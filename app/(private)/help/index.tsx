import { useAuth } from '@/context/AppProvider';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { apiConfig } from '../../../api/config';
import { BugReportApi } from '../../../api/endpoints/bug-report-api';
import { FAQApi } from '../../../api/endpoints/faqapi';
import { Faq } from '../../../api/models';
import NotificationBell from '../../../components/NotificationBell';
import { toast } from '../../../utils/toast';

// Custom Icons matching Figma
const CustomerSupportIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 25" fill="none">
    <G clipPath="url(#clip0_534_913)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.99996C10.475 2.99996 9.01247 3.60576 7.93414 4.6841C6.8558 5.76243 6.25 7.22497 6.25 8.74996V17.5H0V8.49996H3.754C3.82074 6.35744 4.71877 4.32502 6.25791 2.83308C7.79705 1.34114 9.85644 0.506836 12 0.506836C14.1436 0.506836 16.203 1.34114 17.7421 2.83308C19.2812 4.32502 20.1793 6.35744 20.246 8.49996H24V17.5H20.176C19.9364 19.0991 19.1308 20.5592 17.9056 21.6144C16.6803 22.6697 15.117 23.2501 13.5 23.25H13.25V24.5H10.75V19.5H13.25V20.75H13.5C14.6272 20.75 15.7082 20.3022 16.5052 19.5052C17.3022 18.7081 17.75 17.6271 17.75 16.5V8.74996C17.75 7.22497 17.1442 5.76243 16.0659 4.6841C14.9875 3.60576 13.525 2.99996 12 2.99996Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_534_913">
        <Rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
      </ClipPath>
    </Defs>
  </Svg>
);

const IncidentReporterIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.5 9.75H16.5V11.25H7.5V9.75ZM7.5 15H13.5V13.5H7.5V15ZM7.5 18.75H11.25V17.25H7.5V18.75ZM5.25 5.25H7.5V7.5H16.5V5.25H18.75V9.75H20.25V5.25C20.25 4.85218 20.092 4.47064 19.8107 4.18934C19.5294 3.90804 19.1478 3.75 18.75 3.75H16.5V3C16.5 2.60218 16.342 2.22064 16.0607 1.93934C15.7794 1.65804 15.3978 1.5 15 1.5H9C8.60218 1.5 8.22064 1.65804 7.93934 1.93934C7.65804 2.22064 7.5 2.60218 7.5 3V3.75H5.25C4.85218 3.75 4.47064 3.90804 4.18934 4.18934C3.90804 4.47064 3.75 4.85218 3.75 5.25V21C3.75 21.3978 3.90804 21.7794 4.18934 22.0607C4.47064 22.342 4.85218 22.5 5.25 22.5H9V21H5.25V5.25ZM9 3H15V6H9V3ZM22.4325 21.702L17.7218 13.0275C17.6752 12.9432 17.6069 12.873 17.524 12.8241C17.4411 12.7752 17.3466 12.7494 17.2504 12.7494C17.1541 12.7494 17.0596 12.7752 16.9767 12.8241C16.8938 12.873 16.8255 12.9432 16.779 13.0275L12.0668 21.7013C12.0219 21.7834 11.9992 21.8758 12.0008 21.9693C12.0024 22.0629 12.0283 22.1544 12.076 22.2349C12.1236 22.3155 12.1913 22.3822 12.2726 22.4287C12.3538 22.4752 12.4457 22.4997 12.5392 22.5H21.9592C22.0528 22.4999 22.1448 22.4755 22.2261 22.4292C22.3075 22.3829 22.3753 22.3162 22.4231 22.2358C22.4709 22.1553 22.497 22.0638 22.4988 21.9702C22.5005 21.8766 22.4772 21.7842 22.4325 21.702ZM16.6875 15.75H17.8125V18.75H16.6875V15.75ZM17.25 21C17.1496 21.0032 17.0495 20.9861 16.9558 20.9499C16.8621 20.9137 16.7766 20.8589 16.7044 20.789C16.6322 20.7191 16.5749 20.6354 16.5357 20.5429C16.4965 20.4503 16.4763 20.3509 16.4763 20.2504C16.4763 20.1499 16.4965 20.0504 16.5357 19.9579C16.5749 19.8654 16.6322 19.7816 16.7044 19.7117C16.7766 19.6418 16.8621 19.5871 16.9558 19.5509C17.0495 19.5146 17.1496 19.4976 17.25 19.5007C17.4447 19.5069 17.6294 19.5886 17.7649 19.7285C17.9005 19.8684 17.9763 20.0556 17.9763 20.2504C17.9763 20.4452 17.9005 20.6323 17.7649 20.7723C17.6294 20.9122 17.4447 20.9938 17.25 21Z"
      fill="white"
    />
  </Svg>
);

