import { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Trash2, Users, Pencil, Square, Circle, Minus, ArrowRight, 
  Type, Undo2, Redo2, Download, MousePointer, Hand, Highlighter,
  Image as ImageIcon, StickyNote, Pointer, Paintbrush, Eraser, Triangle,
  Star, Heart, PenTool, X
} from 'lucide-react';
import { getUserId, getUsername, getUserColor } from '../lib/userSession';
import { getSocket } from '../lib/socket';
import { api } from '../lib/api';

type Tool = 'select' | 'pan' | 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text' | 'highlighter' | 'laser' | 'stickynote' | 'image' | 'triangle' | 'star' | 'heart';

interface WhiteboardProps {
  boardId: string;
}

interface RemoteUser {
  odId: string;
  username: string;
  color: string;
  isDrawing?: boolean;
  tool?: string;
}

interface RemoteCursor {
  odId: string;
  username: string;
  color: string;
  x: number;
  y: number;
  isDrawing: boolean;
  lastUpdate: number;
  tool?: string;
}

interface LaserPoint {
  odId: string;
  username: string;
  color: string;
  x: number;
  y: number;
  timestamp: number;
}

interface StickyNoteData {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  width: number;
  height: number;
}

interface PlacedImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ShapeData {
  type: 'rectangle' | 'circle' | 'line' | 'arrow' | 'triangle' | 'star' | 'heart';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  lineWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  opacity: number;
  fill?: boolean;
  fillColor?: string;
}

interface TextData {
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
}

