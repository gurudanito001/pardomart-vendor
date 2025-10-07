import * as ImagePicker from 'expo-image-picker';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';

// Types
export interface ImagePickerResult {
  cancelled: boolean;
  uri: string;
  width: number;
  height: number;
  type: 'image' | 'video';
  fileName?: string;
  fileSize?: number;
  base64?: string;
}

export interface ImagePickerOptions {
  mediaTypes?: 'Images' | 'Videos' | 'All';
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  allowsMultipleSelection?: boolean;
  base64?: boolean;
}

interface UseImagePickerConfig extends Partial<ImagePickerOptions> {
  maxSize?: number;
  allowedTypes?: string[];
  showAlert?: boolean;
  alertTitle?: string;
  alertMessage?: string;
}

interface UseImagePickerState {
  selectedImage: ImagePickerResult | null;
  selectedImages: ImagePickerResult[];
  isLoading: boolean;
  error: string | null;
}

interface UseSingleImagePickerReturn extends UseImagePickerState {
  pickFromGallery: () => Promise<ImagePickerResult | null>;
  pickFromCamera: () => Promise<ImagePickerResult | null>;
  showImagePicker: () => void;
  clearImage: () => void;
  reset: () => void;
}

interface UseMultipleImagePickerReturn extends UseImagePickerState {
  pickFromGallery: () => Promise<ImagePickerResult | null>;
  removeImage: (index: number) => void;
  clearImages: () => void;
  reset: () => void;
}


// Constants
const DEFAULT_CONFIG: Required<UseImagePickerConfig> = {
  mediaTypes: 'Images',
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
  allowsMultipleSelection: false,
  base64: false,
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  showAlert: true,
  alertTitle: 'Select Image',
  alertMessage: 'Choose an option to select an image',
};

const FILE_SIZE_LIMITS = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  DEFAULT: 5 * 1024 * 1024, // 5MB
} as const;

// Platform-specific configurations
const WEB_FILE_INPUT_ACCEPT = {
  Images: 'image/*',
  Videos: 'video/*',
  All: 'image/*,video/*',
} as const;

// Utility functions
const formatFileSize = (bytes: number): string => {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
};

const createImageResult = (asset: ImagePicker.ImagePickerAsset): ImagePickerResult => ({
  cancelled: false,
  uri: asset.uri,
  width: asset.width,
  height: asset.height,
  type: asset.type as 'image' | 'video',
  fileName: asset.fileName as any,
  fileSize: asset.fileSize,
  base64: asset.base64 as any,
});

// Web-specific file handling
const handleWebFileSelection = (
  files: FileList | null,
  options: Required<UseImagePickerConfig>
): Promise<ImagePickerResult | null> => {
  return new Promise((resolve) => {
    if (!files || files.length === 0) {
      resolve(null);
      return;
    }

    const file = files[0];
    
    // Validate file type
    if (!options.allowedTypes.some(type => file.type.includes(type.split('/')[1]))) {
      throw new Error(`Invalid file type. Allowed: ${options.allowedTypes.join(', ')}`);
    }

    // Validate file size
    if (file.size > options.maxSize) {
      throw new Error(`File size should not exceed ${formatFileSize(options.maxSize)}`);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const result: ImagePickerResult = {
          cancelled: false,
          uri: event.target?.result as string,
          width: img.width,
          height: img.height,
          type: 'image',
          fileName: file.name,
          fileSize: file.size,
        };

        if (options.base64) {
          result.base64 = event.target?.result as string;
        }

        resolve(result);
      };
      img.onerror = () => {
        throw new Error('Failed to load image');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      throw new Error('Failed to read file');
    };
    reader.readAsDataURL(file);
  });
};

// Custom hooks for permissions
const usePermissions = () => {
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      // Web doesn't need explicit camera permissions for file input
      return true;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Camera permission is required to take photos');
      }
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const requestGalleryPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      // Web doesn't need explicit gallery permissions
      return true;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Gallery permission is required to select photos');
      }
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  return { requestCameraPermission, requestGalleryPermission };
};

