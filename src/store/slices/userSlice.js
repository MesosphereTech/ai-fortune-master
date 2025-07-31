import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  isAuthenticated: false,
  preferences: {
    theme: 'light',
    language: 'zh-CN',
    notifications: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
    },
    updateUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const {
  setUserProfile,
  updateUserProfile,
  clearUserProfile,
  updatePreferences,
} = userSlice.actions;

export const selectUserProfile = (state) => state.user.profile;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserPreferences = (state) => state.user.preferences;

export default userSlice.reducer;
 