export interface MCPServer {
  id: string;
  name: string;
  description?: string;
  path: string;
  type: 'node' | 'python' | 'jar' | 'docker';
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  tools: MCPTool[];
  lastConnected?: Date;
  errorMessage?: string;
  metadata?: {
    version?: string;
    capabilities?: string[];
    author?: string;
  };
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  serverId?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  toolName?: string;
  serverId?: string;
  metadata?: {
    tokens?: number;
    processingTime?: number;
    toolsUsed?: string[];
  };
}



export interface AppState {
  servers: MCPServer[];
  activeServerId: string | null;
  messages: ChatMessage[];
  isProcessing: boolean;
  geminiApiKey: string;
  settings: {
    theme: 'dark' | 'light';
    autoConnect: boolean;
    showSystemMessages: boolean;
    maxTokens: number;
    temperature: number;
  };
}