// Custom hook for image validation
const useImageValidation = (maxSize: number, allowedTypes: string[]) => {
  return useCallback((result: ImagePicker.ImagePickerResult): { isValid: boolean; error?: string } => {
    if (result.canceled || !result.assets?.[0]) {
      return { isValid: false, error: 'No image selected' };
    }

    const asset = result.assets[0];

    // Validate file size
    if (asset.fileSize && asset.fileSize > maxSize) {
      return { 
        isValid: false, 
        error: `Image size should not exceed ${formatFileSize(maxSize)}` 
      };
    }

    // Validate file type
    if (asset.mimeType && !allowedTypes.includes(asset.mimeType)) {
      return { 
        isValid: false, 
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` 
      };
    }

    return { isValid: true };
  }, [maxSize, allowedTypes]);
};


// Main image picker hook
export function useImagePicker(config: UseImagePickerConfig & { multiple: true }): UseMultipleImagePickerReturn;
export function useImagePicker(config?: UseImagePickerConfig & { multiple?: false }): UseSingleImagePickerReturn;
export function useImagePicker(config: UseImagePickerConfig & { multiple?: boolean } = {}): UseSingleImagePickerReturn | UseMultipleImagePickerReturn {
  const isMultiple = config.multiple ?? false;
  const options = useMemo(() => ({ 
    ...DEFAULT_CONFIG, 
    ...config,
    allowsMultipleSelection: isMultiple,
    allowsEditing: isMultiple ? false : config.allowsEditing ?? DEFAULT_CONFIG.allowsEditing,
  }), [config, isMultiple]);

  const [state, setState] = useState<UseImagePickerState>({
    selectedImage: null,
    selectedImages: [],
    isLoading: false,
    error: null,
  });

  const { requestCameraPermission, requestGalleryPermission } = usePermissions();
  const validateImage = useImageValidation(options.maxSize, options.allowedTypes);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const validateAndSetImages = useCallback((result: ImagePicker.ImagePickerResult): ImagePickerResult[] => {
    if (result.canceled || !result.assets) return [];

    const validImages: ImagePickerResult[] = [];
    const errors: string[] = [];

    result.assets.forEach((asset, index) => {
      if (asset.fileSize && asset.fileSize > options.maxSize) {
        errors.push(`Image ${index + 1}: Size exceeds ${formatFileSize(options.maxSize)}`);
        return;
      }

      if (asset.mimeType && !options.allowedTypes.includes(asset.mimeType)) {
        errors.push(`Image ${index + 1}: Invalid file type`);
        return;
      }

      validImages.push(createImageResult(asset));
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (isMultiple) {
      setState(prev => ({ ...prev, selectedImages: [...prev.selectedImages, ...validImages] }));
    } else if (validImages.length > 0) {
      setState(prev => ({ ...prev, selectedImage: validImages[0] }));
    }

    return validImages;
  }, [options.maxSize, options.allowedTypes, setError, isMultiple]);

  
  const pickFromGallery = useCallback(async (): Promise<ImagePickerResult | null> => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === 'web') {
        // Create a file input element for web
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = WEB_FILE_INPUT_ACCEPT[options.mediaTypes];
        input.multiple = options.allowsMultipleSelection;

        return new Promise((resolve) => {
          input.onchange = async (e) => {
            try {
              const target = e.target as HTMLInputElement;
              const files = target.files;

              if (!files) {
                resolve(null);
                return;
              }

              const validImages: ImagePickerResult[] = [];
              const errors: string[] = [];

              for (let i = 0; i < files.length; i++) {
                try {
                  const result = await handleWebFileSelection(
                    { ...files, 0: files[i], length: 1 } as FileList,
                    options
                  );
                  if (result) {
                    validImages.push(result);
                  }
                } catch (error) {
                  errors.push(`File ${i + 1}: ${error instanceof Error ? error.message : 'Failed to process'}`);
                }
              }

              if (errors.length > 0) {
                setError(errors.join('\n'));
              }

              if (isMultiple) setState(prev => ({ ...prev, selectedImages: [...prev.selectedImages, ...validImages] }));
              else if (validImages.length > 0) setState(prev => ({ ...prev, selectedImage: validImages[0] }));

              resolve(validImages.length > 0 ? validImages[0] : null);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
              setError(errorMessage);
              resolve(null);
            }
          };

          input.oncancel = () => {
            resolve(null);
          };

          input.click();
        });
      }

      // Native platforms
      if (!(await requestGalleryPermission())) {
        setError('Gallery permission denied');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: options.mediaTypes as ImagePicker.MediaTypeOptions,
        allowsEditing: options.allowsEditing,
        aspect: options.aspect,
        quality: options.quality,
        allowsMultipleSelection: options.allowsMultipleSelection,
        base64: options.base64,
      });

      const validImages = validateAndSetImages(result);
      return validImages.length > 0 ? validImages[0] : null;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to pick image from gallery';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options, requestGalleryPermission, validateAndSetImages, setLoading, setError, isMultiple]);

  const pickFromCamera = useCallback(async (): Promise<ImagePickerResult | null> => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === 'web') {
        // On web, camera access requires getUserMedia
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          
          // For now, we'll fallback to file picker on web
          // In a real implementation, you'd implement a camera capture UI
          stream.getTracks().forEach(track => track.stop());
          
          setError('Camera capture not yet implemented on web. Please use gallery instead.');
          return null;
        } catch (error) {
          setError('Camera access denied or not available');
          return null;
        }
      }

      // Native platforms
      if (!(await requestCameraPermission())) {
        setError('Camera permission denied');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: options.mediaTypes as ImagePicker.MediaTypeOptions,
        allowsEditing: options.allowsEditing,
        aspect: options.aspect,
        quality: options.quality,
        base64: options.base64,
      });

      const validImages = validateAndSetImages(result);
      return validImages.length > 0 ? validImages[0] : null;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to take photo';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options, requestCameraPermission, validateAndSetImages, setLoading, setError]);

  const showImagePicker = useCallback(() => {
    // On web, the user has already clicked the upload area.
    // The most intuitive UX is to open the file picker directly.
    if (Platform.OS === 'web') {
      pickFromGallery();
      return;
    }
    
    // On native, if showAlert is false, default to gallery.
    if (!options.showAlert) {
      pickFromGallery();
      return;
    }

    // On native platforms, show the alert to choose between Camera and Gallery.
    const alertOptions = [
      { text: 'Camera', onPress: pickFromCamera },
      { text: 'Gallery', onPress: pickFromGallery },
      { text: 'Cancel', style: 'cancel' as const },
    ];

    Alert.alert(options.alertTitle, options.alertMessage, alertOptions);

  }, [options.showAlert, options.alertTitle, options.alertMessage, pickFromCamera, pickFromGallery]);

  const clearImage = useCallback(() => {
    setState(prev => ({ ...prev, selectedImage: null, error: null }));
  }, []);

  const removeImage = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      selectedImages: prev.selectedImages.filter((_, i) => i !== index)
    }));
  }, []);

  const clearImages = useCallback(() => {
    setState(prev => ({ ...prev, selectedImages: [], error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      selectedImage: null,
      selectedImages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  if (isMultiple) {
    return {
      ...state,
      pickFromGallery,
      removeImage,
      clearImages,
      reset,
    };
  }

  return {
    ...state,
    pickFromGallery,
    pickFromCamera,
    showImagePicker,
    clearImage,
    reset,
  };
}

// Specialized hooks
export function useAvatarPicker(config: UseImagePickerConfig = {}) {
  return useImagePicker({
    aspect: [1, 1],
    maxSize: FILE_SIZE_LIMITS.AVATAR,
    alertTitle: 'Select Profile Picture',
    alertMessage: Platform.OS === 'web' 
      ? 'Choose your profile picture' 
      : 'Choose how you want to select your profile picture',
    ...config,
  });
}

export function useDocumentPicker(config: UseImagePickerConfig = {}) {
  return useImagePicker({
    quality: 0.9,
    maxSize: FILE_SIZE_LIMITS.DOCUMENT,
    alertTitle: 'Select Document',
    alertMessage: Platform.OS === 'web'
      ? 'Choose your document file'
      : 'Choose how you want to capture or select the document',
    ...config,
  });
}