export default function Whiteboard({ boardId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const backgroundColorRef = useRef('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(3);
  const [strokeStyle, setStrokeStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [opacity, setOpacity] = useState(100);
  const [fill, setFill] = useState(false);
  const [activeUsers, setActiveUsers] = useState<RemoteUser[]>([]);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [laserPoints, setLaserPoints] = useState<LaserPoint[]>([]);
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>([]);
  const [placedImages, setPlacedImages] = useState<PlacedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [draggingImage, setDraggingImage] = useState<string | null>(null);
  const [imageDragOffset, setImageDragOffset] = useState({ x: 0, y: 0 });
  const [editingStickyNote, setEditingStickyNote] = useState<string | null>(null);
  const [draggingStickyNote, setDraggingStickyNote] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [textInput, setTextInput] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [textValue, setTextValue] = useState('');
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const cursorThrottleRef = useRef<number>(0);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 200));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0066FF', '#FFA500',
    '#FF69B4', '#00CED1', '#9400D3', '#FFD700', '#FFFFFF'
  ];

  const backgroundColors = [
    '#FFFFFF', '#FFE4E1', '#E8F5E9', '#E3F2FD', '#FFF9C4', '#F3E5F5', '#E0E0E0'
  ];

  const strokeWidths = [
    { label: 'S', value: 2 },
    { label: 'M', value: 5 },
    { label: 'L', value: 10 },
  ];

  // Save current canvas state for undo
  const saveToUndoStack = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-20), imageData]);
    setRedoStack([]);
  }, []);

  // Undo function
  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || undoStack.length === 0) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack(prev => [...prev, currentState]);

    const previousState = undoStack[undoStack.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setUndoStack(prev => prev.slice(0, -1));
  }, [undoStack]);

  // Redo function
  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || redoStack.length === 0) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, currentState]);

    const nextState = redoStack[redoStack.length - 1];
    ctx.putImageData(nextState, 0, 0);
    setRedoStack(prev => prev.slice(0, -1));
  }, [redoStack]);

  // Delete selected image
  const deleteSelectedImage = useCallback(() => {
    if (selectedImage) {
      setPlacedImages(prev => prev.filter(img => img.id !== selectedImage));
      setSelectedImage(null);
    }
  }, [selectedImage]);

  // Set stroke style on context
  const setContextStrokeStyle = useCallback((ctx: CanvasRenderingContext2D, style: 'solid' | 'dashed' | 'dotted') => {
    switch (style) {
      case 'dashed':
        ctx.setLineDash([10, 5]);
        break;
      case 'dotted':
        ctx.setLineDash([2, 4]);
        break;
      default:
        ctx.setLineDash([]);
    }
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, prevX: number, prevY: number, drawColor: string, drawWidth: number, drawOpacity: number = 100) => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = drawOpacity / 100;
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, []);

  // Draw shape on canvas
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: ShapeData) => {
    const { type, startX, startY, endX, endY, color: shapeColor, lineWidth: shapeWidth, strokeStyle: shapeStroke, opacity: shapeOpacity, fill: shapeFill, fillColor } = shape;

    ctx.beginPath();
    ctx.strokeStyle = shapeColor;
    ctx.lineWidth = shapeWidth;
    ctx.globalAlpha = shapeOpacity / 100;
    setContextStrokeStyle(ctx, shapeStroke);

    const width = endX - startX;
    const height = endY - startY;
    const centerX = startX + width / 2;
    const centerY = startY + height / 2;

    switch (type) {
      case 'rectangle':
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fillRect(startX, startY, width, height);
        }
        ctx.strokeRect(startX, startY, width, height);
        break;
      case 'circle': {
        const radiusX = Math.abs(width) / 2;
        const radiusY = Math.abs(height) / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'triangle': {
        ctx.moveTo(centerX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX, endY);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'star': {
        const outerRadius = Math.min(Math.abs(width), Math.abs(height)) / 2;
        const innerRadius = outerRadius * 0.4;
        const spikes = 5;
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        
        ctx.moveTo(centerX, centerY - outerRadius);
        for (let i = 0; i < spikes; i++) {
          ctx.lineTo(centerX + Math.cos(rot) * outerRadius, centerY + Math.sin(rot) * outerRadius);
          rot += step;
          ctx.lineTo(centerX + Math.cos(rot) * innerRadius, centerY + Math.sin(rot) * innerRadius);
          rot += step;
        }
        ctx.lineTo(centerX, centerY - outerRadius);
        ctx.closePath();
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'heart': {
        const size = Math.min(Math.abs(width), Math.abs(height)) / 2;
        ctx.moveTo(centerX, centerY + size * 0.5);
        ctx.bezierCurveTo(centerX - size, centerY - size * 0.5, centerX - size * 1.5, centerY + size * 0.5, centerX, centerY + size);
        ctx.bezierCurveTo(centerX + size * 1.5, centerY + size * 0.5, centerX + size, centerY - size * 0.5, centerX, centerY + size * 0.5);
        if (shapeFill) {
          ctx.fillStyle = fillColor || shapeColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }
      case 'line':
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
      case 'arrow': {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = 15;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      }
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  }, [setContextStrokeStyle]);

  // Draw text on canvas
  const drawText = useCallback((ctx: CanvasRenderingContext2D, textData: TextData) => {
    ctx.font = `${textData.fontSize}px Arial`;
    ctx.fillStyle = textData.color;
    ctx.fillText(textData.text, textData.x, textData.y);
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    backgroundColorRef.current = backgroundColor;
  }, [backgroundColor]);

  const loadDrawingHistory = useCallback(async () => {
    try {
      const response = await fetch(api.getBoardHistory(boardId));
      const { drawingEvents } = await response.json();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColorRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let lastBgColor = backgroundColorRef.current;
      drawingEvents?.forEach((event: { eventType: string; data: ShapeData | TextData | { x: number; y: number; prevX: number; prevY: number; color: string; lineWidth: number; opacity?: number; backgroundColor?: string } }) => {
        if (event.eventType === 'clear') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const clearData = event.data as { backgroundColor?: string };
          const bgColor = clearData?.backgroundColor || lastBgColor;
          lastBgColor = bgColor;
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Update state if history has a different background
          if (clearData?.backgroundColor) {
            setBackgroundColor(clearData.backgroundColor);
            backgroundColorRef.current = clearData.backgroundColor;
          }
        } else if (event.eventType === 'shape') {
          drawShape(ctx, event.data as ShapeData);
        } else if (event.eventType === 'text') {
          drawText(ctx, event.data as TextData);
        } else {
          const data = event.data as { x: number; y: number; prevX: number; prevY: number; color: string; lineWidth: number; opacity?: number };
          const { x, y, prevX, prevY, color: eventColor, lineWidth: eventWidth, opacity: eventOpacity } = data;
          if (x !== undefined && y !== undefined && prevX !== undefined && prevY !== undefined) {
            draw(ctx, x, y, prevX, prevY, eventColor || '#000000', eventWidth || 2, eventOpacity || 100);
          }
        }
      });
    } catch (error) {
      console.error('Error loading drawing history:', error);
    }
  }, [boardId, draw, drawShape, drawText]);

  // Export canvas as image
  const exportAsImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `drawflow-board-${boardId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [boardId]);

  // Canvas resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        overlayCanvas.width = container.clientWidth;
        overlayCanvas.height = container.clientHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = backgroundColorRef.current;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        loadDrawingHistory();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [loadDrawingHistory]);

  // Background color change effect - uses a ref to track if this is the initial load
  const isInitialLoadRef = useRef(true);
  const previousBgColorRef = useRef(backgroundColor);
  
  useEffect(() => {
    // Skip effect on initial mount
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      previousBgColorRef.current = backgroundColor;
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    // Get current canvas content
    const currentContent = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = currentContent.data;
    
    // Convert previous and new background colors to RGB
    const prevColor = previousBgColorRef.current;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // Get previous background RGB
    tempCtx.fillStyle = prevColor;
    tempCtx.fillRect(0, 0, 1, 1);
    const prevRGB = tempCtx.getImageData(0, 0, 1, 1).data;
    
    // Get new background RGB
    tempCtx.fillStyle = backgroundColor;
    tempCtx.fillRect(0, 0, 1, 1);
    const newRGB = tempCtx.getImageData(0, 0, 1, 1).data;
    
    // Replace old background color with new background color
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === prevRGB[0] && data[i + 1] === prevRGB[1] && data[i + 2] === prevRGB[2]) {
        data[i] = newRGB[0];
        data[i + 1] = newRGB[1];
        data[i + 2] = newRGB[2];
      }
    }
    
    ctx.putImageData(currentContent, 0, 0);
    previousBgColorRef.current = backgroundColor;
  }, [backgroundColor]);

  // Image dragging effect
  useEffect(() => {
    if (!draggingImage) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - imageDragOffset.x;
      const y = e.clientY - rect.top - imageDragOffset.y;

      setPlacedImages(prev => prev.map(img => 
        img.id === draggingImage 
          ? { ...img, x: Math.max(0, x), y: Math.max(0, y) }
          : img
      ));
    };

    const handleMouseUp = () => {
      setDraggingImage(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingImage, imageDragOffset]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
      
      // Delete selected image
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedImage && !textInput.visible) {
        e.preventDefault();
        deleteSelectedImage();
      }
      
      if (!e.ctrlKey && !e.metaKey && !textInput.visible) {
        switch (e.key.toLowerCase()) {
          case 'v': setTool('select'); break;
          case 'h': setTool('pan'); break;
          case 'p': setTool('pen'); break;
          case 'e': setTool('eraser'); break;
          case 'r': setTool('rectangle'); break;
          case 'o': setTool('circle'); break;
          case 'l': setTool('line'); break;
          case 'a': setTool('arrow'); break;
          case 't': setTool('text'); break;
          case 'g': setTool('highlighter'); break;
          case 'k': setTool('laser'); break;
          case 's': setTool('stickynote'); break;
          case 'i': setTool('triangle'); break;
          case 'x': setTool('star'); break;
          case 'c': setTool('heart'); break;
          case 'escape': 
            setTool('select'); 
            setSelectedImage(null);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, textInput.visible, selectedImage, deleteSelectedImage]);

  // Sticky note dragging
  useEffect(() => {
    if (!draggingStickyNote) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;

      setStickyNotes(prev => prev.map(note => 
        note.id === draggingStickyNote 
          ? { ...note, x: Math.max(0, x), y: Math.max(0, y) }
          : note
      ));
    };

    const handleMouseUp = () => {
      const note = stickyNotes.find(n => n.id === draggingStickyNote);
      if (note && socketRef.current) {
        socketRef.current.emit('stickynote-update', { boardId, ...note });
      }
      setDraggingStickyNote(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingStickyNote, dragOffset, stickyNotes, boardId]);

  // Socket connection and event handlers
  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;
    const myUserId = getUserId();

    socket.emit('join-board', {
      userId: myUserId,
      boardId,
      username: getUsername(),
      color: getUserColor(),
    });

    socket.on('draw', (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      const { x, y, prevX, prevY, color: eventColor, lineWidth: eventWidth, opacity: eventOpacity } = data;
      if (x !== undefined && y !== undefined && prevX !== undefined && prevY !== undefined) {
        draw(ctx, x, y, prevX, prevY, eventColor || '#000000', eventWidth || 2, eventOpacity || 100);
      }
    });

    socket.on('shape', (data: ShapeData) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      drawShape(ctx, data);
    });

    socket.on('text', (data: TextData) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      drawText(ctx, data);
    });

    socket.on('clear-board', (data: { backgroundColor?: string }) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bgColor = data?.backgroundColor || backgroundColorRef.current;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (data?.backgroundColor) {
        setBackgroundColor(data.backgroundColor);
        backgroundColorRef.current = data.backgroundColor;
      }
    });

    socket.on('cursor-update', (data: { odId: string; username: string; color: string; x: number; y: number; isDrawing: boolean; tool?: string }) => {
      if (data.odId === myUserId) return;
      
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.odId, {
          ...data,
          lastUpdate: Date.now(),
        });
        return newMap;
      });

      setActiveUsers((prev) => 
        prev.map((user) => 
          user.odId === data.odId ? { ...user, isDrawing: data.isDrawing, tool: data.tool } : user
        )
      );
    });

    // Laser pointer from other users
    socket.on('laser', (data: { odId: string; username: string; color: string; x: number; y: number }) => {
      if (data.odId === myUserId) return;
      
      setLaserPoints(prev => [...prev.filter(p => Date.now() - p.timestamp < 800), {
        ...data,
        timestamp: Date.now(),
      }]);
    });

    // Sticky note from other users
    socket.on('stickynote', (data: StickyNoteData) => {
      setStickyNotes(prev => [...prev.filter(n => n.id !== data.id), data]);
    });

    // Sticky note update
    socket.on('stickynote-update', (data: StickyNoteData) => {
      setStickyNotes(prev => prev.map(n => n.id === data.id ? data : n));
    });

    // Sticky note delete
    socket.on('stickynote-delete', (data: { id: string }) => {
      setStickyNotes(prev => prev.filter(n => n.id !== data.id));
    });

    // Highlight from other users
    socket.on('highlight', (data: { x: number; y: number; prevX: number; prevY: number; color: string }) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(data.prevX, data.prevY);
      ctx.lineTo(data.x, data.y);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    socket.on('cursor-remove', (data: { odId: string }) => {
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.odId);
        return newMap;
      });
    });

    socket.on('user-joined', (data) => {
      if (data.allUsers) {
        setActiveUsers(data.allUsers.map((u: { odId: string; username: string; color: string }) => ({
          odId: u.odId,
          username: u.username,
          color: u.color,
          isDrawing: false,
        })));
      } else {
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

    socket.on('user-left', (data) => {
      setActiveUsers((prev) => prev.filter((u) => u.odId !== data.odId));
      setActiveUserCount(data.activeUsersCount);
      setRemoteCursors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.odId);
        return newMap;
      });
    });

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
      socket.off('shape');
      socket.off('text');
      socket.off('clear-board');
      socket.off('cursor-update');
      socket.off('cursor-remove');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('laser');
      socket.off('stickynote');
      socket.off('stickynote-update');
      socket.off('stickynote-delete');
      socket.off('highlight');
      clearInterval(cursorCleanup);
    };
  }, [boardId, draw, drawShape, drawText]);

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

  const emitCursorPosition = useCallback((x: number, y: number, drawing: boolean) => {
    const now = Date.now();
    if (now - cursorThrottleRef.current < 30) return;
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
    
    // Laser pointer - broadcast position
    if (tool === 'laser') {
      if (socketRef.current) {
        socketRef.current.emit('laser', {
          boardId,
          x,
          y,
          color: getUserColor(),
          username: getUsername(),
        });
      }
      setLaserPoints(prev => [...prev.filter(p => Date.now() - p.timestamp < 800), {
        odId: getUserId(),
        username: getUsername(),
        color: getUserColor(),
        x,
        y,
        timestamp: Date.now(),
      }]);
    }
    
    if (isDrawing) {
      if (tool === 'pan' && panStartRef.current) {
        setPanOffset({
          x: panOffset.x + (x - panStartRef.current.x),
          y: panOffset.y + (y - panStartRef.current.y),
        });
        panStartRef.current = { x, y };
      } else if (['rectangle', 'circle', 'line', 'arrow', 'triangle', 'star', 'heart'].includes(tool) && shapeStartRef.current) {
        const overlayCanvas = overlayCanvasRef.current;
        const ctx = overlayCanvas?.getContext('2d');
        if (ctx && overlayCanvas) {
          ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          drawShape(ctx, {
            type: tool as 'rectangle' | 'circle' | 'line' | 'arrow' | 'triangle' | 'star' | 'heart',
            startX: shapeStartRef.current.x,
            startY: shapeStartRef.current.y,
            endX: x,
            endY: y,
            color,
            lineWidth,
            strokeStyle,
            opacity,
            fill,
            fillColor: color,
          });
        }
      } else if (tool === 'highlighter') {
        // Highlighter - semi-transparent wide stroke
        continueHighlighting(e);
      } else {
        continueDrawing(e);
      }
    }
  };

  const continueHighlighting = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!lastPosRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (socketRef.current) {
      socketRef.current.emit('highlight', {
        boardId,
        x,
        y,
        prevX: lastPosRef.current.x,
        prevY: lastPosRef.current.y,
        color,
      });
    }

    lastPosRef.current = { x, y };
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

    if (tool === 'text') {
      setTextInput({ x, y, visible: true });
      setTextValue('');
      return;
    }

    if (tool === 'stickynote') {
      handleStickyNoteClick(x, y);
      return;
    }

    if (tool === 'laser') {
      return; // Laser is handled in mousemove
    }

    if (tool === 'select') return;

    saveToUndoStack();

    setIsDrawing(true);
    lastPosRef.current = { x, y };
    
    if (['rectangle', 'circle', 'line', 'arrow', 'triangle', 'star', 'heart'].includes(tool)) {
      shapeStartRef.current = { x, y };
    }
    
    if (tool === 'pan') {
      panStartRef.current = { x, y };
    }
    
    emitCursorPosition(x, y, true);
  };

  const continueDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPosRef.current) return;
    if (['rectangle', 'circle', 'line', 'arrow', 'triangle', 'star', 'heart', 'pan', 'select', 'text', 'laser', 'stickynote'].includes(tool)) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    const currentColor = tool === 'eraser' ? backgroundColor : color;
    const currentWidth = tool === 'eraser' ? 20 : tool === 'highlighter' ? 20 : lineWidth;
    const currentOpacity = tool === 'highlighter' ? 30 : opacity;

    if (tool === 'highlighter') {
      ctx.globalAlpha = 0.3;
    }
    
    draw(ctx, x, y, lastPosRef.current.x, lastPosRef.current.y, currentColor, currentWidth, currentOpacity);
    
    ctx.globalAlpha = 1;

    if (socketRef.current) {
      socketRef.current.emit('draw', {
        boardId,
        x,
        y,
        prevX: lastPosRef.current.x,
        prevY: lastPosRef.current.y,
        color: currentColor,
        lineWidth: currentWidth,
        opacity: currentOpacity,
        tool,
      });
    }

    lastPosRef.current = { x, y };
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing && ['rectangle', 'circle', 'line', 'arrow', 'triangle', 'star', 'heart'].includes(tool) && shapeStartRef.current && e) {
      const { x, y } = getCoordinates(e);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (ctx) {
        const shapeData: ShapeData = {
          type: tool as 'rectangle' | 'circle' | 'line' | 'arrow' | 'triangle' | 'star' | 'heart',
          startX: shapeStartRef.current.x,
          startY: shapeStartRef.current.y,
          endX: x,
          endY: y,
          color,
          lineWidth,
          strokeStyle,
          opacity,
          fill,
          fillColor: color,
        };
        
        drawShape(ctx, shapeData);

        if (socketRef.current) {
          socketRef.current.emit('shape', {
            boardId,
            ...shapeData,
          });
        }
      }

      const overlayCanvas = overlayCanvasRef.current;
      const overlayCtx = overlayCanvas?.getContext('2d');
      if (overlayCtx && overlayCanvas) {
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      }
    }

    setIsDrawing(false);
    lastPosRef.current = null;
    shapeStartRef.current = null;
    panStartRef.current = null;
    
    if (socketRef.current) {
      socketRef.current.emit('cursor-move', {
        boardId,
        x: -1,
        y: -1,
        isDrawing: false,
      });
    }
  };

  const handleTextSubmit = () => {
    if (!textValue.trim()) {
      setTextInput({ ...textInput, visible: false });
      return;
    }

    saveToUndoStack();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const textData: TextData = {
      x: textInput.x,
      y: textInput.y,
      text: textValue,
      color,
      fontSize: lineWidth * 6 + 12,
    };

    drawText(ctx, textData);

    if (socketRef.current) {
      socketRef.current.emit('text', {
        boardId,
        ...textData,
      });
    }

    setTextInput({ ...textInput, visible: false });
    setTextValue('');
  };

  const clearCanvas = () => {
    saveToUndoStack();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (socketRef.current) {
      socketRef.current.emit('clear-board', { boardId, backgroundColor });
    }
  };

  // Custom cursor SVGs
  const cursorIcons = {
    pen: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/%3E%3Cpath d='m15 5 4 4'/%3E%3C/svg%3E") 2 22, crosshair`,
    eraser: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23fff' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='8' width='16' height='12' rx='2'/%3E%3Cpath d='M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'/%3E%3C/svg%3E") 12 20, crosshair`,
    highlighter: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FFFF00' fill-opacity='0.5' stroke='%23333' stroke-width='1.5'%3E%3Cpath d='m9 11-6 6v3h9l3-3'/%3E%3Cpath d='m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4'/%3E%3C/svg%3E") 2 22, crosshair`,
    laser: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FF0000' stroke='%23FF0000' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Ccircle cx='12' cy='12' r='8' fill='none' opacity='0.3'/%3E%3C/svg%3E") 12 12, crosshair`,
    rectangle: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Cline x1='3' y1='3' x2='21' y2='21' stroke='%23999' stroke-dasharray='2'/%3E%3C/svg%3E") 0 0, crosshair`,
    circle: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cline x1='3' y1='3' x2='21' y2='21' stroke='%23999' stroke-dasharray='2'/%3E%3C/svg%3E") 0 0, crosshair`,
    triangle: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M12 2 L22 20 L2 20 Z'/%3E%3C/svg%3E") 0 0, crosshair`,
    star: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FFD700' stroke='%23333' stroke-width='1'%3E%3Cpolygon points='12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9'/%3E%3C/svg%3E") 12 12, crosshair`,
    heart: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FF69B4' stroke='%23333' stroke-width='1'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E") 12 12, crosshair`,
    stickynote: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23FFEB3B' stroke='%23333' stroke-width='1.5'%3E%3Cpath d='M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z'/%3E%3Cpath d='M15 3v6h6'/%3E%3C/svg%3E") 0 0, crosshair`,
    image: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E") 0 0, crosshair`,
    line: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cline x1='5' y1='12' x2='19' y2='12'/%3E%3Ccircle cx='3' cy='12' r='2' fill='%23666'/%3E%3C/svg%3E") 0 12, crosshair`,
    arrow: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cline x1='5' y1='12' x2='19' y2='12'/%3E%3Cpath d='m12 5 7 7-7 7'/%3E%3C/svg%3E") 0 12, crosshair`,
  };

  const getCursor = () => {
    switch (tool) {
      case 'select': return 'default';
      case 'pan': return isDrawing ? 'grabbing' : 'grab';
      case 'text': return 'text';
      case 'pen': return cursorIcons.pen;
      case 'eraser': return cursorIcons.eraser;
      case 'highlighter': return cursorIcons.highlighter;
      case 'laser': return cursorIcons.laser;
      case 'rectangle': return cursorIcons.rectangle;
      case 'circle': return cursorIcons.circle;
      case 'triangle': return cursorIcons.triangle;
      case 'star': return cursorIcons.star;
      case 'heart': return cursorIcons.heart;
      case 'stickynote': return cursorIcons.stickynote;
      case 'image': return cursorIcons.image;
      case 'line': return cursorIcons.line;
      case 'arrow': return cursorIcons.arrow;
      default: return 'crosshair';
    }
  };

  // Handle laser pointer movement
  useEffect(() => {
    if (tool !== 'laser') return;
    
    const cleanup = setInterval(() => {
      setLaserPoints(prev => prev.filter(p => Date.now() - p.timestamp < 1000));
    }, 100);

    return () => clearInterval(cleanup);
  }, [tool]);

  // Handle sticky note creation
  const handleStickyNoteClick = (x: number, y: number) => {
    const newNote: StickyNoteData = {
      id: `note-${Date.now()}`,
      x,
      y,
      text: '',
      color: '#FFEB3B',
      width: 200,
      height: 150,
    };
    setStickyNotes(prev => [...prev, newNote]);
    setEditingStickyNote(newNote.id);
    
    if (socketRef.current) {
      socketRef.current.emit('stickynote', { boardId, ...newNote });
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const container = containerRef.current;
        if (!container) return;

        // Calculate size - max 400x400
        const maxSize = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }
        
        // Place image in center of visible area
        const x = (container.clientWidth - width) / 2;
        const y = (container.clientHeight - height) / 2;
        
        const newImage: PlacedImage = {
          id: `img-${Date.now()}`,
          src: event.target?.result as string,
          x,
          y,
          width,
          height,
        };
        
        setPlacedImages(prev => [...prev, newImage]);
        setSelectedImage(newImage.id);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setTool('select');
  };

  const drawingUsers = activeUsers.filter(u => u.isDrawing);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select (V)', group: 'basic' },
    { id: 'pan', icon: Hand, label: 'Pan (H)', group: 'basic' },
    { id: 'pen', icon: PenTool, label: 'Pen (P)', group: 'draw' },
    { id: 'highlighter', icon: Highlighter, label: 'Highlighter (G)', group: 'draw' },
    { id: 'laser', icon: Pointer, label: 'Laser Pointer (K)', group: 'draw' },
    { id: 'rectangle', icon: Square, label: 'Rectangle (R)', group: 'shape' },
    { id: 'circle', icon: Circle, label: 'Circle (O)', group: 'shape' },
    { id: 'triangle', icon: Triangle, label: 'Triangle (I)', group: 'shape' },
    { id: 'star', icon: Star, label: 'Star (X)', group: 'shape' },
    { id: 'heart', icon: Heart, label: 'Heart (C)', group: 'shape' },
    { id: 'line', icon: Minus, label: 'Line (L)', group: 'shape' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow (A)', group: 'shape' },
    { id: 'text', icon: Type, label: 'Text (T)', group: 'insert' },
    { id: 'stickynote', icon: StickyNote, label: 'Sticky Note (S)', group: 'insert' },
    { id: 'image', icon: ImageIcon, label: 'Insert Image', group: 'insert' },
  ];

  const stickyNoteColors = ['#FFEB3B', '#FF9800', '#4CAF50', '#03A9F4', '#E91E63', '#9C27B0'];

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Top Toolbar - Organized by groups */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 p-2 flex items-center justify-center gap-2">
        {/* Basic Tools */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-xl">
          {tools.filter(t => t.group === 'basic').map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id as Tool)}
              className={`p-2 rounded-lg transition-all ${
                tool === t.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-600/50'
              }`}
              title={t.label}
            >
              <t.icon size={18} />
            </button>
          ))}
        </div>

        {/* Drawing Tools */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-xl">
          {tools.filter(t => t.group === 'draw').map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id as Tool)}
              className={`p-2 rounded-lg transition-all ${
                tool === t.id
                  ? t.id === 'laser' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
                    : t.id === 'highlighter'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-500/30'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-600/50'
              }`}
              title={t.label}
            >
              <t.icon size={18} />
            </button>
          ))}
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-all ${
              tool === 'eraser'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-600/50'
            }`}
            title="Eraser (E)"
          >
            <Eraser size={18} />
          </button>
        </div>

        {/* Shape Tools */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-xl">
          {tools.filter(t => t.group === 'shape').map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id as Tool)}
              className={`p-2 rounded-lg transition-all ${
                tool === t.id
                  ? t.id === 'star'
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
                    : t.id === 'heart'
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-600/50'
              }`}
              title={t.label}
            >
              <t.icon size={18} />
            </button>
          ))}
        </div>

        {/* Insert Tools */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-xl">
          {tools.filter(t => t.group === 'insert').map((t) => (
            <button
              key={t.id}
              onClick={() => {
                if (t.id === 'image') {
                  fileInputRef.current?.click();
                } else {
                  setTool(t.id as Tool);
                }
              }}
              className={`p-2 rounded-lg transition-all ${
                tool === t.id
                  ? t.id === 'stickynote'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-800 shadow-lg'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-600/50'
              }`}
              title={t.label}
            >
              <t.icon size={18} />
            </button>
          ))}
        </div>

        {/* Color Quick Select */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-xl">
          {colors.slice(0, 6).map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`relative w-7 h-7 rounded-lg transition-all hover:scale-110 ${
                color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-700' : ''
              }`}
              title={c}
            >
              <Paintbrush 
                size={16} 
                className="absolute inset-0 m-auto"
                style={{ color: c === '#000000' ? '#333' : c }}
                fill={c}
              />
            </button>
          ))}
        </div>

        {/* Fill toggle for shapes */}
        {['rectangle', 'circle', 'triangle', 'star', 'heart'].includes(tool) && (
          <button
            onClick={() => setFill(!fill)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              fill
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            {fill ? 'Filled' : 'Outline'}
          </button>
        )}

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-xl">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className={`p-2 rounded-lg transition-all ${
              undoStack.length > 0
                ? 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className={`p-2 rounded-lg transition-all ${
              redoStack.length > 0
                ? 'text-slate-300 hover:bg-slate-600/50 hover:text-white'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Properties */}
        <div className="w-52 bg-slate-800/50 border-r border-slate-700/50 p-3 space-y-4 overflow-y-auto">
          {/* Stroke Color */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Stroke</label>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-lg transition-all shadow-sm hover:scale-110 ${
                    color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-800' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Background</label>
            <div className="flex flex-wrap gap-1.5">
              {backgroundColors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setBackgroundColor(c);
                  }}
                  className={`w-6 h-6 rounded-lg border transition-all hover:scale-110 ${
                    backgroundColor === c 
                      ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-800 border-cyan-400' 
                      : 'border-slate-600'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Stroke width</label>
            <div className="flex gap-1.5">
              {strokeWidths.map((sw) => (
                <button
                  key={sw.value}
                  onClick={() => setLineWidth(sw.value)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    lineWidth === sw.value
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <div 
                      className="bg-current rounded-full"
                      style={{ width: sw.value + 2, height: sw.value + 2 }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Style */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Stroke style</label>
            <div className="flex gap-1.5">
              {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setStrokeStyle(style)}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    strokeStyle === style
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div 
                      className={`w-8 border-t-2 ${
                        style === 'solid' ? 'border-solid' : 
                        style === 'dashed' ? 'border-dashed' : 'border-dotted'
                      } border-current`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Opacity</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
              <span className="text-xs text-slate-300 w-8">{opacity}</span>
            </div>
          </div>

          {/* Layers */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">Layers</label>
            <div className="text-xs text-slate-500 bg-slate-700/30 rounded-lg p-3 text-center">
              Coming soon...
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Drawing Status */}
          {drawingUsers.length > 0 && (
            <div className="bg-amber-500/20 border-b border-amber-500/30 px-3 py-2 flex items-center gap-2 animate-pulse">
              <Pencil size={14} className="text-amber-400" />
              <span className="text-amber-300 text-xs">
                {drawingUsers.map(u => u.username).join(', ')} {drawingUsers.length === 1 ? 'is' : 'are'} drawing...
              </span>
            </div>
          )}

          {/* User Panel */}
          {showUserPanel && (
            <div className="bg-slate-800/90 border-b border-slate-700/30 px-3 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-slate-400" />
                <span className="text-slate-300 text-xs font-medium">Active Users</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {activeUsers.map((user) => (
                  <div 
                    key={user.odId} 
                    className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs border ${
                      user.isDrawing 
                        ? 'bg-amber-500/20 border-amber-500/50 animate-pulse' 
                        : 'bg-slate-700/50 border-slate-600/50'
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-slate-300">{user.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canvas Container */}
          <div 
            ref={containerRef} 
            className="flex-1 relative bg-slate-100 overflow-auto"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              style={{ 
                transform: `scale(${zoom / 100})`, 
                transformOrigin: 'top left',
                width: zoom !== 100 ? `${10000 / zoom}%` : '100%',
                height: zoom !== 100 ? `${10000 / zoom}%` : '100%'
              }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDrawing}
                onMouseLeave={() => stopDrawing()}
                onTouchStart={startDrawing}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => stopDrawing()}
                className="absolute inset-0 touch-none"
                style={{ cursor: getCursor(), backgroundColor }}
              />
              <canvas
                ref={overlayCanvasRef}
                className="absolute inset-0 pointer-events-none"
              />
            </div>

            {/* Text Input */}
            {textInput.visible && (
              <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onBlur={handleTextSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTextSubmit();
                  if (e.key === 'Escape') setTextInput({ ...textInput, visible: false });
                }}
                className="absolute bg-transparent border-none outline-none"
                style={{
                  left: textInput.x,
                  top: textInput.y - 10,
                  color: color,
                  fontSize: lineWidth * 6 + 12,
                }}
                autoFocus
              />
            )}
            
            {/* Remote Cursors */}
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
                  <div 
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${cursor.isDrawing ? 'animate-pulse scale-125' : ''}`}
                    style={{ backgroundColor: cursor.color }}
                  />
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

            {/* Laser Pointer Effects */}
            {laserPoints.map((point, index) => {
              const age = Date.now() - point.timestamp;
              const fadeOpacity = Math.max(0, 1 - age / 800);
              const scale = 1 + (age / 800) * 0.5;
              
              return (
                <div
                  key={`${point.odId}-${index}`}
                  className="absolute pointer-events-none z-40"
                  style={{
                    left: point.x,
                    top: point.y,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    opacity: fadeOpacity,
                  }}
                >
                  {/* Outer glow */}
                  <div 
                    className="w-8 h-8 rounded-full absolute -inset-2"
                    style={{ 
                      backgroundColor: point.color,
                      filter: 'blur(8px)',
                      opacity: 0.5,
                    }}
                  />
                  {/* Inner dot */}
                  <div 
                    className="w-4 h-4 rounded-full relative shadow-lg"
                    style={{ 
                      backgroundColor: point.color,
                      boxShadow: `0 0 20px ${point.color}, 0 0 40px ${point.color}`,
                    }}
                  />
                  {/* Username */}
                  <div 
                    className="absolute left-6 top-0 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap"
                    style={{ 
                      backgroundColor: point.color,
                      color: isLightColor(point.color) ? '#000' : '#fff'
                    }}
                  >
                    🔴 {point.username}
                  </div>
                </div>
              );
            })}

            {/* Sticky Notes */}
            {stickyNotes.map((note) => (
              <div
                key={note.id}
                className={`absolute shadow-lg rounded select-none ${draggingStickyNote === note.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                  left: note.x,
                  top: note.y,
                  width: note.width,
                  minHeight: note.height,
                  backgroundColor: note.color,
                  zIndex: draggingStickyNote === note.id ? 50 : 30,
                  transition: draggingStickyNote === note.id ? 'none' : 'box-shadow 0.2s',
                  boxShadow: draggingStickyNote === note.id ? '0 10px 40px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.15)',
                }}
                onMouseDown={(e) => {
                  if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'BUTTON') return;
                  e.preventDefault();
                  setDraggingStickyNote(note.id);
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
              >
                {/* Drag handle */}
                <div className="h-5 bg-black/10 rounded-t flex items-center justify-center cursor-grab">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-black/30" />
                    <div className="w-1 h-1 rounded-full bg-black/30" />
                    <div className="w-1 h-1 rounded-full bg-black/30" />
                  </div>
                </div>
                <div className="p-2 h-full flex flex-col">
                  {/* Color picker bar */}
                  <div className="flex gap-1 mb-2 pb-2 border-b border-black/10">
                    {stickyNoteColors.map((c) => (
                      <button
                        key={c}
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = { ...note, color: c };
                          setStickyNotes(prev => prev.map(n => n.id === note.id ? updated : n));
                          if (socketRef.current) {
                            socketRef.current.emit('stickynote-update', { boardId, ...updated });
                          }
                        }}
                        className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${note.color === c ? 'ring-2 ring-black/30' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStickyNotes(prev => prev.filter(n => n.id !== note.id));
                        if (socketRef.current) {
                          socketRef.current.emit('stickynote-delete', { boardId, id: note.id });
                        }
                      }}
                      className="ml-auto text-black/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {/* Text content */}
                  {editingStickyNote === note.id ? (
                    <textarea
                      autoFocus
                      value={note.text}
                      onChange={(e) => {
                        const updated = { ...note, text: e.target.value };
                        setStickyNotes(prev => prev.map(n => n.id === note.id ? updated : n));
                      }}
                      onBlur={() => {
                        setEditingStickyNote(null);
                        if (socketRef.current) {
                          socketRef.current.emit('stickynote-update', { boardId, ...note });
                        }
                      }}
                      className="flex-1 bg-transparent resize-none outline-none text-black/80 text-sm placeholder-black/40"
                      placeholder="Type your note..."
                    />
                  ) : (
                    <div
                      onClick={() => setEditingStickyNote(note.id)}
                      className="flex-1 text-black/80 text-sm cursor-text min-h-[60px]"
                    >
                      {note.text || <span className="text-black/40">Click to edit...</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Placed Images */}
            {placedImages.map((img) => (
              <div
                key={img.id}
                className={`absolute ${draggingImage === img.id ? 'cursor-grabbing' : 'cursor-move'} ${selectedImage === img.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''}`}
                style={{
                  left: img.x,
                  top: img.y,
                  width: img.width,
                  height: img.height,
                  zIndex: draggingImage === img.id ? 50 : 25,
                  transition: draggingImage === img.id ? 'none' : 'box-shadow 0.2s',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(img.id);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedImage(img.id);
                  setDraggingImage(img.id);
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setImageDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
              >
                <img
                  src={img.src}
                  alt="Uploaded"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
                {selectedImage === img.id && (
                  <>
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSelectedImage();
                      }}
                      className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                      title="Delete image"
                    >
                      <X size={14} />
                    </button>
                    {/* Move handle indicator */}
                    <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none" />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                      Drag to move • Press Delete to remove
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-slate-800/80 border-t border-slate-700/50 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg px-2 py-1">
                <button 
                  onClick={zoomOut}
                  disabled={zoom <= 25}
                  className="text-slate-400 hover:text-white p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom Out"
                >−</button>
                <span className="text-xs text-slate-300 w-12 text-center">{zoom}%</span>
                <button 
                  onClick={zoomIn}
                  disabled={zoom >= 200}
                  className="text-slate-400 hover:text-white p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom In"
                >+</button>
              </div>
              
              {/* Undo/Redo */}
              <div className="flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
                <button
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 size={16} />
                </button>
                <button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Export */}
              <button
                onClick={exportAsImage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-xs transition-all"
              >
                <Download size={14} />
                Export
              </button>

              {/* Clear */}
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs border border-red-500/30 transition-all"
              >
                <Trash2 size={14} />
                Clear
              </button>

              {/* Users */}
              <button
                onClick={() => setShowUserPanel(!showUserPanel)}
                className="flex items-center gap-1.5 bg-green-500/20 rounded-lg px-3 py-1.5 border border-green-500/30 hover:bg-green-500/30 transition-all"
              >
                <Users size={14} className="text-green-400" />
                <span className="font-semibold text-green-400 text-xs">{activeUserCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 180;
}
