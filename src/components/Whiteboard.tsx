import { useRef, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getUserId } from '../lib/userSession';

type Tool = 'pen' | 'eraser';

interface WhiteboardProps {
  boardId: string;
}

export default function Whiteboard({ boardId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

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

  const saveDrawingEvent = async (x: number, y: number, prevX: number, prevY: number) => {
    try {
      await supabase.from('drawing_events').insert({
        board_id: boardId,
        user_id: getUserId(),
        event_type: tool === 'eraser' ? 'erase' : 'draw',
        data: {
          x,
          y,
          prevX,
          prevY,
          color: tool === 'eraser' ? '#FFFFFF' : color,
          lineWidth: tool === 'eraser' ? 20 : lineWidth,
          tool
        }
      });
    } catch (error) {
      console.error('Error saving drawing event:', error);
    }
  };

  const loadDrawingEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('drawing_events')
        .select('*')
        .eq('board_id', boardId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      data?.forEach((event) => {
        const { x, y, prevX, prevY, color: eventColor, lineWidth: eventWidth } = event.data;
        if (x !== undefined && y !== undefined && prevX !== undefined && prevY !== undefined) {
          draw(ctx, x, y, prevX, prevY, eventColor || '#000000', eventWidth || 2);
        }
      });
    } catch (error) {
      console.error('Error loading drawing events:', error);
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
        loadDrawingEvents();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [loadDrawingEvents]);

  useEffect(() => {
    const channel = supabase
      .channel(`board:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'drawing_events',
          filter: `board_id=eq.${boardId}`
        },
        (payload) => {
          const event = payload.new;
          if (event.user_id === getUserId()) return;

          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (!ctx) return;

          const { x, y, prevX, prevY, color: eventColor, lineWidth: eventWidth } = event.data;
          if (x !== undefined && y !== undefined && prevX !== undefined && prevY !== undefined) {
            draw(ctx, x, y, prevX, prevY, eventColor || '#000000', eventWidth || 2);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, draw]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
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
    saveDrawingEvent(x, y, lastPosRef.current.x, lastPosRef.current.y);

    lastPosRef.current = { x, y };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const clearCanvas = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      await supabase
        .from('drawing_events')
        .delete()
        .eq('board_id', boardId);
    } catch (error) {
      console.error('Error clearing canvas:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tool === 'pen'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pen
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tool === 'eraser'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Eraser
          </button>
        </div>

        {tool === 'pen' && (
          <>
            <div className="flex gap-2 items-center">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-blue-600 ring-offset-2 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Size:</label>
              <input
                type="range"
                min="1"
                max="10"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-600 w-6">{lineWidth}</span>
            </div>
          </>
        )}

        <button
          onClick={clearCanvas}
          className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Clear Board
        </button>
      </div>

      <div className="flex-1 relative bg-gray-50">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={continueDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={continueDrawing}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
}
