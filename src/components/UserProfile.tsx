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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User size={24} className="text-cyan-400" />
              User Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-400 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar & Username */}
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
              style={{ backgroundColor: session.userColor }}
            >
              {session.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter username"
                    autoFocus
                    maxLength={20}
                  />
                  <button
                    onClick={handleSaveUsername}
                    className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-white">{session.username}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Edit username"
                  >
                    <Edit2 size={16} className="text-slate-400 hover:text-cyan-400" />
                  </button>
                </div>
              )}
              <p className="text-sm text-slate-400 mt-1">User ID: {session.userId.slice(0, 8)}...</p>
            </div>
          </div>

          {/* User Info Cards */}
          <div className="space-y-3">
            {/* User Color */}
            <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg">
                  <Palette size={18} className="text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Your Color</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: session.userColor }}
                    />
                    <span className="text-white font-mono text-sm">{session.userColor}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingColor(!isEditingColor)}
                  className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Change color"
                >
                  <Edit2 size={16} className="text-slate-400 hover:text-purple-400" />
                </button>
              </div>
              
              {/* Color Picker */}
              {isEditingColor && (
                <div className="mt-3 pt-3 border-t border-slate-600/30">
                  <p className="text-xs text-slate-400 mb-2">Select a new color:</p>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
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
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20">
            <p className="text-sm text-slate-300">
              💡 <span className="font-medium">Tip:</span> Your session is stored locally. Changing your username will update it for future boards you join.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
