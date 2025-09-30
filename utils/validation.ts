import { ERROR_MESSAGES, VALIDATION_RULES } from '../constants';

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return ERROR_MESSAGES.EMAIL_REQUIRED;
  }
  
  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return ERROR_MESSAGES.EMAIL_INVALID;
  }
  
  if (email.length < VALIDATION_RULES.EMAIL.MIN_LENGTH || email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
    return ERROR_MESSAGES.EMAIL_INVALID;
  }
  
  return null;
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return ERROR_MESSAGES.PASSWORD_REQUIRED;
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }
  
  if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
    return ERROR_MESSAGES.PASSWORD_WEAK;
  }
  
  return null;
};

/**
 * Validate phone number format
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return ERROR_MESSAGES.PHONE_REQUIRED;
  }
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < VALIDATION_RULES.PHONE.MIN_LENGTH || cleanPhone.length > VALIDATION_RULES.PHONE.MAX_LENGTH) {
    return ERROR_MESSAGES.PHONE_INVALID;
  }
  
  if (!VALIDATION_RULES.PHONE.PATTERN.test(phone)) {
    return ERROR_MESSAGES.PHONE_INVALID;
  }
  
  return null;
};

/**
 * Validate name format
 */
export const validateName = (name: string): string | null => {
  if (!name) {
    return ERROR_MESSAGES.NAME_REQUIRED;
  }
  
  if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH || name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return ERROR_MESSAGES.NAME_INVALID;
  }
  
  if (!VALIDATION_RULES.NAME.PATTERN.test(name)) {
    return ERROR_MESSAGES.NAME_INVALID;
  }
  
  return null;
};

/**
 * Validate OTP format
 */
export const validateOTP = (otp: string): string | null => {
  if (!otp) {
    return ERROR_MESSAGES.OTP_REQUIRED;
  }

  if (otp.length !== VALIDATION_RULES.OTP.LENGTH) {
    return ERROR_MESSAGES.OTP_INVALID;
  }

  if (!VALIDATION_RULES.OTP.PATTERN.test(otp)) {
    return ERROR_MESSAGES.OTP_INVALID;
  }

  return null;
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED;
  }

  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORDS_MISMATCH;
  }

  return null;
};

/**
 * Validate required field
 */
export const validateRequired = (value: any, fieldName: string = 'Field'): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return ERROR_MESSAGES.REQUIRED_FIELD.replace('{field}', fieldName);
  }
  return null;
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value: string, minLength: number, fieldName: string = 'Field'): string | null => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (value: string, maxLength: number, fieldName: string = 'Field'): string | null => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

/**
 * Validate pattern match
 */
export const validatePattern = (value: string, pattern: RegExp, message: string): string | null => {
  if (value && !pattern.test(value)) {
    return message;
  }
  return null;
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSizeInBytes: number): string | null => {
  if (file.size > maxSizeInBytes) {
    const maxSizeInMB = Math.round(maxSizeInBytes / (1024 * 1024));
    return ERROR_MESSAGES.FILE_TOO_LARGE_WITH_SIZE.replace('{size}', String(maxSizeInMB));
  }
  return null;
};

/**
 * Validate file type
 */
export const validateFileType = (file: File, allowedTypes: string[]): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return `${ERROR_MESSAGES.INVALID_FILE_TYPE} Allowed types: ${allowedTypes.join(', ')}`;
  }
  return null;
};

/**
 * Validate URL format
 */
export const validateURL = (url: string): string | null => {
  if (!url) return null; // Optional field

  try {
    new URL(url);
    return null;
  } catch {
    return ERROR_MESSAGES.URL_INVALID;
  }
};

/**
 * Validate date format and range
 */
export const validateDate = (dateString: string, minDate?: Date, maxDate?: Date): string | null => {
  if (!dateString) return null; // Optional field
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return ERROR_MESSAGES.DATE_INVALID;
  }

  if (minDate && date < minDate) {
    return ERROR_MESSAGES.DATE_TOO_EARLY.replace('{date}', minDate.toLocaleDateString());
  }

  if (maxDate && date > maxDate) {
    return ERROR_MESSAGES.DATE_TOO_LATE.replace('{date}', maxDate.toLocaleDateString());
  }
  
  return null;
};

