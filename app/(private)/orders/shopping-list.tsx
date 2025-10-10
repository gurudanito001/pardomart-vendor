import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';
import CompletedTabContent from '../../../components/shopping-list/CompletedTabContent';
import PendingTabContent from '../../../components/shopping-list/PendingTabContent';
import RemainingTabContent from '../../../components/shopping-list/RemainingTabContent';
import { colors, shadows, spacing, typography } from '../../../styles/theme';

export type TabType = 'remaining' | 'pending' | 'completed';

export default function ShoppingListScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>('remaining');

  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleResumeClick = () => {
    console.log('Resume shopping');
  };

  const handleProceedToReview = () => {
    console.log('Proceed to review');
  };


  const renderTabContent = () => {
    switch (selectedTab) {
      case 'remaining':
        return <RemainingTabContent onResumeClick={handleResumeClick} />;
      case 'pending':
        return <PendingTabContent />;
      case 'completed':
        return <CompletedTabContent onProceedToReview={handleProceedToReview} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Svg width="30" height="30" viewBox="0 0 31 30" fill="none">
            <Path 
              d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" 
              fill="white"
            />
          </Svg>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Shopping List</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
            <Svg width="24" height="24" viewBox="0 0 25 24" fill="none">
              <Path 
                d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z" 
                fill="white"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContentContainer}
        >
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'remaining' && styles.activeTab]}
            onPress={() => setSelectedTab('remaining')}
          >
            <Text style={[styles.tabText, selectedTab === 'remaining' && styles.activeTabText]}>
              Remaining
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'pending' && styles.activeTab]}
            onPress={() => setSelectedTab('pending')}
          >
            <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>
              Pending
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'completed' && styles.activeTab]}
            onPress={() => setSelectedTab('completed')}
          >
            <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 19,
    paddingBottom: 16,
    backgroundColor: colors.primary,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    color: colors.background,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerAction: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    paddingHorizontal: 25,
    paddingTop: 19,
    backgroundColor: colors.background,
  },
  tabContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tab: {
    paddingHorizontal: 23,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.md,
  },
  tabText: {
    fontSize: 14,
    fontWeight: typography.weights.medium,
    fontFamily: typography.families.accent,
    color: colors.textPrimary,
    lineHeight: 14,
  },
  activeTabText: {
    color: colors.background,
    fontWeight: typography.weights.bold,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
