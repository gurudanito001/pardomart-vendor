import { Image } from 'expo-image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Country, getCountries, isoToFlagEmoji } from '../utils/countries';

interface PhoneInputWithCountryProps {
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

const DEFAULT_COUNTRY: Country = { name: 'Nigeria', iso2: 'NG', dialCode: '+234', flagPng: 'https://flagcdn.com/w320/ng.png', flagSvg: 'https://flagcdn.com/ng.svg' };

const DIAL_PRIMARY: Record<string, string> = {
  '+1': 'US',
  '+44': 'GB',
  '+61': 'AU',
  '+358': 'FI',
};

const parseInitial = (value: string, list: Country[]): { country: Country; local: string } => {
  const countries = list && list.length ? list : [DEFAULT_COUNTRY];
  if (value && value.trim().startsWith('+')) {
    const clean = value.replace(/\s/g, '');
    const sorted = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
    const match = sorted.find((c) => clean.startsWith(c.dialCode));
    if (match) {
      const sameDial = countries.filter((c) => c.dialCode === match.dialCode);
      const preferredIso = DIAL_PRIMARY[match.dialCode];
      const chosen = preferredIso ? (sameDial.find((c) => c.iso2 === preferredIso) || match) : match;
      const local = clean.slice(chosen.dialCode.length);
      return { country: chosen, local };
    }
  }
  const fallback = countries.find((c) => c.iso2 === DEFAULT_COUNTRY.iso2) || countries[0];
  return { country: fallback, local: value || '' };
};

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChangeText,
  editable = true,
  placeholder = 'Phone Number',
  autoFocus = false,
}) => {
  const [list, setList] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country>(DEFAULT_COUNTRY);
  const [localNumber, setLocalNumber] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleOpen = useCallback(() => {
    if (!editable) return;
    setOpen(true);
  }, [editable]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 120);
  }, []);

  useEffect(() => {
    let mounted = true;
    getCountries().then((c) => {
      if (mounted && c && c.length) setList(c);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const composeFull = (c: Country, local: string) => `${c.dialCode}${local}`;

  useEffect(() => {
    // Keep internal state in sync if parent value changes externally
    const current = composeFull(selected, localNumber);
    const incoming = (value || '').replace(/\s/g, '');
    if (incoming === current) return;
    const parsed = parseInitial(value, list.length ? list : [DEFAULT_COUNTRY]);
    setSelected(parsed.country);
    setLocalNumber(parsed.local);
  }, [value, list]);

  // Auto focus on mount when requested
  useEffect(() => {
    if (autoFocus) {
      const id = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(id);
    }
  }, [autoFocus]);

  // Compose full E.164-like value when parts change
  useEffect(() => {
    const digitsOnly = localNumber; // already sanitized
    const combined = `${selected.dialCode}${digitsOnly}`;
    onChangeText(combined);
  }, [selected, localNumber, onChangeText]);

  const data = useMemo(() => {
    const source = list.length ? list : [DEFAULT_COUNTRY];
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q) ||
        c.dialCode.includes(q)
      );
    });
  }, [query, list]);

  const getTrunkPrefix = (iso2: string): string | null => {
    const upper = iso2.toUpperCase();
    if (upper === 'IT') return null; // keep leading 0 in international format for Italy
    if (upper === 'RU' || upper === 'KZ') return '8'; // Russia/Kazakhstan domestic trunk prefix
    return '0'; // default trunk prefix for most countries
  };

  const normalizeLocal = (iso2: string, input: string): string => {
    let digits = input.replace(/[^0-9]/g, '');
    const trunk = getTrunkPrefix(iso2);
    if (trunk && digits.startsWith(trunk)) {
      digits = digits.slice(trunk.length);
    }
    return digits;
  };

  const renderItem = ({ item }: { item: Country }) => {
    const isSelected = item.iso2 === selected.iso2;
    return (
      <Pressable
        onPress={() => {
          setSelected(item);
          setLocalNumber((prev) => normalizeLocal(item.iso2, prev));
          handleClose();
        }}
        style={[styles.itemRow, isSelected && styles.itemRowSelected]}
      >
        {item.flagPng ? (
          <Image source={{ uri: item.flagPng }} style={styles.flagImg} contentFit="cover" />
        ) : (
          <Text style={styles.flag}>{isoToFlagEmoji(item.iso2)}</Text>
        )}
        <View style={styles.itemTextWrap}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemSub}>({item.iso2})</Text>
        </View>
        <Text style={styles.itemDial}>{item.dialCode}</Text>
        {isSelected && <Text style={styles.check}>✓</Text>}
      </Pressable>
    );
  };

  return (
    <>
      <View style={[styles.container, focused && styles.containerFocused, !editable && styles.disabled]}>
        <Pressable
          disabled={!editable}
          onPress={handleOpen}
          style={styles.countryBtn}
          accessibilityRole="button"
          accessibilityLabel="Select country code"
        >
          {selected.flagPng ? (
            <Image source={{ uri: selected.flagPng }} style={styles.flagImg} contentFit="cover" />
          ) : (
            <Text style={styles.flag}>{isoToFlagEmoji(selected.iso2)}</Text>
          )}
          <Text style={styles.dialCode}>{selected.dialCode}</Text>
        </Pressable>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={localNumber}
          onChangeText={(t) => setLocalNumber(normalizeLocal(selected.iso2, t))}
          keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric', default: 'number-pad' })}
          placeholder={placeholder}
          placeholderTextColor="rgba(111, 115, 128, 0.5)"
          editable={editable}
          textContentType="telephoneNumber"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>

      <Modal visible={open} animationType="slide" onRequestClose={handleClose}>
        <View style={styles.modalWrap}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <Pressable onPress={handleClose} accessibilityRole="button" accessibilityLabel="Close">
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>
          <View style={styles.searchWrap}>
            <TextInput
              style={[styles.searchInput, searchFocused && styles.searchInputFocused]}
              placeholder="Search by name, code, or dial code"
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              autoFocus
            />
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.iso2}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b4bed4',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  containerFocused: {
    borderColor: '#F48022',
    ...(Platform.OS === 'web' ? { boxShadow: '0 0 0 3px rgba(244, 129, 34, 0.18)' } : ({} as any)),
  },
  disabled: {
    opacity: 0.6,
  },
  countryBtn: {
    height: '100%',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  flag: {
    fontSize: 20,
  },
  flagImg: {
    width: 22,
    height: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0, boxShadow: 'none' } : ({} as any)),
  },
  modalWrap: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    paddingTop: Platform.select({ ios: 54, android: 24, default: 24 }),
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalClose: {
    color: '#f48122',
    fontWeight: '700',
    fontSize: 16,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b4bed4',
    paddingHorizontal: 12,
    fontSize: 16,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0, boxShadow: 'none' } : ({} as any)),
  },
  searchInputFocused: {
    borderColor: '#F48022',
    ...(Platform.OS === 'web' ? { boxShadow: '0 0 0 3px rgba(244, 129, 34, 0.18)' } : ({} as any)),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  itemRowSelected: {
    backgroundColor: '#f1f5f9',
  },
  itemTextWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#111827',
    flexShrink: 1,
  },
  itemSub: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemDial: {
    fontSize: 16,
    color: '#111827',
  },
  check: {
    marginLeft: 8,
    color: '#00b140',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default PhoneInputWithCountry;