/**
 * Validate number range
 */
export const validateNumberRange = (value: number, min?: number, max?: number, fieldName: string = 'Value'): string | null => {
  if (isNaN(value)) {
    return ERROR_MESSAGES.NUMBER_INVALID.replace('{field}', fieldName);
  }

  if (min !== undefined && value < min) {
    return `${fieldName} must be at least ${min}`;
  }

  if (max !== undefined && value > max) {
    return `${fieldName} must not exceed ${max}`;
  }

  return null;
};

/**
 * Generic field validator that applies multiple rules
 */
export const validateField = <T>(value: T, rules: ValidationRule<T>[]): string | null => {
  for (const rule of rules) {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.message || ERROR_MESSAGES.REQUIRED_FIELD.replace('{field}', 'This field');
    }
    
    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      continue;
    }
    
    // String-specific validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `Must be at least ${rule.minLength} characters`;
      }
      
      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `Must not exceed ${rule.maxLength} characters`;
      }
      
      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || 'Invalid format';
      }
    }
    
    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }
  }
  
  return null;
};

/**
 * Validate entire form object
 */
export const validateForm = <T extends Record<string, any>>(
  formData: T,
  validationRules: { [K in keyof T]?: ValidationRule<T[K]>[] }
): { [K in keyof T]?: string } => {
  const errors: { [K in keyof T]?: string } = {};
  
  for (const [field, rules] of Object.entries(validationRules) as [keyof T, ValidationRule<T[keyof T]>[]][]) {
    if (rules) {
      const error = validateField(formData[field], rules);
      if (error) {
        errors[field] = error;
      }
    }
  }
  
  return errors;
};

/**
 * Check if form has any errors
 */
export const hasFormErrors = (errors: Record<string, string | undefined>): boolean => {
  return Object.values(errors).some(error => error !== undefined && error !== null && error !== '');
};

/**
 * Format validation error for display
 */
export const formatValidationError = (error: string): string => {
  return error.charAt(0).toUpperCase() + error.slice(1);
};

/**
 * Debounced validation function
 */
export const createDebouncedValidator = <T>(
  validator: (value: T) => string | null,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (value: T, callback: (error: string | null) => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const error = validator(value);
      callback(error);
    }, delay);
  };
};

/**
 * Common validation rules for reuse
 */
export const commonValidationRules = {
  email: [
    { required: true, message: ERROR_MESSAGES.EMAIL_REQUIRED },
    { custom: validateEmail, message: ERROR_MESSAGES.EMAIL_INVALID },
  ],
  password: [
    { required: true, message: ERROR_MESSAGES.PASSWORD_REQUIRED },
    { custom: validatePassword, message: ERROR_MESSAGES.PASSWORD_WEAK },
  ],
  phone: [
    { required: true, message: ERROR_MESSAGES.PHONE_REQUIRED },
    { custom: validatePhone, message: ERROR_MESSAGES.PHONE_INVALID },
  ],
  name: [
    { required: true, message: ERROR_MESSAGES.NAME_REQUIRED },
    { custom: validateName, message: ERROR_MESSAGES.NAME_INVALID },
  ],
  otp: [
    { required: true, message: ERROR_MESSAGES.OTP_REQUIRED },
    { custom: validateOTP, message: ERROR_MESSAGES.OTP_INVALID },
  ],
} as const;

/**
 * Business-specific validation rules
 */
export const businessValidationRules = {
  businessName: [
    { required: true, message: 'Business name is required' },
    { minLength: 2, message: 'Business name must be at least 2 characters' },
    { maxLength: 100, message: 'Business name must not exceed 100 characters' },
  ],
  businessType: [
    { required: true, message: 'Business type is required' },
  ],
  description: [
    { maxLength: 500, message: 'Description must not exceed 500 characters' },
  ],
  address: [
    { required: true, message: 'Address is required' },
    { minLength: 10, message: 'Please provide a complete address' },
  ],
  bankAccount: [
    { required: true, message: 'Bank account number is required' },
    { pattern: /^\d{8,17}$/, message: 'Invalid bank account number format' },
  ],
  routingNumber: [
    { required: true, message: 'Routing number is required' },
    { pattern: /^\d{9}$/, message: 'Routing number must be 9 digits' },
  ],
} as const;
