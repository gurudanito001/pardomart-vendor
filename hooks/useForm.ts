import { useState, useCallback, useMemo } from 'react';
import { FormState, FormField, FormValidation, ValidationRule } from '../types';
import { validateField, hasFormErrors } from '../utils/validation';

interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validationRules?: FormValidation<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: { [K in keyof T]?: string };
  touched: { [K in keyof T]?: boolean };
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setError: (field: keyof T, error: string | null) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  handleChange: (field: keyof T) => (value: T[keyof T]) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: () => Promise<void>;
  reset: (newValues?: Partial<T>) => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => boolean;
  clearErrors: () => void;
  setSubmitting: (submitting: boolean) => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormOptions<T>): UseFormReturn<T> {
  // Create initial form state
  const createInitialState = useCallback(
    (values: T): FormState<T> => ({
      fields: Object.keys(values).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            value: values[key as keyof T],
            error: null,
            touched: false,
          },
        }),
        {} as { [K in keyof T]: FormField<T[K]> }
      ),
      isValid: true,
      isSubmitting: false,
    }),
    []
  );

  const [formState, setFormState] = useState<FormState<T>>(() =>
    createInitialState(initialValues)
  );

  // Derived values
  const values = useMemo(
    () =>
      Object.keys(formState.fields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: formState.fields[key as keyof T].value,
        }),
        {} as T
      ),
    [formState.fields]
  );

  const errors = useMemo(
    () =>
      Object.keys(formState.fields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: formState.fields[key as keyof T].error,
        }),
        {} as { [K in keyof T]?: string }
      ),
    [formState.fields]
  );

  const touched = useMemo(
    () =>
      Object.keys(formState.fields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: formState.fields[key as keyof T].touched,
        }),
        {} as { [K in keyof T]?: boolean }
      ),
    [formState.fields]
  );

  const isValid = useMemo(() => {
    return !hasFormErrors(errors);
  }, [errors]);

  // Field validation
  const validateFieldValue = useCallback(
    (field: keyof T, value: T[keyof T]): string | null => {
      const rules = validationRules[field];
      if (!rules) return null;
      return validateField(value, rules);
    },
    [validationRules]
  );

  // Form actions
  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: {
          ...prev.fields[field],
          value,
          error: validateOnChange ? validateFieldValue(field, value) : prev.fields[field].error,
        },
      },
    }));
  }, [validateOnChange, validateFieldValue]);

  const setError = useCallback((field: keyof T, error: string | null) => {
    setFormState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: {
          ...prev.fields[field],
          error,
        },
      },
    }));
  }, []);

  const setTouched = useCallback((field: keyof T, touched: boolean) => {
    setFormState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: {
          ...prev.fields[field],
          touched,
        },
      },
    }));
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    setFormState(prev => ({
      ...prev,
      isSubmitting: submitting,
    }));
  }, []);

  // Event handlers
  const handleChange = useCallback(
    (field: keyof T) => (value: T[keyof T]) => {
      setValue(field, value);
    },
    [setValue]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched(field, true);
      if (validateOnBlur) {
        const currentValue = formState.fields[field].value;
        const error = validateFieldValue(field, currentValue);
        setError(field, error);
      }
    },
    [formState.fields, validateOnBlur, validateFieldValue, setTouched, setError]
  );

  // Form validation
  const validateFormFields = useCallback(() => {
    const newErrors: { [K in keyof T]?: string } = {};
    let hasErrors = false;

    Object.keys(formState.fields).forEach(key => {
      const field = key as keyof T;
      const value = formState.fields[field].value;
      const error = validateFieldValue(field, value);
      
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    // Update all errors at once
    setFormState(prev => ({
      ...prev,
      fields: Object.keys(prev.fields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...prev.fields[key as keyof T],
            error: newErrors[key as keyof T] || null,
            touched: true,
          },
        }),
        {} as { [K in keyof T]: FormField<T[K]> }
      ),
    }));

    return !hasErrors;
  }, [formState.fields, validateFieldValue]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!onSubmit) return;

    const isFormValid = validateFormFields();
    if (!isFormValid) return;

    try {
      setSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      // Optionally handle submission errors here
    } finally {
      setSubmitting(false);
    }
  }, [onSubmit, validateFormFields, values, setSubmitting]);

  // Reset form
  const reset = useCallback((newValues?: Partial<T>) => {
    const resetValues = newValues ? { ...initialValues, ...newValues } : initialValues;
    setFormState(createInitialState(resetValues));
  }, [initialValues, createInitialState]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      fields: Object.keys(prev.fields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...prev.fields[key as keyof T],
            error: null,
          },
        }),
        {} as { [K in keyof T]: FormField<T[K]> }
      ),
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting: formState.isSubmitting,
    setValue,
    setError,
    setTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validateField: validateFieldValue,
    validateForm: validateFormFields,
    clearErrors,
    setSubmitting,
  };
}

// Helper hook for simple form validation without complex state management
export function useSimpleForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: FormValidation<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(() => {
    if (!validationRules) return true;

    const newErrors: { [K in keyof T]?: string } = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach(key => {
      const field = key as keyof T;
      const rules = validationRules[field];
      if (rules) {
        const error = validateField(values[field], rules);
        if (error) {
          newErrors[field] = error;
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [values, validationRules]);

  const handleChange = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when value changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    setValues,
    setErrors,
    setIsSubmitting,
    handleChange,
    validate,
    reset,
    isValid: !hasFormErrors(errors),
  };
}
