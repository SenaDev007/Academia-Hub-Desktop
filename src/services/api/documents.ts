import { dataService } from '../dataService';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'image' | 'other';
  size: number;
  url: string;
  category: 'student' | 'teacher' | 'class' | 'school' | 'admin';
  entityId: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
  schoolId: string;
}

export interface CreateDocumentData {
  name: string;
  type: string;
  size: number;
  url: string;
  category: string;
  entityId: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface DocumentFilters {
  category?: string;
  entityId?: string;
  type?: string;
  uploadedBy?: string;
  search?: string;
}

export const documentsService = {
  async getDocuments(filters?: DocumentFilters) {
    try {
      const documents = await dataService.getAllDocuments(filters);
      return {
        data: documents,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async getDocument(id: string) {
    try {
      const document = await dataService.getDocumentById(id);
      if (!document) {
        return {
          data: null,
          success: false,
          error: 'Document non trouvé'
        };
      }
      return {
        data: document,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du document:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async createDocument(data: CreateDocumentData) {
    try {
      const document = await dataService.createDocument({
        ...data,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current-user', // À remplacer par l'utilisateur connecté
        isPublic: data.isPublic || false,
        tags: data.tags || []
      });
      
      return {
        data: document,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async updateDocument(id: string, data: Partial<CreateDocumentData>) {
    try {
      const document = await dataService.updateDocument(id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      return {
        data: document,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async deleteDocument(id: string) {
    try {
      await dataService.deleteDocument(id);
      return {
        data: null,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async uploadFile(file: File, category: string, entityId: string, description?: string) {
    try {
      // Lire le fichier en tant que ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Créer une URL de données locale (base64)
      const base64 = btoa(String.fromCharCode(...uint8Array));
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      // Créer le document
      const document = await dataService.createDocument({
        name: file.name,
        type: this.getFileType(file.type),
        size: file.size,
        url: dataUrl,
        category,
        entityId,
        description,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current-user',
        isPublic: false,
        tags: []
      });
      
      return {
        data: document,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async getDocumentsByCategory(category: string, entityId?: string) {
    try {
      const filters: DocumentFilters = { category };
      if (entityId) {
        filters.entityId = entityId;
      }
      const documents = await dataService.getAllDocuments(filters);
      return {
        data: documents,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des documents par catégorie:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async downloadDocument(id: string) {
    try {
      const document = await dataService.getDocumentById(id);
      if (!document) {
        return {
          data: null,
          success: false,
          error: 'Document non trouvé'
        };
      }

      // Créer un blob à partir de l'URL de données
      const response = await fetch(document.url);
      const blob = await response.blob();
      
      return {
        data: blob,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  getFileType(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('msword') || mimeType.includes('wordprocessingml.document')) return 'doc';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheetml')) return 'xls';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentationml')) return 'ppt';
    if (mimeType.includes('image')) return 'image';
    return 'other';
  }
};
