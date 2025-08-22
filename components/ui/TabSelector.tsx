import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface TabSelectorProps {
  activeTab: 'email' | 'phone';
  onTabChange: (tab: 'email' | 'phone') => void;
  tabIndicatorPosition: Animated.SharedValue<number>;
}

export default function TabSelector({ activeTab, onTabChange, tabIndicatorPosition }: TabSelectorProps) {
  const { width: screenWidth } = useWindowDimensions();
  const tabSelectorWidth = screenWidth - 66; // 33px padding on each side of the container
  const singleTabWidth = (tabSelectorWidth - 6) / 2; // Account for 3px padding inside the selector

  const handleTabSwitch = (tab: 'email' | 'phone') => {
    onTabChange(tab);
    // Animate tab indicator
    tabIndicatorPosition.value = withTiming(tab === 'email' ? 0 : 1, {
      duration: 300,
    });
  };

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabSelector}>
        <Animated.View style={[
          styles.tabIndicator,
          { width: singleTabWidth },
          useAnimatedStyle(() => ({
            transform: [{
              translateX: tabIndicatorPosition.value * singleTabWidth
            }]
          }))
        ]} />
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabSwitch('email')}
        >
          <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
            Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabSwitch('phone')}
        >
          <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
            Phone Number
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: 33,
    paddingTop: 35,
    marginBottom: 27,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    position: 'relative',
    alignSelf: 'stretch',
  },
  tabIndicator: {
    position: 'absolute',
    top: 3,
    left: 3,
    height: 53,
    backgroundColor: '#06888C',
    borderRadius: 16,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 17,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 53,
    zIndex: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Raleway',
    color: '#7C7B7B',
  },
  activeTabText: {
    color: '#FFF',
  },
});
