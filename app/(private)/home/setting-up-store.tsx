import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg';

export default function SettingUpStoreScreen() {
  const { storeId, imageUrl } = useLocalSearchParams<{ storeId?: string; imageUrl?: string }>();
  const handleBack = () => {
    router.back();
  };

  const handleAction = (actionType: string) => {
    console.log(`Handle ${actionType} action`);

    switch (actionType) {
      case 'edit-profile':
        router.push(`/(private)/store/edit-store?storeId=${storeId}` as any);
        break;
      case 'view-products':
        router.push(`/(private)/store/unpublished-store?storeId=${storeId}` as any);
        break;
      case 'upload-documents':
        router.push(`/(private)/store/upload-documents?storeId=${storeId}` as any);
        break;
      case 'settings':
        // Navigate to settings screen
        console.log('Navigate to settings');
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  const ActionItem = ({ 
    icon, 
    title, 
    onPress 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionContent}>
        <View style={styles.actionIconContainer}>
          {icon}
        </View>
        <Text style={styles.actionTitle}>{title}</Text>
      </View>
      <View style={styles.actionArrow}>
        <Svg width="9" height="16" viewBox="0 0 9 16" fill="none">
          <Path 
            d="M6.3247 7.99999L0 1.88297L0.973452 0.941483L8.2716 7.99999L0.973452 15.0585L0 14.117L6.3247 7.99999Z" 
            fill="rgba(0,0,0,0.4)"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#06888C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Svg width="31" height="30" viewBox="0 0 31 30" fill="none">
                <Path 
                  d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" 
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Store</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path 
                  d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z" 
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M20.3 10.18C19.99 7.00003 18.11 2.00002 12.3 2.00002C6.49002 2.00002 4.61001 7.00003 4.30002 10.18C3.21252 10.5928 2.4952 11.6369 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.37 7.53004 4.00003 12.3 4.00003C17.07 4.00003 18.04 8.37 18.24 10.21C17.1882 10.6403 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4482 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.998 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4228 22.1 14.2V12.8C22.1048 11.6369 21.3875 10.5928 20.3 10.18Z" 
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Page Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Set up your store</Text>
          <Text style={styles.subtitle}>
            Provide all the information of your stores here
          </Text>
        </View>

        {/* Store Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: String(imageUrl) }}
              style={{ width: 85, height: 85, borderRadius: 16 }}
              resizeMode="cover"
            />
          ) : (
            <Svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <G clipPath="url(#clip0_776_1470)">
                <Path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M10.9997 2.10357C21.9783 0.482142 28.1676 0.496428 38.9997 2.10357C39.128 2.12318 39.2537 2.15671 39.3747 2.20357C42.6983 3.46999 45.4605 5.88139 47.164 9.00357C48.589 11.5607 49.1069 14.1179 49.1069 15.5464C49.1069 21.1536 44.3926 25.575 38.7354 25.575C36.1104 25.575 33.6997 24.6286 31.8676 23.0607C29.9515 24.6907 27.5153 25.5813 24.9997 25.5714C22.3747 25.5714 19.964 24.625 18.1319 23.0571C16.2162 24.6884 13.7801 25.5803 11.264 25.5714C5.60686 25.5714 0.892578 21.1536 0.892578 15.5464C0.892578 14.1179 1.41044 11.5607 2.83544 9.00357C4.53805 5.88204 7.29892 3.47071 10.6211 2.20357C10.7444 2.15621 10.8726 2.12267 11.0033 2.10357M7.98544 30.25C7.98544 29.658 7.75026 29.0902 7.33166 28.6716C6.91305 28.253 6.34529 28.0179 5.75329 28.0179C5.16129 28.0179 4.59354 28.253 4.17493 28.6716C3.75632 29.0902 3.52115 29.658 3.52115 30.25V39.7321C3.52115 42.2179 4.50838 44.602 6.26576 46.36C8.02314 48.1181 10.4068 49.1062 12.8926 49.1071H37.1069C39.5933 49.1071 41.9778 48.1194 43.736 46.3613C45.4941 44.6031 46.4819 42.2185 46.4819 39.7321V30.25C46.4819 29.658 46.2467 29.0902 45.8281 28.6716C45.4095 28.253 44.8417 28.0179 44.2497 28.0179C43.6577 28.0179 43.09 28.253 42.6714 28.6716C42.2528 29.0902 42.0176 29.658 42.0176 30.25V39.7321C42.0176 42.4464 39.8176 44.6429 37.1069 44.6429H32.4819V30.25C32.4819 29.658 32.2467 29.0902 31.8281 28.6716C31.4095 28.253 30.8417 28.0179 30.2497 28.0179C29.6577 28.0179 29.09 28.253 28.6714 28.6716C28.2527 29.0902 28.0176 29.658 28.0176 30.25V33.2679H7.98186L7.98544 30.25ZM7.98544 39.7321V37.7321H28.0212V44.6429H12.8926C10.1783 44.6429 7.98186 42.4429 7.98186 39.7321" 
                  fill="#06888C"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_776_1470">
                  <Rect width="50" height="50" fill="white"/>
                </ClipPath>
              </Defs>
            </Svg>
          )}
        </View>
          <Text style={styles.profileImageText}>Store Profile picture</Text>
        </View>

        {/* Action Items */}
        <View style={styles.actionsContainer}>
          <ActionItem
            icon={
              <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <Path 
                  d="M18.3333 5.50001H3.66667V3.66667H18.3333V5.50001ZM12.8333 14.7858L10.0833 17.5358V18.3333H3.66667V12.8333H2.75V11L3.66667 6.41667H18.3333L18.8925 9.23084C18.48 9.3225 18.0858 9.53334 17.7742 9.84501L14.7858 12.8333H12.8333V14.7858ZM11 12.8333H5.5V16.5H11V12.8333ZM20.9458 12.3475L19.7358 11.1375C19.5525 10.9542 19.25 10.9542 19.0758 11.1375L18.1775 12.0358L20.0475 13.9058L20.9458 13.0075C21.1292 12.8333 21.1292 12.5308 20.9458 12.3475ZM11.9167 18.2967V20.1667H13.7867L19.4058 14.5567L17.5358 12.6775L11.9167 18.2967Z" 
                  fill="black"
                />
              </Svg>
            }
            title="Edit Store Profile"
            onPress={() => handleAction('edit-profile')}
          />
          
          <ActionItem
            icon={
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <Path d="M3 3H10V10H3V3ZM14 3H21V10H14V3ZM3 14H10V21H3V14ZM14 14H21V21H14V14Z" fill="black" />
              </Svg>
            }
            title="View Products"
            onPress={() => handleAction('view-products')}
          />
          
          <ActionItem
            icon={
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path 
                  d="M11 16V7.85L8.4 10.45L7 9L12 4L17 9L15.6 10.45L13 7.85V16H11ZM4 20V15H6V18H18V15H20V20H4Z" 
                  fill="black"
                />
              </Svg>
            }
            title="Upload Documents"
            onPress={() => handleAction('upload-documents')}
          />
          
          <ActionItem
            icon={
              <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <Path 
                  d="M13.4263 3.74091C13.4509 3.84242 13.4991 3.93668 13.567 4.01605C13.6349 4.09541 13.7206 4.15763 13.817 4.19765C13.9135 4.23767 14.0181 4.25435 14.1222 4.24634C14.2263 4.23834 14.3271 4.20587 14.4163 4.15158C16.6521 2.79033 19.2105 5.34783 17.8492 7.58358C17.7949 7.67274 17.7624 7.77345 17.7544 7.87753C17.7463 7.98161 17.7629 8.08612 17.8028 8.18257C17.8428 8.27903 17.9049 8.36471 17.9841 8.43265C18.0634 8.50059 18.1576 8.54887 18.259 8.57358C20.8027 9.1905 20.8027 12.8086 18.259 13.4264C18.1575 13.451 18.0632 13.4992 17.9839 13.5671C17.9045 13.635 17.8423 13.7207 17.8023 13.8171C17.7622 13.9136 17.7455 14.0182 17.7536 14.1223C17.7616 14.2264 17.794 14.3272 17.8483 14.4164C19.2096 16.6522 16.6521 19.2106 14.4163 17.8493C14.3272 17.795 14.2265 17.7625 14.1224 17.7545C14.0183 17.7464 13.9138 17.763 13.8173 17.8029C13.7209 17.8429 13.6352 17.905 13.5673 17.9842C13.4993 18.0635 13.451 18.1577 13.4263 18.2591C12.8094 20.8028 9.19132 20.8028 8.57349 18.2591C8.54889 18.1576 8.50069 18.0633 8.4328 17.9839C8.36491 17.9046 8.27924 17.8424 8.18277 17.8023C8.0863 17.7623 7.98175 17.7456 7.87762 17.7536C7.77348 17.7617 7.67271 17.7941 7.58349 17.8484C5.34774 19.2097 2.78932 16.6522 4.15057 14.4164C4.20487 14.3273 4.23737 14.2265 4.24543 14.1225C4.25349 14.0184 4.23688 13.9139 4.19696 13.8174C4.15704 13.721 4.09492 13.6353 4.01567 13.5673C3.93641 13.4994 3.84225 13.4511 3.74082 13.4264C1.19707 12.8095 1.19707 9.19141 3.74082 8.57358C3.84232 8.54898 3.93659 8.50078 4.01595 8.43289C4.09532 8.365 4.15754 8.27933 4.19756 8.18286C4.23757 8.08639 4.25426 7.98184 4.24625 7.87771C4.23825 7.77357 4.20578 7.6728 4.15149 7.58358C2.79024 5.34783 5.34774 2.78941 7.58349 4.15066C7.67256 4.20537 7.77331 4.2382 7.87751 4.24647C7.98171 4.25474 8.08639 4.23821 8.18297 4.19823C8.27955 4.15826 8.36529 4.09598 8.43317 4.01649C8.50105 3.937 8.54913 3.84256 8.57349 3.74091C9.1904 1.19716 12.8085 1.19716 13.4263 3.74091ZM10.9999 8.25C10.2706 8.25 9.57108 8.53973 9.05536 9.05545C8.53964 9.57118 8.2499 10.2706 8.2499 11C8.2499 11.7293 8.53964 12.4288 9.05536 12.9445C9.57108 13.4603 10.2706 13.75 10.9999 13.75C11.7292 13.75 12.4287 13.4603 12.9444 12.9445C13.4602 12.4288 13.7499 11.7293 13.7499 11C13.7499 10.2706 13.4602 9.57118 12.9444 9.05545C12.4287 8.53973 11.7292 8.25 10.9999 8.25Z" 
                  fill="black"
                />
              </Svg>
            }
            title="Settings"
            onPress={() => handleAction('settings')}
          />
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
    backgroundColor: '#06888C',
    paddingTop: 19,
    paddingBottom: 19,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 22,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 30,
    paddingTop: 19,
    paddingBottom: 30,
    gap: 7,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 12,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 30,
    gap: 14,
  },
  profileImageContainer: {
    width: 85,
    height: 85,
    borderRadius: 16,
    backgroundColor: '#FFEBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 21,
    paddingBottom: 30,
    gap: 14,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#AAD7D8',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 13,
    height: 56,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  actionIconContainer: {
    width: 35,
    height: 34,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
  },
  actionArrow: {
    width: 8.272,
    height: 14.117,
  },
});
