import {
  AuthRegisterPostRequest,
  AuthRegisterPostRequestRoleEnum,
} from '../api/models';
import { API_ENDPOINTS } from '../constants';
import {
  LoginResponse,
  OTPVerificationRequest,
  ResendOTPRequest,
  User,
} from '../types';
import { apiService } from './api';

export const authService = {
  /**
   * Initiates the login process by sending an OTP.
   */
  initiateLogin: (data: { mobileNumber: string; role: AuthRegisterPostRequestRoleEnum }) => {
    return apiService.post(API_ENDPOINTS.AUTH.INITIATE_LOGIN, data);
  },

  /**
   * Verifies the OTP and logs the user in.
   */
  verifyOTP: (data: OTPVerificationRequest) => {
    // The response from the API service will be wrapped in a standard format.
    // The context will handle unpacking `response.data`.
    return apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.VERIFY_LOGIN, data);
  },

  /**
   * Registers a new user and triggers OTP sending.
   */
  register: (data: AuthRegisterPostRequest) => {
    return apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * A placeholder for a standard login method if you have one.
   */
  login: (credentials: any) => {
    // Replace with your actual login API call if it exists
    return apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  /**
   * A placeholder for resending OTP.
   */
  resendOTP: (data: ResendOTPRequest) => {
    return apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.RESEND_OTP, data);
  },

  /**
   * A placeholder for logging out.
   */
  logout: () => {
    return apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Gets the current user's profile to validate the token.
   */
  getCurrentUser: () => {
    return apiService.get<User>(API_ENDPOINTS.AUTH.CURRENT_USER);
  },
};