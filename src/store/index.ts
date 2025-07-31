import { configureStore } from '@reduxjs/toolkit';
import mcpReducer from './mcpSlice';

export const store = configureStore({
  reducer: {
    mcp: mcpReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['mcp/addMessage'],
        ignoredPaths: ['mcp.messages.timestamp'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;