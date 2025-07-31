import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MCPServer, ChatMessage, AppState } from '../types/mcp';

const initialState: AppState = {
  servers: [],
  activeServerId: null,
  messages: [{
    id: '1',
    type: 'system',
    content: 'Welcome to MCP Enterprise. Connect to your Model Context Protocol servers to get started.',
    timestamp: new Date(),
  }],
  isProcessing: false,
  geminiApiKey: '',
  settings: {
    theme: 'dark',
    autoConnect: false,
    showSystemMessages: true,
    maxTokens: 4096,
    temperature: 0.7,
  },
};

const mcpSlice = createSlice({
  name: 'mcp',
  initialState,
  reducers: {
    addServer: (state, action: PayloadAction<MCPServer>) => {
      state.servers.push(action.payload);
    },
    updateServer: (state, action: PayloadAction<{ id: string; updates: Partial<MCPServer> }>) => {
      const server = state.servers.find(s => s.id === action.payload.id);
      if (server) {
        Object.assign(server, action.payload.updates);
      }
    },
    removeServer: (state, action: PayloadAction<string>) => {
      state.servers = state.servers.filter(s => s.id !== action.payload);
      if (state.activeServerId === action.payload) {
        state.activeServerId = null;
      }
    },
    setActiveServer: (state, action: PayloadAction<string | null>) => {
      state.activeServerId = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [initialState.messages[0]];
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setGeminiApiKey: (state, action: PayloadAction<string>) => {
      state.geminiApiKey = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<AppState['settings']>>) => {
      Object.assign(state.settings, action.payload);
    },
  },
});

export const {
  addServer,
  updateServer,
  removeServer,
  setActiveServer,
  addMessage,
  clearMessages,
  setProcessing,
  setGeminiApiKey,
  updateSettings,
} = mcpSlice.actions;

export default mcpSlice.reducer;