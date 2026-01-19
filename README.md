# 🎨 Collaborative Whiteboard - Real-time Drawing & Chat Platform

A modern, feature-rich collaborative whiteboard application built with **React**, **Node.js**, **Socket.io**, and **MongoDB**.

## ✨ Features

- 🎨 **Real-time Drawing Canvas** - Draw, erase, and collaborate simultaneously
- 💬 **Real-time Chat** - Instant messaging with color-coded users
- 👥 **User Presence** - See who's currently on the board
- 🎯 **Multiple Colors & Tools** - 9 vibrant colors and adjustable brush sizes
- 📱 **Touch Support** - Full support for mobile and tablet devices
- 💾 **Persistent Storage** - All drawings and messages saved to MongoDB
- 🚀 **No Lag** - Optimized Socket.io for smooth real-time updates
- 🔐 **Anonymous Sessions** - No login required, just start collaborating

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time communication
- **Vite** - Build tool & dev server
- **Lucide React** - Icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Socket.io** - Real-time WebSocket library
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd WhiteBoard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (if not already installed)
# macOS: brew install mongodb-community
# Windows: Download from https://www.mongodb.com/try/download/community

# Start MongoDB
# macOS: brew services start mongodb-community
# Windows: mongod
```

**Option B: MongoDB Cloud (Atlas)**
- Go to https://www.mongodb.com/cloud/atlas
- Create a free account and cluster
- Copy your connection string

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/whiteboard
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/whiteboard

# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173
SOCKET_URL=http://localhost:3000
```

### 5. Install Socket.io Client (Frontend)

```bash
npm install socket.io-client uuid
```

### 6. Start the Development Server

**Option A: Run both frontend and backend together**
```bash
npm run dev
```

**Option B: Run separately (in different terminals)**

Terminal 1 - Frontend:
```bash
npm run dev:frontend
```

Terminal 2 - Backend:
```bash
npm run dev:backend
```

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📖 Usage Guide

### Creating a Board

1. Enter your name (or use the auto-generated one)
2. Click "Create Board"
3. Share the Board ID with others

### Joining a Board

1. Enter your name
2. Paste the Board ID
3. Click "Join Board"

### Drawing Tools

- **Pen** - Draw with selected color and size
- **Eraser** - Remove parts of the drawing
- **Colors** - Click any color to select
- **Size** - Adjust brush size (1-15px)
- **Clear** - Clear the entire board

### Chat

- Type messages in the chat input
- Messages appear in real-time with your color indicator
- Scroll up to see message history

## 📁 Project Structure

```
WhiteBoard/
├── server/                    # Backend
│   ├── models/
│   │   ├── User.ts           # User schema
│   │   ├── Board.ts          # Board schema
│   │   ├── DrawingEvent.ts   # Drawing events schema
│   │   └── ChatMessage.ts    # Chat messages schema
│   ├── index.ts              # Main server file
│   └── middleware/           # Express middleware
├── src/                      # Frontend
│   ├── components/
│   │   ├── Whiteboard.tsx   # Drawing canvas
│   │   ├── Chat.tsx         # Chat sidebar
│   │   └── BoardSetup.tsx   # Setup/join page
│   ├── lib/
│   │   ├── socket.ts        # Socket.io setup
│   │   ├── api.ts           # API configuration
│   │   └── userSession.ts   # Session management
│   ├── App.tsx              # Main app
│   ├── index.css            # Global styles
│   └── main.tsx             # Entry point
├── package.json             # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
└── README.md               # This file
```

## 🔌 API Endpoints

### Create User
```
POST /api/user/create
Body: { username: string, isAnonymous: boolean }
```

### Create Board
```
POST /api/board/create
Body: { userId: string, title: string }
```

### Get Board History
```
GET /api/board/:boardId/history
Response: { drawingEvents: [], chatMessages: [] }
```

## 🔄 Socket.io Events

### Client → Server
- `join-board` - Join a board
- `draw` - Send drawing event
- `clear-board` - Clear all drawings
- `chat-message` - Send chat message

### Server → Client
- `user-joined` - User joined the board
- `user-left` - User left the board
- `draw` - Receive drawing from other users
- `clear-board` - Board cleared by someone
- `chat-message` - Receive chat message

## 🎨 Customization

### Change Colors
Edit the `colors` array in `src/components/Whiteboard.tsx`:
```tsx
const colors = ['#FF0000', '#FF6B35', '#F7931E', /* ... */];
```

### Change Port
Edit `.env`:
```env
PORT=3001  # Change to different port
```

### Change Database
Edit `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/whiteboard
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Check MongoDB is running: `mongod`
- Verify connection string in `.env`
- Check firewall settings for MongoDB cloud

### Socket.io Connection Issues
- Check that backend is running on port 3000
- Verify FRONTEND_URL and SOCKET_URL in `.env`
- Check browser console for errors

### Drawing Not Appearing
- Refresh the page
- Check browser console for errors
- Verify MongoDB connection

## 📦 Build for Production

```bash
# Build frontend
npm run build

# Start backend server
npm start
```

Frontend build will be in `dist/` directory.

## 🚢 Deployment

### ⚠️ IMPORTANT: This app requires SEPARATE deployments for frontend and backend!

**Frontend (React)** → Deploy to **Vercel** or **Netlify**
**Backend (Express + Socket.io)** → Deploy to **Render**, **Railway**, or **Fly.io**

Vercel/Netlify **cannot run WebSocket servers** - they only serve static files!

---

### Step 1: Deploy Backend to Render (Free)

1. **Go to [Render.com](https://render.com)** and sign up/login

2. **Create a New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the WhiteBoard repo

3. **Configure the Service**
   ```
   Name: whiteboard-backend
   Environment: Node
   Build Command: npm install && npm run build:server
   Start Command: npm start
   ```

4. **Add Environment Variables** (in Render dashboard)
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/whiteboard?retryWrites=true&w=majority
   DB_NAME=whiteboard
   FRONTEND_URL=https://collaborative-white-board-wheat.vercel.app
   NODE_ENV=production
   ```

5. **Deploy!** - Click "Create Web Service"

6. **Copy your Render URL** (e.g., `https://whiteboard-backend.onrender.com`)

---

### Step 2: Update Frontend for Production

1. **In Vercel Dashboard**, add this environment variable:
   ```
   VITE_SOCKET_URL=https://your-render-backend-url.onrender.com
   ```
   
2. **Redeploy** on Vercel to apply the new environment variable

---

### Step 3: MongoDB Atlas Network Access

1. Go to **MongoDB Atlas** → **Security** → **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. Click **Confirm**

This allows Render's servers to connect to your database.

---

### Alternative: Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables in Railway dashboard
```

---

### Alternative: Deploy using Docker (Any Platform)

Create a `Dockerfile` for the backend:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:server
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions:
- Open a GitHub issue
- Contact the maintainers
- Check existing documentation

## 🎯 Future Features

- [ ] User authentication & accounts
- [ ] Board permissions & privacy settings
- [ ] Drawing shapes (rectangle, circle, line)
- [ ] Text tool
- [ ] Undo/Redo functionality
- [ ] Export drawings as PNG/SVG
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)
- [ ] Screen sharing
- [ ] Voice chat

---

**Made with ❤️ for real-time collaboration**