const SearchIcon = () => (
  <Svg width="14" height="15" viewBox="0 0 14 15" fill="none">
    <Path
      d="M13.2353 14.4531C13.1474 14.4527 13.0605 14.4348 12.9797 14.4005C12.8988 14.3662 12.8256 14.3161 12.7643 14.2531L10.3153 11.8041C9.05417 12.824 7.44984 13.3212 5.83303 13.1931C4.21621 13.0651 2.71014 12.3216 1.62528 11.1159C0.540426 9.9103 -0.0405212 8.33438 0.00219959 6.71306C0.0449203 5.09175 0.708053 3.54861 1.85489 2.40177C3.00174 1.25493 4.54487 0.591795 6.16619 0.549075C7.78751 0.506354 9.36342 1.0873 10.5691 2.17216C11.7747 3.25701 12.5182 4.76308 12.6462 6.3799C12.7743 7.99672 12.2771 9.60104 11.2573 10.8621L13.7063 13.3111C13.7994 13.4043 13.8629 13.523 13.8886 13.6522C13.9143 13.7814 13.9011 13.9153 13.8507 14.037C13.8003 14.1587 13.7149 14.2628 13.6054 14.3359C13.4958 14.4091 13.367 14.4482 13.2353 14.4481V14.4531ZM6.33227 1.88615C5.34336 1.88615 4.37667 2.17939 3.55442 2.7288C2.73217 3.27821 2.09131 4.0591 1.71287 4.97273C1.33444 5.88636 1.23542 6.89169 1.42834 7.8616C1.62127 8.8315 2.09747 9.72242 2.79674 10.4217C3.496 11.1209 4.38691 11.5971 5.35682 11.7901C6.32672 11.983 7.33206 11.884 8.24569 11.5055C9.15932 11.1271 9.94021 10.4862 10.4896 9.664C11.039 8.84175 11.3323 7.87505 11.3323 6.88615C11.3307 5.56055 10.8034 4.2897 9.86605 3.35237C8.92871 2.41503 7.65787 1.88773 6.33227 1.88615Z"
      fill="black"
    />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width="7" height="12" viewBox="0 0 7 12" fill="none">
    <Path
      d="M0.866949 11.9985C0.66474 11.9988 0.468777 11.9292 0.313076 11.8017C0.225444 11.7299 0.153007 11.6418 0.0999113 11.5423C0.0468157 11.4428 0.0141058 11.3339 0.00365506 11.2219C-0.0067957 11.1098 0.00521815 10.9969 0.0390082 10.8895C0.0727983 10.7821 0.1277 10.6823 0.200571 10.5958L4.07768 6.01173L0.339039 1.41906C0.267152 1.33158 0.213468 1.23092 0.181074 1.12286C0.148679 1.01481 0.138213 0.901501 0.150276 0.789439C0.16234 0.677378 0.196694 0.568777 0.251367 0.469879C0.306039 0.370982 0.379951 0.283737 0.468853 0.213159C0.558395 0.135301 0.663255 0.0765731 0.776853 0.0406621C0.89045 0.00475112 1.01033 -0.00756759 1.12898 0.00447846C1.24762 0.0165245 1.36246 0.0526755 1.4663 0.110663C1.57014 0.16865 1.66072 0.247221 1.73237 0.341446L5.91238 5.47292C6.03967 5.62596 6.10925 5.81791 6.10925 6.01601C6.10925 6.2141 6.03967 6.40606 5.91238 6.55909L1.58525 11.6906C1.49843 11.7941 1.38815 11.8759 1.26335 11.9294C1.13854 11.9829 1.00274 12.0065 0.866949 11.9985Z"
      fill="#333333"
    />
  </Svg>
);

