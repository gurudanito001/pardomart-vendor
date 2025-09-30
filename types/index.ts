import { AuthRegisterPostRequestRoleEnum } from "@/api";

// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email?: string;
  mobileNumber?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  role: AuthRegisterPostRequestRoleEnum;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isReady: boolean; // True when initial auth check is complete
  isRegistered: boolean; // True if the user has ever logged in
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string; // From form
  role: AuthRegisterPostRequestRoleEnum;
  email?: string; // From form, one of email/mobile is required
  mobileNumber?: string; // From form, one of email/mobile is required
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface OTPVerificationRequest {
  mobileNumber: string;
  verificationCode: string;
  role: 'vendor'  | 'shopper';
}

export interface ResendOTPRequest {
  identifier: string; // email or phone number
  role: AuthRegisterPostRequestRoleEnum;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// Vendor Types
export interface VendorProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  address: Address;
  contactInfo: ContactInfo;
  bankDetails: BankDetails;
  documents: VendorDocument[];
  isVerified: boolean;
  isOnline: boolean;
  rating: number;
  totalOrders: number;
  joinedAt: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface VendorStats {
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  responseTime: number; // in minutes
}

export interface VendorAnalytics {
  dailyStats: {
    date: string;
    orders: number;
    revenue: number;
  }[];
  topProducts: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ContactInfo {
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface BankDetails {
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountHolderName: string;
  accountType: 'checking' | 'savings';
}

export interface VendorDocument {
  id: string;
  type: 'profile_photo' | 'national_id' | 'business_license' | 'tax_certificate' | 'bank_statement';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface BusinessHour {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "17:00"
  breaks?: {
    startTime: string;
    endTime: string;
  }[];
}

export interface VendorReview {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  orderId: string;
  createdAt: string;
}

export interface VendorSettings {
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
}

export interface VendorVerificationStatus {
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  requiredDocuments: string[];
  submittedDocuments: string[];
  pendingDocuments: string[];
  rejectedDocuments: {
    type: string;
    reason: string;
  }[];
}

export interface BankAccount {
  id: string;
  accountNumber: string; // masked
  bankName: string;
  accountType: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface NewBankAccountRequest {
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountHolderName: string;
  accountType: 'checking' | 'savings';
}

export interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bankAccountId: string;
  initiatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketMessage {
  id: string;
  message: string;
  isFromVendor: boolean;
  createdAt: string;
}

export interface SupportTicketDetails extends SupportTicket {
  messages: SupportTicketMessage[];
}

export interface NewSupportTicketRequest {
  subject: string;
  message: string;
  category: string;
}

export interface NewSupportTicketResponse {
  ticketId: string;
  message: string;
}

export interface VendorState {
  profile: VendorProfile | null;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Navigation Types
export interface NavigationParams {
  [key: string]: any;
}

export type RootStackParamList = {
  'vendor/sign-in': undefined;
  'vendor/register': undefined;
  'vendor/verify': { email: string; fromScreen?: 'signin' | 'register' };
  'vendor/selfie': undefined;
  'vendor/camera': undefined;
  'vendor/verified': undefined;
  'vendor/online': undefined;
};

// Form Types
export interface FormField<T = string> {
  value: T;
  error: string | null;
  touched: boolean;
}

export interface FormState<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FormField<T[K]>;
  };
  isValid: boolean;
  isSubmitting: boolean;
}

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
}

export type FormValidation<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Hook Types
export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

// File Upload Types
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: (progress: UploadProgress) => void;
}

export interface UploadedFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

// Camera and Image Types
export interface ImagePickerOptions {
  mediaTypes: 'Images' | 'Videos' | 'All';
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  allowsMultipleSelection?: boolean;
}

export interface ImagePickerResult {
  cancelled: boolean;
  uri?: string;
  width?: number;
  height?: number;
  type?: 'image' | 'video';
  fileName?: string;
  fileSize?: number;
}

// Theme and Styling Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface VendorNotification extends NotificationData {
  // any vendor-specific notification fields
}

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

// Notification Types
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'order' | 'payment' | 'promotion' | 'system' | 'chat';
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// Location Types
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  orderCount: number;
  totalAmount: number;
  avatar: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  date: string;
  amount: number;
}

export interface Shopper {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeAddress: string;
  isAvailable: boolean;
  avatar: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  logo: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Order Types (for future use)
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  notes?: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: LocationData;
  radius?: number;
  sortBy?: 'relevance' | 'price' | 'rating' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  timestamp: string;
}

export interface PerformanceMetrics {
  screenLoadTime: number;
  apiResponseTime: number;
  renderTime: number;
}

// Settings Types
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  biometricAuth: boolean;
  autoLock: boolean;
  autoLockTime: number; // in minutes
}

export interface NotificationSettings {
  orders: boolean;
  payments: boolean;
  promotions: boolean;
  chat: boolean;
  system: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
}

// Error Types
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type OptionalExcept<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
