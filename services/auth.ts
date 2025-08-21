import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import {
  User,
  LoginRequest,
  RegisterRequest,
  OTPVerificationRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
} from '../types';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

interface OTPResponse {
  message: string;
  expiresAt: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, {
      requiresAuth: false,
    });
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data, {
      requiresAuth: false,
    });
  }

  async verifyOTP(data: OTPVerificationRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, data, {
      requiresAuth: false,
    });
  }

  async resendOTP(email: string): Promise<ApiResponse<OTPResponse>> {
    return apiService.post<OTPResponse>(
      API_ENDPOINTS.AUTH.RESEND_OTP,
      { email },
      { requiresAuth: false }
    );
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken },
      { requiresAuth: false }
    );
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<OTPResponse>> {
    return apiService.post<OTPResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data, {
      requiresAuth: false,
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data, {
      requiresAuth: false,
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.AUTH.CURRENT_USER);
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  // Social login methods (to be implemented based on your social auth setup)
  async loginWithGoogle(idToken: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH.LOGIN}/google`,
      { idToken },
      { requiresAuth: false }
    );
  }

  async loginWithFacebook(accessToken: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH.LOGIN}/facebook`,
      { accessToken },
      { requiresAuth: false }
    );
  }

  async loginWithApple(identityToken: string, authorizationCode?: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH.LOGIN}/apple`,
      { identityToken, authorizationCode },
      { requiresAuth: false }
    );
  }

  // Biometric authentication helpers
  async enableBiometricAuth(): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/biometric/enable');
  }

  async disableBiometricAuth(): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/biometric/disable');
  }

  async loginWithBiometric(biometricData: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(
      '/auth/biometric/login',
      { biometricData },
      { requiresAuth: false }
    );
  }

  // Account management
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.patch<User>('/auth/profile', data);
  }

  async deleteAccount(password: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>('/auth/account', {
      data: { password },
    });
  }

  // Email and phone verification
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/verify-email', { token });
  }

  async resendEmailVerification(): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/resend-email-verification');
  }

  async verifyPhone(phoneNumber: string, otp: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/verify-phone', {
      phoneNumber,
      otp,
    });
  }

  async resendPhoneVerification(phoneNumber: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>('/auth/resend-phone-verification', {
      phoneNumber,
    });
  }

  // Session management
  async getSessions(): Promise<ApiResponse<Array<{
    id: string;
    deviceInfo: string;
    ipAddress: string;
    lastActive: string;
    isCurrent: boolean;
  }>>> {
    return apiService.get('/auth/sessions');
  }

  async revokeSession(sessionId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete(`/auth/sessions/${sessionId}`);
  }

  async revokeAllSessions(): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete('/auth/sessions/all');
  }

  // Two-factor authentication
  async enableTwoFactor(): Promise<ApiResponse<{
    qrCode: string;
    secret: string;
    backupCodes: string[];
  }>> {
    return apiService.post('/auth/2fa/enable');
  }

  async confirmTwoFactor(code: string): Promise<ApiResponse<{
    backupCodes: string[];
  }>> {
    return apiService.post('/auth/2fa/confirm', { code });
  }

  async disableTwoFactor(code: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/auth/2fa/disable', { code });
  }

  async generateBackupCodes(): Promise<ApiResponse<{ backupCodes: string[] }>> {
    return apiService.post('/auth/2fa/backup-codes');
  }
}

// Create and export singleton instance
export const authService = new AuthService();

// Export the class for testing
export { AuthService };
