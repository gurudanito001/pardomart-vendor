import { notificationApi } from '@/api/client';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  title: string;
  body?: string;
  isRead: boolean;
  meta?: {
    orderId?: string;
    [key: string]: any;
  };
  createdAt: string;
}

interface SupportItemProps {
  title: string;
  agentMessage: string;
  timestamp: string;
  actionText?: string;
  isActive: boolean;
  onPress: () => void;
}

interface ClosedSupportItemProps {
  title: string;
  date: string;
  endDate: string;
  onPress: () => void;
}

const SupportItem: React.FC<SupportItemProps> = ({
  title,
  agentMessage,
  timestamp,
  actionText,
  isActive,
  onPress,
}) => (
  <Pressable
    style={[
      styles.supportCard,
      { backgroundColor: isActive ? '#F4E1D2' : '#F0F0F0' },
    ]}
    onPress={onPress}
  >
    <View style={styles.supportContent}>
      <View style={styles.mailIconContainer}>
        <Ionicons
          name="mail"
          size={24}
          color={isActive ? '#000' : '#898A8D'}
        />
      </View>
      <View style={styles.supportTextContainer}>
        <Text
          style={[
            styles.supportTitle,
            { color: isActive ? '#000' : '#979797' },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.supportAgentMessage,
            { color: isActive ? '#000' : '#979797' },
          ]}
        >
          {agentMessage}
        </Text>
        <View style={styles.supportTimestampRow}>
          <Text
            style={[
              styles.supportTimestamp,
              { color: isActive ? '#000' : '#979797' },
            ]}
          >
            {timestamp}
          </Text>
          <View style={styles.timestampDot} />
          {actionText && (
            <Text
              style={[
                styles.supportActionText,
                { color: isActive ? '#01891C' : '#979797' },
              ]}
            >
              {actionText}
            </Text>
          )}
        </View>
      </View>
    </View>
    <View style={styles.supportChevronContainer}>
      <Ionicons name="chevron-forward" size={12} color="#333" />
    </View>
  </Pressable>
);

const ClosedSupportItem: React.FC<ClosedSupportItemProps> = ({
  title,
  date,
  endDate,
  onPress,
}) => (
  <Pressable style={styles.closedSupportCard} onPress={onPress}>
    <View style={styles.supportContent}>
      <View style={styles.mailIconContainer}>
        <Ionicons name="mail" size={24} color="#898A8D" />
      </View>
      <View style={styles.supportTextContainer}>
        <View style={styles.closedTitleRow}>
          <Text style={styles.closedTitle}>{title}</Text>
          <View style={styles.timestampDot} />
          <Text style={styles.closedDate}>{date}</Text>
        </View>
        <Text style={styles.closedEndDate}>{endDate}</Text>
      </View>
    </View>
    <View style={styles.supportChevronContainer}>
      <Ionicons name="chevron-forward" size={12} color="#333" />
    </View>
  </Pressable>
);

const NotificationList = ({ items, onNotificationPress, onRefresh, refreshing, loadMore, loading }: { items: Notification[], onNotificationPress: (item: Notification) => void, onRefresh: () => void, refreshing: boolean, loadMore: () => void, loading: boolean }) => {
  const router = useRouter();
  if (items.length === 0 && !loading) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No notifications yet</Text>
        <Text style={styles.emptySubtitle}>We’ll keep you posted when there’s activity on your account.</Text>
        <Pressable style={styles.refreshBtn} onPress={onRefresh}><Text style={styles.refreshBtnText}>Refresh</Text></Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      data={items}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <Pressable
          style={[
            styles.notificationCard,
            { backgroundColor: item.isRead ? '#F0F0F0' : '#F4E1D2' },
          ]}
          onPress={() => onNotificationPress(item)}
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
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListFooterComponent={loading ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
    />
  );
};

