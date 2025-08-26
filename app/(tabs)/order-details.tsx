import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  isPerishable: boolean;
}

const MOCK_ORDER_ITEMS: OrderItem[] = [
  {
    id: '1',
    name: 'Tyson All natural chicken freshwings, family pack, 4.25-3.5lb Tray',
    category: 'Meat',
    price: 3.34,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/63f1ba43866c14d9b7ec4aeb2941bb00c04b7d4c?width=104',
    isPerishable: true,
  },
  {
    id: '2',
    name: 'Tyson All natural chicken freshwings, family pack, 4.25-3.5lb Tray',
    category: 'Meat',
    price: 3.34,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/63f1ba43866c14d9b7ec4aeb2941bb00c04b7d4c?width=104',
    isPerishable: true,
  },
  {
    id: '3',
    name: 'Tyson All natural chicken freshwings, family pack, 4.25-3.5lb Tray',
    category: 'Wal Deli',
    price: 3.34,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d8e31a39f95ad8a07cdcfb9245798e545b674e5b?width=96',
    isPerishable: true,
  },
  {
    id: '4',
    name: 'Tyson All natural chicken freshwings, family pack, 4.25-3.5lb Tray',
    category: 'Wal Deli',
    price: 3.34,
    quantity: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9163f624e8c0af4229d79bbd17692fd7d6ea4de5?width=86',
    isPerishable: true,
  },
];

