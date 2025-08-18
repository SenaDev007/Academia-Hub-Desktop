import { dataService } from '../dataService';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipients: string[];
  readBy: string[];
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  schoolId: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  recipients: string[];
  type?: 'info' | 'warning' | 'error' | 'success';
}

export const notificationsService = {
  async getNotifications() {
    try {
      const notifications = await dataService.getAllNotifications();
      return {
        data: notifications,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async markAsRead(notificationId: string) {
    try {
      await dataService.updateNotification(notificationId, {
        isRead: true,
        readAt: new Date().toISOString()
      });
      return {
        data: null,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la marquage de la notification comme lue:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async sendNotification(data: CreateNotificationData) {
    try {
      const notification = await dataService.createNotification({
        title: data.title,
        message: data.message,
        recipients: data.recipients,
        type: data.type || 'info',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readBy: [],
        isRead: false
      });
      
      return {
        data: notification,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async getUnreadCount() {
    try {
      const notifications = await dataService.getAllNotifications();
      const unreadCount = notifications.filter(n => !n.isRead).length;
      return {
        data: unreadCount,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de notifications non lues:', error);
      return {
        data: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async deleteNotification(notificationId: string) {
    try {
      await dataService.deleteNotification(notificationId);
      return {
        data: null,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      return {
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
};
