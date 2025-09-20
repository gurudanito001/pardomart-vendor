import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFF',
          paddingTop: 20,
          paddingBottom: 25,
          paddingHorizontal: 17,
          height: 105,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingHorizontal: 2,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: '#06888C',
        tabBarInactiveTintColor: '#484C52',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Raleway',
          fontWeight: '400',
          lineHeight: 16,
          marginTop: 6,
          marginBottom: 0,
          paddingBottom: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24 }}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M3.42039 7.823C2.90039 8.77 2.90039 9.915 2.90039 12.203V13.725C2.90039 17.625 2.90039 19.576 4.07239 20.788C5.24439 22 7.12939 22 10.9004 22H14.9004C18.6714 22 20.5574 22 21.7284 20.788C22.8994 19.576 22.9004 17.626 22.9004 13.725V12.204C22.9004 9.915 22.9004 8.771 22.3804 7.823C21.8624 6.874 20.9134 6.286 19.0164 5.108L17.0164 3.867C15.0114 2.622 14.0084 2 12.9004 2C11.7924 2 10.7904 2.622 8.78439 3.867L6.78439 5.108C4.88739 6.286 3.93939 6.874 3.42039 7.823Z" 
                  stroke={color} 
                  strokeWidth="2"
                />
              </svg>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24 }}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path 
                  d="M17.0996 4H7.09961C5.99504 4 5.09961 4.89543 5.09961 6V19C5.09961 20.1046 5.99504 21 7.09961 21H17.0996C18.2042 21 19.0996 20.1046 19.0996 19V6C19.0996 4.89543 18.2042 4 17.0996 4Z" 
                  stroke={color} 
                  strokeWidth="2"
                />
                <path 
                  d="M9.09961 9H15.0996M9.09961 13H15.0996M9.09961 17H13.0996" 
                  stroke={color} 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24 }}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path 
                  d="M3.2002 20L4.5002 16.1C2.1762 12.663 3.0742 8.22803 6.6002 5.72603C10.1262 3.22503 15.1902 3.43003 18.4452 6.20603C21.7002 8.98303 22.1402 13.472 19.4742 16.707C16.8082 19.942 11.8592 20.922 7.9002 19L3.2002 20Z" 
                  stroke={color} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24 }}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path 
                  d="M12.8504 18C13.2004 18 13.4964 17.879 13.7384 17.637C13.9804 17.395 14.1011 17.0993 14.1004 16.75C14.0997 16.4007 13.9791 16.1047 13.7384 15.862C13.4977 15.6193 13.2017 15.4987 12.8504 15.5C12.4991 15.5013 12.2034 15.6223 11.9634 15.863C11.7234 16.1037 11.6024 16.3993 11.6004 16.75C11.5984 17.1007 11.7194 17.3967 11.9634 17.638C12.2074 17.8793 12.5031 18 12.8504 18ZM11.9504 14.15H13.8004C13.8004 13.6 13.8631 13.1667 13.9884 12.85C14.1137 12.5333 14.4677 12.1 15.0504 11.55C15.4837 11.1167 15.8254 10.704 16.0754 10.312C16.3254 9.92 16.4504 9.44934 16.4504 8.9C16.4504 7.96667 16.1087 7.25001 15.4254 6.75001C14.7421 6.25001 13.9337 6.00001 13.0004 6.00001C12.0504 6.00001 11.2797 6.25001 10.6884 6.75001C10.0971 7.25001 9.68439 7.85001 9.45039 8.55001L11.1004 9.20001C11.1837 8.9 11.3714 8.57501 11.6634 8.22501C11.9554 7.87501 12.4011 7.70001 13.0004 7.70001C13.5337 7.70001 13.9337 7.846 14.2004 8.138C14.4671 8.43 14.6004 8.75067 14.6004 9.10001C14.6004 9.43334 14.5004 9.74601 14.3004 10.038C14.1004 10.33 13.8504 10.6007 13.5504 10.85C12.8171 11.5 12.3671 11.9917 12.2004 12.325C12.0337 12.6583 11.9504 13.2667 11.9504 14.15ZM12.9004 22C11.5171 22 10.2171 21.7377 9.00039 21.213C7.78373 20.6883 6.72539 19.9757 5.82539 19.075C4.92539 18.1743 4.21306 17.116 3.68839 15.9C3.16373 14.684 2.90106 13.384 2.90039 12C2.89973 10.616 3.16239 9.31601 3.68839 8.10001C4.21439 6.88401 4.92673 5.82567 5.82539 4.92501C6.72406 4.02434 7.78239 3.31201 9.00039 2.78801C10.2184 2.26401 11.5184 2.00134 12.9004 2.00001C14.2824 1.99867 15.5824 2.26134 16.8004 2.78801C18.0184 3.31467 19.0767 4.02701 19.9754 4.92501C20.8741 5.82301 21.5867 6.88134 22.1134 8.10001C22.6401 9.31867 22.9024 10.6187 22.9004 12C22.8984 13.3813 22.6357 14.6813 22.1124 15.9C21.5891 17.1187 20.8767 18.177 19.9754 19.075C19.0741 19.973 18.0157 20.6857 16.8004 21.213C15.5851 21.7403 14.2851 22.0027 12.9004 22ZM12.9004 20C15.1337 20 17.0254 19.225 18.5754 17.675C20.1254 16.125 20.9004 14.2333 20.9004 12C20.9004 9.76667 20.1254 7.875 18.5754 6.32501C17.0254 4.77501 15.1337 4.00001 12.9004 4.00001C10.6671 4.00001 8.77539 4.77501 7.22539 6.32501C5.67539 7.875 4.90039 9.76667 4.90039 12C4.90039 14.2333 5.67539 16.125 7.22539 17.675C8.77539 19.225 10.6671 20 12.9004 20Z" 
                  fill={color}
                />
              </svg>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24 }}>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path 
                  d="M12.7002 13C15.4616 13 17.7002 10.7614 17.7002 8C17.7002 5.23858 15.4616 3 12.7002 3C9.93877 3 7.7002 5.23858 7.7002 8C7.7002 10.7614 9.93877 13 12.7002 13Z" 
                  stroke={color} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M20.7002 21C20.7002 18.8783 19.8573 16.8434 18.357 15.3431C16.8568 13.8429 14.8219 13 12.7002 13C10.5785 13 8.54363 13.8429 7.04334 15.3431C5.54305 16.8434 4.7002 18.8783 4.7002 21" 
                  stroke={color} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </View>
          ),
        }}
      />
      <Tabs.Screen 
        name='setting-up-store'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen 
        name='add-store'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen 
        name='edit-store'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='upload-documents'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='unpublished-store'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='my-shoppers'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='earnings-wallet'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='transactions'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='customers'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='customer-details'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='my-stores'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='view-shopper'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='select-category'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='add-product'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='support'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='order-details'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='finding-item'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='finding-items'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='item-substitution'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='complete-shopping'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='success'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='preview-page'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='shopping-list'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='completed-orders'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='verify-order-code'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='order-verified'
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
