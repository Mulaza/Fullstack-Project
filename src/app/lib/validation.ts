// src/app/lib/validation.ts

export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const EMAIL_MAX_LENGTH = 255;

// Allowed characters: letters, numbers, spaces, hyphens, underscores
const USERNAME_REGEX = /^[a-zA-Z0-9\s\-_]+$/;

// Email regex (basic validation)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements: at least one letter, one number
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

// SQL injection prevention - check for common SQL keywords and special characters
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
  /(--|;|\/\*|\*\/|xp_|sp_)/gi,
  /('|('')|(\')|(;))/gi,
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUsername = (username: string): ValidationResult => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < USERNAME_MIN_LENGTH) {
    return { isValid: false, error: `Name must be at least ${USERNAME_MIN_LENGTH} characters` };
  }

  if (trimmedUsername.length > USERNAME_MAX_LENGTH) {
    return { isValid: false, error: `Name must not exceed ${USERNAME_MAX_LENGTH} characters` };
  }

  if (!USERNAME_REGEX.test(trimmedUsername)) {
    return { 
      isValid: false, 
      error: 'Name can only contain letters, numbers, spaces, hyphens, and underscores' 
    };
  }

  // Check for SQL injection patterns
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(trimmedUsername)) {
      return { isValid: false, error: 'Invalid characters detected' };
    }
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedEmail.length > EMAIL_MAX_LENGTH) {
    return { isValid: false, error: `Email must not exceed ${EMAIL_MAX_LENGTH} characters` };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Check for SQL injection patterns
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(trimmedEmail)) {
      return { isValid: false, error: 'Invalid characters detected' };
    }
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { isValid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return { isValid: false, error: `Password must not exceed ${PASSWORD_MAX_LENGTH} characters` };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one letter and one number' 
    };
  }

  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/['"]/g, '') // Remove quotes
    .slice(0, 1000); // Hard limit
};