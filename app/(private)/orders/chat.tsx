import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { apiConfig } from '../../../api/config';
import { OrderApi } from '../../../api/endpoints/order-api';
import { MessageWithRelations, User } from '../../../api/models';

const MessageItem = ({ item, currentUserId }: { item: MessageWithRelations; currentUserId?: string }) => {
  const isMyMessage = item.senderId === currentUserId;
  const date = new Date(item.createdAt || Date.now());
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.otherMessageRow]}>
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble]}>
        <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>{item.content}</Text>
        <Text style={styles.timestamp}>{timeString}</Text>
      </View>
    </View>
  );
};

export default function MessagesScreen() {
  const router = useRouter();
  const { orderId, customer: customerString } = useLocalSearchParams<{ orderId: string; customer: string }>();
  const { state } = useAuth();
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  
  const customer = useMemo(() => {
    try {
      return customerString ? JSON.parse(customerString) as User : null;
    } catch (e) {
      return null;
    }
  }, [customerString]);

  const orderApi = useMemo(() => new OrderApi(apiConfig), []);

  // Mark messages as read on mount
  useEffect(() => {
    if (orderId) {
      orderApi.orderOrderIdMessagesReadPatch(orderId).catch((err) => {
        console.error('Failed to mark messages as read:', err);
      });
    }
  }, [orderId, orderApi]);

  // Fetch messages every 10 seconds
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', orderId, state?.user?.id, customer?.id],
    queryFn: async () => {
      if (!orderId || !state?.user?.id || !customer?.id) return [];
      const response = await orderApi.orderOrderIdMessagesGet(orderId, state.user.id, customer.id);
      // Sort by createdAt descending for inverted list (newest at bottom visually)
      return response.data.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    },
    enabled: !!orderId && !!state?.user?.id && !!customer?.id,
    refetchInterval: 10000,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!orderId || !customer?.id) throw new Error('Missing data');
      // Call the API endpoint: /order/{orderId}/messages
      console.log('Sending message:', { content, recipientId: customer.id, orderId });
      return orderApi.orderOrderIdMessagesPost({ content, recipientId: customer.id }, orderId);
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages', orderId] });
      setInputText('');
      // Scroll to the bottom (which is the top of the inverted list)
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || // Message from the backend API
        err?.response?.data?.error ||   // Alternative backend error field
        err?.message ||                 // Standard JS Error message (e.g., Network Error)
        'Failed to send message.'; // Fallback message

      toast.error(errorMessage);
    }
  });

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      sendMessageMutation.mutate(inputText);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#100A37" />
        </Pressable>
        <Image
          source={{ uri: customer?.image || 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
          style={styles.avatar}
        />
        <View style={styles.headerUserInfo}>
          <Text style={styles.userName}>{customer?.name || 'Customer'}</Text>
          <Text style={styles.userStatus}>Online</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton}>
            <Ionicons name="videocam-outline" size={24} color="#100A37" />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Ionicons name="call-outline" size={22} color="#100A37" />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {isLoading && messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#F48022" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => <MessageItem item={item} currentUserId={state?.user?.id} />}
            keyExtractor={(item) => item.id || Math.random().toString()}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            inverted
          />
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <Pressable style={styles.inputButton}>
            <Ionicons name="add" size={28} color="#484C52" />
          </Pressable>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#7C7B7B"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable style={styles.inputButton}>
            <Ionicons name="camera-outline" size={24} color="#484C52" />
          </Pressable>
          <Pressable 
            style={[styles.inputButton, styles.sendButton, sendMessageMutation.isPending && { opacity: 0.7 }]} 
            onPress={handleSend}
            disabled={sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFF" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerUserInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: '#100A37',
  },
  userStatus: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#01891C', // App's green color
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 5,
  },
  messageList: {
    flex: 1,
    backgroundColor: '#FAFAFB',
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#E3F5E6', // A light green
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: '#F0F0F1', // A light grey
    borderBottomLeftRadius: 5,
  },
  myMessageText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#100A37',
  },
  otherMessageText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#100A37',
  },
  timestamp: {
    fontSize: 10,
    color: '#7C7B7B',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#FFF',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F0F0F1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    marginHorizontal: 8,
    maxHeight: 100,
  },
  inputButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#F48022', // App's orange color
    borderRadius: 20,
    padding: 10,
  },
});
