# DrawFlow.io

A real-time collaborative whiteboard application where multiple users can draw, add shapes, sticky notes, and chat together.

## What is DrawFlow.io?

DrawFlow.io is an online collaborative whiteboard that allows multiple users to:

- **Draw together in real-time** - Pen, highlighter, eraser tools
- **Add shapes** - Rectangle, circle, triangle, star, heart, lines, arrows
- **Add text and sticky notes** - Draggable sticky notes with color options
- **Upload images** - Move and delete uploaded images
- **Use laser pointer** - Point at things for others to see
- **Chat** - Real-time chat alongside the whiteboard
- **Export drawings** - Download your board as PNG

No login required - just create or join a board and start collaborating.

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 18 | Node.js |
| TypeScript | Express |
| Tailwind CSS | Socket.io |
| Vite | MongoDB |
| Socket.io Client | Mongoose |

## Prerequisites

- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/Ojas-Arora/DrawFlow.io.git
cd DrawFlow.io
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/whiteboard
PORT=3000
FRONTEND_URL=http://localhost:5173
SOCKET_URL=http://localhost:3000
```

For MongoDB Atlas, use:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/whiteboard
```

### 3. Start Development Server

```bash
npm run dev
```

This starts both frontend (port 5173) and backend (port 3000).

Open http://localhost:5173 in your browser.

## How to Use

### Create a Board
1. Enter your name
2. Click "Create Board"
3. Share the Board ID with others

### Join a Board
1. Enter your name
2. Enter the Board ID
3. Click "Join Board"

### Drawing Tools
- **Select/Pan** - Navigate the canvas
- **Pen** - Freehand drawing
- **Highlighter** - Semi-transparent strokes
- **Eraser** - Remove drawings
- **Shapes** - Rectangle, circle, triangle, star, heart
- **Lines & Arrows** - Draw lines and arrows
- **Text** - Add text to canvas
- **Sticky Notes** - Add draggable colored notes
- **Image** - Upload and place images
- **Laser Pointer** - Point at things (visible to all)

### Customization Options
- Stroke colors
- Stroke width (S, M, L)
- Stroke style (solid, dashed, dotted)
- Opacity control
- Fill/Outline for shapes
- Background color

## Project Structure

```
DrawFlow.io/
├── server/
│   ├── index.ts              # Express + Socket.io server
│   └── models/               # MongoDB schemas
│       ├── Board.ts
│       ├── User.ts
│       ├── DrawingEvent.ts
│       └── ChatMessage.ts
├── src/
│   ├── components/
│   │   ├── Whiteboard.tsx    # Main drawing canvas
│   │   ├── Chat.tsx          # Chat component
│   │   ├── BoardSetup.tsx    # Create/Join board page
│   │   └── UserProfile.tsx   # User profile modal
│   ├── lib/
│   │   ├── socket.ts         # Socket.io client
│   │   ├── api.ts            # API endpoints
│   │   └── userSession.ts    # Session management
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Deployment

DrawFlow.io requires separate deployments for frontend and backend because WebSocket servers cannot run on static hosting platforms.

### Backend → Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install && npm run build:server`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `MONGO_URI` - Your MongoDB connection string
     - `FRONTEND_URL` - Your Vercel frontend URL
     - `NODE_ENV` - `production`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL` - Your Render backend URL
     - `VITE_SOCKET_URL` - Your Render backend URL

## Build for Production

```bash
# Build frontend
npm run build

# Build backend
npm run build:server

# Start production server
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
