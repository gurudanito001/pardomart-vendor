import React, { Component, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Colors } from '../constants/Colors';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: React.ErrorInfo | null, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console and external services
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Here you could also log to external services like Sentry, Bugsnag, etc.
    // Example:
    // import * as Sentry from '@sentry/react-native';
    // Sentry.captureException(error, { extra: errorInfo });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.resetError);
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Oops! Something went wrong</Text>
        
        <Text style={styles.description}>
          We&apos;re sorry, but something unexpected happened. The app encountered an error and couldn&apos;t continue.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={resetError}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => setShowDetails(!showDetails)}
          activeOpacity={0.8}
        >
          <Text style={styles.detailsButtonText}>
            {showDetails ? 'Hide Details' : 'Show Error Details'}
          </Text>
        </TouchableOpacity>

        {showDetails && (
          <ScrollView style={styles.errorDetails} showsVerticalScrollIndicator={false}>
            <Text style={styles.errorTitle}>Error Details:</Text>
            
            {error && (
              <View style={styles.errorSection}>
                <Text style={styles.errorSectionTitle}>Error Message:</Text>
                <Text style={styles.errorText}>{error.message}</Text>
              </View>
            )}

            {error?.stack && (
              <View style={styles.errorSection}>
                <Text style={styles.errorSectionTitle}>Stack Trace:</Text>
                <Text style={styles.errorText}>{error.stack}</Text>
              </View>
            )}

            {errorInfo?.componentStack && (
              <View style={styles.errorSection}>
                <Text style={styles.errorSectionTitle}>Component Stack:</Text>
                <Text style={styles.errorText}>{errorInfo.componentStack}</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    ...(Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
      default: {},
    }) as any),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsButtonText: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: '500',
  },
  errorDetails: {
    maxHeight: 300,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  errorSection: {
    marginBottom: 16,
  },
  errorSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'monospace',
    lineHeight: 16,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
});

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...(props as P)} ref={ref} />
    </ErrorBoundary>
  )) as React.ForwardRefExoticComponent<P & React.RefAttributes<any>>;

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for handling errors in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error handled by useErrorHandler:', error);
    setError(error);
  }, []);

  // If error exists, throw it to be caught by ErrorBoundary
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};
