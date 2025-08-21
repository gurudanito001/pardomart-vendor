import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import { ImagePickerOptions, ImagePickerResult } from '../types';

interface UseImagePickerOptions extends Partial<ImagePickerOptions> {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  showAlert?: boolean;
  alertTitle?: string;
  alertMessage?: string;
}

interface UseImagePickerReturn {
  selectedImage: ImagePickerResult | null;
  isLoading: boolean;
  error: string | null;
  pickFromGallery: () => Promise<ImagePickerResult | null>;
  pickFromCamera: () => Promise<ImagePickerResult | null>;
  showImagePicker: () => void;
  clearImage: () => void;
  reset: () => void;
}

/**
 * Hook for handling image selection from camera or gallery
 */
export function useImagePicker(options: UseImagePickerOptions = {}): UseImagePickerReturn {
  const {
    mediaTypes = 'Images',
    allowsEditing = true,
    aspect = [4, 3],
    quality = 0.8,
    allowsMultipleSelection = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    showAlert = true,
    alertTitle = 'Select Image',
    alertMessage = 'Choose an option to select an image',
  } = options;

  const [selectedImage, setSelectedImage] = useState<ImagePickerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request permissions
  const requestPermissions = useCallback(async (type: 'camera' | 'gallery') => {
    try {
      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Camera permission is required to take photos');
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Gallery permission is required to select photos');
        }
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, []);

  // Validate selected image
  const validateImage = useCallback((result: ImagePicker.ImagePickerResult): boolean => {
    if (result.canceled) {
      return false;
    }

    const asset = result.assets?.[0];
    if (!asset) {
      setError('No image selected');
      return false;
    }

    // Check file size
    if (asset.fileSize && asset.fileSize > maxSize) {
      const maxSizeInMB = Math.round(maxSize / (1024 * 1024));
      setError(`Image size should not exceed ${maxSizeInMB}MB`);
      return false;
    }

    // Check file type (if available)
    if (asset.mimeType && !allowedTypes.includes(asset.mimeType)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      return false;
    }

    return true;
  }, [maxSize, allowedTypes]);

  // Pick image from gallery
  const pickFromGallery = useCallback(async (): Promise<ImagePickerResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const hasPermission = await requestPermissions('gallery');
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypes as ImagePicker.MediaTypeOptions,
        allowsEditing,
        aspect,
        quality,
        allowsMultipleSelection,
      });

      if (!validateImage(result)) {
        return null;
      }

      const asset = result.assets?.[0];
      if (asset) {
        const imageResult: ImagePickerResult = {
          cancelled: false,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type as 'image' | 'video',
          fileName: asset.fileName,
          fileSize: asset.fileSize,
        };

        setSelectedImage(imageResult);
        return imageResult;
      }

      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to pick image from gallery');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [mediaTypes, allowsEditing, aspect, quality, allowsMultipleSelection, requestPermissions, validateImage]);

  // Pick image from camera
  const pickFromCamera = useCallback(async (): Promise<ImagePickerResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const hasPermission = await requestPermissions('camera');
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: mediaTypes as ImagePicker.MediaTypeOptions,
        allowsEditing,
        aspect,
        quality,
      });

      if (!validateImage(result)) {
        return null;
      }

      const asset = result.assets?.[0];
      if (asset) {
        const imageResult: ImagePickerResult = {
          cancelled: false,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type as 'image' | 'video',
          fileName: asset.fileName,
          fileSize: asset.fileSize,
        };

        setSelectedImage(imageResult);
        return imageResult;
      }

      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to take photo');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [mediaTypes, allowsEditing, aspect, quality, requestPermissions, validateImage]);

  // Show image picker alert
  const showImagePicker = useCallback(() => {
    if (!showAlert) {
      pickFromGallery();
      return;
    }

    const options = [
      { text: 'Camera', onPress: pickFromCamera },
      { text: 'Gallery', onPress: pickFromGallery },
      { text: 'Cancel', style: 'cancel' as const },
    ];

    Alert.alert(alertTitle, alertMessage, options);
  }, [showAlert, alertTitle, alertMessage, pickFromCamera, pickFromGallery]);

  // Clear selected image
  const clearImage = useCallback(() => {
    setSelectedImage(null);
    setError(null);
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    setSelectedImage(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    selectedImage,
    isLoading,
    error,
    pickFromGallery,
    pickFromCamera,
    showImagePicker,
    clearImage,
    reset,
  };
}

/**
 * Hook for handling multiple image selection
 */
export function useMultipleImagePicker(options: UseImagePickerOptions = {}) {
  const [selectedImages, setSelectedImages] = useState<ImagePickerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    mediaTypes = 'Images',
    allowsEditing = false, // Usually disabled for multiple selection
    quality = 0.8,
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Gallery permission is required to select photos');
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, []);

  const validateImages = useCallback((result: ImagePicker.ImagePickerResult): ImagePickerResult[] => {
    if (result.canceled || !result.assets) {
      return [];
    }

    const validImages: ImagePickerResult[] = [];
    const errors: string[] = [];

    result.assets.forEach((asset, index) => {
      // Check file size
      if (asset.fileSize && asset.fileSize > maxSize) {
        const maxSizeInMB = Math.round(maxSize / (1024 * 1024));
        errors.push(`Image ${index + 1}: Size should not exceed ${maxSizeInMB}MB`);
        return;
      }

      // Check file type
      if (asset.mimeType && !allowedTypes.includes(asset.mimeType)) {
        errors.push(`Image ${index + 1}: Invalid file type`);
        return;
      }

      validImages.push({
        cancelled: false,
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type as 'image' | 'video',
        fileName: asset.fileName,
        fileSize: asset.fileSize,
      });
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    return validImages;
  }, [maxSize, allowedTypes]);

  const pickImages = useCallback(async (): Promise<ImagePickerResult[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return [];
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypes as ImagePicker.MediaTypeOptions,
        allowsEditing,
        quality,
        allowsMultipleSelection: true,
      });

      const validImages = validateImages(result);
      setSelectedImages(prev => [...prev, ...validImages]);
      return validImages;
    } catch (err: any) {
      setError(err.message || 'Failed to pick images');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [mediaTypes, allowsEditing, quality, requestPermissions, validateImages]);

  const removeImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setSelectedImages([]);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setSelectedImages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    selectedImages,
    isLoading,
    error,
    pickImages,
    removeImage,
    clearImages,
    reset,
  };
}

/**
 * Hook for handling avatar/profile picture selection with cropping
 */
export function useAvatarPicker(options: UseImagePickerOptions = {}) {
  const defaultOptions: UseImagePickerOptions = {
    mediaTypes: 'Images',
    allowsEditing: true,
    aspect: [1, 1], // Square aspect ratio for avatars
    quality: 0.8,
    maxSize: 2 * 1024 * 1024, // 2MB for avatars
    ...options,
  };

  return useImagePicker(defaultOptions);
}

/**
 * Hook for document image selection (receipts, IDs, etc.)
 */
export function useDocumentPicker(options: UseImagePickerOptions = {}) {
  const defaultOptions: UseImagePickerOptions = {
    mediaTypes: 'Images',
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.9, // Higher quality for documents
    maxSize: 10 * 1024 * 1024, // 10MB for documents
    ...options,
  };

  return useImagePicker(defaultOptions);
}
