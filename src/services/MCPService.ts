import { MCPServer, MCPTool } from '../types/mcp';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class MCPService {
  constructor(apiKey: string) {
    this.setGeminiKey(apiKey);
  }

  private async setGeminiKey(apiKey: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/gemini/key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to set Gemini API key');
    }
  }

  async connectToServer(server: MCPServer): Promise<MCPTool[]> {
    const response = await fetch(`${API_BASE_URL}/servers/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(server),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to connect to server');
    }
    
    const data = await response.json();
    return data.tools;
  }

  async disconnectServer(serverId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/disconnect`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to disconnect server');
    }
  }

  async processQuery(query: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process query');
    }
    
    const data = await response.json();
    return data.response;
  }

  async getConnectedServers(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/servers`);
    if (!response.ok) throw new Error('Failed to get servers');
    const data = await response.json();
    return data.servers;
  }

  async getAllTools(): Promise<MCPTool[]> {
    const response = await fetch(`${API_BASE_URL}/tools`);
    if (!response.ok) throw new Error('Failed to get tools');
    const data = await response.json();
    return data.tools;
  }

  async cleanup(): Promise<void> {
    // Cleanup handled by backend
  }
}