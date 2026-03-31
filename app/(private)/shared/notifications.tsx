import { useNotificationCount } from '@/hooks/useNotificationCount';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiConfig } from '../../../api/config';
import { NotificationApi } from '../../../api/endpoints/notification-api';

const groupNotificationsByDate = (notifications: any[]) => {
  const groups: Record<string, any[]> = {};
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  notifications.forEach(item => {
    const date = new Date(item.createdAt || Date.now());
    let dateString = '';
    
    if (date.toDateString() === today.toDateString()) {
      dateString = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateString = 'Yesterday';
    } else {
      dateString = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }

    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(item);
  });

  // Preserve the order of dates
  return Object.keys(groups).map(key => ({
    title: key,
    data: groups[key]
  }));
};

const Notifications = () => {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [activeTab, setActiveTab] = useState<'notifications' | 'support'>('notifications');
  const { count: unreadCount } = useNotificationCount();

  // Inline notifications center logic
  const notificationApi = React.useMemo(() => new NotificationApi(apiConfig), []);
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPage = React.useCallback(async (p: number, replace = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await notificationApi.notificationsGet(p, 20);
      const data = (res as any)?.data?.data ?? [];
      const tp = (res as any)?.data?.totalPages ?? 1;
      setTotalPages(tp);
      setItems(prev => (replace ? data : [...prev, ...data]));
    } catch {}
    finally { setLoading(false); }
  }, [loading, notificationApi]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPage(1, true);
      setPage(1);
    } finally {
      setRefreshing(false);
    }
  }, [loadPage]);

  const loadMore = React.useCallback(() => {
    if (page < totalPages && !loading) {
      const next = page + 1;
      setPage(next);
      loadPage(next);
    }
  }, [page, totalPages, loading, loadPage]);

  const markRead = React.useCallback(async (id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    try { await notificationApi.notificationsNotificationIdReadPatch(id); } catch {}
  }, [notificationApi]);

  const markAllRead = React.useCallback(async () => {
    const prev = items;
    setItems(prev.map(n => ({ ...n, isRead: true })));
    try { await notificationApi.notificationsReadAllPatch(); } catch { setItems(prev); }
  }, [items, notificationApi]);

  const handleNotificationPress = (item: any) => {
    // Mark as read if it's not already
    if (item.id && !item.isRead) {
      markRead(item.id);
    }

    // Navigate if there's an orderId in the metadata
    if (item?.meta?.orderId) {
      router.push({ pathname: '/orders/order-details', params: { orderId: item.meta.orderId } });
    }
  };

  const handleSwipeRead = async (id: string) => {
    // 1. Optimistically remove from list immediately
    setItems(prev => prev.filter(n => n.id !== id));
    
    try {
      // 2. Mark as read in backend
      await notificationApi.notificationsNotificationIdReadPatch(id);
      
      // 3. Refetch as requested (silently to avoid full loading spinner if possible, 
      // but we use loadPage which sets loading state. We might want to keep it subtle)
      // We'll just call loadPage(1, true) to refresh the list from top.
      loadPage(1, true);
    } catch (error) {
      console.error('Failed to mark notification as read', error);
      // Optionally revert state here if needed, or just show error
    }
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, item: any) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Pressable 
        style={styles.rightAction} 
        onPress={() => handleSwipeRead(item.id)}
      >
        <Animated.View style={[styles.actionContent, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark-done-circle-outline" size={28} color="#FFF" />
          <Text style={styles.actionText}>Mark Read</Text>
        </Animated.View>
      </Pressable>
    );
  };

  React.useEffect(() => {
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const supportNotifications = useMemo(() => 
    items.filter(item => ['SUPPORT', 'SYSTEM'].includes(item.category)), 
    [items]
  );

  const generalNotifications = useMemo(() => 
    items.filter(item => !['SUPPORT', 'SYSTEM'].includes(item.category)), 
    [items]
  );

  const groupedGeneralNotifications = useMemo(() => 
    groupNotificationsByDate(generalNotifications), 
    [generalNotifications]
  );

  const groupedSupportNotifications = useMemo(() => 
    groupNotificationsByDate(supportNotifications), 
    [supportNotifications]
  );

  const handleGoBack = () => {
    if (from && typeof from === 'string') {
      router.replace(from as any);
    } else {
      router.back();
    }
  };

  const handleNotifications = () => {
    console.log('Notifications');
  };

  /* const handleCart = () => {
    router.push('/home/continueShopping');
  }; */

  // handled inside NotificationCenter

  const handleSupportTab = () => {
    setActiveTab('support');
  };

  const unreadSupportCount = useMemo(() => 
    supportNotifications.filter(n => !n.isRead).length, 
  [supportNotifications]);

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color="#100A37" />
          </Pressable>
          <Text style={styles.headerTitle}>Notification & Support</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton} onPress={handleNotifications}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
          </Pressable>
          {/* <Pressable style={styles.cartButton} onPress={handleCart}>
            <ShoppingBasket width={20} height={20} stroke="#000" strokeWidth="0" />
          </Pressable> */}
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <View style={styles.tabSwitcher}>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'notifications' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('notifications')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'notifications' && styles.activeTabText,
              ]}
            >
              Notifications
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'support' && styles.activeTab,
            ]}
            onPress={handleSupportTab}
          >
            <View style={styles.supportTabContent}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'support' && styles.activeTabText,
                ]}
              >
                Support
              </Text>
              {unreadSupportCount > 0 && (
                <View style={styles.supportBadge}>
                  <Text style={styles.supportBadgeText}>{unreadSupportCount}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {activeTab === 'notifications' && (
        <View style={{ flex: 1 }}>
          {/* <View style={styles.notifHeaderRow}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Pressable style={styles.markAllBtn} onPress={markAllRead}>
              <Text style={styles.markAllBtnText}>Mark all read</Text>
            </Pressable>
          </View> */}

          {generalNotifications.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>We’ll keep you posted when there’s activity on your account.</Text>
              <Pressable style={styles.refreshBtn} onPress={onRefresh}><Text style={styles.refreshBtnText}>Refresh</Text></Pressable>
            </View>
          ) : (
            <SectionList
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              sections={groupedGeneralNotifications}
              keyExtractor={(i, idx) => i.id || String(idx)}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.dateHeader}>{title}</Text>
              )}
              renderItem={({ item }) => (
                <View style={styles.notificationWrapper}>
                  <Swipeable
                    renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
                    onSwipeableOpen={() => handleSwipeRead(item.id)}
                  >
                  <Pressable
                    style={[
                      styles.notificationCard,
                      { backgroundColor: item.isRead ? '#F0F0F0' : '#F4E1D2' },
                    ]}
                    onPress={() => handleNotificationPress(item)}
                  >
                    <View style={styles.notificationContent}>
                      <View style={styles.checkIconContainer}>
                        <Ionicons
                          name="checkmark-circle"
                          size={32}
                          color={item.isRead ? '#7C7B7B' : '#2CAF0B'}
                        />
                      </View>
                      <View style={styles.notificationText}>
                        <Text
                          style={[
                            styles.notificationTitle,
                            { color: item.isRead ? '#7C7B7B' : '#000' },
                          ]}
                        >
                          {item.title}
                        </Text>
                        {!!item.body && (
                          <Text
                            style={[
                              styles.notificationDescription,
                              { color: item.isRead ? '#7C7B7B' : '#000' },
                            ]}
                          >
                            {item.body}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.chevronContainer}>
                      <Ionicons name="chevron-forward" size={12} color="#333" />
                    </View>
                  </Pressable>
                  </Swipeable>
                </View>
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              refreshing={refreshing}
              onRefresh={onRefresh}
              ListFooterComponent={loading && !refreshing ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
              stickySectionHeadersEnabled={false}
            />
          )}
        </View>
      )}

      {activeTab === 'support' && (
        <View style={{ flex: 1 }}>
          {supportNotifications.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No support messages</Text>
              <Text style={styles.emptySubtitle}>You have no support or system notifications.</Text>
              <Pressable style={styles.refreshBtn} onPress={onRefresh}><Text style={styles.refreshBtnText}>Refresh</Text></Pressable>
            </View>
          ) : (
            <SectionList
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              sections={groupedSupportNotifications}
              keyExtractor={(i, idx) => i.id || String(idx)}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.dateHeader}>{title}</Text>
              )}
              renderItem={({ item }) => (
                <View style={styles.notificationWrapper}>
                  <Swipeable
                    renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
                    onSwipeableOpen={() => handleSwipeRead(item.id)}
                  >
                  <Pressable
                    style={[
                      styles.notificationCard,
                      { backgroundColor: item.isRead ? '#F0F0F0' : '#F4E1D2' },
                    ]}
                    onPress={() => handleNotificationPress(item)}
                  >
                    <View style={styles.notificationContent}>
                      <View style={styles.checkIconContainer}>
                        <Ionicons
                          name="mail"
                          size={32}
                          color={item.isRead ? '#7C7B7B' : '#000'}
                        />
                      </View>
                      <View style={styles.notificationText}>
                        <Text
                          style={[
                            styles.notificationTitle,
                            { color: item.isRead ? '#7C7B7B' : '#000' },
                          ]}
                        >
                          {item.title}
                        </Text>
                        {!!item.body && (
                          <Text
                            style={[
                              styles.notificationDescription,
                              { color: item.isRead ? '#7C7B7B' : '#000' },
                            ]}
                          >
                            {item.body}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.chevronContainer}>
                      <Ionicons name="chevron-forward" size={12} color="#333" />
                    </View>
                  </Pressable>
                  </Swipeable>
                </View>
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              refreshing={refreshing}
              onRefresh={onRefresh}
              ListFooterComponent={loading && !refreshing ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
              stickySectionHeadersEnabled={false}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

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
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#FFF',
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#06888C',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'OpenSans-SemiBold',
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: 'transparent',
  },
  tabContainer: {
    paddingHorizontal: 21,
    paddingTop: 16,
    paddingBottom: 20
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
    lineHeight: 25,
  },
  activeTabText: {
    color: '#000',
  },
  supportTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  supportBadge: {
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: '#2C4CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportBadgeText: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: '#FFF',
    lineHeight: 25,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 21,
  },
  section: {
    gap: 14,
    paddingHorizontal: 21,
    marginBottom: 27,
  },
  sectionTitle: {
    fontFamily: "Raleway-Bold",
    fontSize: 18
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    marginBottom: 10,
  },
  dateHeader: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
    color: '#7C7B7B',
    lineHeight: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  notificationsGroup: {
    gap: 8,
  },
  notificationWrapper: {
    marginBottom: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    shadowColor: '#000',
    backgroundColor: '#FFF', // Ensure background is set for swipeable to look right
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
    gap: 16,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    flex: 1,
    gap: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    lineHeight: 16,
  },
  notificationDescription: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    lineHeight: 16,
  },
  chevronContainer: {
    width: 20,
    height: 20,
    paddingRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markAllBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#06888C',
    borderRadius: 8,
  },
  markAllBtnText: { color: '#fff', fontFamily: 'OpenSans-SemiBold' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 16 },
  refreshBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#06888C', borderRadius: 8 },
  refreshBtnText: { color: '#fff', fontWeight: '600' },
  supportGroup: {
    gap: 8,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingRight: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
    gap: 6,
  },
  supportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  mailIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  supportTextContainer: {
    flex: 1,
    gap: 2,
  },
  supportTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    lineHeight: 16,
  },
  supportAgentMessage: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    lineHeight: 16,
  },
  supportTimestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  supportTimestamp: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    lineHeight: 16,
  },
  timestampDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#898A8D',
    opacity: 0.6,
  },
  supportActionText: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    lineHeight: 16,
  },
  supportChevronContainer: {
    width: 6,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedSupportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingRight: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
    gap: 6,
  },
  closedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  closedTitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#979797',
    lineHeight: 16,
  },
  closedDate: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#979797',
    lineHeight: 16,
  },
  closedEndDate: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#979797',
    lineHeight: 16,
  },
  rightAction: {
    backgroundColor: '#06888C',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    borderRadius: 16,
    marginBottom: 0, 
    marginTop: 0,
  },
  actionContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  actionText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'OpenSans-SemiBold',
    marginTop: 4,
  },
});

export default Notifications;
