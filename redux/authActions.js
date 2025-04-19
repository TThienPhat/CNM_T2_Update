// redux/authActions.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setUser, setToken, logout } from './userSlice';

// Thay đổi URL này cho phù hợp backend của bạn
const API_URL = 'http://localhost:8080';

export const checkAuthStatus = () => async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      dispatch(logout());
      return;
    }
    // Kiểm tra token hợp lệ bằng cách gọi API lấy thông tin user
    const response = await axios.get(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setUser(response.data));
    dispatch(setToken(token));
  } catch (error) {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  }
};

export const loginUser = (phone, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, { phone, password });
    const { token, user } = response.data;
    await AsyncStorage.setItem('token', token);
    dispatch(setToken(token));
    dispatch(setUser(user));
    return true;
  } catch (error) {
    return false;
  }
};

export const logoutUser = () => async (dispatch) => {
  await AsyncStorage.removeItem('token');
  dispatch(logout());
};
