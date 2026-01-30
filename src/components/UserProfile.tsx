import { useState, useEffect } from 'react';
import { X, User, Edit2, Check, Palette } from 'lucide-react';
import { getOrCreateSession, setUsername, setUserColor } from '../lib/userSession';

const AVAILABLE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#F1948A', '#82E0AA',
  '#F8B500', '#E74C3C', '#3498DB', '#9B59B6', '#1ABC9C'
];

interface Session {
  userId: string;
  username: string;
  userColor: string;
  createdAt: number;
  lastLogin: number;
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onUsernameChange?: (newUsername: string) => void;
  onColorChange?: (newColor: string) => void;
}

export default function UserProfile({ isOpen, onClose, onUsernameChange, onColorChange }: UserProfileProps) {
  const [session, setSession] = useState<Session>(getOrCreateSession() as Session);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingColor, setIsEditingColor] = useState(false);
  const [newUsername, setNewUsername] = useState(session.username);

  useEffect(() => {
    if (isOpen) {
      const currentSession = getOrCreateSession() as Session;
      setSession(currentSession);
      setNewUsername(currentSession.username);
    }
  }, [isOpen]);

  const handleSaveUsername = () => {
    if (newUsername.trim() && newUsername !== session.username) {
      setUsername(newUsername.trim());
      const updatedSession = getOrCreateSession();
      setSession(updatedSession);
      onUsernameChange?.(newUsername.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveUsername();
    } else if (e.key === 'Escape') {
      setNewUsername(session.username);
      setIsEditing(false);
    }
  };

  const handleColorChange = (color: string) => {
    setUserColor(color);
    const updatedSession = getOrCreateSession() as Session;
    setSession(updatedSession);
    onColorChange?.(color);
    setIsEditingColor(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md mx-2 sm:mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <User size={20} className="text-cyan-400 sm:w-6 sm:h-6" />
              User Profile
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X size={18} className="text-slate-400 hover:text-white sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Avatar & Username */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg flex-shrink-0"
              style={{ backgroundColor: session.userColor }}
            >
              {session.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter username"
                    autoFocus
                    maxLength={20}
                  />
                  <button
                    onClick={handleSaveUsername}
                    className="p-1.5 sm:p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-semibold text-white truncate">{session.username}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 sm:p-1.5 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                    title="Edit username"
                  >
                    <Edit2 size={14} className="text-slate-400 hover:text-cyan-400 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1 truncate">User ID: {session.userId.slice(0, 8)}...</p>
            </div>
          </div>

          {/* User Info Cards */}
          <div className="space-y-2 sm:space-y-3">
            {/* User Color */}
            <div className="p-2.5 sm:p-3 bg-slate-700/30 rounded-lg sm:rounded-xl border border-slate-600/30">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-slate-700 rounded-lg">
                  <Palette size={16} className="text-purple-400 sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-400">Your Color</p>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div 
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white/20 flex-shrink-0"
                      style={{ backgroundColor: session.userColor }}
                    />
                    <span className="text-white font-mono text-xs sm:text-sm truncate">{session.userColor}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingColor(!isEditingColor)}
                  className="p-1 sm:p-1.5 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                  title="Change color"
                >
                  <Edit2 size={14} className="text-slate-400 hover:text-purple-400 sm:w-4 sm:h-4" />
                </button>
              </div>
              
              {/* Color Picker */}
              {isEditingColor && (
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-600/30">
                  <p className="text-[10px] sm:text-xs text-slate-400 mb-1.5 sm:mb-2">Select a new color:</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {AVAILABLE_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          session.userColor === color 
                            ? 'border-white ring-2 ring-white/30' 
                            : 'border-white/20 hover:border-white/50'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Tips */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg sm:rounded-xl border border-cyan-500/20">
            <p className="text-xs sm:text-sm text-slate-300">
              💡 <span className="font-medium">Tip:</span> Your session is stored locally. Changing your username will update it for future boards you join.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
