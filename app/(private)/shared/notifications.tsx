import { NotificationApi } from "@/api";
import { apiConfig } from "@/api/config";
import { Ionicons } from "@expo/vector-icons";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const formatTimestamp = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "";
  }
};

const NotificationsList = ({
  items,
  onNotificationPress,
  onRefresh,
  refreshing,
  loadMore,
  loading,
}: {
  items?: Notification[];
  onNotificationPress: (item: Notification) => void;
  onRefresh: () => void;
  refreshing: boolean;
  loadMore: () => void;
  loading: boolean;
}) => {
  return (
    <FlatList
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      data={items}
      keyExtractor={(i) => i.id}
      ListEmptyComponent={() =>
        !loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySubtitle}>
              Pull down to refresh or check back later.
            </Text>
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <Pressable
          style={[
            styles.notificationCard,
            { backgroundColor: item.isRead ? "#F0F0F0" : "#F4E1D2" },
          ]}
          onPress={() => onNotificationPress(item)}
        >
          <View
            style={[
              styles.leftAccent,
              { backgroundColor: item.isRead ? "transparent" : "#06888C" },
            ]}
          />
          <View style={styles.notificationContent}>
            <View style={styles.checkIconContainer}>
              <Ionicons
                name="checkmark-circle"
                size={32}
                color={item.isRead ? "#7C7B7B" : "#2CAF0B"}
              />
            </View>
            <View style={styles.notificationText}>
              <Text
                style={[
                  styles.notificationTitle,
                  { color: item.isRead ? "#7C7B7B" : "#000" },
                ]}
              >
                {item.title}
              </Text>
              {!!item.body && (
                <Text
                  style={[
                    styles.notificationDescription,
                    { color: item.isRead ? "#7C7B7B" : "#000" },
                  ]}
                >
                  {item.body}
                </Text>
              )}
              <Text style={styles.timestampText}>
                {formatTimestamp(item.createdAt)}
              </Text>
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
      ListFooterComponent={
        loading ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
      }
    />
  );
};

// Support UI removed from Notifications per product requirement

const Header = ({
  onGoBack,
  unreadCount,
  onMarkAll,
}: {
  onGoBack: () => void;
  unreadCount: number;
  onMarkAll: () => void;
}) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Pressable style={styles.backButton} onPress={onGoBack}>
        <Ionicons name="chevron-back" size={24} color="#FFF" />
      </Pressable>
      <Text style={styles.headerTitle}>Notifications</Text>
    </View>
  </View>
);

// const TabSwitcher = () => null;

