import { apiClient } from './config';

export const notificationsService = {
  async getNotifications() {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  async markAsRead(notificationId: string) {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  async sendNotification(data: { title: string; message: string; recipients: string[] }) {
    const response = await apiClient.post('/notifications/send', data);
    return response.data;
  }
};
