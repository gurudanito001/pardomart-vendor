import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiConfig } from '../../../api/config';
import { BugReportApi } from '../../../api/endpoints/bug-report-api';
import { ArrowBackSVG } from '../../../components/icons';

export default function BugReportDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const bugReportApi = useMemo(() => new BugReportApi(apiConfig), []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response: any = await bugReportApi.bugReportsIdGet(id!);
        setReport(response.data?.data || response.data);
      } catch (error) {
        console.error('Failed to fetch bug report details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id, bugReportApi]);

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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#F48022" />
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Bug report not found.</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <ArrowBackSVG />
                </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const style = getStatusStyle(report.status);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <ArrowBackSVG />
                </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue Details</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.category}>{report.category?.replace(/_/g, ' ')}</Text>
            <View style={[styles.statusBadge, { backgroundColor: style.backgroundColor }]}>
              <Text style={[styles.statusText, { color: style.color }]}>{report.status?.replace(/_/g, ' ')}</Text>
            </View>
          </View>
          {report.title && <Text style={styles.title}>{report.title}</Text>}
          <Text style={styles.date}>{new Date(report.createdAt).toLocaleString()}</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>{report.description}</Text>
          
          {report.imageUrl && (
            <View style={styles.imageSection}>
              <Text style={styles.label}>Attached Image</Text>
              <Image source={{ uri: report.imageUrl }} style={styles.image} resizeMode="contain" />
            </View>
          )}

          {report.adminNotes && (
            <View style={styles.adminNotes}>
              <Text style={styles.label}>Support Response</Text>
              <Text style={styles.description}>{report.adminNotes}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#7C7B7B', fontFamily: 'OpenSans-Regular', marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 21, paddingTop: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontFamily: 'Raleway-Bold', color: '#000' },
  content: { padding: 20 },
  card: { backgroundColor: '#FAFAFB', borderRadius: 16, borderWidth: 1, borderColor: '#B4BED4', padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  category: { fontSize: 14, fontFamily: 'OpenSans-SemiBold', color: '#F48022', textTransform: 'uppercase', flex: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginLeft: 10 },
  statusText: { fontSize: 12, fontFamily: 'OpenSans-Bold', textTransform: 'capitalize' },
  title: { fontSize: 20, fontFamily: 'Raleway-Bold', color: '#100A37', marginBottom: 8 },
  date: { fontSize: 12, fontFamily: 'OpenSans-SemiBold', color: '#B4BED4', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#E0E9F5', marginBottom: 20 },
  label: { fontSize: 14, fontFamily: 'OpenSans-Bold', color: '#100A37', marginBottom: 8 },
  description: { fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#484C52', lineHeight: 22 },
  imageSection: { marginTop: 20 },
  image: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#F0F0F0' },
  adminNotes: { marginTop: 25, padding: 15, backgroundColor: 'rgba(1, 137, 28, 0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(1, 137, 28, 0.2)' },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
});