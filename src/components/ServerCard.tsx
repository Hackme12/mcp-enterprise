import React from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Trash2, Settings, Activity } from 'lucide-react';
import { MCPServer } from '../types/mcp';

interface ServerCardProps {
  server: MCPServer;
  onConnect: (serverId: string) => void;
  onDisconnect: (serverId: string) => void;
  onRemove: (serverId: string) => void;
  onEdit: (serverId: string) => void;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  onConnect,
  onDisconnect,
  onRemove,
  onEdit,
}) => {
  const getStatusColor = () => {
    switch (server.status) {
      case 'connected': return 'status-connected';
      case 'connecting': return 'status-connecting';
      case 'error': return 'status-error';
      default: return 'status-disconnected';
    }
  };

  const getTypeIcon = () => {
    switch (server.type) {
      case 'node': return '🟢';
      case 'python': return '🐍';
      case 'jar': return '☕';
      case 'docker': return '🐳';
      default: return '📦';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-6 hover:bg-white/15 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getTypeIcon()}</div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">
              {server.name}
            </h3>
            <p className="text-sm text-gray-400">{server.description || 'No description'}</p>
          </div>
        </div>
        <div className={`status-indicator ${getStatusColor()}`} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-300">
          <span className="font-medium mr-2">Path:</span>
          <code className="bg-black/20 px-2 py-1 rounded text-xs font-mono truncate">
            {server.path}
          </code>
        </div>
        
        {server.tools.length > 0 && (
          <div className="flex items-center text-sm text-gray-300">
            <Activity className="w-4 h-4 mr-2" />
            <span>{server.tools.length} tools available</span>
          </div>
        )}

        {server.lastConnected && (
          <div className="text-xs text-gray-400">
            Last connected: {server.lastConnected.toLocaleString()}
          </div>
        )}

        {server.errorMessage && (
          <div className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
            {server.errorMessage}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {server.status === 'connected' ? (
            <button
              onClick={() => onDisconnect(server.id)}
              className="glass-button text-red-300 hover:text-red-200 flex items-center space-x-1"
            >
              <Square className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={() => onConnect(server.id)}
              disabled={server.status === 'connecting'}
              className="glass-button text-green-300 hover:text-green-200 flex items-center space-x-1 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{server.status === 'connecting' ? 'Connecting...' : 'Connect'}</span>
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(server.id)}
            className="glass-button text-gray-300 hover:text-white p-2"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(server.id)}
            className="glass-button text-red-300 hover:text-red-200 p-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};