import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  theme: 'light',
  language: 'zh-CN',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  apiConfig: {
    provider: 'tongyi',
    model: 'qwen-plus',
    apiKey: null,
    baseUrl: 'https://dashscope.aliyuncs.com',
  },
  appSettings: {
    autoSave: true,
    debugMode: false,
    analytics: true,
  },
  networkStatus: 'online',
  lastSync: null,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateApiConfig: (state, action) => {
      state.apiConfig = { ...state.apiConfig, ...action.payload };
    },
    updateAppSettings: (state, action) => {
      state.appSettings = { ...state.appSettings, ...action.payload };
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
    },
    setLastSync: (state, action) => {
      state.lastSync = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAppSettings: (state) => {
      return { ...initialState, apiConfig: state.apiConfig };
    },
  },
});

export const {
  setLoading,
  setTheme,
  setLanguage,
  updateNotificationSettings,
  updateApiConfig,
  updateAppSettings,
  setNetworkStatus,
  setLastSync,
  setError,
  clearError,
  resetAppSettings,
} = appSlice.actions;

export const selectIsLoading = (state) => state.app.isLoading;
export const selectTheme = (state) => state.app.theme;
export const selectLanguage = (state) => state.app.language;
export const selectNotificationSettings = (state) => state.app.notifications;
export const selectApiConfig = (state) => state.app.apiConfig;
export const selectAppSettings = (state) => state.app.appSettings;
export const selectNetworkStatus = (state) => state.app.networkStatus;
export const selectLastSync = (state) => state.app.lastSync;
export const selectAppError = (state) => state.app.error;

export default appSlice.reducer;
 