import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export interface Tab {
  key: string;
  label: string;
}

export interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  style?: ViewStyle;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabSelector}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 19,
  },
  
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    padding: 3,
  },
  
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  activeTab: {
    backgroundColor: '#06888C',
  },
  
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#7C7B7B',
  },
  
  activeTabText: {
    color: '#FFFFFF',
  },
});