export default function OrderDetailsScreen() {
  const handleGoBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    console.log('Open notifications');
  };

  const handleSupport = () => {
    console.log('Open support');
  };

  const handleStartShopping = () => {
    console.log('Start shopping');
  };

  const handleGoBackToOrders = () => {
    router.back();
  };

  const handleCallCustomer = () => {
    console.log('Call customer');
  };

  const handleMessageCustomer = () => {
    console.log('Message customer');
  };

  const handleCopyOrderCode = () => {
    console.log('Copy order code');
  };

  const groupedItems = MOCK_ORDER_ITEMS.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, OrderItem[]>);

  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.orderItem}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemFooter}>
          {item.isPerishable && (
            <View style={styles.perishableBadge}>
              <Text style={styles.perishableText}>Perishable</Text>
            </View>
          )}
          <View style={styles.itemPricing}>
            <Text style={styles.itemQuantity}>qty {item.quantity}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Map Section */}
      <View style={styles.mapSection}>
        <Image 
          source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/1aec3e87a8b4b88db60323cecb75b8585664780e?width=858' }}
          style={styles.mapImage}
        />

        {/* Map overlay with delivery route */}
        <View style={styles.mapOverlay}>
          <View style={styles.routeContainer}>
            {/* Start point */}
            <View style={styles.startPoint} />
            {/* Route line */}
            <View style={styles.routeLine} />
            {/* End point */}
            <View style={styles.endPoint} />
          </View>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M19.6278 21.993C19.8661 22.2135 20 22.5125 20 22.8243C20 23.1361 19.8661 23.4352 19.6278 23.6556C19.3895 23.8761 19.0662 24 18.7292 24C18.3921 24 18.0689 23.8761 17.8306 23.6556L9.37313 15.8313C9.25486 15.7223 9.16102 15.5927 9.09699 15.4501C9.03296 15.3074 9 15.1545 9 15C9 14.8455 9.03296 14.6926 9.09699 14.5499C9.16102 14.4073 9.25486 14.2777 9.37313 14.1687L17.8306 6.34435C18.0689 6.12387 18.3921 6 18.7292 6C19.0662 6 19.3895 6.12387 19.6278 6.34435C19.8661 6.56483 20 6.86387 20 7.17568C20 7.48749 19.8661 7.78653 19.6278 8.00702L12.07 14.999L19.6278 21.993Z" fill="black"/>
            </svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleNotifications} style={styles.headerAction}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.645 20.5C8.86103 21.2219 9.30417 21.8549 9.90858 22.3049C10.513 22.755 11.2464 22.998 12 22.998C12.7536 22.998 13.487 22.755 14.0914 22.3049C14.6958 21.8549 15.139 21.2219 15.355 20.5H8.645ZM3 19.5H21V16.5L19 13.5V8.5C19 7.58075 18.8189 6.6705 18.4672 5.82122C18.1154 4.97194 17.5998 4.20026 16.9497 3.55025C16.2997 2.90024 15.5281 2.38463 14.6788 2.03284C13.8295 1.68106 12.9193 1.5 12 1.5C11.0807 1.5 10.1705 1.68106 9.32122 2.03284C8.47194 2.38463 7.70026 2.90024 7.05025 3.55025C6.40024 4.20026 5.88463 4.97194 5.53284 5.82122C5.18106 6.6705 5 7.58075 5 8.5V13.5L3 16.5V19.5Z" fill="black"/>
            </svg>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSupport} style={styles.headerAction}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M19.8 10.18C19.49 7.00003 17.61 2.00002 11.8 2.00002C5.99002 2.00002 4.11001 7.00003 3.80002 10.18C2.71252 10.5928 1.9952 11.6369 2.00002 12.8V14.2C2.00002 15.7464 3.25365 17 4.80001 17C6.34642 17 7.60004 15.7464 7.60004 14.2V12.8C7.59498 11.6619 6.90404 10.6393 5.85001 10.21C6.05002 8.37 7.03004 4.00003 11.8 4.00003C16.57 4.00003 17.54 8.37 17.74 10.21C16.6882 10.6403 16.0007 11.6636 16 12.8V14.2C16.0022 14.7269 16.1524 15.2425 16.4335 15.6881C16.7147 16.1337 17.1154 16.4913 17.59 16.72C17.17 17.51 16.1 18.58 13.47 18.9C12.9443 18.1017 11.9272 17.787 11.0424 18.1489C10.1578 18.5108 9.65279 19.4482 9.83729 20.386C10.0218 21.3239 10.8442 22 11.8 22C12.1704 21.998 12.5329 21.8931 12.8472 21.6971C13.1615 21.5011 13.4152 21.2217 13.58 20.89C17.87 20.4 19.24 18.19 19.67 16.89C20.8333 16.5132 21.6157 15.4228 21.6 14.2V12.8C21.6048 11.6369 20.8875 10.5928 19.8 10.18ZM5.60002 14.2C5.60002 14.6418 5.24185 15 4.80001 15C4.35816 15 4.00004 14.6419 4.00004 14.2V12.8C3.99923 12.6944 4.01933 12.5898 4.05917 12.492C4.09901 12.3942 4.15781 12.3053 4.23217 12.2304C4.30654 12.1554 4.395 12.0959 4.49247 12.0554C4.58993 12.0148 4.69446 11.9939 4.80003 11.9939C4.90561 11.9939 5.01014 12.0148 5.1076 12.0554C5.20506 12.0959 5.29352 12.1554 5.36789 12.2304C5.44226 12.3053 5.50105 12.3942 5.5409 12.492C5.58074 12.5898 5.60083 12.6944 5.60002 12.8V14.2ZM18 12.8C18 12.3582 18.3582 12 18.8 12C19.2419 12 19.6 12.3582 19.6 12.8V14.2C19.6 14.6418 19.2419 15 18.8 15C18.3582 15 18 14.6419 18 14.2V12.8Z" fill="black"/>
            </svg>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <View style={styles.orderSummaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.totalRow}>
              <Text style={styles.estimatedTotalLabel}>Estimated Total</Text>
              <Text style={styles.estimatedTotalAmount}>$120.60</Text>
            </View>
            
            <View style={styles.costBreakdown}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Item Cost</Text>
                <Text style={styles.costAmount}>$100.00</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Shopping Fee</Text>
                <Text style={styles.costAmount}>$20.32</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <Text style={styles.progressDistance}>4.5 Miles - 20 Items</Text>
            
            {/* Progress bar */}
            <View style={styles.progressBar}>
              <View style={styles.progressStartPoint} />
              <View style={styles.progressLine} />
              <View style={styles.progressEndPoint} />
            </View>

            <View style={styles.progressDetails}>
              <View style={styles.progressLeft}>
                <Text style={styles.customerNameProgress}>Mr Damilare Adebanjo</Text>
                <View style={styles.timeDetails}>
                  <View style={styles.timeItem}>
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none">
                      <path d="M6 1.02487C3.243 1.02487 1 3.26787 1 6.02487C1 8.78187 3.243 11.0249 6 11.0249C8.757 11.0249 11 8.78187 11 6.02487C11 3.26787 8.757 1.02487 6 1.02487ZM6 10.0249C3.7945 10.0249 2 8.23037 2 6.02487C2 3.81937 3.7945 2.02487 6 2.02487C8.2055 2.02487 10 3.81937 10 6.02487C10 8.23037 8.2055 10.0249 6 10.0249Z" fill="#7C7B7B"/>
                      <path d="M6.5 3.52487H5.5V6.52487H8.5V5.52487H6.5V3.52487Z" fill="#7C7B7B"/>
                    </svg>
                    <Text style={styles.timeText}>12:00pm</Text>
                  </View>
                  <View style={styles.timeItem}>
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none">
                      <path d="M4.25 7.02487C4.41576 7.02487 4.57473 6.95902 4.69194 6.84181C4.80915 6.7246 4.875 6.56563 4.875 6.39987C4.875 6.23411 4.80915 6.07514 4.69194 5.95793C4.57473 5.84072 4.41576 5.77487 4.25 5.77487C4.08424 5.77487 3.92527 5.84072 3.80806 5.95793C3.69085 6.07514 3.625 6.23411 3.625 6.39987C3.625 6.56563 3.69085 6.7246 3.80806 6.84181C3.92527 6.95902 4.08424 7.02487 4.25 7.02487Z" fill="#7C7B7B"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M4 1.64987C4.09946 1.64987 4.19484 1.68938 4.26516 1.75971C4.33549 1.83003 4.375 1.92542 4.375 2.02487V2.39987H7.625V2.02487C7.625 1.92542 7.66451 1.83003 7.73484 1.75971C7.80516 1.68938 7.90054 1.64987 8 1.64987C8.09946 1.64987 8.19484 1.68938 8.26517 1.75971C8.33549 1.83003 8.375 1.92542 8.375 2.02487V2.40387C8.451 2.40587 8.52183 2.40954 8.5875 2.41487C8.7775 2.42987 8.9555 2.46387 9.124 2.54987C9.38278 2.68171 9.59316 2.89209 9.725 3.15087C9.811 3.31937 9.845 3.49737 9.86 3.68737C9.875 3.86987 9.875 4.09237 9.875 4.35987V8.18987C9.875 8.45737 9.875 8.67987 9.86 8.86237C9.845 9.05237 9.811 9.23037 9.725 9.39887C9.5933 9.65757 9.38309 9.86795 9.1245 9.99987C8.9555 10.0859 8.7775 10.1199 8.5875 10.1349C8.405 10.1499 8.1825 10.1499 7.9155 10.1499H4.085C3.8175 10.1499 3.595 10.1499 3.4125 10.1349C3.2225 10.1199 3.0445 10.0859 2.876 9.99987C2.61738 9.8683 2.40701 9.65828 2.275 9.39987C2.189 9.23087 2.155 9.05287 2.14 8.86287C2.125 8.68037 2.125 8.45787 2.125 8.19087V4.35987C2.125 4.09237 2.125 3.86987 2.14 3.68737C2.155 3.49737 2.189 3.31937 2.275 3.15087C2.40684 2.89209 2.61722 2.68171 2.876 2.54987C3.0445 2.46387 3.2225 2.42987 3.4125 2.41487C3.47817 2.40954 3.549 2.40587 3.625 2.40387V2.02487C3.625 1.97563 3.6347 1.92686 3.65355 1.88137C3.67239 1.83587 3.70001 1.79453 3.73483 1.75971C3.76966 1.72488 3.811 1.69726 3.85649 1.67842C3.90199 1.65957 3.95075 1.64987 4 1.64987Z" fill="#7C7B7B"/>
                    </svg>
                    <Text style={styles.timeText}>03/2025</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.progressRight}>
                <Text style={styles.deliveryAddress}>47 North Union Avenue</Text>
                <Text style={styles.deliveryLocation}>Chicago Illiniou, 60612, US</Text>
              </View>
            </View>
          </View>

          {/* Order Code */}
          <View style={styles.orderCodeSection}>
            <Text style={styles.orderCodeText}>Order code - 987BNTT43</Text>
            <TouchableOpacity onPress={handleCopyOrderCode}>
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                <path d="M13 1.02487H4.625C4.55625 1.02487 4.5 1.08112 4.5 1.14987V2.02487C4.5 2.09362 4.55625 2.14987 4.625 2.14987H12.375V12.8999C12.375 12.9686 12.4312 13.0249 12.5 13.0249H13.375C13.4438 13.0249 13.5 12.9686 13.5 12.8999V1.52487C13.5 1.24831 13.2766 1.02487 13 1.02487ZM11 3.02487H3C2.72344 3.02487 2.5 3.24831 2.5 3.52487V11.8171C2.5 11.9499 2.55312 12.0764 2.64687 12.1702L5.35469 14.878C5.38906 14.9124 5.42813 14.9405 5.47031 14.9639V14.9936H5.53594C5.59062 15.0139 5.64844 15.0249 5.70781 15.0249H11C11.2766 15.0249 11.5 14.8014 11.5 14.5249V3.52487C11.5 3.24831 11.2766 3.02487 11 3.02487ZM5.46875 13.403L4.12344 12.0561H5.46875V13.403ZM10.375 13.8999H6.46875V11.6811C6.46875 11.3358 6.18906 11.0561 5.84375 11.0561H3.625V4.14987H10.375V13.8999Z" fill="black"/>
              </svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Contact Card */}
        <View style={styles.customerCard}>
          <View style={styles.customerInfo}>
            <Image 
              source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/c91bce15e2114688cb19d13e673d86c47c9917ca?width=60' }}
              style={styles.customerAvatar}
            />
            <Text style={styles.customerName}>Mr Damilare Adebanjo</Text>
          </View>
          
          <View style={styles.customerActions}>
            <TouchableOpacity style={styles.messageButton} onPress={handleMessageCustomer}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <rect width="30" height="30" rx="15" fill="#2CAF0B"/>
                <path d="M15 8.925C18.7125 8.925 21.75 11.3415 21.75 14.325C21.75 17.3085 18.7125 19.725 15 19.725C14.163 19.725 13.3598 19.6035 12.6173 19.3875C10.6463 21.075 8.25 21.075 8.25 21.075C9.82275 19.5023 10.0725 18.4425 10.1063 18.0375C8.95875 17.0723 8.25 15.7628 8.25 14.325C8.25 11.3415 11.2875 8.925 15 8.925Z" fill="white"/>
              </svg>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.callButton} onPress={handleCallCustomer}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#2CAF0B"/>
                <path d="M18.1618 20.2498C17.7043 20.2498 17.0616 20.0843 16.0993 19.5467C14.929 18.8904 14.0239 18.2845 12.86 17.1237C11.7378 16.0022 11.1917 15.2761 10.4274 13.8853C9.56395 12.315 9.71114 11.4919 9.87567 11.1401C10.0716 10.7196 10.3608 10.4681 10.7347 10.2185C10.947 10.0794 11.1717 9.96016 11.4059 9.86228C11.4293 9.8522 11.4511 9.8426 11.4706 9.83392C11.5866 9.78166 11.7624 9.70267 11.985 9.78705C12.1336 9.84283 12.2663 9.95697 12.4739 10.162C12.8998 10.582 13.4818 11.5174 13.6964 11.9768C13.8406 12.2864 13.936 12.4908 13.9362 12.72C13.9362 12.9884 13.8012 13.1953 13.6374 13.4187C13.6067 13.4606 13.5762 13.5007 13.5467 13.5396C13.3683 13.774 13.3292 13.8417 13.355 13.9627C13.4072 14.2057 13.797 14.9292 14.4375 15.5684C15.0781 16.2075 15.7807 16.5727 16.0247 16.6247C16.1508 16.6517 16.22 16.6109 16.4618 16.4262C16.4965 16.3997 16.5322 16.3723 16.5694 16.3449C16.8193 16.159 17.0166 16.0275 17.2786 16.0275H17.28C17.5081 16.0275 17.7033 16.1264 18.0268 16.2895C18.4486 16.5024 19.4122 17.0768 19.8347 17.5031C20.0403 17.7103 20.1549 17.8425 20.2109 17.9909C20.2953 18.2142 20.2158 18.3893 20.164 18.5065C20.1554 18.526 20.1457 18.5473 20.1357 18.571C20.037 18.8048 19.9171 19.029 19.7773 19.2408C19.5282 19.6135 19.2757 19.902 18.8543 20.0981C18.638 20.2005 18.4011 20.2524 18.1618 20.2498Z" fill="black"/>
              </svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shopping Items */}
        <View style={styles.shoppingItemsCard}>
          <View style={styles.shoppingItemsHeader}>
            <Text style={styles.shoppingItemsTitle}>SHOPPING ITEMS</Text>
            <Text style={styles.itemCount}>20 ITEMS</Text>
          </View>

          {Object.entries(groupedItems).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.categoryItems}>
                {items.map((item, index) => (
                  <View 
                    key={item.id} 
                    style={[
                      styles.orderItemContainer,
                      index === 0 && styles.firstItem,
                      index === items.length - 1 && styles.lastItem
                    ]}
                  >
                    {renderOrderItem(item)}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBackToOrders}>
            <Text style={styles.goBackText}>Go back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.startShoppingButton} onPress={handleStartShopping}>
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
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
  mapSection: {
    height: 257,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  timeText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'SF Pro',
  },
  mapOverlay: {
    position: 'absolute',
    top: 88,
    left: 153,
    width: 157,
    height: 102,
  },
  routeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startPoint: {
    width: 19,
    height: 19,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#000',
    marginVertical: 5,
  },
  endPoint: {
    width: 19,
    height: 19,
    backgroundColor: '#01891C',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#B4BED4',
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
    fontFamily: 'Raleway',
    color: '#000',
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerAction: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  orderSummaryCard: {
    padding: 17,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#FBFBFB',
    marginBottom: 19,
  },
  summaryHeader: {
    gap: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimatedTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 22,
  },
  estimatedTotalAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#100A37',
    lineHeight: 22,
  },
  costBreakdown: {
    gap: 4,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#707070',
  },
  costAmount: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#313131',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 16,
  },
  progressSection: {
    alignItems: 'center',
    gap: 10,
  },
  progressDistance: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'center',
  },
  progressBar: {
    width: 245,
    height: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStartPoint: {
    width: 16,
    height: 16,
    backgroundColor: '#2CAF0B',
    borderRadius: 8,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 8,
  },
  progressEndPoint: {
    width: 16,
    height: 16,
    backgroundColor: '#B4BED4',
    borderRadius: 8,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    gap: 90,
  },
  progressLeft: {
    alignItems: 'center',
    gap: 4,
  },
  customerNameProgress: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  timeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  progressRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  deliveryAddress: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'right',
  },
  deliveryLocation: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
    textAlign: 'right',
  },
  orderCodeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 16,
  },
  orderCodeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  customerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    marginBottom: 19,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  customerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  messageButton: {
    width: 30,
    height: 30,
  },
  callButton: {
    width: 30,
    height: 30,
  },
  shoppingItemsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B4BED4',
    backgroundColor: '#ECECEC',
    marginBottom: 19,
    overflow: 'hidden',
  },
  shoppingItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  shoppingItemsTitle: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  itemCount: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#484C52',
  },
  categorySection: {
    marginBottom: 16,
    paddingHorizontal: 18,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#000',
    marginBottom: 16,
  },
  categoryItems: {
    gap: 0,
  },
  orderItemContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  firstItem: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  lastItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 0,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    gap: 9,
  },
  itemImageContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 52,
    height: 61,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
    gap: 6,
  },
  itemName: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#484C52',
    lineHeight: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  perishableBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(191, 227, 198, 0.50)',
  },
  perishableText: {
    fontSize: 6,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#01891C',
    lineHeight: 18,
  },
  itemPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemQuantity: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    color: '#7C7B7B',
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    color: '#000',
    lineHeight: 18,
  },
  actionButtons: {
    gap: 16,
    marginBottom: 30,
  },
  goBackButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#06888C',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#06888C',
    lineHeight: 25,
    textAlign: 'center',
  },
  startShoppingButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#06888C',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
  },
  startShoppingText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Raleway',
    color: '#FFF',
    lineHeight: 25,
    textAlign: 'center',
  },
});
