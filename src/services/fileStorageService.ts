import { app } from 'electron';
import { join, dirname, extname, basename } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync, statSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface FileMetadata {
  id: string;
  originalName: string;
  storedName: string;
  path: string;
  size: number;
  mimeType: string;
  category: 'student_photo' | 'document' | 'report' | 'attachment' | 'other';
  uploadedAt: Date;
  uploadedBy: string;
  tags?: string[];
  description?: string;
  isCompressed: boolean;
  originalSize?: number;
}

export interface FileStorageConfig {
  basePath: string;
  maxFileSize: number; // en bytes
  allowedTypes: string[];
  compressionEnabled: boolean;
  imageOptimizationEnabled: boolean;
}

class FileStorageService {
  private config: FileStorageConfig;
  private basePath: string;

  constructor() {
    this.config = {
      basePath: '',
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],
      compressionEnabled: true,
      imageOptimizationEnabled: true
    };
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      // Utiliser le chemin de données utilisateur d'Electron
      const userDataPath = app?.getPath('userData') || process.env.APPDATA || './data';
      this.basePath = join(userDataPath, 'academia-hub', 'files');
      
      // Créer la structure de dossiers
      this.createDirectoryStructure();
      
      console.log('File storage initialized at:', this.basePath);
    } catch (error) {
      console.error('Failed to initialize file storage:', error);
      // Fallback vers un chemin local
      this.basePath = join('./data', 'files');
      this.createDirectoryStructure();
    }
  }

  private createDirectoryStructure() {
    const directories = [
      this.basePath,
      join(this.basePath, 'student-photos'),
      join(this.basePath, 'documents'),
      join(this.basePath, 'reports'),
      join(this.basePath, 'attachments'),
      join(this.basePath, 'temp'),
      join(this.basePath, 'cache')
    ];

    directories.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  async storeFile(
    file: File | Buffer | string,
    metadata: Omit<FileMetadata, 'id' | 'storedName' | 'path' | 'uploadedAt' | 'isCompressed'>
  ): Promise<FileMetadata> {
    try {
      const fileId = uuidv4();
      const fileExtension = this.getFileExtension(metadata.originalName, metadata.mimeType);
      const storedName = `${fileId}${fileExtension}`;
      
      // Déterminer le chemin de stockage selon la catégorie
      const categoryPath = this.getCategoryPath(metadata.category);
      const filePath = join(categoryPath, storedName);

      // Stocker le fichier
      let fileBuffer: Buffer;
      if (file instanceof File) {
        fileBuffer = Buffer.from(await file.arrayBuffer());
      } else if (file instanceof Buffer) {
        fileBuffer = file;
      } else {
        fileBuffer = Buffer.from(file, 'utf8');
      }

      // Vérifier la taille
      if (fileBuffer.length > this.config.maxFileSize) {
        throw new Error(`File size ${fileBuffer.length} bytes exceeds maximum allowed size ${this.config.maxFileSize} bytes`);
      }

      // Optimiser et compresser si nécessaire
      let finalBuffer = fileBuffer;
      let isCompressed = false;
      let originalSize = fileBuffer.length;

      if (this.config.imageOptimizationEnabled && this.isImage(metadata.mimeType)) {
        finalBuffer = await this.optimizeImage(fileBuffer, metadata.mimeType);
        isCompressed = finalBuffer.length < fileBuffer.length;
      }

      // Écrire le fichier
      writeFileSync(filePath, finalBuffer);

      const fileMetadata: FileMetadata = {
        id: fileId,
        originalName: metadata.originalName,
        storedName,
        path: filePath,
        size: finalBuffer.length,
        mimeType: metadata.mimeType,
        category: metadata.category,
        uploadedAt: new Date(),
        uploadedBy: metadata.uploadedBy,
        tags: metadata.tags,
        description: metadata.description,
        isCompressed,
        originalSize: isCompressed ? originalSize : undefined
      };

      return fileMetadata;
    } catch (error) {
      console.error('Error storing file:', error);
      throw error;
    }
  }

  async getFile(fileId: string): Promise<Buffer | null> {
    try {
      // Récupérer les métadonnées depuis la base de données
      // Pour l'instant, on suppose que le fichier existe
      const filePath = join(this.basePath, 'documents', `${fileId}.pdf`); // Exemple
      
      if (!existsSync(filePath)) {
        return null;
      }

      return readFileSync(filePath);
    } catch (error) {
      console.error('Error retrieving file:', error);
      return null;
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      // Récupérer les métadonnées depuis la base de données
      // Pour l'instant, on suppose que le fichier existe
      const filePath = join(this.basePath, 'documents', `${fileId}.pdf`); // Exemple
      
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    try {
      // Cette méthode devrait récupérer les métadonnées depuis la base de données
      // Pour l'instant, retourner null
      return null;
    } catch (error) {
      console.error('Error retrieving file metadata:', error);
      return null;
    }
  }

  async listFiles(category?: string, tags?: string[]): Promise<FileMetadata[]> {
    try {
      // Cette méthode devrait récupérer la liste des fichiers depuis la base de données
      // Pour l'instant, retourner un tableau vide
      return [];
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    categoryBreakdown: Record<string, { count: number; size: number }>;
  }> {
    try {
      // Calculer les statistiques de stockage
      const stats = {
        totalFiles: 0,
        totalSize: 0,
        categoryBreakdown: {} as Record<string, { count: number; size: number }>
      };

      // Cette méthode devrait analyser le stockage et retourner les statistiques
      return stats;
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        categoryBreakdown: {}
      };
    }
  }

  private getFileExtension(originalName: string, mimeType: string): string {
    if (originalName.includes('.')) {
      return extname(originalName);
    }
    
    // Déterminer l'extension selon le MIME type
    const mimeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'text/plain': '.txt',
      'text/csv': '.csv',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
    };

    return mimeToExt[mimeType] || '';
  }

  private getCategoryPath(category: string): string {
    const categoryPaths: Record<string, string> = {
      'student_photo': join(this.basePath, 'student-photos'),
      'document': join(this.basePath, 'documents'),
      'report': join(this.basePath, 'reports'),
      'attachment': join(this.basePath, 'attachments'),
      'other': join(this.basePath, 'other')
    };

    return categoryPaths[category] || join(this.basePath, 'other');
  }

  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  private async optimizeImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      // Pour l'instant, retourner le buffer original
      // L'optimisation d'image sera implémentée plus tard
      return buffer;
    } catch (error) {
      console.error('Error optimizing image:', error);
      return buffer;
    }
  }

  getBasePath(): string {
    return this.basePath;
  }

  getConfig(): FileStorageConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<FileStorageConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export const fileStorageService = new FileStorageService();
