import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Thay đổi domain này cho phù hợp backend của bạn
const API_URL = 'http://your-api-domain.com';
const SOCKET_URL = 'http://your-api-domain.com';

const Screen06 = ({ navigation, route }) => {
  const contact = route.params?.contact;
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const socket = useRef(null);
  const flatListRef = useRef();

  // Lấy user hiện tại từ AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('user').then(userStr => {
      if (userStr) setCurrentUser(JSON.parse(userStr));
    });
  }, []);

  // Kết nối socket và join room
  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token');
      socket.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
      });

      socket.current.on('connect', () => {
        setIsConnected(true);
        joinChatRoom();
      });

      socket.current.on('disconnect', () => setIsConnected(false));
      socket.current.on('private message', handleNewMessage);
      socket.current.on('typing', () => setIsTyping(true));
      socket.current.on('stop typing', () => setIsTyping(false));
    };

    init();

    return () => {
      socket.current?.disconnect();
    };
    // eslint-disable-next-line
  }, [contact]);

  // Join room riêng cho 2 user
  const joinChatRoom = async () => {
    const user = await AsyncStorage.getItem('user');
    const { _id: userId } = JSON.parse(user);
    const roomId = [userId, contact._id].sort().join('_');
    socket.current.emit('join room', roomId);
    fetchInitialMessages();
  };

  // Lấy lịch sử tin nhắn qua API
  const fetchInitialMessages = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/messages/${contact._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages.map(msg => ({
        ...msg,
        isMe: msg.sender === currentUser?._id,
      })));
    } catch (err) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nhận tin nhắn mới
  const handleNewMessage = (msg) => {
    setMessages(prev => [...prev, {
      ...msg,
      isMe: msg.sender === currentUser?._id,
    }]);
    scrollToBottom();
  };

  // Gửi tin nhắn qua socket
  const handleSend = () => {
    if (!message.trim() || !isConnected || !currentUser) return;
    const msgData = {
      text: message,
      sender: currentUser._id,
      recipient: contact._id,
      timestamp: new Date().toISOString(),
    };
    // Optimistic update
    setMessages(prev => [...prev, { ...msgData, isMe: true }]);
    setMessage('');
    socket.current.emit('private message', msgData);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Image source={{ uri: contact.avatar || contact.profile_pic }} style={styles.avatar} />
        <Text style={styles.name}>{contact.name}</Text>
        {isTyping && <Text style={styles.typingText}>Đang soạn tin...</Text>}
      </View>
      {/* Danh sách tin nhắn */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.isMe ? styles.myMessage : styles.theirMessage,
              ]}
            >
              {!item.isMe && (
                <Image
                  source={{ uri: contact.avatar || contact.profile_pic }}
                  style={styles.messageAvatar}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  item.isMe ? styles.myBubble : styles.theirBubble,
                ]}
              >
                <Text style={item.isMe ? styles.myText : styles.theirText}>
                  {item.text}
                </Text>
                <Text style={styles.time}>
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={scrollToBottom}
        />
      )}
      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={message}
          onChangeText={setMessage}
          multiline
          onFocus={() => socket.current.emit('typing', contact._id)}
          onBlur={() => socket.current.emit('stop typing', contact._id)}
        />
        <TouchableOpacity onPress={handleSend} disabled={!message.trim()}>
          <Ionicons name="send" size={24} color={message.trim() ? '#007AFF' : '#ccc'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 15 },
  name: { fontSize: 18, fontWeight: '500' },
  typingText: { fontSize: 12, color: '#666', fontStyle: 'italic', marginLeft: 10 },
  messagesContainer: { padding: 15 },
  messageContainer: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 15 },
  myMessage: { justifyContent: 'flex-end' },
  theirMessage: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 15 },
  myBubble: { backgroundColor: '#007AFF', marginLeft: 'auto' },
  theirBubble: { backgroundColor: '#f0f0f0', marginRight: 'auto' },
  myText: { color: '#fff' },
  theirText: { color: '#333' },
  time: { fontSize: 10, color: '#666', marginTop: 5, alignSelf: 'flex-end' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    padding: 15, borderTopWidth: 1, borderTopColor: '#eee',
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#ddd',
    borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100,
  },
  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
});

export default Screen06;
