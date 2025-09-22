import { API_ENDPOINTS } from '../constants';
import {
    ApiResponse,
    UploadedFile,
    VendorDocument,
    VendorProfile,
} from '../types';
import { apiService } from './api';

interface VendorStats {
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  responseTime: number; // in minutes
}

interface VendorAnalytics {
  dailyStats: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
  };
}

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
  async getBusinessHours(): Promise<ApiResponse<Array<{
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    isOpen: boolean;
    openTime: string; // "09:00"
    closeTime: string; // "17:00"
    breaks?: Array<{
      startTime: string;
      endTime: string;
    }>;
  }>>> {
    return apiService.get('/auth/business-hours');
  }

  async updateBusinessHours(hours: Array<{
    dayOfWeek: number;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    breaks?: Array<{
      startTime: string;
      endTime: string;
    }>;
  }>): Promise<ApiResponse<{ message: string }>> {
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
  async getReviews(page: number = 1, limit: number = 20): Promise<ApiResponse<{
    reviews: Array<{
      id: string;
      customerId: string;
      customerName: string;
      rating: number;
      comment: string;
      orderId: string;
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> {
    return apiService.get('/auth/reviews', { page, limit });
  }

  async respondToReview(reviewId: string, response: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post(`/vendor/reviews/${reviewId}/respond`, { response });
  }

  // Notifications
  async getNotifications(page: number = 1, limit: number = 20): Promise<ApiResponse<{
    notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      isRead: boolean;
      data?: any;
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> {
    return apiService.get('/auth/notifications', { page, limit });
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.patch(`/vendor/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
    return apiService.patch('/auth/notifications/read-all');
  }

  // Settings
  async getSettings(): Promise<ApiResponse<{
    notifications: {
      orders: boolean;
      payments: boolean;
      reviews: boolean;
      promotions: boolean;
    };
    privacy: {
      showPhoneToCustomers: boolean;
      showEmailToCustomers: boolean;
    };
    preferences: {
      currency: string;
      timezone: string;
      language: string;
    };
  }>> {
    return apiService.get('/auth/settings');
  }

  async updateSettings(settings: {
    notifications?: {
      orders?: boolean;
      payments?: boolean;
      reviews?: boolean;
      promotions?: boolean;
    };
    privacy?: {
      showPhoneToCustomers?: boolean;
      showEmailToCustomers?: boolean;
    };
    preferences?: {
      currency?: string;
      timezone?: string;
      language?: string;
    };
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.patch('/auth/settings', settings);
  }

  // Verification
  async getVerificationStatus(): Promise<ApiResponse<{
    isVerified: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    requiredDocuments: string[];
    submittedDocuments: string[];
    pendingDocuments: string[];
    rejectedDocuments: Array<{
      type: string;
      reason: string;
    }>;
  }>> {
    return apiService.get('/auth/verification-status');
  }

  async requestVerification(): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/auth/request-verification');
  }

  // Bank account management
  async getBankAccounts(): Promise<ApiResponse<Array<{
    id: string;
    accountNumber: string; // masked
    bankName: string;
    accountType: string;
    isDefault: boolean;
    isVerified: boolean;
    createdAt: string;
  }>>> {
    return apiService.get('/auth/bank-accounts');
  }

  async addBankAccount(bankDetails: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountHolderName: string;
    accountType: 'checking' | 'savings';
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/auth/bank-accounts', bankDetails);
  }

  async setDefaultBankAccount(accountId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.patch(`/vendor/bank-accounts/${accountId}/default`);
  }

  async deleteBankAccount(accountId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete(`/vendor/bank-accounts/${accountId}`);
  }

  // Payout management
  async getPayouts(page: number = 1, limit: number = 20): Promise<ApiResponse<{
    payouts: Array<{
      id: string;
      amount: number;
      status: 'pending' | 'processing' | 'completed' | 'failed';
      bankAccountId: string;
      initiatedAt: string;
      completedAt?: string;
      failureReason?: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> {
    return apiService.get('/auth/payouts', { page, limit });
  }

  async requestPayout(amount: number, bankAccountId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/auth/payouts/request', {
      amount,
      bankAccountId,
    });
  }

  // Support tickets
  async createSupportTicket(subject: string, message: string, category: string): Promise<ApiResponse<{
    ticketId: string;
    message: string;
  }>> {
    return apiService.post('/auth/support/tickets', {
      subject,
      message,
      category,
    });
  }

  async getSupportTickets(page: number = 1, limit: number = 20): Promise<ApiResponse<{
    tickets: Array<{
      id: string;
      subject: string;
      status: 'open' | 'in_progress' | 'resolved' | 'closed';
      category: string;
      createdAt: string;
      updatedAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> {
    return apiService.get('/auth/support/tickets', { page, limit });
  }

  async getSupportTicket(ticketId: string): Promise<ApiResponse<{
    id: string;
    subject: string;
    status: string;
    category: string;
    messages: Array<{
      id: string;
      message: string;
      isFromVendor: boolean;
      createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }>> {
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
