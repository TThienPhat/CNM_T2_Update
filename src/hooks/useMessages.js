// src/hooks/useMessages.js
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '../services/socket';
import api from '../services/api';

export const useMessages = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = getSocket();
  const currentUser = useSelector(state => state.user);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Lấy thông tin người nhận
    socket.emit('message-page', conversationId);
    
    // Lắng nghe tin nhắn
    socket.on('message', (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });

    // Đánh dấu tin nhắn đã xem
    socket.emit('seen', conversationId);

    return () => {
      socket.off('message');
    };
  }, [socket, conversationId]);

  const sendMessage = async (text, imageUrl = '', videoUrl = '') => {
    if (!socket || !text && !imageUrl && !videoUrl) return;

    socket.emit('new massage', {
      text,
      imageUrl,
      videoUrl,
      sender: currentUser._id,
      receiver: conversationId,
      msgByUserId: currentUser._id
    });
  };

  return { messages, loading, sendMessage };
};
