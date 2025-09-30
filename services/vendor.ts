import { API_ENDPOINTS } from '../constants';
import {
  ApiResponse,
  BankAccount,
  BusinessHour,
  NewBankAccountRequest,
  NewSupportTicketRequest,
  NewSupportTicketResponse,
  PaginatedResponse,
  Payout,
  SupportTicket,
  SupportTicketDetails,
  UploadedFile,
  VendorAnalytics,
  VendorDocument,
  VendorNotification,
  VendorProfile,
  VendorReview,
  VendorSettings,
  VendorStats,
  VendorVerificationStatus,
} from '../types';
import { apiService } from './api';

class VendorService {
  async getProfile(): Promise<ApiResponse<VendorProfile>> {
    return apiService.get<VendorProfile>(API_ENDPOINTS.VENDOR.PROFILE);
  }

  async updateProfile(data: Partial<VendorProfile>): Promise<ApiResponse<VendorProfile>> {
    return apiService.put<VendorProfile>(API_ENDPOINTS.VENDOR.UPDATE_PROFILE, data);
  }

  async uploadDocument(file: FormData): Promise<ApiResponse<VendorDocument>> {
    return apiService.uploadFile<VendorDocument>(API_ENDPOINTS.VENDOR.UPLOAD_DOCUMENT, file);
  }

  async uploadSelfie(file: FormData): Promise<ApiResponse<UploadedFile>> {
    return apiService.uploadFile<UploadedFile>(API_ENDPOINTS.VENDOR.UPLOAD_SELFIE, file);
  }

  async goOnline(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return apiService.post<{ message: string; timestamp: string }>(API_ENDPOINTS.VENDOR.GO_ONLINE);
  }

  async goOffline(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return apiService.post<{ message: string; timestamp: string }>(API_ENDPOINTS.VENDOR.GO_OFFLINE);
  }

  // Document management
  async getDocuments(): Promise<ApiResponse<VendorDocument[]>> {
    return apiService.get<VendorDocument[]>('/auth/documents');
  }

  async deleteDocument(documentId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/vendor/documents/${documentId}`);
  }

  async resubmitDocument(documentId: string, file: FormData): Promise<ApiResponse<VendorDocument>> {
    return apiService.uploadFile<VendorDocument>(`/vendor/documents/${documentId}/resubmit`, file);
  }

  // Business hours management
  async getBusinessHours(): Promise<ApiResponse<BusinessHour[]>> {
    return apiService.get('/auth/business-hours');
  }

  async updateBusinessHours(hours: Partial<BusinessHour>[]): Promise<ApiResponse<{ message: string }>> {
    return apiService.put('/auth/business-hours', { hours });
  }

  // Statistics and analytics
  async getStats(period: 'today' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<VendorStats>> {
    return apiService.get<VendorStats>('/auth/stats', { period });
  }

  async getAnalytics(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<VendorAnalytics>> {
    return apiService.get<VendorAnalytics>('/auth/analytics', {
      startDate,
      endDate,
    });
  }

  // Reviews and ratings
  async getReviews(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<VendorReview>>> {
    return apiService.get('/auth/reviews', { page, limit });
  }

  async respondToReview(reviewId: string, response: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post(`/vendor/reviews/${reviewId}/respond`, { response });
  }

  // Notifications
  async getNotifications(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<VendorNotification>>> {
    return apiService.get('/auth/notifications', { page, limit });
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.patch(`/vendor/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
    return apiService.patch('/auth/notifications/read-all');
  }

  // Settings
  async getSettings(): Promise<ApiResponse<VendorSettings>> {
    return apiService.get('/auth/settings');
  }

  async updateSettings(settings: Partial<VendorSettings>): Promise<ApiResponse<{ message: string }>> {
    return apiService.patch('/auth/settings', settings);
  }

  // Verification
  async getVerificationStatus(): Promise<ApiResponse<VendorVerificationStatus>> {
    return apiService.get('/auth/verification-status');
  }

  async requestVerification(): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/auth/request-verification');
  }

  // Bank account management
  async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return apiService.get('/auth/bank-accounts');
  }

  async addBankAccount(bankDetails: NewBankAccountRequest): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/auth/bank-accounts', bankDetails);
  }

  async setDefaultBankAccount(accountId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.patch(`/vendor/bank-accounts/${accountId}/default`);
  }

  async deleteBankAccount(accountId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete(`/vendor/bank-accounts/${accountId}`);
  }

  // Payout management
  async getPayouts(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<Payout>>> {
    return apiService.get('/auth/payouts', { page, limit });
  }

  async requestPayout(amount: number, bankAccountId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/auth/payouts/request', {
      amount,
      bankAccountId,
    });
  }

  // Support tickets
  async createSupportTicket(data: NewSupportTicketRequest): Promise<ApiResponse<NewSupportTicketResponse>> {
    return apiService.post('/auth/support/tickets', data);
  }

  async getSupportTickets(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<SupportTicket>>> {
    return apiService.get('/auth/support/tickets', { page, limit });
  }

  async getSupportTicket(ticketId: string): Promise<ApiResponse<SupportTicketDetails>> {
    return apiService.get(`/vendor/support/tickets/${ticketId}`);
  }

  async replyToSupportTicket(ticketId: string, message: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post(`/vendor/support/tickets/${ticketId}/reply`, { message });
  }
}

// Create and export singleton instance
export const vendorService = new VendorService();

// Export the class for testing
export { VendorService };
