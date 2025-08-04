import { debug } from "console";
import { MCPTool } from "../types/mcp";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3002/bedrock/api";

export class MCPService {
  constructor() {
    // Backend handles Gemini API key from environment
  }

  getAvailableServers(): { name: string; type: string; path: string }[] {
    debugger;
    const serverConfigs = process.env.REACT_APP_MCP_SERVERS;
    if (!serverConfigs) return [];

    return serverConfigs
      .split(",")
      .map((config) => {
        const [name, type, path] = config.trim().split(":");
        return { name, type, path };
      })
      .filter((server) => server.name && server.type && server.path);
  }

  async connectToServer(server: {
    name: string;
    type: string;
    path: string;
  }): Promise<MCPTool[]> {
    const response = await fetch(`${API_BASE_URL}/servers/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(server),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to connect to server");
    }

    const data = await response.json();
    return data.tools;
  }

  async disconnectServer(serverId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/servers/${serverId}/disconnect`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to disconnect server");
    }
  }

  async processQuery(query: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to process query");
    }

    const data = await response.json();
    return data.response;
  }

  async getConnectedServers(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/servers`);
    if (!response.ok) throw new Error("Failed to get servers");
    const data = await response.json();
    return data.servers;
  }

  async getAllTools(): Promise<MCPTool[]> {
    const response = await fetch(`${API_BASE_URL}/tools`);
    if (!response.ok) throw new Error("Failed to get tools");
    const data = await response.json();
    return data.tools;
  }

  async cleanup(): Promise<void> {
    // Cleanup handled by backend
  }
}
