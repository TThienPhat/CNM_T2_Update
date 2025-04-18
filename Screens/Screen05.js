import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Thay đổi domain này cho phù hợp backend của bạn
const API_URL = 'http://your-api-domain.com';

const Screen05 = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  // Lấy danh sách liên hệ đã chat từ API
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Giả sử backend trả về mảng [{_id, name, avatar}]
        setContacts(res.data);
      } catch (err) {
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Lọc theo tên
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      {/* Danh sách liên hệ */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => navigation.navigate('Screen06', { contact: item })}
            >
              <Image source={{ uri: item.avatar || item.profile_pic }} style={styles.avatar} />
              <Text style={styles.contactName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      {/* Tab điều hướng phía dưới */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="chatbubbles" size={22} color="#007AFF" />
          <Text style={[styles.tabText, { color: '#007AFF' }]}>Tin nhắn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Screen04')}
        >
          <Ionicons name="person" size={22} color="#888" />
          <Text style={styles.tabText}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 15,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  listContent: { paddingBottom: 70 },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  contactName: { fontSize: 16, fontWeight: '500' },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
  },
  tabItem: { flex: 1, alignItems: 'center', padding: 5 },
  tabText: { fontSize: 12, marginTop: 5 },
});

export default Screen05;
