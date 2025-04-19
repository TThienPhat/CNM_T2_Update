// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
// Import các slice reducer của bạn ở đây, ví dụ:
// import userReducer from './userSlice';
// import messageReducer from './messageSlice';

export const store = configureStore({
  reducer: {
    // user: userReducer,
    // messages: messageReducer,
    // Thêm các slice khác nếu có
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt warning nếu bạn lưu object không serializable (ví dụ: socket)
    }),
});
