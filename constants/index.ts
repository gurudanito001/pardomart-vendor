// App Constants
export const APP_CONFIG = {
  APP_NAME: 'Pardomart Vendor',
  VERSION: '1.0.0',
  MIN_SUPPORTED_VERSION: '1.0.0',
  FORCE_UPDATE_VERSION: '1.0.0',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    INITIATE_LOGIN: '/auth/initiate-login',
    REGISTER: '/auth/register',
    VERIFY_LOGIN: '/auth/verify-login',
    RESEND_OTP: '/auth/resend-otp',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CURRENT_USER: '/auth/me',
  },
  
  // Vendor endpoints
  VENDOR: {
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    UPLOAD_DOCUMENT: '/auth/documents',
    GO_ONLINE: '/auth/status/online',
    GO_OFFLINE: '/auth/status/offline',
    UPLOAD_SELFIE: '/auth/selfie',
  },
  
  // File upload
  UPLOAD: {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@pardomart_vendor:auth_token',
  IS_REGISTERED: '@pardomart_vendor:is_registered',
  REFRESH_TOKEN: '@pardomart_vendor:refresh_token',
  USER_DATA: '@pardomart_vendor:user_data',
  VENDOR_PROFILE: '@pardomart_vendor:vendor_profile',
  ONBOARDING_COMPLETED: '@pardomart_vendor:onboarding_completed',
  BIOMETRIC_ENABLED: '@pardomart_vendor:biometric_enabled',
  LANGUAGE_PREFERENCE: '@pardomart_vendor:language',
  THEME_PREFERENCE: '@pardomart_vendor:theme',
  NOTIFICATION_SETTINGS: '@pardomart_vendor:notifications',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_LENGTH: 5,
    MAX_LENGTH: 254,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  PHONE: {
    PATTERN: /^\+?[1-9]\d{1,14}$/,
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  OTP: {
    LENGTH: 6,
    PATTERN: /^\d{6}$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s]+$/,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Requested resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  
  // Auth specific
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_LOCKED: 'Account temporarily locked. Please try again later.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  OTP_INVALID: 'Invalid OTP. Please try again.',
  
  // Validation specific
  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  PASSWORD_WEAK: 'Password must contain uppercase, lowercase, number and special character.',
  PHONE_REQUIRED: 'Phone number is required.',
  PHONE_INVALID: 'Please enter a valid phone number.',
  NAME_REQUIRED: 'Name is required.',
  NAME_INVALID: 'Name should only contain letters and spaces.',
  
  // File upload
  FILE_TOO_LARGE: 'File size should not exceed 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a valid file.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration successful!',
  OTP_SENT: 'OTP sent successfully.',
  OTP_VERIFIED: 'OTP verified successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  DOCUMENT_UPLOADED: 'Document uploaded successfully.',
  PASSWORD_RESET: 'Password reset successfully.',
  STATUS_UPDATED: 'Status updated successfully.',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Request Timeout (in milliseconds)
export const TIMEOUTS = {
  DEFAULT: 10000,
  UPLOAD: 30000,
  DOWNLOAD: 20000,
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  QUALITY: 0.8,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
} as const;

// Document Configuration
export const DOCUMENT_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Social Login Providers
export const SOCIAL_PROVIDERS = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  APPLE: 'apple',
} as const;

// Vendor Status
export const VENDOR_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;

// Document Types
export const DOCUMENT_TYPES = {
  PROFILE_PHOTO: 'profile_photo',
  NATIONAL_ID: 'national_id',
  BUSINESS_LICENSE: 'business_license',
  TAX_CERTIFICATE: 'tax_certificate',
  BANK_STATEMENT: 'bank_statement',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
  CHAT: 'chat',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// Currency
export const CURRENCY = {
  CODE: 'USD',
  SYMBOL: '$',
  DECIMAL_PLACES: 2,
} as const;