const SupportList = () => {
  // TODO: Replace with real data fetching
  const activeSupportItems = [
    {
      id: 'support-1',
      title: 'Update profile picture',
      agentMessage: 'Agent: Hi, Abiodun .....',
      timestamp: '1min ago',
      actionText: 'please rate us',
      isActive: true,
    },
    {
      id: 'support-2',
      title: 'Update profile picture',
      agentMessage: 'Agent: Hi, Abiodun .....',
      timestamp: '1min ago',
      actionText: 'please rate us',
      isActive: false,
    },
  ];

  const closedSupportItems = [
    {
      id: 'closed-1',
      title: 'RIU Hotel & Resorts',
      date: 'Jul 11',
      endDate: 'Conversation ended on 2/11/25',
    },
    {
      id: 'closed-2',
      title: 'RIU Hotel & Resorts',
      date: 'Jul 11',
      endDate: 'Conversation ended on 2/11/25',
    },
    {
      id: 'closed-3',
      title: 'RIU Hotel & Resorts',
      date: 'Jul 11',
      endDate: 'Conversation ended on 2/11/25',
    },
    {
      id: 'closed-4',
      title: 'RIU Hotel & Resorts',
      date: 'Jul 11',
      endDate: 'Conversation ended on 2/11/25',
    },
  ];

  const handleSupportItemPress = (id: string) => {
    console.log('Support item pressed:', id);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Active Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active</Text>
        <View style={styles.supportGroup}>
          {activeSupportItems.map((item) => (
            <SupportItem
              key={item.id}
              title={item.title}
              agentMessage={item.agentMessage}
              timestamp={item.timestamp}
              actionText={item.actionText}
              isActive={item.isActive}
              onPress={() => handleSupportItemPress(item.id)}
            />
          ))}
        </View>
      </View>

      {/* Closed Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Closed</Text>
        <View style={styles.supportGroup}>
          {closedSupportItems.map((item) => (
            <ClosedSupportItem
              key={item.id}
              title={item.title}
              date={item.date}
              endDate={item.endDate}
              onPress={() => handleSupportItemPress(item.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const Header = ({ onGoBack, unreadCount }: { onGoBack: () => void, unreadCount: number }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Pressable style={styles.backButton} onPress={onGoBack}>
        <Ionicons name="chevron-back" size={24} color="#100A37" />
      </Pressable>
      <Text style={styles.headerTitle}>Notification & Support</Text>
    </View>
    <View style={styles.headerRight}>
      <Pressable style={styles.iconButton} onPress={() => console.log('Notifications')}>
        <Ionicons name="notifications-outline" size={24} color="#000" />
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  </View>
);

const TabSwitcher = ({ activeTab, setActiveTab }: { activeTab: 'notifications' | 'support', setActiveTab: (tab: 'notifications' | 'support') => void }) => (
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
        onPress={() => setActiveTab('support')}
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
          <View style={styles.supportBadge}>
            <Text style={styles.supportBadgeText}>1</Text>
          </View>
        </View>
      </Pressable>
    </View>
  </View>
);

const Notifications = () => {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [activeTab, setActiveTab] = useState<'notifications' | 'support'>('notifications');

  const [items, setItems] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const api = notificationApi();

  const loadPage = useCallback(async (p: number, replace = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.notificationsGet(p, 20);
      const data = (res.data as any)?.data ?? [];
      const meta = (res.data as any)?.pagination;
      setTotalPages(meta?.totalPages ?? 1);
      setItems(prev => (replace ? data : [...prev, ...data]));
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
    finally { setLoading(false); }
  }, [loading, api]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPage(1, true).finally(() => setRefreshing(false));
    setPage(1);
  }, [loadPage]);

  const loadMore = React.useCallback(() => {
    if (page < totalPages && !loading) {
      const next = page + 1;
      setPage(next);
      loadPage(next);
    }
  }, [page, totalPages, loading, loadPage]);

  const markRead = useCallback(async (id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    try { await api.notificationsNotificationIdReadPatch(id); } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
    }
  }, [api]);

  const handleNotificationPress = (item: Notification) => {
    if (item.id && !item.isRead) {
      markRead(item.id);
    }
    if (item?.meta?.orderId) {
      router.push({ pathname: '/(private)/orders/order-details' as any, params: { orderId: item.meta.orderId } });
    }
  };

  useEffect(() => {
    setUnreadCount(items.filter(item => !item.isRead).length);
  }, [items]);

  useEffect(() => {
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoBack = () => {
    if (from && typeof from === 'string' && router.canGoBack()) {
      router.back();
    } else if (from) {
      router.replace(from as any);
    } else {
      router.replace('/(private)/home');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      <Header onGoBack={handleGoBack} unreadCount={unreadCount} />

      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      {activeTab === 'notifications' && (
        <NotificationList
          items={items}
          onNotificationPress={handleNotificationPress}
          onRefresh={onRefresh}
          refreshing={refreshing}
          loadMore={loadMore}
          loading={loading}
        />
      )}

      {activeTab === 'support' && (
        <SupportList />
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
    backgroundColor: '#F48022',
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
    fontSize: 12,
    fontFamily: 'OpenSans-SemiBold',
    color: '#7C7B7B',
    lineHeight: 16,
  },
  notificationsGroup: {
    gap: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
    backgroundColor: '#F48022',
    borderRadius: 8,
  },
  markAllBtnText: { color: '#fff', fontFamily: 'OpenSans-SemiBold' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 16 },
  refreshBtn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#F48022', borderRadius: 8 },
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
});

export default Notifications;