interface CommonQuestionItemProps {
  faq: Faq;
  isExpanded: boolean;
  onPress: () => void;
}

const CommonQuestionItem: React.FC<CommonQuestionItemProps> = ({ faq, isExpanded, onPress }) => (
  <Pressable style={styles.questionItem} onPress={onPress}>
    <View style={styles.questionContent}>
      <Text style={styles.questionTitle}>{faq.question}</Text>
      <Text style={styles.questionAnswer} numberOfLines={isExpanded ? undefined : 1}>
        {faq.answer}
      </Text>
    </View>
    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#333333" />
  </Pressable>
);

const HelpScreen = () => {
  const router = useRouter();
  const { state, logout, initializeAuth } = useAuth();
  const { user, isLoading: authLoading } = state;
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [bugReports, setBugReports] = useState<any[]>([]);
  const [loadingBugReports, setLoadingBugReports] = useState(true);

  const faqApi = useMemo(() => new FAQApi(apiConfig), []);
  const bugReportApi = useMemo(() => new BugReportApi(apiConfig), []);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await faqApi.faqsGet();
        setFaqs(response.data || []);
      } catch (error) {
        toast.error('Failed to load FAQs.');
      } finally {
        setLoadingFaqs(false);
      }
    };
    fetchFaqs();
  }, [faqApi]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const fetchBugReports = async () => {
        try {
          const response: any = await bugReportApi.bugReportsMeGet();
          if (active) setBugReports(response.data?.data || response.data || []);
        } catch (error) {
        } finally {
          if (active) setLoadingBugReports(false);
        }
      };
      fetchBugReports();
      return () => { active = false; };
    }, [bugReportApi])
  );

  const handleCallNow = () => {
    Linking.openURL('tel:+1-800-123-4567');
  };

  const handleReportIssue = () => {
    router.push('/help/reportIssue');
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleFaqPress = (faqId: string) => {
    if (expandedFaqId === faqId) {
      setExpandedFaqId(null); // Collapse if already expanded
    } else {
      setExpandedFaqId(faqId); // Expand new one
    }
  };

  const getStatusStyle = (status?: string) => {
    switch(status?.toLowerCase()) {
      case 'resolved': return { backgroundColor: 'rgba(1, 137, 28, 0.1)', color: '#01891C' };
      case 'in_progress': return { backgroundColor: 'rgba(244, 128, 34, 0.1)', color: '#F48022' };
      default: return { backgroundColor: '#F0F0F0', color: '#7C7B7B' };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="chevron-back" size={24} color="#100A37" />
          </Pressable>
          <Text style={styles.headerTitle}>Help Center</Text>
        </View>
        <View style={styles.headerRight}>
          <NotificationBell from="/help/help" />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        {/* <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SearchIcon />
            <Text style={styles.searchPlaceholder}>Help center</Text>
          </View>
        </View> */}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Greeting */}
          <Text style={styles.greeting}>Hi {user?.name?.split(" ")[0] || 'there'}, How can we help you?</Text>

          

          {/* Contact Support Card */}
          <View style={styles.supportCard}>
            <View style={styles.supportCardContent}>
              <View style={styles.supportIconContainer}>
                <CustomerSupportIcon />
              </View>
              <View style={styles.supportTextContainer}>
                <Text style={styles.supportTitle}>Contact Support</Text>
                <Text style={styles.supportDescription}>
                  Customer support is available from 9:00 AM - 10:00 PM, 7 days a week.
                </Text>
              </View>
            </View>
            <Pressable style={styles.callButton} onPress={handleCallNow}>
              <Text style={styles.callButtonText}>Call now</Text>
            </Pressable>
          </View>

          {/* Reported Issues Section */}
          {!loadingBugReports && bugReports.length > 0 && (
            <View style={styles.reportedIssuesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reported Issues</Text>
                <Pressable onPress={() => router.push('/help/bugReportList')}>
                  <Text style={styles.viewAllText}>View all</Text>
                </Pressable>
              </View>
              <View style={styles.bugReportsList}>
                {bugReports.slice(0, 3).map((report) => (
                  <Pressable
                    key={report.id}
                    style={styles.bugReportCard}
                    onPress={() => router.push({ pathname: '/help/bugReportDetails', params: { id: report.id } })}
                  >
                    <View style={styles.bugReportInfo}>
                      <Text style={styles.bugReportTitle} numberOfLines={1}>{report.title || report.category?.replace(/_/g, ' ') || 'Issue'}</Text>
                      <Text style={styles.bugReportDesc} numberOfLines={1}>{report.description}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusStyle(report.status).backgroundColor }]}>
                      <Text style={[styles.statusText, { color: getStatusStyle(report.status).color }]}>{report.status?.replace(/_/g, ' ')}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Report Issue Card */}
          <Pressable style={styles.reportCard} onPress={handleReportIssue}>
            <View style={styles.reportCardContent}>
              <View style={styles.reportIconContainer}>
                <IncidentReporterIcon />
              </View>
              <View style={styles.reportTextContainer}>
                <Text style={styles.reportTitle}>Report an issue</Text>
                <Text style={styles.reportDescription}>
                  If you are experiencing a problem with the app or have suggestions, please let us know
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Common Questions Section */}
        <View style={styles.questionsSection}>
          <Text style={styles.questionsTitle}>Frequently Asked Questions</Text>
          <View style={styles.questionsList}>
            {loadingFaqs ? (
              <ActivityIndicator size="large" color="#F48022" style={{ marginTop: 20 }} />
            ) : (
              faqs.map((faq) => (
                <CommonQuestionItem
                  key={faq.id}
                  faq={faq}
                  isExpanded={expandedFaqId === faq.id}
                  onPress={() => handleFaqPress(faq.id!)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 5,
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
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 21,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#F0F0F0',
    gap: 14,
    height: 47,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans-SemiBold',
    color: '#898A8D',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
    lineHeight: 25,
  },
  supportCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    padding: 22,
    gap: 31,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 9,
    elevation: 2,
  },
  supportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  supportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 32,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportTextContainer: {
    flex: 1,
    gap: 4,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
    lineHeight: 16,
  },
  supportDescription: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#898A8D',
    width: 220,
    lineHeight: 16,
  },
  callButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 120,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 9,
    elevation: 2,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#06888C',
    lineHeight: 25,
  },
  reportCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FFF',
    padding: 22,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 9,
    elevation: 2,
  },
  reportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  reportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 32,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTextContainer: {
    flex: 1,
    gap: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
    lineHeight: 16,
  },
  reportDescription: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: '#898A8D',
    lineHeight: 16,
  },
  questionsSection: {
    paddingHorizontal: 21,
    paddingTop: 27,
    paddingBottom: 20,
  },
  questionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Raleway-Bold',
    color: '#000',
    lineHeight: 25,
    marginBottom: 20,
  },
  questionsList: {
    gap: 24,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  questionContent: {
    flex: 1,
    paddingRight: 10,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OpenSans-SemiBold',
    color: '#3e3e3eff',
    lineHeight: 22,
  },
  questionAnswer: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#7C7B7B',
    marginTop: 8,
    lineHeight: 20,
  },
  questionSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'OpenSans-SemiBold',
    color: '#7C7B7B',
  },
  reportedIssuesSection: {
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#06888C',
  },
  bugReportsList: {
    gap: 12,
  },
  bugReportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
    borderWidth: 1,
    borderColor: '#B4BED4',
    borderRadius: 12,
    padding: 16,
  },
  bugReportInfo: {
    flex: 1,
    marginRight: 10,
  },
  bugReportTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
    color: '#100A37',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  bugReportDesc: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#7C7B7B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'OpenSans-Bold',
    textTransform: 'capitalize',
  },
});

export default HelpScreen;