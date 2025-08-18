const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class SyncService {
  constructor(db, config = {}) {
    this.db = db;
    this.config = {
      syncInterval: config.syncInterval || 30000, // 30 seconds
      maxRetries: config.maxRetries || 3,
      batchSize: config.batchSize || 100,
      ...config
    };
    this.isSyncing = false;
    this.syncQueue = [];
    this.syncInterval = null;
  }

  // Initialize sync service
  async initialize() {
    try {
      // Create sync metadata table if not exists
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS sync_metadata (
          id TEXT PRIMARY KEY,
          entity_type TEXT NOT NULL,
          entity_id TEXT NOT NULL,
          action TEXT NOT NULL,
          data TEXT,
          status TEXT DEFAULT 'pending',
          retry_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_sync DATETIME,
          error_message TEXT,
          school_id TEXT NOT NULL
        )
      `);

      // Create sync_history table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS sync_history (
          id TEXT PRIMARY KEY,
          sync_type TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          records_count INTEGER DEFAULT 0,
          status TEXT NOT NULL,
          error_message TEXT,
          started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          duration_ms INTEGER,
          school_id TEXT NOT NULL
        )
      `);

      // Start periodic sync
      this.startPeriodicSync();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
      return { success: false, error: error.message };
    }
  }

  // Start periodic sync
  startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.performSync();
    }, this.config.syncInterval);
  }

  // Stop periodic sync
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Add item to sync queue
  async queueSync(entityType, entityId, action, data, schoolId) {
    try {
      const syncId = uuidv4();
      
      this.db.insert('sync_metadata', {
        id: syncId,
        entity_type: entityType,
        entity_id: entityId,
        action,
        data: JSON.stringify(data),
        school_id: schoolId
      });

      this.syncQueue.push({
        id: syncId,
        entityType,
        entityId,
        action,
        data,
        schoolId
      });

      return { success: true, syncId };
    } catch (error) {
      console.error('Failed to queue sync:', error);
      return { success: false, error: error.message };
    }
  }

  // Perform sync operation
  async performSync() {
    if (this.isSyncing) return;
    
    this.isSyncing = true;
    const syncId = uuidv4();
    
    try {
      console.log('Starting sync operation...');
      
      // Record sync start
      this.db.insert('sync_history', {
        id: syncId,
        sync_type: 'automatic',
        entity_type: 'all',
        status: 'in_progress',
        school_id: 'system'
      });

      // Get pending sync items
      const pendingItems = this.db.query(`
        SELECT * FROM sync_metadata 
        WHERE status IN ('pending', 'failed') 
        AND retry_count < ?
        ORDER BY created_at ASC
        LIMIT ?
      `, [this.config.maxRetries, this.config.batchSize]);

      if (pendingItems.length === 0) {
        this.db.update('sync_history', {
          status: 'completed',
          records_count: 0,
          completed_at: new Date().toISOString(),
          duration_ms: 0
        }, { id: syncId });
        
        this.isSyncing = false;
        return { success: true, synced: 0 };
      }

      let successCount = 0;
      let errorCount = 0;

      for (const item of pendingItems) {
        try {
          const result = await this.syncItem(item);
          if (result.success) {
            this.db.update('sync_metadata', {
              status: 'completed',
              last_sync: new Date().toISOString(),
              retry_count: item.retry_count + 1
            }, { id: item.id });
            successCount++;
          } else {
            this.db.update('sync_metadata', {
              status: 'failed',
              last_sync: new Date().toISOString(),
              retry_count: item.retry_count + 1,
              error_message: result.error
            }, { id: item.id });
            errorCount++;
          }
        } catch (error) {
          this.db.update('sync_metadata', {
            status: 'failed',
            last_sync: new Date().toISOString(),
            retry_count: item.retry_count + 1,
            error_message: error.message
          }, { id: item.id });
          errorCount++;
        }
      }

      // Update sync history
      const startedAt = this.db.get('SELECT started_at FROM sync_history WHERE id = ?', [syncId]).started_at;
      const duration = Date.now() - new Date(startedAt).getTime();
      
      this.db.update('sync_history', {
        status: 'completed',
        records_count: pendingItems.length,
        completed_at: new Date().toISOString(),
        duration_ms: duration
      }, { id: syncId });

      console.log(`Sync completed: ${successCount} success, ${errorCount} errors`);
      
      this.isSyncing = false;
      return { 
        success: true, 
        synced: pendingItems.length,
        successCount,
        errorCount 
      };

    } catch (error) {
      console.error('Sync operation failed:', error);
      
      this.db.update('sync_history', {
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString()
      }, { id: syncId });

      this.isSyncing = false;
      return { success: false, error: error.message };
    }
  }

  // Sync individual item
  async syncItem(item) {
    try {
      const data = JSON.parse(item.data || '{}');
      
      switch (item.action) {
        case 'create':
          return await this.createEntity(item.entity_type, data);
        case 'update':
          return await this.updateEntity(item.entity_type, item.entity_id, data);
        case 'delete':
          return await this.deleteEntity(item.entity_type, item.entity_id);
        default:
          throw new Error(`Unknown action: ${item.action}`);
      }
    } catch (error) {
      console.error(`Failed to sync item ${item.id}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Create entity
  async createEntity(entityType, data) {
    try {
      const id = uuidv4();
      data.id = id;
      data.created_at = new Date().toISOString();
      
      this.db.insert(entityType, data);
      return { success: true, id };
    } catch (error) {
      console.error(`Failed to create ${entityType}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Update entity
  async updateEntity(entityType, entityId, data) {
    try {
      data.updated_at = new Date().toISOString();
      
      this.db.update(entityType, data, { id: entityId });
      return { success: true };
    } catch (error) {
      console.error(`Failed to update ${entityType}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Delete entity
  async deleteEntity(entityType, entityId) {
    try {
      this.db.delete(entityType, { id: entityId });
      return { success: true };
    } catch (error) {
      console.error(`Failed to delete ${entityType}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Get sync status
  async getSyncStatus(schoolId) {
    try {
      const pendingCount = this.db.get(
        'SELECT COUNT(*) as count FROM sync_metadata WHERE status = "pending" AND school_id = ?',
        [schoolId]
      );

      const failedCount = this.db.get(
        'SELECT COUNT(*) as count FROM sync_metadata WHERE status = "failed" AND school_id = ?',
        [schoolId]
      );

      const completedCount = this.db.get(
        'SELECT COUNT(*) as count FROM sync_metadata WHERE status = "completed" AND school_id = ?',
        [schoolId]
      );

      const lastSync = this.db.get(`
        SELECT * FROM sync_history 
        WHERE school_id = ? 
        ORDER BY started_at DESC 
        LIMIT 1
      `, [schoolId]);

      return {
        success: true,
        status: {
          pending: pendingCount.count,
          failed: failedCount.count,
          completed: completedCount.count,
          lastSync: lastSync || null
        }
      };
    } catch (error) {
      console.error('Failed to get sync status:', error);
      return { success: false, error: error.message };
    }
  }

  // Get sync history
  async getSyncHistory(filters = {}) {
    const { schoolId, limit = 50, offset = 0 } = filters;
    
    try {
      let sql = `
        SELECT * FROM sync_history 
        WHERE 1=1
      `;
      const params = [];

      if (schoolId) {
        sql += ' AND school_id = ?';
        params.push(schoolId);
      }

      sql += ' ORDER BY started_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const history = this.db.query(sql, params);
      return { success: true, history };
    } catch (error) {
      console.error('Failed to get sync history:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear sync data
  async clearSyncData(schoolId, olderThanDays = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      this.db.exec(`
        DELETE FROM sync_metadata 
        WHERE school_id = ? 
        AND created_at < ?
      `, [schoolId, cutoffDate.toISOString()]);

      this.db.exec(`
        DELETE FROM sync_history 
        WHERE school_id = ? 
        AND started_at < ?
      `, [schoolId, cutoffDate.toISOString()]);

      return { success: true };
    } catch (error) {
      console.error('Failed to clear sync data:', error);
      return { success: false, error: error.message };
    }
  }

  // Export sync data
  async exportSyncData(schoolId) {
    try {
      const syncData = {
        metadata: this.db.select('sync_metadata', { school_id: schoolId }),
        history: this.db.select('sync_history', { school_id: schoolId }),
        timestamp: new Date().toISOString()
      };

      const exportPath = path.join(
        require('electron').app.getPath('userData'),
        'exports',
        `sync-data-${schoolId}-${Date.now()}.json`
      );

      await fs.mkdir(path.dirname(exportPath), { recursive: true });
      await fs.writeFile(exportPath, JSON.stringify(syncData, null, 2));

      return { success: true, exportPath };
    } catch (error) {
      console.error('Failed to export sync data:', error);
      return { success: false, error: error.message };
    }
  }

  // Force manual sync
  async forceSync(schoolId) {
    try {
      const result = await this.performSync();
      return result;
    } catch (error) {
      console.error('Force sync failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = SyncService;
