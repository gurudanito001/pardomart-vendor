import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DashboardCard from "../../components/ui/DashboardCard";

export default function HomeScreen() {
  const handleSetupStore = () => {
    router.push("/setting-up-store" as any);
  };

  const handleCardPress = (cardType: string) => {
    console.log(`Navigate to ${cardType}`);
    switch (cardType) {
      case "shoppers":
        router.push("/my-shoppers" as any);
        break;
      case "store":
        router.push("/store" as any);
        break;
      case "orders":
        router.push("/orders" as any);
        break;
      case "transactions":
        router.push("/transactions" as any);
        break;
      case "customers":
        router.push("/customers" as any);
        break;
      case "wallet":
        router.push("/earnings-wallet" as any);
        break;
      case "stores":
        router.push("/my-stores" as any);
        break;
      case "completed-orders":
        router.push("/completed-orders" as any);
        break;
      // Add other navigation cases as needed
      default:
        console.log(`Navigation not implemented for ${cardType}`);
    }
  };

  const StoreIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M5.0002 4H19.0002C19.2835 4 19.5212 4.096 19.7132 4.288C19.9052 4.48 20.0009 4.71733 20.0002 5C19.9995 5.28267 19.9035 5.52033 19.7122 5.713C19.5209 5.90567 19.2835 6.00133 19.0002 6H5.0002C4.71686 6 4.47953 5.904 4.2882 5.712C4.09686 5.52 4.00086 5.28267 4.0002 5C3.99953 4.71733 4.09553 4.48 4.2882 4.288C4.48086 4.096 4.7182 4 5.0002 4ZM5.0002 20C4.71686 20 4.47953 19.904 4.2882 19.712C4.09686 19.52 4.00086 19.2827 4.0002 19V14H3.8252C3.50853 14 3.2502 13.879 3.0502 13.637C2.8502 13.395 2.78353 13.116 2.8502 12.8L3.8502 7.8C3.9002 7.56667 4.01686 7.375 4.2002 7.225C4.38353 7.075 4.59186 7 4.8252 7H19.1752C19.4085 7 19.6169 7.075 19.8002 7.225C19.9835 7.375 20.1002 7.56667 20.1502 7.8L21.1502 12.8C21.2169 13.1167 21.1502 13.3957 20.9502 13.637C20.7502 13.8783 20.4919 13.9993 20.1752 14H20.0002V19C20.0002 19.2833 19.9042 19.521 19.7122 19.713C19.5202 19.905 19.2829 20.0007 19.0002 20C18.7175 19.9993 18.4802 19.9033 18.2882 19.712C18.0962 19.5207 18.0002 19.2833 18.0002 19V14H14.0002V19C14.0002 19.2833 13.9042 19.521 13.7122 19.713C13.5202 19.905 13.2829 20.0007 13.0002 20H5.0002ZM6.0002 18H12.0002V14H6.0002V18Z"
        fill="black"
      />
    </svg>
  );

  const OrdersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <mask
        id="mask0_754_1114"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="2"
        y="2"
        width="20"
        height="20"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 7.5H21L20 21H4L3 7.5Z"
          fill="white"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 9.5V3H16V9.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 17H16"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </mask>
      <g mask="url(#mask0_754_1114)">
        <path d="M0 0H24V24H0V0Z" fill="black" />
      </g>
    </svg>
  );

  const TransactionsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <mask
        id="mask0_754_1130"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="2"
        y="2"
        width="20"
        height="20"
      >
        <path
          d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3Z"
          fill="white"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 15.5L13 17.5L17 12.5M7 7.5H17M7 11.5H11"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>
      <g mask="url(#mask0_754_1130)">
        <path d="M0 0H24V24H0V0Z" fill="black" />
      </g>
    </svg>
  );

  const ShoppersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 12.5H8.25C8.1837 12.5 8.12011 12.5263 8.07322 12.5732C8.02634 12.6201 8 12.6837 8 12.75V16.5C8 16.5929 7.97414 16.6839 7.92533 16.7629C7.87651 16.8419 7.80666 16.9057 7.72361 16.9472C7.64055 16.9887 7.54758 17.0063 7.4551 16.998C7.36262 16.9896 7.27428 16.9557 7.2 16.9L6.2 16.11C6.1556 16.0803 6.1034 16.0645 6.05 16.0645C5.9966 16.0645 5.9444 16.0803 5.9 16.11L4.9 16.9C4.82572 16.9557 4.73738 16.9896 4.6449 16.998C4.55242 17.0063 4.45945 16.9887 4.37639 16.9472C4.29334 16.9057 4.22349 16.8419 4.17467 16.7629C4.12586 16.6839 4.1 16.5929 4.1 16.5V12.75C4.1 12.6837 4.07366 12.6201 4.02678 12.5732C3.97989 12.5263 3.9163 12.5 3.85 12.5H1C0.734784 12.5 0.48043 12.6054 0.292893 12.7929C0.105357 12.9804 0 13.2348 0 13.5L0 23C0 23.2652 0.105357 23.5196 0.292893 23.7071C0.48043 23.8946 0.734784 24 1 24H11C11.2652 24 11.5196 23.8946 11.7071 23.7071C11.8946 23.5196 12 23.2652 12 23V13.5C12 13.2348 11.8946 12.9804 11.7071 12.7929C11.5196 12.6054 11.2652 12.5 11 12.5ZM21.3 8.36C21.26 8.33813 21.2262 8.30649 21.2017 8.26802C21.1772 8.22955 21.1629 8.18551 21.16 8.14C21.1609 8.09524 21.1733 8.05147 21.1961 8.01293C21.2189 7.97438 21.2512 7.94238 21.29 7.92C21.9292 7.54398 22.4592 7.00761 22.8275 6.36394C23.1958 5.72027 23.3897 4.9916 23.39 4.25C23.3646 3.13083 22.9086 2.06454 22.117 1.27296C21.3255 0.481381 20.2592 0.0254456 19.14 0C18.351 0.00689573 17.5792 0.230723 16.909 0.646977C16.2387 1.06323 15.6959 1.65587 15.34 2.36C15.319 2.40285 15.2862 2.4388 15.2455 2.46361C15.2047 2.48842 15.1577 2.50104 15.11 2.5H13.5C13.2348 2.5 12.9804 2.60536 12.7929 2.79289C12.6054 2.98043 12.5 3.23478 12.5 3.5C12.5 3.76522 12.6054 4.01957 12.7929 4.20711C12.9804 4.39464 13.2348 4.5 13.5 4.5H14.68C14.7397 4.50196 14.7967 4.52522 14.8407 4.56558C14.8847 4.60593 14.9129 4.66071 14.92 4.72C14.9961 5.35732 15.2156 5.96912 15.562 6.50948C15.9084 7.04984 16.3727 7.50473 16.92 7.84C16.9584 7.86448 16.9897 7.8986 17.0107 7.93896C17.0318 7.97933 17.0419 8.02451 17.04 8.07C17.0365 8.11534 17.0206 8.15885 16.9942 8.19585C16.9678 8.23285 16.9317 8.26195 16.89 8.28C16.0286 8.68096 15.2993 9.31906 14.7874 10.1196C14.2756 10.9201 14.0025 11.8499 14 12.8V15.8C14.0026 15.9318 14.0561 16.0575 14.1493 16.1507C14.2425 16.2439 14.3682 16.2974 14.5 16.3H16C16.0612 16.3023 16.1195 16.3269 16.1638 16.3693C16.208 16.4117 16.2351 16.4689 16.24 16.53L17 23.41C17.0146 23.5329 17.0733 23.6463 17.1653 23.7291C17.2573 23.8119 17.3762 23.8584 17.5 23.86H20.5C20.6244 23.8606 20.7445 23.8149 20.837 23.7317C20.9294 23.6484 20.9876 23.5338 21 23.41L21.69 16.55C21.695 16.4872 21.7236 16.4287 21.7699 16.386C21.8163 16.3434 21.877 16.3198 21.94 16.32H23.5C23.6318 16.3174 23.7575 16.2639 23.8507 16.1707C23.9439 16.0775 23.9974 15.9518 24 15.82V12.82C24.0037 11.9002 23.7537 10.9971 23.2773 10.2102C22.801 9.42335 22.1168 8.78312 21.3 8.36ZM21.22 4.5C21.2528 4.49153 21.2872 4.49153 21.32 4.5C21.3274 4.51739 21.3313 4.53609 21.3313 4.555C21.3313 4.5739 21.3274 4.59261 21.32 4.61C21.2136 5.09057 20.9519 5.52272 20.5753 5.83965C20.1987 6.15658 19.7282 6.34066 19.2365 6.36342C18.7449 6.38618 18.2594 6.24637 17.8551 5.96559C17.4509 5.6848 17.1503 5.27868 17 4.81C16.9833 4.77751 16.9746 4.74152 16.9746 4.705C16.9746 4.66848 16.9833 4.63249 17 4.6C17.0217 4.56972 17.0502 4.54493 17.0832 4.52757C17.1162 4.51021 17.1527 4.50077 17.19 4.5H21.22Z"
        fill="black"
      />
    </svg>
  );

  const CustomersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 17V19H2V17C2 17 2 13 9 13C16 13 16 17 16 17ZM12.5 7.50001C12.5 6.80777 12.2947 6.13108 11.9101 5.55551C11.5256 4.97994 10.9789 4.53133 10.3394 4.26643C9.69985 4.00152 8.99612 3.93221 8.31718 4.06726C7.63825 4.20231 7.01461 4.53565 6.52513 5.02513C6.03564 5.51462 5.7023 6.13826 5.56725 6.81719C5.4322 7.49612 5.50152 8.19986 5.76642 8.8394C6.03133 9.47894 6.47993 10.0256 7.0555 10.4102C7.63108 10.7947 8.30777 11 9 11C9.92826 11 10.8185 10.6313 11.4749 9.97488C12.1313 9.3185 12.5 8.42826 12.5 7.50001Z"
        fill="black"
      />
    </svg>
  );

  const WalletIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.0996 8.00404C21.043 8.00071 20.9826 7.99938 20.9186 8.00004H18.3936C16.3256 8.00004 14.5566 9.62804 14.5566 11.75C14.5566 13.872 16.3266 15.5 18.3936 15.5H20.9186C20.9826 15.5007 21.0433 15.4994 21.1006 15.496C21.5257 15.4704 21.9269 15.2911 22.2295 14.9916C22.5322 14.6921 22.7156 14.2928 22.7456 13.868C22.7496 13.808 22.7496 13.743 22.7496 13.683V9.81704C22.7496 9.75705 22.7496 9.69204 22.7456 9.63204C22.7156 9.20731 22.5322 8.80798 22.2295 8.50846C21.9269 8.20895 21.5247 8.02967 21.0996 8.00404ZM18.1726 12.75C18.7046 12.75 19.1356 12.302 19.1356 11.75C19.1356 11.198 18.7046 10.75 18.1726 10.75C17.6396 10.75 17.2086 11.198 17.2086 11.75C17.2086 12.302 17.6396 12.75 18.1726 12.75Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.918 17C20.9526 16.9986 20.987 17.0054 21.0184 17.0198C21.0499 17.0342 21.0775 17.0558 21.099 17.0829C21.1206 17.11 21.1354 17.1418 21.1424 17.1757C21.1493 17.2096 21.1481 17.2446 21.139 17.278C20.939 17.99 20.62 18.598 20.109 19.108C19.36 19.858 18.411 20.189 17.239 20.347C16.099 20.5 14.644 20.5 12.806 20.5H10.694C8.856 20.5 7.4 20.5 6.261 20.347C5.089 20.189 4.14 19.857 3.391 19.109C2.643 18.36 2.311 17.411 2.153 16.239C2 15.099 2 13.644 2 11.806V11.694C2 9.856 2 8.4 2.153 7.26C2.311 6.088 2.643 5.139 3.391 4.39C4.14 3.642 5.089 3.31 6.261 3.152C7.401 3 8.856 3 10.694 3H12.806C14.644 3 16.1 3 17.239 3.153C18.411 3.311 19.36 3.643 20.109 4.391C20.62 4.903 20.939 5.51 21.139 6.222C21.1481 6.25537 21.1493 6.29042 21.1424 6.32432C21.1354 6.35822 21.1206 6.39 21.099 6.41708C21.0775 6.44417 21.0499 6.46579 21.0184 6.4802C20.987 6.4946 20.9526 6.50139 20.918 6.5H18.394C15.557 6.5 13.057 8.74 13.057 11.75C13.057 14.76 15.557 17 18.394 17H20.918ZM5.75 7C5.55109 7 5.36032 7.07902 5.21967 7.21967C5.07902 7.36032 5 7.55109 5 7.75C5 7.94891 5.07902 8.13968 5.21967 8.28033C5.36032 8.42098 5.55109 8.5 5.75 8.5H9.75C9.94891 8.5 10.1397 8.42098 10.2803 8.28033C10.421 8.13968 10.5 7.94891 10.5 7.75C10.5 7.55109 10.421 7.36032 10.2803 7.21967C10.1397 7.07902 9.94891 7 9.75 7H5.75Z"
        fill="black"
      />
    </svg>
  );

  const ResourcesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M16.5 10.25L21 12.5L12 17L3 12.5L7.5 10.25M16.5 15.25L21 17.5L12 22L3 17.5L7.5 15.25M12 3L21 7.5L12 12L3 7.5L12 3Z"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
      <path
        d="M13.4263 3.74091C13.4509 3.84242 13.4991 3.93668 13.567 4.01605C13.6349 4.09541 13.7206 4.15763 13.817 4.19765C13.9135 4.23767 14.0181 4.25435 14.1222 4.24634C14.2263 4.23834 14.3271 4.20587 14.4163 4.15158C16.6521 2.79033 19.2105 5.34783 17.8492 7.58358C17.7949 7.67274 17.7624 7.77345 17.7544 7.87753C17.7463 7.98161 17.7629 8.08612 17.8028 8.18257C17.8428 8.27903 17.9049 8.36471 17.9841 8.43265C18.0634 8.50059 18.1576 8.54887 18.259 8.57358C20.8027 9.1905 20.8027 12.8086 18.259 13.4264C18.1575 13.451 18.0632 13.4992 17.9839 13.5671C17.9045 13.635 17.8423 13.7207 17.8023 13.8171C17.7622 13.9136 17.7455 14.0182 17.7536 14.1223C17.7616 14.2264 17.794 14.3272 17.8483 14.4164C19.2096 16.6522 16.6521 19.2106 14.4163 17.8493C14.3272 17.795 14.2265 17.7625 14.1224 17.7545C14.0183 17.7464 13.9138 17.763 13.8173 17.8029C13.7209 17.8429 13.6352 17.905 13.5673 17.9842C13.4993 18.0635 13.451 18.1577 13.4263 18.2591C12.8094 20.8028 9.19132 20.8028 8.57349 18.2591C8.54889 18.1576 8.50069 18.0633 8.4328 17.9839C8.36491 17.9046 8.27924 17.8424 8.18277 17.8023C8.0863 17.7623 7.98175 17.7456 7.87762 17.7536C7.77348 17.7617 7.67271 17.7941 7.58349 17.8484C5.34774 19.2097 2.78932 16.6522 4.15057 14.4164C4.20487 14.3273 4.23737 14.2265 4.24543 14.1225C4.25349 14.0184 4.23688 13.9139 4.19696 13.8174C4.15704 13.721 4.09492 13.6353 4.01567 13.5673C3.93641 13.4994 3.84225 13.4511 3.74082 13.4264C1.19707 12.8095 1.19707 9.19141 3.74082 8.57358C3.84232 8.54898 3.93659 8.50078 4.01595 8.43289C4.09532 8.365 4.15754 8.27933 4.19756 8.18286C4.23757 8.08639 4.25426 7.98184 4.24625 7.87771C4.23825 7.77357 4.20578 7.6728 4.15149 7.58358C2.79024 5.34783 5.34774 2.78941 7.58349 4.15066C7.67256 4.20537 7.77331 4.2382 7.87751 4.24647C7.98171 4.25474 8.08639 4.23821 8.18297 4.19823C8.27955 4.15826 8.36529 4.09598 8.43317 4.01649C8.50105 3.937 8.54913 3.84256 8.57349 3.74091C9.1904 1.19716 12.8085 1.19716 13.4263 3.74091ZM10.9999 8.25C10.2706 8.25 9.57108 8.53973 9.05536 9.05545C8.53964 9.57118 8.2499 10.2706 8.2499 11C8.2499 11.7293 8.53964 12.4288 9.05536 12.9445C9.57108 13.4603 10.2706 13.75 10.9999 13.75C11.7292 13.75 12.4287 13.4603 12.9444 12.9445C13.4602 12.4288 13.7499 11.7293 13.7499 11C13.7499 10.2706 13.4602 9.57118 12.9444 9.05545C12.4287 8.53973 11.7292 8.25 10.9999 8.25Z"
        fill="black"
      />
    </svg>
  );

  const CompletedOrdersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M23.7773 17.0273L17.25 23.5664L14.0977 20.4023L15.1523 19.3477L17.25 21.4336L22.7227 15.9727L23.7773 17.0273ZM12 7.5H7.5V6H12V7.5ZM12 10.5H7.5V9H12V10.5ZM7.5 12H12V13.5H7.5V12ZM6 7.5H4.5V6H6V7.5ZM6 10.5H4.5V9H6V10.5ZM4.5 12H6V13.5H4.5V12ZM13.5 7.5V1.5H3V22.5H13.5V24H1.5V0H14.5664L21 6.43359V15L19.5 16.5V7.5H13.5ZM15 6H18.4336L15 2.56641V6Z" fill="black"/>
    </svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#06888C" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <View style={styles.avatarIcon}>
                  <svg width="40" height="41" viewBox="0 0 40 41" fill="none">
                    <circle cx="20" cy="20.9581" r="20" fill="#BFE3C6" />
                    <path
                      d="M30 20.9657C35.5228 20.9657 40 16.2723 40 10.4828C40 4.69332 35.5228 0 30 0C24.4772 0 20 4.69332 20 10.4828C20 16.2723 24.4772 20.9657 30 20.9657Z"
                      fill="white"
                    />
                    <path
                      d="M33.542 14.85H26.458C26.182 14.8497 25.9174 14.7346 25.7222 14.53C25.527 14.3255 25.4173 14.0481 25.417 13.7587V8.5173C25.417 8.22778 25.5266 7.95011 25.7218 7.74529C25.917 7.54047 26.1818 7.42527 26.458 7.42499H27.868L28.378 6.35574C28.4123 6.28292 28.4655 6.22169 28.5315 6.17905C28.5974 6.13642 28.6735 6.11409 28.751 6.11463H31.251C31.3284 6.11446 31.4043 6.13693 31.4702 6.17953C31.5361 6.22212 31.5894 6.28315 31.624 6.35574L32.133 7.42499H33.542C33.8182 7.42499 34.0831 7.53993 34.2784 7.74455C34.4738 7.94917 34.5837 8.22673 34.584 8.51625V13.7577C34.584 14.0474 34.4742 14.3252 34.2788 14.53C34.0834 14.7349 33.8183 14.85 33.542 14.85Z"
                      fill="#06888C"
                    />
                  </svg>
                </View>
              </View>
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Good morning</Text>
              <View style={styles.storeInfoContainer}>
                <Text style={styles.storeInfo}>Set up Store info</Text>
                <View>
                  <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.28935 11.1361L2.63235 5.47906L4.04635 4.06506L8.99635 9.01506L13.9464 4.06506L15.3604 5.47906L9.70335 11.1361C9.51582 11.3235 9.26152 11.4288 8.99635 11.4288C8.73119 11.4288 8.47688 11.3235 8.28935 11.1361Z"
                      fill="white"
                    />
                  </svg>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path
                  d="M8.645 20.9791C8.86103 21.701 9.30417 22.334 9.90858 22.784C10.513 23.234 11.2464 23.4771 12 23.4771C12.7536 23.4771 13.487 23.234 14.0914 22.784C14.6958 22.334 15.139 21.701 15.355 20.9791H8.645ZM3 19.9791H21V16.9791L19 13.9791V8.97906C19 8.05981 18.8189 7.14956 18.4672 6.30028C18.1154 5.451 17.5998 4.67933 16.9497 4.02932C16.2997 3.37931 15.5281 2.86369 14.6788 2.51191C13.8295 2.16013 12.9193 1.97906 12 1.97906C11.0807 1.97906 10.1705 2.16013 9.32122 2.51191C8.47194 2.86369 7.70026 3.37931 7.05025 4.02932C6.40024 4.67933 5.88463 5.451 5.53284 6.30028C5.18106 7.14956 5 8.05981 5 8.97906V13.9791L3 16.9791V19.9791Z"
                  fill="white"
                />
              </svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.8 10.6591C19.49 7.4791 17.61 2.47908 11.8 2.47908C5.99002 2.47908 4.11001 7.4791 3.80002 10.6591C2.71252 11.0718 1.9952 12.1159 2.00002 13.2791V14.6791C2.00002 16.2255 3.25365 17.4791 4.80001 17.4791C6.34642 17.4791 7.60004 16.2255 7.60004 14.6791V13.2791C7.59498 12.141 6.90404 11.1184 5.85001 10.6891C6.05002 8.84906 7.03004 4.4791 11.8 4.4791C16.57 4.4791 17.54 8.84906 17.74 10.6891C16.6882 11.1193 16.0007 12.1426 16 13.2791V14.6791C16.0022 15.206 16.1524 15.7216 16.4335 16.1672C16.7147 16.6128 17.1154 16.9703 17.59 17.1991C17.17 17.9891 16.1 19.0591 13.47 19.3791C12.9443 18.5808 11.9272 18.2661 11.0424 18.628C10.1578 18.9899 9.65279 19.9272 9.83729 20.8651C10.0218 21.803 10.8442 22.4791 11.8 22.4791C12.1704 22.477 12.5329 22.3722 12.8472 22.1762C13.1615 21.9802 13.4152 21.7008 13.58 21.3691C17.87 20.8791 19.24 18.6691 19.67 17.3691C20.8333 16.9922 21.6157 15.9018 21.6 14.6791V13.2791C21.6048 12.1159 20.8875 11.0718 19.8 10.6591Z"
                  fill="white"
                />
              </svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Setup Banner */}
        <View style={styles.setupBanner}>
          <View style={styles.setupContent}>
            <View style={styles.setupIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6V4H20V6H4ZM4 20V14H3V12L4 7H20L21 12V14H20V20H18V14H14V20H4ZM6 18H12V14H6V18ZM5.05 12H18.95L18.35 9H5.65L5.05 12Z"
                  fill="black"
                />
              </svg>
            </View>
            <Text style={styles.setupText}>Finish setting up your store</Text>
          </View>
          <TouchableOpacity onPress={handleSetupStore}>
            <AntDesign name="right" size={24} color="rgba(0,0,0,0.4)" />
          </TouchableOpacity>
        </View>

        {/* Dashboard Grid */}
        <View style={styles.dashboardGrid}>
          <View style={styles.gridRow}>
            <DashboardCard
              title="My Store"
              subtitle="Checkout your store informations now"
              iconComponent={<StoreIcon />}
              onPress={() => handleCardPress("store")}
            />
            <DashboardCard
              title="My Orders"
              subtitle="Checkout your store informations now"
              iconComponent={<OrdersIcon />}
              onPress={() => handleCardPress("orders")}
            />
          </View>

          <View style={styles.gridRow}>
            <DashboardCard
              title="Transactions"
              subtitle="Checkout your store informations now"
              iconComponent={<TransactionsIcon />}
              onPress={() => handleCardPress("transactions")}
            />
            <DashboardCard
              title="My Shoppers"
              subtitle="Checkout your store informations now"
              iconComponent={<ShoppersIcon />}
              onPress={() => handleCardPress("shoppers")}
            />
          </View>

          <View style={styles.gridRow}>
            <DashboardCard
              title="Customers"
              subtitle="Checkout your store informations now"
              iconComponent={<CustomersIcon />}
              onPress={() => handleCardPress("customers")}
            />
            <DashboardCard
              title="Earnings & Wallet"
              subtitle="Checkout your store informations now"
              iconComponent={<WalletIcon />}
              onPress={() => handleCardPress("wallet")}
            />
          </View>

          <View style={styles.gridRow}>
            <DashboardCard
              title="Resources"
              subtitle="Checkout your store informations now"
              iconComponent={<ResourcesIcon />}
              onPress={() => handleCardPress("resources")}
            />
            <DashboardCard
              title="My Settings"
              subtitle="Checkout your store informations now"
              iconComponent={<SettingsIcon />}
              onPress={() => handleCardPress("settings")}
            />
          </View>

          <View style={styles.gridRow}>
            <DashboardCard
              title="Completed Orders"
              subtitle="View all completed Orders and Verify Orders"
              iconComponent={<CompletedOrdersIcon />}
              onPress={() => handleCardPress("completed-orders")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#06888C",
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#BFE3C6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: {
    position: "absolute",
  },
  greetingContainer: {
    gap: 1,
  },
  greeting: {
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#FFF",
  },
  storeInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  storeInfo: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Raleway",
    color: "#FFF",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  setupBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 21,
    marginBottom: 17,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DA5742",
    backgroundColor: "#FFF",
  },
  setupContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  setupIcon: {
    width: 36,
    height: 36,
    borderRadius: 32,
    backgroundColor: "#B4DBDD",
    justifyContent: "center",
    alignItems: "center",
  },
  setupText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Open Sans",
    color: "#000",
  },
  dashboardGrid: {
    paddingHorizontal: 23,
    gap: 17,
    paddingBottom: 20,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  dashboardCard: {
    flex: 1,
    height: 158,
    borderRadius: 16,
    backgroundColor: "#F0F8F8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
    paddingBottom: 18,
    flex: 1,
    gap: 15,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(6, 136, 140, 0.30)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTextContainer: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Raleway",
    color: "#000",
    lineHeight: 22,
  },
  cardSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  cardSubtitle: {
    flex: 1,
    fontSize: 8,
    fontWeight: "400",
    fontFamily: "Raleway",
    color: "#444",
    lineHeight: 12,
  },
  arrowIcon: {
    width: 12,
    height: 24,
  },
});
