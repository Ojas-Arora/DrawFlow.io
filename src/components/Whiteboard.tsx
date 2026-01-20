import { useRef, useEffect, useState, useCallback } from 'react';
import { Trash2, Users, Pencil } from 'lucide-react';
import { getUserId, getUsername, getUserColor } from '../lib/userSession';
import { getSocket } from '../lib/socket';
import { api } from '../lib/api';

type Tool = 'pen' | 'eraser';

interface WhiteboardProps {
  boardId: string;
}

interface RemoteUser {
  odId: string;
  username: string;
  color: string;
  isDrawing?: boolean;
}

interface RemoteCursor {
  odId: string;
  username: string;
  color: string;
  x: number;
  y: number;
  isDrawing: boolean;
  lastUpdate: number;
}

export default function Whiteboard({ boardId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [activeUsers, setActiveUsers] = useState<RemoteUser[]>([]);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [showUserPanel, setShowUserPanel] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const cursorThrottleRef = useRef<number>(0);

  const colors = [
    '#000000', '#FF0000', '#FF6B35', '#F7931E', '#FDB913', 
    '#12D000', '#00A8CC', '#0066FF', '#8B00FF', '#FF1493'
  ];

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

  // Canvas resize handler
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

  // Socket connection and event handlers
  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;
    const myUserId = getUserId();

    // Join the board
    socket.emit('join-board', {
      userId: myUserId,
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

    // Listen for cursor updates from other users
    socket.on('cursor-update', (data: { odId: string; username: string; color: string; x: number; y: number; isDrawing: boolean }) => {
      if (data.odId === myUserId) return; // Skip own cursor
      
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.odId, {
          ...data,
          lastUpdate: Date.now(),
        });
        return newMap;
      });

      // Update isDrawing status in activeUsers
      setActiveUsers((prev) => 
        prev.map((user) => 
          user.odId === data.odId ? { ...user, isDrawing: data.isDrawing } : user
        )
      );
    });

    // Listen for cursor removal
    socket.on('cursor-remove', (data: { odId: string }) => {
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.odId);
        return newMap;
      });
    });

    // Listen for user joined
    socket.on('user-joined', (data) => {
      if (data.allUsers) {
        // Full user list provided
        setActiveUsers(data.allUsers.map((u: any) => ({
          odId: u.odId,
          username: u.username,
          color: u.color,
          isDrawing: false,
        })));
      } else {
        // Single user update
        const newUser: RemoteUser = {
          odId: data.odId,
          username: data.username,
          color: data.color,
          isDrawing: false,
        };
        setActiveUsers((prev) => {
          const filtered = prev.filter((u) => u.odId !== data.odId);
          return [...filtered, newUser];
        });
      }
      setActiveUserCount(data.activeUsersCount);
    });

    // Listen for user left
    socket.on('user-left', (data) => {
      setActiveUsers((prev) => prev.filter((u) => u.odId !== data.odId));
      setActiveUserCount(data.activeUsersCount);
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.odId);
        return newMap;
      });
    });

    // Cleanup stale cursors every 3 seconds
    const cursorCleanup = setInterval(() => {
      const now = Date.now();
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        prev.forEach((cursor, odId) => {
          if (now - cursor.lastUpdate > 5000) {
            newMap.delete(odId);
          }
        });
        return newMap;
      });
    }, 3000);

    return () => {
      socket.off('draw');
      socket.off('clear-board');
      socket.off('cursor-update');
      socket.off('cursor-remove');
      socket.off('user-joined');
      socket.off('user-left');
      clearInterval(cursorCleanup);
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

  // Emit cursor position (throttled)
  const emitCursorPosition = useCallback((x: number, y: number, drawing: boolean) => {
    const now = Date.now();
    if (now - cursorThrottleRef.current < 30) return; // Throttle to ~30fps
    cursorThrottleRef.current = now;

    if (socketRef.current) {
      socketRef.current.emit('cursor-move', {
        boardId,
        x,
        y,
        isDrawing: drawing,
      });
    }
  }, [boardId]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e);
    emitCursorPosition(x, y, isDrawing);
    
    if (isDrawing) {
      continueDrawing(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e);
    emitCursorPosition(x, y, isDrawing);
    
    if (isDrawing) {
      continueDrawing(e);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    lastPosRef.current = { x, y };
    emitCursorPosition(x, y, true);
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
    if (socketRef.current) {
      socketRef.current.emit('cursor-move', {
        boardId,
        x: -1,
        y: -1,
        isDrawing: false,
      });
    }
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

  const drawingUsers = activeUsers.filter(u => u.isDrawing);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Toolbar */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 p-2 sm:p-3 flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Tool Selection */}
        <div className="flex gap-1 bg-slate-700/50 p-1 rounded-xl">
          <button
            onClick={() => setTool('pen')}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all flex items-center gap-1 ${
              tool === 'pen'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            <Pencil size={14} className="sm:hidden" />
            <span className="hidden sm:inline">✏️</span> Pen
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
              tool === 'eraser'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            <span className="sm:hidden">🧹</span>
            <span className="hidden sm:inline">🧹 Eraser</span>
          </button>
        </div>

        {tool === 'pen' && (
          <>
            {/* Color Palette */}
            <div className="flex gap-1 sm:gap-1.5 items-center bg-slate-700/50 rounded-xl p-1.5 sm:p-2 overflow-x-auto">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 sm:w-7 sm:h-7 rounded-lg transition-all shadow-md hover:scale-110 flex-shrink-0 ${
                    color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-800 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-700/50 rounded-xl px-3 py-2">
              <label className="text-xs font-medium text-slate-400">Size:</label>
              <input
                type="range"
                min="1"
                max="15"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-16 sm:w-20 accent-cyan-500"
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
          className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2 border border-red-500/30"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* Active Users Button */}
        <button
          onClick={() => setShowUserPanel(!showUserPanel)}
          className="flex items-center gap-1 sm:gap-2 bg-green-500/20 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-green-500/30 hover:bg-green-500/30 transition-all"
        >
          <Users size={14} className="text-green-400" />
          <span className="font-semibold text-green-400 text-xs sm:text-sm">{activeUserCount}</span>
          <span className="text-green-400/70 text-xs hidden sm:inline">online</span>
        </button>
      </div>

      {/* Drawing Status Bar */}
      {drawingUsers.length > 0 && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-3 sm:px-4 py-2 flex items-center gap-2 animate-pulse">
          <Pencil size={14} className="text-amber-400" />
          <span className="text-amber-300 text-xs sm:text-sm">
            {drawingUsers.map(u => u.username).join(', ')} {drawingUsers.length === 1 ? 'is' : 'are'} drawing...
          </span>
        </div>
      )}

      {/* Active Users Panel (Slidable) */}
      {showUserPanel && (
        <div className="bg-slate-800/90 border-b border-slate-700/30 px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-slate-400" />
            <span className="text-slate-300 text-sm font-medium">Active Users</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {activeUsers.map((user) => (
              <div 
                key={user.odId} 
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 border transition-all ${
                  user.isDrawing 
                    ? 'bg-amber-500/20 border-amber-500/50 animate-pulse' 
                    : 'bg-slate-700/50 border-slate-600/50'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${user.isDrawing ? 'animate-ping' : ''}`}
                  style={{ backgroundColor: user.color }}
                />
                <span className="text-xs font-medium text-slate-300">{user.username}</span>
                {user.isDrawing && (
                  <Pencil size={10} className="text-amber-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div ref={containerRef} className="flex-1 relative bg-slate-100 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 cursor-crosshair touch-none bg-white"
        />
        
        {/* Remote Cursors Overlay */}
        {Array.from(remoteCursors.values()).map((cursor) => (
          cursor.x >= 0 && cursor.y >= 0 && (
            <div
              key={cursor.odId}
              className="absolute pointer-events-none transition-all duration-75 ease-out z-50"
              style={{
                left: cursor.x,
                top: cursor.y,
                transform: 'translate(-2px, -2px)',
              }}
            >
              {/* Cursor dot */}
              <div 
                className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${cursor.isDrawing ? 'animate-pulse scale-125' : ''}`}
                style={{ backgroundColor: cursor.color }}
              />
              {/* Username label */}
              <div 
                className={`absolute left-5 top-0 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap shadow-lg ${
                  cursor.isDrawing ? 'animate-pulse' : ''
                }`}
                style={{ 
                  backgroundColor: cursor.color,
                  color: isLightColor(cursor.color) ? '#000' : '#fff'
                }}
              >
                {cursor.username}
                {cursor.isDrawing && ' ✏️'}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Mobile Brush Size (Bottom) */}
      {tool === 'pen' && (
        <div className="sm:hidden bg-slate-800/80 border-t border-slate-700/50 px-4 py-2 flex items-center gap-3">
          <label className="text-xs font-medium text-slate-400">Brush Size:</label>
          <input
            type="range"
            min="1"
            max="15"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="flex-1 accent-cyan-500"
          />
          <span className="text-sm font-semibold text-cyan-400 w-6">{lineWidth}</span>
        </div>
      )}
    </div>
  );
}

// Helper function to determine if a color is light
function isLightColor(hex: string): boolean {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 180;
}
