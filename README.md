# MCP Enterprise

A comprehensive Model Context Protocol (MCP) application built for enterprise use with React, TypeScript, and Google's Gemini AI. This application provides a sophisticated interface for managing and interacting with multiple MCP servers through an AI-powered chat interface.

## 🚀 Features

### Enterprise-Grade UI
- **Glass Morphism Design**: Modern, sophisticated interface with soft glass effects
- **Responsive Layout**: Optimized for desktop and mobile enterprise environments
- **Advanced Animations**: Smooth transitions and micro-interactions using Framer Motion
- **Dark Theme**: Professional dark theme optimized for extended use

### MCP Integration
- **Multi-Server Support**: Connect to multiple MCP servers simultaneously
- **Universal Compatibility**: Support for Node.js, Python, Java JAR, and Docker-based servers
- **Real-time Status**: Live connection status and health monitoring
- **Tool Discovery**: Automatic discovery and cataloging of available tools

### AI-Powered Chat
- **Gemini Integration**: Powered by Google's Gemini AI for intelligent interactions
- **Context Awareness**: AI understands and utilizes all connected MCP tools
- **Enterprise Security**: Secure API key management and encrypted communications
- **Performance Metrics**: Real-time processing time and usage analytics

### Enterprise Benefits
- **Scalability**: Designed to handle multiple servers and high-volume interactions
- **Security**: Enterprise-grade security practices and data protection
- **Monitoring**: Comprehensive logging and performance monitoring
- **Flexibility**: Support for various server types and deployment scenarios

## 🛠️ Installation

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcp-enterprise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key and backend URL
   ```

4. **Start the frontend**
   ```bash
   npm start
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd ../gemini-mcp
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Set up backend environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

## 📋 Usage

### Setting Up Your First MCP Server

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Enter it in the application setup screen

2. **Add an MCP Server**
   - Click "Add Server" in the dashboard
   - Choose your server type (Node.js, Python, Java, Docker)
   - Provide the server name and path
   - Click "Add Server"

3. **Connect and Chat**
   - Click "Connect" on your server card
   - Switch to the "Chat" tab
   - Start interacting with your MCP tools through AI

### Using External MCP Servers

This application is designed to connect to external MCP servers that you provide. You can connect to any MCP-compatible server by:

1. Having your MCP server running externally
2. Adding the server configuration in the application
3. Connecting and interacting through the AI chat interface

The application supports various server types and will automatically discover available tools from your connected servers.

## 🏗️ Architecture

### Hybrid Architecture
The application uses a hybrid architecture with separate frontend and backend:

**Frontend (React)**: `/mcp-enterprise/`
```
src/
├── components/          # Reusable UI components
│   ├── ServerCard.tsx   # Server management card
│   ├── AddServerModal.tsx # Server addition modal
│   └── ChatInterface.tsx # AI chat interface
├── pages/              # Main application pages
│   └── Dashboard.tsx   # Primary dashboard
├── services/           # API communication services
│   └── MCPService.ts   # HTTP API client
├── store/              # Redux state management
│   ├── index.ts        # Store configuration
│   └── mcpSlice.ts     # MCP state slice
├── types/              # TypeScript definitions
│   └── mcp.ts          # MCP-related types
└── App.tsx             # Main application component
```

**Backend (Node.js)**: `/gemini-mcp/`
```
├── server.js           # Express server with MCP SDK integration
├── package.json        # Backend dependencies
└── .env.example        # Environment configuration
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Redux Toolkit, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MCP SDK, Google Generative AI
- **Communication**: REST API between frontend and backend

## 🔧 Configuration

### Server Types

**Node.js Servers**
- Path: `/path/to/server.js`
- Execution: `node /path/to/server.js`

**Python Servers**
- Path: `/path/to/server.py`
- Execution: `python3 /path/to/server.py`

**Java Servers**
- Path: `/path/to/server.jar`
- Execution: `java -jar /path/to/server.jar`

**Docker Servers**
- Path: `docker:image-name`
- Execution: `docker run -i image-name`

### Environment Variables

**Frontend (.env)**:
```bash
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_API_URL=http://localhost:3001/api
```

**Backend (.env)**:
```bash
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Enterprise Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY build ./build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
```

### Security Considerations
- API keys are stored securely in environment variables
- All communications use HTTPS in production
- Input validation and sanitization on all user inputs
- Regular security audits and dependency updates

## 📊 Monitoring and Analytics

The application provides comprehensive monitoring:
- **Connection Status**: Real-time server health monitoring
- **Performance Metrics**: Response times and processing statistics
- **Usage Analytics**: Tool usage patterns and frequency
- **Error Tracking**: Comprehensive error logging and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Google Gemini AI Documentation](https://ai.google.dev/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)