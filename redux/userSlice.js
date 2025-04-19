import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: "",
  phone: "",
  profile_pic: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.name = "";
      state.phone = "";
      state.profile_pic = "";
      state.token = "";
    },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
