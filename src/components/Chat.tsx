import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { getUserId, getUsername, getUserColor } from '../lib/userSession';
import { getSocket } from '../lib/socket';

interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  userColor: string;
  createdAt: Date;
}

interface ChatProps {
  boardId: string;
}

export default function Chat({ boardId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize socket connection for real-time chat
    socketRef.current = getSocket();
    const socket = socketRef.current;

    // Listen for incoming messages (real-time only, no history)
    socket.on('chat-message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [boardId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      if (socketRef.current) {
        socketRef.current.emit('chat-message', {
          boardId,
          message: newMessage.trim(),
        });
      }
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Chat Header */}
      <div className="bg-slate-800/80 backdrop-blur-xl p-3 sm:p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl">
            <MessageCircle size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Live Chat</h2>
            <p className="text-slate-400 text-[10px] sm:text-xs">{messages.length} messages</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-slate-900/50">
        {messages.length === 0 ? (
          <div className="text-center mt-8 sm:mt-12 flex flex-col items-center gap-2 sm:gap-3">
            <div className="p-3 sm:p-4 bg-slate-800/50 rounded-xl sm:rounded-2xl">
              <MessageCircle size={32} className="text-slate-600 sm:w-10 sm:h-10" />
            </div>
            <p className="font-semibold text-slate-500 text-sm sm:text-base">No messages yet</p>
            <p className="text-xs sm:text-sm text-slate-600">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwnMessage = msg.userId === getUserId();
            return (
              <div
                key={idx}
                className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                  <div
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg flex-shrink-0"
                    style={{ backgroundColor: msg.userColor }}
                    title={msg.username}
                  />
                  <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
                    {msg.username}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-600">
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
                <div
                  className={`max-w-[90%] sm:max-w-[85%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl break-words ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-sm'
                      : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700/50'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 sm:p-4 border-t border-slate-700/50 bg-slate-800/50">
        <div className="flex gap-1.5 sm:gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 transition-all text-xs sm:text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-1.5 sm:gap-2"
          >
            <Send size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
