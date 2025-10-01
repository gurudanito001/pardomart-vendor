import { useAuth } from '@/context/AppProvider';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { toast } from 'sonner-native';
import { WalletApi } from '../../../api/endpoints/wallet-api';
import { Wallet, WalletTransaction } from '../../../api/models';

export default function WalletScreen() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showBalance, setShowBalance] = useState<boolean>(true);

  const walletApi = useMemo(() => new WalletApi(), []);
  const showError = useCallback((m: string) => toast.error(m), []);
  const { state: { isAuthenticated } } = useAuth();

  const WithdrawIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 3v12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Path d="M8 11l4 4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 19h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );

  const CoinsIcon = () => (
    <Svg width="23" height="28" viewBox="0 0 23 28" fill="none">
      <Path 
        d="M11.5 13.3C17.852 13.3 23 10.6859 23 7.4648C23 4.2437 17.852 1.62964 11.5 1.62964C5.14805 1.62964 0 4.2437 0 7.4648C0 10.6859 5.14805 13.3 11.5 13.3ZM11.5 22.6296C7.11113 22.6296 3.22988 21.3445 0.781641 19.3593C0.283008 20.0156 0 20.721 0 21.4648C0 24.6859 5.14805 27.3 11.5 27.3C17.852 27.3 23 24.6859 23 21.4648C23 20.721 22.717 20.0156 22.2184 19.3648C19.7701 21.3445 15.8889 22.6296 11.5 22.6296ZM11.5 15.6296C7.11113 15.6296 3.22988 14.3445 0.781641 12.3593C0.283008 13.0156 0 13.721 0 14.4648C0 17.6859 5.14805 20.3 11.5 20.3C17.852 20.3 23 17.6859 23 14.4648C23 13.721 22.717 13.0156 22.2184 12.3648C19.7701 14.3445 15.8889 15.6296 11.5 15.6296Z" 
        fill="black"
      />
    </Svg>
  );

  const EyeHideIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 11 10" fill="none">
      <Path
        d="M3.0365 5.09698L1.106 3.16648C0.346 3.99498 0.058 4.82499 0.053 4.84198L0 4.99998L0.0525 5.15798C0.0635 5.19148 1.2105 8.49999 5.027 8.49999C5.4915 8.49999 5.9145 8.44899 6.303 8.36349L4.93 6.99049C4.43564 6.96625 3.96798 6.75898 3.61799 6.40899C3.26801 6.05901 3.06073 5.59134 3.0365 5.09698ZM5.027 1.49998C4.0995 1.49998 3.3395 1.70198 2.706 1.99898L0.8535 0.146484L0.1465 0.853484L9.1465 9.85349L9.8535 9.14649L8.2045 7.49749C9.5235 6.52099 9.994 5.17898 10.001 5.15798L10.0535 4.99998L10.001 4.84198C9.99 4.80849 8.8435 1.49998 5.027 1.49998ZM5.98 5.27298C6.0735 4.93448 5.994 4.55348 5.734 4.29298C5.474 4.03249 5.0925 3.95348 4.754 4.04698L4 3.29298C4.30903 3.10309 4.66429 3.00174 5.027 2.99998C6.13 2.99998 7.027 3.89698 7.027 4.99998C7.02552 5.36264 6.92395 5.71786 6.7335 6.02648L5.98 5.27298Z"
        fill="#7E7E7E"
      />
    </Svg>
  );

  const EyeOpenIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 11 10" fill="none">
      <Path d="M5.027 1.5C1.211 1.5 0.064 4.808 0.053 4.842L0 5l.053.158C.064 5.191 1.211 8.5 5.027 8.5c3.816 0 4.963-3.309 4.974-3.342L10.054 5l-.053-.158C9.989 4.808 8.843 1.5 5.027 1.5Z" fill="#7E7E7E"/>
      <Circle cx="5.027" cy="5" r="1.5" fill="#7E7E7E" />
    </Svg>
  );

  const SmallWithdrawIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M10 2v10" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M6 8l4 4 4-4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(amount);
    } catch {
      const sign = amount < 0 ? '-' : '';
      const n = Math.abs(amount);
      return `${sign}$${n.toFixed(2)}`;
    }
  };

  const parseDateTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      }).format(d).replace(',', '');
    } catch {
      return iso;
    }
  };

  const fetchData = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        setWallet(prev => prev || { balance: 0 });
        setTransactions([]);
        return;
      }
      const [wRes, tRes] = await Promise.all([
        walletApi.walletMeGet(),
        walletApi.walletMeTransactionsGet(), // Assuming default pagination
      ]);
      setWallet((wRes.data as any) || null);
      setTransactions(Array.isArray((tRes.data as any)?.items) ? (tRes.data as any).items : []);
    } catch (err: any) {
      showError(err?.error?.message || 'Failed to load wallet data');
      setWallet(prev => prev || { balance: 0 });
      setTransactions([]);
    }
  }, [walletApi, showError, isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData, isAuthenticated]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  const sanitizedBalance = typeof wallet?.balance === 'number' && !isNaN(wallet.balance!) ? wallet.balance! : 0;

  const renderTransactionItem = (tx: WalletTransaction, idx: number) => {
    const amount = typeof tx.amount === 'number' ? tx.amount : 0;
    const isPositive = amount >= 0;
    const displayAmount = `${isPositive ? '+' : '-'}${formatCurrency(Math.abs(amount))}`;
    const title = tx.description || (tx.type === 'CREDIT' ? 'Credit' : 'Debit');
    const dateText = parseDateTime(tx.createdAt);

    return (
      <View key={tx.id || String(idx)} style={styles.transactionItem}>
        <View style={styles.transactionContent}>
          <View style={[styles.withdrawalIconContainer, { backgroundColor: tx.type === 'CREDIT' ? '#BFE3C6' : '#F4CFCF' }]}>
            <SmallWithdrawIcon />
          </View>
          <View style={styles.transactionDetails}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{title}</Text>
              <Text style={styles.transactionDate}>{dateText}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              isPositive ? styles.positiveAmount : styles.negativeAmount,
            ]}>
              {displayAmount}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" hidden={false} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Svg width="11" height="18" viewBox="0 0 11 18" fill="none">
              <Path d="M10.6278 15.993C10.8661 16.2135 11 16.5125 11 16.8243C11 17.1361 10.8661 17.4352 10.6278 17.6556C10.3895 17.8761 10.0662 18 9.72918 18C9.39214 18 9.0689 17.8761 8.83058 17.6556L0.373128 9.83133C0.254859 9.7223 0.161019 9.59274 0.0969895 9.45008C0.0329598 9.30742 0 9.15447 0 9C0 8.84553 0.0329598 8.69258 0.0969895 8.54992C0.161019 8.40726 0.254859 8.2777 0.373128 8.16866L8.83058 0.344349C9.0689 0.123866 9.39214 -4.64634e-09 9.72918 0C10.0662 4.64634e-09 10.3895 0.123866 10.6278 0.34435C10.8661 0.564833 11 0.863872 11 1.17568C11 1.48749 10.8661 1.78653 10.6278 2.00702L3.07 8.99902L10.6278 15.993Z" fill="#100A37"/>
            </Svg>
          </Pressable>
          <Text style={styles.headerTitle}>Wallet</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Wallet Balance</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceAmountContainer}>
              <CoinsIcon />
              {showBalance ? (
                <Text style={styles.balanceAmount}>{formatCurrency(sanitizedBalance)}</Text>
              ) : (
                <Text style={styles.balanceAmount}>••••••</Text>
              )}
            </View>
            <Pressable
              onPress={() => setShowBalance(v => !v)}
              accessibilityRole="button"
              accessibilityLabel={showBalance ? 'Hide balance' : 'Show balance'}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {showBalance ? <EyeHideIcon  /> : <EyeOpenIcon />}
            </Pressable>
          </View>
          <Pressable style={styles.withdrawButton}>
            <WithdrawIcon />
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </Pressable>
        </View>

        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            <Pressable>
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 16 }} color="#F48022" />
          ) : transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySubtitle}>Pull down to refresh or check back later.</Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.map((t, idx) => renderTransactionItem(t, idx))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingVertical: 12,
    height: 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
    lineHeight: 22,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B4BED4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
  },
  balanceCard: {
    backgroundColor: 'rgba(244, 128, 34, 0.20)',
    borderRadius: 16,
    paddingHorizontal: 41,
    paddingVertical: 36,
    marginTop: 23,
    marginBottom: 37,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Raleway-Regular',
    color: '#707070',
    marginBottom: 15,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#000',
    lineHeight: 25,
  },
  withdrawButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F48022',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#FFF',
    lineHeight: 25,
  },
  transactionsSection: {
    gap: 19,
    paddingBottom: 100,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
    lineHeight: 25,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#06888C',
    lineHeight: 25,
  },
  transactionsList: {
    gap: 8,
  },
  transactionItem: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 15,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  withdrawalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#BFE3C6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  transactionDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionName: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    color: '#000',
    lineHeight: 14,
  },
  transactionDate: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#707070',
    lineHeight: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
    lineHeight: 16,
    textAlign: 'right',
  },
  positiveAmount: {
    color: '#2CAF0B',
  },
  negativeAmount: {
    color: '#C70000',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  emptySubtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#707070',
  },
});
