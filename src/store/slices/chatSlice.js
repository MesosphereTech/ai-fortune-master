import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSession: {
    id: null,
    messages: [],
    status: 'idle', // 'idle' | 'collecting' | 'analyzing' | 'completed'
    userInfo: null,
  },
  sessions: [],
  isTyping: false,
  isLoading: false,
  inputText: '',
  collectionSteps: {
    current: 0,
    total: 5,
    steps: ['姓名', '性别', '出生日期', '出生时间', '出生地点'],
  },
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startNewSession: (state) => {
      const sessionId = Date.now().toString();
      state.currentSession = {
        id: sessionId,
        messages: [],
        status: 'collecting',
        userInfo: null,
      };
      state.collectionSteps.current = 0;
    },
    addMessage: (state, action) => {
      state.currentSession.messages.push({
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    updateUserInfo: (state, action) => {
      state.currentSession.userInfo = {
        ...state.currentSession.userInfo,
        ...action.payload,
      };
    },
    nextCollectionStep: (state) => {
      if (state.collectionSteps.current < state.collectionSteps.total - 1) {
        state.collectionSteps.current += 1;
      }
    },
    setSessionStatus: (state, action) => {
      state.currentSession.status = action.payload;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setInputText: (state, action) => {
      state.inputText = action.payload;
    },
    saveSession: (state) => {
      if (state.currentSession.id) {
        const existingIndex = state.sessions.findIndex(
          session => session.id === state.currentSession.id
        );
        if (existingIndex !== -1) {
          state.sessions[existingIndex] = { ...state.currentSession };
        } else {
          state.sessions.unshift({ ...state.currentSession });
        }
      }
    },
    loadSession: (state, action) => {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        state.currentSession = { ...session };
      }
    },
    clearCurrentSession: (state) => {
      state.currentSession = {
        id: null,
        messages: [],
        status: 'idle',
        userInfo: null,
      };
      state.collectionSteps.current = 0;
    },
    deleteSession: (state, action) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  startNewSession,
  addMessage,
  updateUserInfo,
  nextCollectionStep,
  setSessionStatus,
  setTyping,
  setLoading,
  setInputText,
  saveSession,
  loadSession,
  clearCurrentSession,
  deleteSession,
  setError,
  clearError,
} = chatSlice.actions;

export const selectCurrentSession = (state) => state.chat.currentSession;
export const selectCurrentMessages = (state) => state.chat.currentSession.messages;
export const selectSessionStatus = (state) => state.chat.currentSession.status;
export const selectIsTyping = (state) => state.chat.isTyping;
export const selectIsLoading = (state) => state.chat.isLoading;
export const selectInputText = (state) => state.chat.inputText;
export const selectCollectionSteps = (state) => state.chat.collectionSteps;
export const selectChatError = (state) => state.chat.error;
export const selectSessionHistory = (state) => state.chat.sessions;

export default chatSlice.reducer;
 