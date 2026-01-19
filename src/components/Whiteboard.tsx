import { useRef, useEffect, useState, useCallback } from 'react';
import { Trash2, Users } from 'lucide-react';
import { getUserId, getUsername, getUserColor } from '../lib/userSession';
import { getSocket } from '../lib/socket';
import { api } from '../lib/api';

type Tool = 'pen' | 'eraser';

interface WhiteboardProps {
  boardId: string;
}

interface RemoteUser {
  userId: string;
  username: string;
  color: string;
}

export default function Whiteboard({ boardId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [activeUsers, setActiveUsers] = useState<RemoteUser[]>([]);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  const colors = ['#FF0000', '#FF6B35', '#F7931E', '#FDB913', '#12D000', '#00A8CC', '#0066FF', '#8B00FF', '#FF1493'];

  const draw = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, prevX: number, prevY: number, drawColor: string, drawWidth: number) => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, []);

  const loadDrawingHistory = useCallback(async () => {
    try {
      const response = await fetch(api.getBoardHistory(boardId));
      const { drawingEvents } = await response.json();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawingEvents?.forEach((event: any) => {
        if (event.eventType === 'clear') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          const { x, y, prevX, prevY, color: eventColor, lineWidth: eventWidth } = event.data;
          if (x !== undefined && y !== undefined && prevX !== undefined && prevY !== undefined) {
            draw(ctx, x, y, prevX, prevY, eventColor || '#000000', eventWidth || 2);
          }
        }
      });
    } catch (error) {
      console.error('Error loading drawing history:', error);
    }
  }, [boardId, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        loadDrawingHistory();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [loadDrawingHistory]);

  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;

    // Join the board
    socket.emit('join-board', {
      userId: getUserId(),
      boardId,
      username: getUsername(),
      color: getUserColor(),
    });

    // Listen for drawing events
    socket.on('draw', (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      const { x, y, prevX, prevY, color: eventColor, lineWidth: eventWidth } = data;
      if (x !== undefined && y !== undefined && prevX !== undefined && prevY !== undefined) {
        draw(ctx, x, y, prevX, prevY, eventColor || '#000000', eventWidth || 2);
      }
    });

    // Listen for clear-board events
    socket.on('clear-board', () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // Listen for user joined
    socket.on('user-joined', (data) => {
      const newUser: RemoteUser = {
        userId: data.userId,
        username: data.username,
        color: data.color,
      };
      setActiveUsers((prev) => {
        const filtered = prev.filter((u) => u.userId !== data.userId);
        return [...filtered, newUser];
      });
      setActiveUserCount(data.activeUsersCount);
    });

    // Listen for user left
    socket.on('user-left', (data) => {
      setActiveUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      setActiveUserCount(data.activeUsersCount);
    });

    return () => {
      socket.off('draw');
      socket.off('clear-board');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [boardId, draw]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    lastPosRef.current = { x, y };
  };

  const continueDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPosRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    const currentColor = tool === 'eraser' ? '#FFFFFF' : color;
    const currentWidth = tool === 'eraser' ? 20 : lineWidth;

    draw(ctx, x, y, lastPosRef.current.x, lastPosRef.current.y, currentColor, currentWidth);

    if (socketRef.current) {
      socketRef.current.emit('draw', {
        boardId,
        x,
        y,
        prevX: lastPosRef.current.x,
        prevY: lastPosRef.current.y,
        color: currentColor,
        lineWidth: currentWidth,
        tool,
      });
    }

    lastPosRef.current = { x, y };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (socketRef.current) {
      socketRef.current.emit('clear-board', boardId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Toolbar */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 p-3 flex items-center gap-3 flex-wrap">
        {/* Tool Selection */}
        <div className="flex gap-1 bg-slate-700/50 p-1 rounded-xl">
          <button
            onClick={() => setTool('pen')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              tool === 'pen'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            ✏️ Pen
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              tool === 'eraser'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            🧹 Eraser
          </button>
        </div>

        {tool === 'pen' && (
          <>
            {/* Color Palette */}
            <div className="flex gap-1.5 items-center bg-slate-700/50 rounded-xl p-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-lg transition-all shadow-md hover:scale-110 ${
                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-2 bg-slate-700/50 rounded-xl px-3 py-2">
              <label className="text-xs font-medium text-slate-400">Size:</label>
              <input
                type="range"
                min="1"
                max="15"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-20 accent-cyan-500"
              />
              <span className="text-xs font-semibold text-cyan-400 w-6">{lineWidth}</span>
            </div>
          </>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium text-sm transition-all flex items-center gap-2 border border-red-500/30"
        >
          <Trash2 size={16} />
          Clear All
        </button>

        {/* Active Users */}
        <div className="flex items-center gap-2 bg-green-500/20 rounded-xl px-3 py-2 border border-green-500/30">
          <Users size={16} className="text-green-400" />
          <span className="font-semibold text-green-400 text-sm">{activeUserCount}</span>
          <span className="text-green-400/70 text-xs">online</span>
        </div>
      </div>

      {/* Active Users Bar */}
      {activeUsers.length > 0 && (
        <div className="bg-slate-800/50 border-b border-slate-700/30 px-4 py-2 flex gap-2 flex-wrap">
          {activeUsers.map((user) => (
            <div key={user.userId} className="flex items-center gap-2 bg-slate-700/50 rounded-full px-3 py-1">
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: user.color }}
              />
              <span className="text-xs font-medium text-slate-300">{user.username}</span>
            </div>
          ))}
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 relative bg-slate-100">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={continueDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={continueDrawing}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 cursor-crosshair touch-none bg-white"
        />
      </div>
    </div>
  );
}
