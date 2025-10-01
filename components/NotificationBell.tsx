import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
//import { useNotificationCount } from '../hooks/api/useNotificationCount';

interface NotificationBellProps {
  from: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ from }) => {
  const router = useRouter();
  //const { count } = useNotificationCount();

  const handlePress = () => {
    return;
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Ionicons name="notifications-outline" size={24} color="#000" />
      {/* {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )} */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B4BED4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
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
