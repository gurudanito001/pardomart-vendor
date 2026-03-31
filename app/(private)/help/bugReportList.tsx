import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiConfig } from '../../../api/config';
import { BugReportApi } from '../../../api/endpoints/bug-report-api';
import { ArrowBackSVG } from '../../../components/icons';

export default function BugReportsList() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const bugReportApi = useMemo(() => new BugReportApi(apiConfig), []);

  const fetchReports = useCallback(async (p: number) => {
    try {
      const response: any = await bugReportApi.bugReportsMeGet();
      const newReports = response.data?.data || response.data || [];
      if (newReports.length < 15) setHasMore(false);
      setReports(prev => p === 1 ? newReports : [...prev, ...newReports]);
    } catch (error) {
      console.error('Failed to fetch bug reports:', error);
    } finally {
      setLoading(false);
    }
  }, [bugReportApi]);

  useEffect(() => {
    fetchReports(page);
  }, [page, fetchReports]);

  const getStatusStyle = (status?: string) => {
    switch(status?.toLowerCase()) {
      case 'resolved': return { backgroundColor: 'rgba(1, 137, 28, 0.1)', color: '#01891C' };
      case 'in_progress': return { backgroundColor: 'rgba(244, 128, 34, 0.1)', color: '#F48022' };
      default: return { backgroundColor: '#F0F0F0', color: '#7C7B7B' };
    }
  };

    const handleGoBack = () => {
        router.back();
    };

  const renderItem = ({ item }: { item: any }) => {
    const style = getStatusStyle(item.status);
    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push({ pathname: '/help/bugReportDetails', params: { id: item.id } })}
      >
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title || item.category?.replace(/_/g, ' ') || 'Issue'}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: style.backgroundColor }]}>
          <Text style={[styles.statusText, { color: style.color }]}>{item.status?.replace(/_/g, ' ')}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowBackSVG />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Reported Issues</Text>
        <View style={{ width: 30 }} />
      </View>
      
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#F48022" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          onEndReached={() => hasMore && setPage(p => p + 1)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && page > 1 ? <ActivityIndicator color="#F48022" style={{ marginVertical: 20 }} /> : null}
          ListEmptyComponent={<Text style={styles.emptyText}>No bug reports found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 18, fontFamily: 'Raleway-Bold', color: '#000' },
  listContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, gap: 15 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FAFAFB',
    borderWidth: 1,
    borderColor: '#B4BED4',
    borderRadius: 16,
    padding: 16,
  },
  cardInfo: { flex: 1, marginRight: 15 },
  cardTitle: { fontSize: 16, fontFamily: 'OpenSans-Bold', color: '#100A37', marginBottom: 4, textTransform: 'capitalize' },
  cardDesc: { fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#7C7B7B', marginBottom: 8 },
  cardDate: { fontSize: 12, fontFamily: 'OpenSans-SemiBold', color: '#B4BED4' },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    textTransform: 'capitalize',
  },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 14, color: '#7C7B7B', fontFamily: 'OpenSans-Regular' },
   backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
});