import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  results: [],
  currentResult: null,
  favorites: [],
  analysisHistory: [],
  isAnalyzing: false,
  analysisProgress: 0,
  error: null,
};

const fortuneSlice = createSlice({
  name: 'fortune',
  initialState,
  reducers: {
    startAnalysis: (state) => {
      state.isAnalyzing = true;
      state.analysisProgress = 0;
      state.error = null;
    },
    updateAnalysisProgress: (state, action) => {
      state.analysisProgress = action.payload;
    },
    setAnalysisResult: (state, action) => {
      const result = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };
      state.currentResult = result;
      state.results.unshift(result);
      state.isAnalyzing = false;
      state.analysisProgress = 100;
    },
    addToFavorites: (state, action) => {
      const resultId = action.payload;
      const result = state.results.find(r => r.id === resultId);
      if (result) {
        result.isFavorite = true;
        if (!state.favorites.find(f => f.id === resultId)) {
          state.favorites.push(result);
        }
      }
    },
    removeFromFavorites: (state, action) => {
      const resultId = action.payload;
      const result = state.results.find(r => r.id === resultId);
      if (result) {
        result.isFavorite = false;
      }
      state.favorites = state.favorites.filter(f => f.id !== resultId);
    },
    deleteResult: (state, action) => {
      const resultId = action.payload;
      state.results = state.results.filter(r => r.id !== resultId);
      state.favorites = state.favorites.filter(f => f.id !== resultId);
      if (state.currentResult?.id === resultId) {
        state.currentResult = null;
      }
    },
    setCurrentResult: (state, action) => {
      state.currentResult = action.payload;
    },
    addAnalysisHistory: (state, action) => {
      state.analysisHistory.unshift({
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isAnalyzing = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
  },
});

export const {
  startAnalysis,
  updateAnalysisProgress,
  setAnalysisResult,
  addToFavorites,
  removeFromFavorites,
  deleteResult,
  setCurrentResult,
  addAnalysisHistory,
  setError,
  clearError,
  clearCurrentResult,
} = fortuneSlice.actions;

export const selectFortuneResults = (state) => state.fortune.results;
export const selectCurrentResult = (state) => state.fortune.currentResult;
export const selectFavorites = (state) => state.fortune.favorites;
export const selectIsAnalyzing = (state) => state.fortune.isAnalyzing;
export const selectAnalysisProgress = (state) => state.fortune.analysisProgress;
export const selectFortuneError = (state) => state.fortune.error;
export const selectAnalysisHistory = (state) => state.fortune.analysisHistory;

export default fortuneSlice.reducer;
 