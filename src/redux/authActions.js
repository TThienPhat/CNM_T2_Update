
import api from '../services/api';
import { setUser, setToken, logout } from './userSlice';
import { initSocket, disconnectSocket } from '../services/socket';

// Đăng nhập
export const loginUser = (phone, password) => async (dispatch) => {
  try {
    const response = await api.post('/api/login', { phone, password });
    const { token, user } = response.data;
    
    // Lưu token vào localStorage
    localStorage.setItem('token', token);
    
    // Cập nhật Redux store
    dispatch(setToken(token));
    dispatch(setUser(user));
    
    // Khởi tạo kết nối Socket.IO
    initSocket(token);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Đăng nhập thất bại'
    };
  }
};

// Đăng xuất
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  disconnectSocket();
  dispatch(logout());
};

// Kiểm tra trạng thái đăng nhập khi load trang
export const checkAuthStatus = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.get('/api/me');
    dispatch(setUser(response.data));
    dispatch(setToken(token));
    initSocket(token);
  } catch (error) {
    localStorage.removeItem('token');
    dispatch(logout());
  }
};