const Notifications = () => {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  // Support tab removed; notifications only

  const [unreadCount, setUnreadCount] = useState(0);

  const api = useMemo(() => new NotificationApi(apiConfig), []);
  const queryClient = useQueryClient();

  type PageData = {
    data: Notification[];
    meta?: { totalPages?: number; page?: number };
  };

  const notificationsQuery = useInfiniteQuery<
    PageData,
    Error,
    PageData,
    string[],
    number
  >({
    queryKey: ["notifications", "list"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.notificationsGet(pageParam as number, 20);
      const data = (res.data as any)?.data ?? [];
      const meta = (res.data as any)?.pagination;
      return { data, meta };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.meta?.totalPages ?? 1;
      const next = (lastPage?.meta?.page ?? allPages.length) + 1;
      return next <= totalPages ? next : undefined;
    },
    staleTime: 30000,
  });

  const pages = ((notificationsQuery.data as any)?.pages ?? []) as PageData[];
  const items: Notification[] = pages.flatMap((p) => p.data);
  const loading =
    notificationsQuery.isLoading || notificationsQuery.isFetchingNextPage;
  const refreshing = notificationsQuery.isRefetching;

  const onRefresh = useCallback(() => {
    notificationsQuery.refetch();
  }, [notificationsQuery]);

  const loadMore = React.useCallback(() => {
    if (
      notificationsQuery.hasNextPage &&
      !notificationsQuery.isFetchingNextPage
    ) {
      notificationsQuery.fetchNextPage();
    }
  }, [notificationsQuery]);

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.notificationsNotificationIdReadPatch(id);
      return id;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications", "list"] });
      const prev = queryClient.getQueryData<any>(["notifications", "list"]);
      queryClient.setQueryData(["notifications", "list"], (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((p: any) => ({
            ...p,
            data: p.data.map((n: Notification) =>
              n.id === id ? { ...n, isRead: true } : n
            ),
          })),
        };
      });
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(["notifications", "list"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: async () => {
      await api.notificationsReadAllPatch();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", "list"] });
      const prev = queryClient.getQueryData<any>(["notifications", "list"]);
      queryClient.setQueryData(["notifications", "list"], (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((p: any) => ({
            ...p,
            data: p.data.map((n: Notification) => ({ ...n, isRead: true })),
          })),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(["notifications", "list"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    },
  });

  const markRead = useCallback(
    (id: string) => {
      markReadMutation.mutate(id);
    },
    [markReadMutation]
  );

  const markAllAsRead = useCallback(() => {
    if (unreadCount === 0) return;
    markAllMutation.mutate();
  }, [unreadCount, markAllMutation]);

  // seedMockData removed (dev-only utility)

  const handleNotificationPress = (item: Notification) => {
    if (item.id && !item.isRead) {
      markRead(item.id);
    }
    if (item?.meta?.orderId) {
      router.push({
        pathname: "/(private)/orders/order-details" as any,
        params: { orderId: item.meta.orderId },
      });
    }
  };

  useEffect(() => {
    setUnreadCount(items.filter((item) => !item.isRead).length);
  }, [items]);

  const handleGoBack = () => {
    if (from && typeof from === "string" && router.canGoBack()) {
      router.back();
    } else if (from) {
      router.replace(from as any);
    } else {
      router.replace("/(private)/home");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header
        onGoBack={handleGoBack}
        unreadCount={unreadCount}
        onMarkAll={markAllAsRead}
      />

      {/* Support tab removed */}

      {/* Content */}
      {items.length > 0 && (
        <View style={styles.markAllRow}>
          <Pressable style={styles.markAllBtn} onPress={markAllAsRead}>
            <Text style={styles.markAllBtnText}>Mark all as read</Text>
          </Pressable>
        </View>
      )}
      <NotificationsList
        items={items}
        onNotificationPress={handleNotificationPress}
        onRefresh={onRefresh}
        refreshing={refreshing}
        loadMore={loadMore}
        loading={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 21,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: "#06888C",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Raleway-Bold",
    color: "#FFF",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B4BED4",
    backgroundColor: "transparent",
    position: "relative",
  },
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#06888C",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: "OpenSans-SemiBold",
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B4BED4",
    backgroundColor: "transparent",
  },
  tabContainer: {
    paddingHorizontal: 21,
    paddingTop: 16,
    paddingBottom: 20,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
    padding: 3,
    shadowColor: "#000",
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
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#FFF",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Raleway-Bold",
    color: "#000",
    lineHeight: 25,
  },
  activeTabText: {
    color: "#000",
  },
  supportTabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  supportBadge: {
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: "#2C4CFF",
    justifyContent: "center",
    alignItems: "center",
  },
  supportBadgeText: {
    fontSize: 16,
    fontFamily: "Raleway-Bold",
    color: "#FFF",
    lineHeight: 25,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
    paddingHorizontal: 21,
  },
  section: {
    gap: 14,
    paddingHorizontal: 21,
    marginBottom: 27,
  },
  sectionTitle: {
    fontFamily: "Raleway-Bold",
    fontSize: 18,
  },
  notifHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 21,
    marginBottom: 10,
  },
  dateHeader: {
    fontSize: 12,
    fontFamily: "OpenSans-SemiBold",
    color: "#7C7B7B",
    lineHeight: 16,
  },
  notificationsGroup: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#B4BED4",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    gap: 16,
  },
  leftAccent: {
    width: 4,
    alignSelf: "stretch",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    flex: 1,
    gap: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
    lineHeight: 16,
  },
  notificationDescription: {
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    lineHeight: 16,
  },
  timestampText: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: "OpenSans-Regular",
    color: "#7C7B7B",
  },
  chevronContainer: {
    width: 20,
    height: 20,
    paddingRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  markAllRow: {
    paddingHorizontal: 21,
    paddingBottom: 10,
  },
  markAllBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#06888C",
    borderRadius: 8,
  },
  markAllBtnText: { color: "#fff", fontFamily: "OpenSans-SemiBold" },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Raleway-Bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    fontFamily: "OpenSans-Regular",
  },
  supportGroup: {
    gap: 8,
  },
  supportCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingRight: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#B4BED4",
    shadowColor: "#000",
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  mailIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  supportTextContainer: {
    flex: 1,
    gap: 2,
  },
  supportTitle: {
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold",
    lineHeight: 16,
  },
  supportAgentMessage: {
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    lineHeight: 16,
  },
  supportTimestampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  supportTimestamp: {
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    lineHeight: 16,
  },
  timestampDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#898A8D",
    opacity: 0.6,
  },
  supportActionText: {
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    lineHeight: 16,
  },
  supportChevronContainer: {
    width: 6,
    height: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  closedSupportCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingRight: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#B4BED4",
    backgroundColor: "#F0F0F0",
    shadowColor: "#000",
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  closedTitle: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#979797",
    lineHeight: 16,
  },
  closedDate: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#979797",
    lineHeight: 16,
  },
  closedEndDate: {
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
    color: "#979797",
    lineHeight: 16,
  },
});

export default Notifications;
