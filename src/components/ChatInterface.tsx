import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Wrench, Clock } from "lucide-react";
import { ChatMessage } from "../types/mcp";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  onSendMessage: (message: string) => void;
  connectedServers: number;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isProcessing,
  onSendMessage,
  connectedServers,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const getMessageIcon = (type: ChatMessage["type"]) => {
    switch (type) {
      case "user":
        return <User className="w-5 h-5" />;
      case "assistant":
        return <Bot className="w-5 h-5" />;
      case "tool":
        return <Wrench className="w-5 h-5" />;
      case "system":
        return <Clock className="w-5 h-5" />;
    }
  };

  const getMessageStyle = (type: ChatMessage["type"]) => {
    switch (type) {
      case "user":
        return "bg-primary-500/20 border-primary-400/30 ml-12";
      case "assistant":
        return "bg-primary-500/20 border-purple-400/30 mr-12";
      case "tool":
        return "bg-green-500/20 border-green-400/30 mx-8";
      case "system":
        return "bg-gray-500/20 border-gray-400/30 mx-16 text-center";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-soft"></div>
            <span className="text-lg font-semibold">Chat</span>
          </div>
          <div className="text-sm text-gray-400">
            {connectedServers} server{connectedServers !== 1 ? "s" : ""}{" "}
            connected
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
        <div>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`glass-card p-4 ${getMessageStyle(message.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-primary-500/30"
                      : message.type === "assistant"
                      ? "bg-purple-500/30"
                      : message.type === "tool"
                      ? "bg-green-500/30"
                      : "bg-gray-500/30"
                  }`}
                >
                  {getMessageIcon(message.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium capitalize">
                      {message.type === "assistant"
                        ? "Bedrock - Nova"
                        : message.type}
                    </span>
                    {message.toolName && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        {message.toolName}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-gray-200">
                      {message.content}
                    </p>
                  </div>
                  {message.metadata && (
                    <div className="mt-2 text-xs text-gray-400 space-x-4">
                      {message.metadata.processingTime && (
                        <span>⏱️ {message.metadata.processingTime}ms</span>
                      )}
                      {message.metadata.toolsUsed && (
                        <span>🔧 {message.metadata.toolsUsed.join(", ")}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 bg-purple-500/20 border-purple-400/30 mr-12"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">AWS Bedrock</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
                <p className="text-gray-300">Processing your request...</p>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="glass-card p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              connectedServers > 0
                ? "Ask me anything about your connected MCP servers..."
                : "Connect to MCP servers to start chatting..."
            }
            className="flex-1 glass-input"
            disabled={isProcessing || connectedServers === 0}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing || connectedServers === 0}
            className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white p-3 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
