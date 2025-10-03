import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useLocation } from '../../hooks/useLocation';
import {
  getPlaceDetailsGoogle,
  GooglePlacesSuggestion,
  isGoogleMapsConfigured,
  searchPlacesGoogle
} from '../../utils/googleMapsLocation';
import { searchPlaces } from '../../utils/location';
import { toast } from '../../utils/toast';

interface AddressAutocompleteEnhancedProps {
  placeholder?: string;
  onAddressSelect: (suggestion: GooglePlacesSuggestion) => void;
  onCreateAddress: (suggestion: GooglePlacesSuggestion) => Promise<void>;
  style?: any;
  autoFocus?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  requireConfirmation?: boolean;
}

const AddressAutocompleteEnhanced: React.FC<AddressAutocompleteEnhancedProps> = ({
  placeholder = "Add a new address",
  onAddressSelect,
  onCreateAddress,
  style,
  autoFocus = false,
  value: controlledValue,
  onValueChange,
  requireConfirmation = false,
}) => {
  // State management
  const [internalValue, setInternalValue] = useState('');
  const [suggestions, setSuggestions] = useState<GooglePlacesSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Refs
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Hooks
  const showError = useCallback((m: string) => toast.error(m), []);
  const showSuccess = useCallback((m: string) => toast.success(m), []);
  const { getCurrentLocation } = useLocation();

  // Determine which value to use (controlled vs uncontrolled)
  const inputValue = controlledValue !== undefined ? controlledValue : internalValue;

  // Memoized current location for search bias
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // Get current location for search bias (non-blocking)
    getCurrentLocation().then(location => {
      if (location) {
        setCurrentLocation(location);
      }
    }).catch(() => {
      // Ignore location errors, search will work without bias
    });
  }, [getCurrentLocation]);

  // Enhanced debounced search with abort controller for cleanup
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchError(null);
      return;
    }

    // Cancel previous search if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this search
    abortControllerRef.current = new AbortController();

    setIsSearching(true);
    setSearchError(null);

    try {
      let results: GooglePlacesSuggestion[] = [];

      if (isGoogleMapsConfigured()) {
        results = await searchPlacesGoogle(
          searchQuery,
          currentLocation || undefined,
          (message) => setSearchError(message)
        );
      } else {
        // Fallback to OpenStreetMap/Nominatim search
        const basicResults = await searchPlaces(searchQuery);
        results = basicResults.map((s) => ({
          id: s.id,
          displayName: s.displayName || s.address,
          address: s.address,
          latitude: s.latitude,
          longitude: s.longitude,
          country: s.country || null,
          placeId: s.id,
          types: [],
        }));
      }

      // Check if this search was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('Search error:', error);
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchError('Search temporarily unavailable');
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, [currentLocation]);

  // Debounced search handler
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
  }, [performSearch]);

  // Handle text input changes
  const handleTextChange = useCallback((text: string) => {
    if (controlledValue === undefined) {
      setInternalValue(text);
    }
    onValueChange?.(text);

    // Reset selection when text changes
    setSelectedIndex(-1);
    
    // Perform search
    debouncedSearch(text);
  }, [controlledValue, onValueChange, debouncedSearch]);

  // Handle suggestion selection
  const handleSuggestionPress = useCallback(async (suggestion: GooglePlacesSuggestion, index: number) => {
    setSelectedIndex(index);

    if (requireConfirmation) {
      try {
        let selected = suggestion;
        if (suggestion.latitude === 0 && suggestion.longitude === 0 && isGoogleMapsConfigured()) {
          try {
            const details = await getPlaceDetailsGoogle(suggestion.placeId);
            selected = { ...suggestion, latitude: details.latitude, longitude: details.longitude };
          } catch (_) {}
        }
        onAddressSelect(selected);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Suggestion selection error:', error);
      }
      return;
    }

    setIsCreating(true);
    try {
      let finalSuggestion = suggestion;
      if (suggestion.latitude === 0 && suggestion.longitude === 0 && isGoogleMapsConfigured()) {
        try {
          const details = await getPlaceDetailsGoogle(suggestion.placeId);
          finalSuggestion = {
            ...suggestion,
            latitude: details.latitude,
            longitude: details.longitude,
          };
        } catch (error) {
          console.warn('Failed to get coordinates for place:', error);
        }
      }

      await onCreateAddress(finalSuggestion);
      showSuccess('Address added successfully');
      if (controlledValue === undefined) {
        setInternalValue('');
      }
      onValueChange?.('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error creating address:', error);
      showError('Failed to add address. Please try again.');
      setSelectedIndex(-1);
    } finally {
      setIsCreating(false);
    }
  }, [requireConfirmation, controlledValue, onValueChange, onCreateAddress, onAddressSelect, showSuccess, showError]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    if (suggestions.length > 0 && inputValue.trim().length >= 2) {
      setShowSuggestions(true);
    }
  }, [suggestions.length, inputValue]);

  // Handle input blur with delay to allow for suggestion taps
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for tap events
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
  }, []);

  // Clear search when component unmounts or input clears
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Memoized styles to prevent unnecessary re-renders
  const containerStyles = useMemo(() => [styles.container, style], [style]);
  const inputContainerStyles = useMemo(() => [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    searchError && styles.inputContainerError,
  ], [isFocused, searchError]);

  // Loading indicator component
  const LoadingIndicator = useMemo(() => {
    if (!isSearching && !isCreating) return null;
    return (
      <ActivityIndicator
        size="small"
        color="#06888C"
        style={styles.loadingIndicator}
      />
    );
  }, [isSearching, isCreating]);

  return (
    <View style={containerStyles}>
      {/* Input Container */}
      <Pressable 
        style={inputContainerStyles}
        onPress={() => inputRef.current?.focus()}
      >
        <Svg width="14" height="15" viewBox="0 0 14 15" fill="none" style={styles.searchIcon}>
          <Path d="M13.2353 14.4531C13.1474 14.4527 13.0605 14.4348 12.9797 14.4005C12.8988 14.3661 12.8256 14.3161 12.7643 14.2531L10.3153 11.8041C9.05417 12.824 7.44984 13.3211 5.83303 13.1931C4.21621 13.0651 2.71014 12.3216 1.62528 11.1159C0.540426 9.91028 -0.0405212 8.33437 0.00219959 6.71305C0.0449203 5.09173 0.708053 3.5486 1.85489 2.40175C3.00174 1.25491 4.54487 0.59178 6.16619 0.549059C7.78751 0.506339 9.36342 1.08729 10.5691 2.17214C11.7747 3.257 12.5182 4.76307 12.6462 6.37989C12.7743 7.9967 12.2771 9.60103 11.2573 10.8621L13.7063 13.3111C13.7994 13.4043 13.8629 13.523 13.8886 13.6522C13.9143 13.7814 13.9011 13.9153 13.8507 14.037C13.8003 14.1587 13.7149 14.2628 13.6054 14.3359C13.4958 14.4091 13.367 14.4482 13.2353 14.4481V14.4531ZM6.33227 1.88613C5.34336 1.88613 4.37667 2.17938 3.55442 2.72878C2.73217 3.27819 2.09131 4.05908 1.71287 4.97271C1.33444 5.88634 1.23542 6.89168 1.42834 7.86158C1.62127 8.83149 2.09747 9.7224 2.79674 10.4217C3.496 11.1209 4.38691 11.5971 5.35682 11.7901C6.32672 11.983 7.33206 11.884 8.24569 11.5055C9.15932 11.1271 9.94021 10.4862 10.4896 9.66398C11.039 8.84174 11.3323 7.87504 11.3323 6.88613C11.3307 5.56054 10.8034 4.28969 9.86605 3.35235C8.92871 2.41501 7.65787 1.88772 6.33227 1.88613Z" fill={searchError ? "#FF6B6B" : "#000"}/>
        </Svg>
        
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={searchError ? "#FF9999" : "#6F7380"}
          value={inputValue}
          onChangeText={handleTextChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          editable={!isCreating}
          returnKeyType="search"
          autoCapitalize="words"
          autoComplete={Platform.OS === 'web' ? 'street-address' : undefined}
          autoCorrect={false}
        />
        
        {LoadingIndicator}
      </Pressable>

      {/* Error message */}
      {searchError && (
        <Text style={styles.errorText}>{searchError}</Text>
      )}

      {/* Suggestions Container */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            style={{ maxHeight: 280 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
          >
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={suggestion.id}
                style={[
                  styles.suggestionItem,
                  index === suggestions.length - 1 && styles.suggestionItemLast,
                  selectedIndex === index && styles.suggestionItemSelected,
                ]}
                onPress={() => handleSuggestionPress(suggestion, index)}
                disabled={isCreating}
              >
                <View style={styles.suggestionContent}>
                  <Svg width="18" height="18" viewBox="0 0 18 19" fill="none" style={styles.locationIcon}>
                    <Path d="M17.0176 0.505315L17.1115 0.5L17.2267 0.507087L17.3064 0.52126L17.4154 0.552264L17.5101 0.593012L17.5987 0.643504L17.6784 0.702854L17.7511 0.769291L17.7971 0.821555L17.8698 0.924311L17.9158 1.00935C17.9572 1.09793 17.9838 1.19124 17.9956 1.28927L18 1.38317C18 1.4499 17.9929 1.51486 17.9787 1.57805L17.9477 1.68701L12.1615 17.7001C12.0518 17.9389 11.8759 18.1412 11.6547 18.283C11.4334 18.4248 11.1762 18.5001 10.9134 18.5C10.6768 18.5005 10.444 18.4398 10.2378 18.3239C10.0315 18.2079 9.8587 18.0407 9.73612 17.8383L9.67854 17.7258L6.70925 11.789L0.800788 8.83386C0.582166 8.73387 0.393629 8.57824 0.254031 8.38252C0.114433 8.1868 0.0286688 7.95787 0.005315 7.7186L0 7.58661C0 7.09055 0.266634 6.63701 0.74498 6.37303L0.868996 6.31102L16.8289 0.547835L16.9228 0.52126L17.0176 0.505315Z" fill={selectedIndex === index ? "#FFF" : "#06888C"}/>
                  </Svg>
                  <View style={styles.suggestionText}>
                    <Text
                      style={[
                        styles.suggestionAddress,
                        selectedIndex === index && styles.suggestionAddressSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {suggestion.address}
                    </Text>
                    <Text
                      style={[
                        styles.suggestionDetails,
                        selectedIndex === index && styles.suggestionDetailsSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {suggestion.displayName}
                    </Text>
                  </View>
                  {selectedIndex === index && isCreating && (
                    <ActivityIndicator size="small" color="#FFF" />
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>
          {/* API Info Footer */}
          <View style={styles.apiInfoContainer}>
            <Text style={styles.apiInfoText}>
              {isGoogleMapsConfigured() ? 'Powered by Google Maps' : 'Powered by OpenStreetMap'}
            </Text>
          </View>
        </View>
      )}

      {/* Empty state when search has no results */}
      {showSuggestions && suggestions.length === 0 && !isSearching && inputValue.trim().length >= 2 && (
        <View style={styles.suggestionsContainer}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No addresses found</Text>
            <Text style={styles.emptyStateSubtext}>Try a different search term</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10002,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFFFFF',
    gap: 14,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : ({} as any)),
  },
  inputContainerFocused: {
    borderColor: '#06888C',
    backgroundColor: '#FFF',
    ...(Platform.select({
      ios: {
        shadowColor: '#06888C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 0px 4px rgba(6, 136, 140, 0.12)'
      }
    }) as any),
  },
  inputContainerError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  searchIcon: {
    flexShrink: 0,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Nunito Sans',
    color: '#333333',
    paddingVertical: 0,
    height: '100%',
    ...(Platform.OS === 'web'
      ? {
          outlineStyle: 'none',
          outlineWidth: 0,
          borderWidth: 0,
          borderColor: 'transparent',
          boxShadow: 'none',
        }
      : ({} as any)),
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    marginLeft: 18,
    fontFamily: 'OpenSans-Regular',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    ...(Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)'
      }
    }) as any),
    zIndex: 10000,
    maxHeight: 280,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  suggestionItemLast: {
    borderBottomWidth: 0,
  },
  suggestionItemSelected: {
    backgroundColor: '#06888C',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIcon: {
    width: 18,
    height: 18,
    flexShrink: 0,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionAddress: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
    lineHeight: 18,
  },
  suggestionAddressSelected: {
    color: '#FFF',
  },
  suggestionDetails: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#6B7280',
    lineHeight: 16,
    marginTop: 2,
  },
  suggestionDetailsSelected: {
    color: '#DFF7EE',
  },
  apiInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  apiInfoText: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'OpenSans-SemiBold',
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'OpenSans-Regular',
  },
});

export default AddressAutocompleteEnhanced;
