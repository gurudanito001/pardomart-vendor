import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Option {
  [key: string]: any;
}

interface MultiSelectProps {
  options: Option[];
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  placeholder?: string;
  labelKey?: string;
  valueKey?: string;
  isLoading?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options = [],
  selectedItems,
  onSelectionChange,
  placeholder = 'Select items',
  labelKey = 'name',
  valueKey = 'id',
  isLoading = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState<string[]>(selectedItems);

  useEffect(() => {
    setTempSelected(selectedItems);
  }, [selectedItems]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(option =>
      option[labelKey]?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, labelKey]);

  const handleSelect = (itemValue: string) => {
    setTempSelected(prev =>
      prev.includes(itemValue)
        ? prev.filter(val => val !== itemValue)
        : [...prev, itemValue]
    );
  };

  const handleDone = () => {
    onSelectionChange(tempSelected);
    setModalVisible(false);
  };

  const handleOpen = () => {
    setTempSelected(selectedItems);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Option }) => {
    const isSelected = tempSelected.includes(item[valueKey]);
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleSelect(item[valueKey])}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.optionText}>{item[labelKey]}</Text>
      </TouchableOpacity>
    );
  };

  const selectedLabels = useMemo(() => {
    return options
      .filter(opt => selectedItems.includes(opt[valueKey]))
      .map(opt => opt[labelKey]);
  }, [selectedItems, options, labelKey, valueKey]);

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={handleOpen}>
        {selectedItems.length === 0 ? (
          <Text style={styles.placeholder}>{isLoading ? 'Loading...' : placeholder}</Text>
        ) : (
          <View style={styles.tagsContainer}>
            {selectedLabels.map(label => (
              <View key={label} style={styles.tag}>
                <Text style={styles.tagText}>{label}</Text>
              </View>
            ))}
          </View>
        )}
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <Path d="M4.5 6L8 9.5L11.5 6" stroke="black" />
        </Svg>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={handleDone}>
              <Text style={styles.doneButton}>Done</Text>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 20 }} size="large" />
          ) : (
            <FlatList
              data={filteredOptions}
              renderItem={renderItem}
              keyExtractor={item => item[valueKey]}
              extraData={tempSelected}
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    minHeight: 58,
  },
  placeholder: { color: '#7C8BA0', fontSize: 12, fontFamily: 'Open Sans' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  tag: { backgroundColor: '#E0E0E0', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8 },
  tagText: { color: '#000', fontSize: 12 },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  doneButton: { color: '#007BFF', fontSize: 16, fontWeight: 'bold' },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#06888C',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: { backgroundColor: '#06888C' },
  checkmark: { color: 'white', fontWeight: 'bold' },
  optionText: { fontSize: 16 },
});