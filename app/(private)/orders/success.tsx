import { ArrowBackSVG, NotificationSVG, SupportSVG } from '@/components/icons';
import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ConfettiSVG from '../../../assets/images/confetti_15552843 1.svg';


// Import existing components
import { Button } from '@/components/ui';
import { colors, spacing, typography } from '@/styles/theme';

export default function SuccessScreen() {
  const handleBackPress = () => {
    router.back();
  };

  const handleGoToOrdersPress = () => {
    // Navigate to orders tab or orders screen
    router.push('/(private)/orders');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowBackSVG width={30} height={30} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <NotificationSVG width={24} height={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <SupportSVG width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Celebration Icon */}
        <View style={styles.iconContainer}>
          <ConfettiSVG />
        </View>

        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.congratsText}>Congratulations</Text>
          <Text style={styles.doneText}>You are done Shopping</Text>
        </View>
      </View>

      {/* Go to My Orders Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Go to My Orders"
          onPress={handleGoToOrdersPress}
          variant="primary"
          size="large"
          fullWidth
          style={styles.ordersButton}
        />
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
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 19,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
    color: colors.background,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 39,
  },
  messageContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  congratsText: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
  },
  doneText: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  ordersButton: {
    paddingVertical: 18,
  },
});
