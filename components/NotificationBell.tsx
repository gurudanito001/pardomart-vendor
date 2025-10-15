import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNotificationCount } from '../hooks/useNotificationCount';

interface NotificationBellProps {
  from: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ from }) => {
  const router = useRouter();
  const { count } = useNotificationCount();

  const handlePress = () => {
    router.push({ pathname: '/(private)/shared/notifications' as any, params: { from } } as never);
  };

  return (
    <Pressable onPress={handlePress}>
      <Svg width="22" height="22" viewBox="0 0 24 25" fill="none">
        <Path
          d="M8.645 20.9791C8.86103 21.701 9.30417 22.334 9.90858 22.784C10.513 23.234 11.2464 23.4771 12 23.4771C12.7536 23.4771 13.487 23.234 14.0914 22.784C14.6958 22.334 15.139 21.701 15.355 20.9791H8.645ZM3 19.9791H21V16.9791L19 13.9791V8.97906C19 8.05981 18.8189 7.14956 18.4672 6.30028C18.1154 5.451 17.5998 4.67933 16.9497 4.02932C16.2997 3.37931 15.5281 2.86369 14.6788 2.51191C13.8295 2.16013 12.9193 1.97906 12 1.97906C11.0807 1.97906 10.1705 2.16013 9.32122 2.51191C8.47194 2.86369 7.70026 3.37931 7.05025 4.02932C6.40024 4.67933 5.88463 5.451 5.53284 6.30028C5.18106 7.14956 5 8.05981 5 8.97906V13.9791L3 16.9791V19.9791Z"
          fill="white"
        />
      </Svg>

      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#F48022',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'OpenSans-Bold',
  },
});

export default NotificationBell;
