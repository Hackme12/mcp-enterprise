import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Plus,
  Server,
  MessageSquare,
  Settings,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { RootState } from "../store";
import {
  addServer,
  updateServer,
  removeServer,
  addMessage,
  setProcessing,
  setGeminiApiKey,
} from "../store/mcpSlice";
import { ServerCard } from "../components/ServerCard";
import { AddServerModal } from "../components/AddServerModal";
import { ChatInterface } from "../components/ChatInterface";
import { MCPService } from "../services/MCPService";
import { MCPServer, ChatMessage } from "../types/mcp";

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { servers, messages, isProcessing, geminiApiKey } = useSelector(
    (state: RootState) => state.mcp
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mcpService, setMcpService] = useState<MCPService | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [activeTab, setActiveTab] = useState<"servers" | "chat" | "settings">(
    "servers"
  );

  useEffect(() => {
    if (geminiApiKey && !mcpService) {
      try {
        const service = new MCPService(geminiApiKey);
        setMcpService(service);
      } catch (error) {
        console.error("Failed to initialize MCP service:", error);
      }
    }
  }, [geminiApiKey, mcpService]);

  const handleSetApiKey = () => {
    if (apiKeyInput.trim()) {
      dispatch(setGeminiApiKey(apiKeyInput.trim()));
      setApiKeyInput("");
    }
  };

  const handleAddServer = (
    serverData: Omit<MCPServer, "id" | "status" | "tools">
  ) => {
    const newServer: MCPServer = {
      ...serverData,
      id: `server-${Date.now()}`,
      status: "disconnected",
      tools: [],
    };
    dispatch(addServer(newServer));
  };

  const handleConnectServer = async (serverId: string) => {
    if (!mcpService) return;

    const server = servers.find((s) => s.id === serverId);
    if (!server) return;

    dispatch(updateServer({ id: serverId, updates: { status: "connecting" } }));

    try {
      const tools = await mcpService.connectToServer(server);
      dispatch(
        updateServer({
          id: serverId,
          updates: {
            status: "connected",
            tools,
            lastConnected: new Date(),
            errorMessage: undefined,
          },
        })
      );

      dispatch(
        addMessage({
          id: `msg-${Date.now()}`,
          type: "system",
          content: `Connected to ${server.name}. ${
            tools.length
          } tools available: ${tools.map((t) => t.name).join(", ")}`,
          timestamp: new Date(),
        })
      );
    } catch (error) {
      dispatch(
        updateServer({
          id: serverId,
          updates: {
            status: "error",
            errorMessage:
              error instanceof Error ? error.message : "Connection failed",
          },
        })
      );
    }
  };

  const handleDisconnectServer = async (serverId: string) => {
    if (!mcpService) return;

    await mcpService.disconnectServer(serverId);
    dispatch(
      updateServer({ id: serverId, updates: { status: "disconnected" } })
    );

    const server = servers.find((s) => s.id === serverId);
    if (server) {
      dispatch(
        addMessage({
          id: `msg-${Date.now()}`,
          type: "system",
          content: `Disconnected from ${server.name}`,
          timestamp: new Date(),
        })
      );
    }
  };

  const handleRemoveServer = async (serverId: string) => {
    if (mcpService) {
      await mcpService.disconnectServer(serverId);
    }
    dispatch(removeServer(serverId));
  };

  const handleSendMessage = async (message: string) => {
    if (!mcpService) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    dispatch(addMessage(userMessage));
    dispatch(setProcessing(true));

    try {
      const startTime = Date.now();
      const response = await mcpService.processQuery(message);
      const processingTime = Date.now() - startTime;

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: "assistant",
        content: response,
        timestamp: new Date(),
        metadata: {
          processingTime,
          // toolsUsed: mcpService.getAllTools().map((t) => t.name),
        },
      };

      dispatch(addMessage(assistantMessage));
    } catch (error) {
      dispatch(
        addMessage({
          id: `msg-${Date.now()}`,
          type: "system",
          content: `Error: ${
            error instanceof Error ? error.message : "Unknown error occurred"
          }`,
          timestamp: new Date(),
        })
      );
    } finally {
      dispatch(setProcessing(false));
    }
  };

  const connectedServers = servers.filter((s) => s.status === "connected");
  const totalTools = servers.reduce(
    (acc, server) => acc + server.tools.length,
    0
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                MCP Enterprise
              </h1>
              <p className="text-gray-400">
                Model Context Protocol - Enterprise AI Integration Platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="glass-card p-4 flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">
                    {servers.length}
                  </div>
                  <div className="text-xs text-gray-400">Servers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {connectedServers.length}
                  </div>
                  <div className="text-xs text-gray-400">Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {totalTools}
                  </div>
                  <div className="text-xs text-gray-400">Tools</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-4 flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="font-semibold">Enterprise Security</h3>
                <p className="text-sm text-gray-400">Secure MCP connections</p>
              </div>
            </div>
            <div className="glass-card p-4 flex items-center space-x-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="font-semibold">High Performance</h3>
                <p className="text-sm text-gray-400">Optimized for scale</p>
              </div>
            </div>
            <div className="glass-card p-4 flex items-center space-x-3">
              <Globe className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="font-semibold">Multi-Protocol</h3>
                <p className="text-sm text-gray-400">Universal compatibility</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* API Key Setup */}
        {!geminiApiKey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6 border-primary-400/30"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Setup Required
            </h2>
            <p className="text-gray-300 mb-4">
              Enter your Google Gemini API key to enable AI-powered MCP
              interactions.
            </p>
            <div className="flex space-x-4">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="flex-1 glass-input"
                onKeyDown={(e) => e.key === "Enter" && handleSetApiKey()}
              />
              <button
                onClick={handleSetApiKey}
                disabled={!apiKeyInput.trim()}
                className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
              >
                Set API Key
              </button>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="glass-card p-2 mb-6">
          <div className="flex space-x-2">
            {[
              { id: "servers", label: "Servers", icon: Server },
              { id: "chat", label: "Chat", icon: MessageSquare },
              { id: "settings", label: "Settings", icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === id
                    ? "bg-primary-500/30 text-primary-300"
                    : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeTab === "servers" && (
            <>
              {/* Servers List */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">MCP Servers</h2>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="glass-button flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Server</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {servers.map((server) => (
                    <ServerCard
                      key={server.id}
                      server={server}
                      onConnect={handleConnectServer}
                      onDisconnect={handleDisconnectServer}
                      onRemove={handleRemoveServer}
                      onEdit={() => {}}
                    />
                  ))}

                  {servers.length === 0 && (
                    <div className="glass-card p-8 text-center">
                      <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        No MCP Servers
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Add your first MCP server to get started with enterprise
                        AI integration.
                      </p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                      >
                        Add Your First Server
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    System Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Servers</span>
                      <span className="font-semibold">{servers.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Connected</span>
                      <span className="font-semibold text-green-400">
                        {connectedServers.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Available Tools</span>
                      <span className="font-semibold text-purple-400">
                        {totalTools}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Messages</span>
                      <span className="font-semibold">{messages.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "chat" && (
            <div className="lg:col-span-3 h-[600px]">
              <ChatInterface
                messages={messages}
                isProcessing={isProcessing}
                onSendMessage={handleSendMessage}
                connectedServers={connectedServers.length}
              />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="lg:col-span-3">
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold mb-6">Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gemini API Key
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="password"
                        value={geminiApiKey ? "••••••••••••••••" : ""}
                        className="flex-1 glass-input"
                        disabled
                      />
                      <button
                        onClick={() => {
                          dispatch(setGeminiApiKey(""));
                          setMcpService(null);
                        }}
                        className="glass-button"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddServerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddServer}
      />
    </div>
  );
};
