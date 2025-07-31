import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, FolderOpen } from "lucide-react";
import { MCPServer } from "../types/mcp";

interface AddServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (server: Omit<MCPServer, "id" | "status" | "tools">) => void;
}

export const AddServerModal: React.FC<AddServerModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    path: "",
    type: "node" as MCPServer["type"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.path) {
      onAdd(formData);
      setFormData({ name: "", description: "", path: "", type: "node" });
      onClose();
    }
  };

  const serverTypes = [
    { value: "node", label: "Node.js (.js)", icon: "🟢" },
    { value: "python", label: "Python (.py)", icon: "🐍" },
    { value: "jar", label: "Java (.jar)", icon: "☕" },
    { value: "docker", label: "Docker Image", icon: "🐳" },
  ];

  return (
    <div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-8 max-w-md w-full enterprise-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                Add MCP Server
              </h2>
              <button
                onClick={onClose}
                className="glass-button p-2 hover:bg-red-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Server Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="glass-input w-full"
                  placeholder="My MCP Server"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="glass-input w-full h-20 resize-none"
                  placeholder="Brief description of what this server does..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Server Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serverTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          type: type.value as MCPServer["type"],
                        })
                      }
                      className={`glass-button p-3 text-left transition-all ${
                        formData.type === type.value
                          ? "bg-primary-500/30 border-primary-400"
                          : "hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="text-sm font-medium">
                          {type.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Server Path *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.path}
                    onChange={(e) =>
                      setFormData({ ...formData, path: e.target.value })
                    }
                    className="glass-input w-full pr-10"
                    placeholder={
                      formData.type === "docker"
                        ? "docker:image-name"
                        : "/path/to/server/file"
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FolderOpen className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formData.type === "docker"
                    ? "Enter Docker image name (e.g., docker:my-mcp-server)"
                    : "Full path to the executable server file"}
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 glass-button py-3 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Server</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
