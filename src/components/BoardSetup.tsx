import { useState } from 'react';
import { PlusCircle, LogIn, Users, Palette, MessageSquare, Zap, Lock, Unlock, Eye, EyeOff, Shield } from 'lucide-react';
import { getUsername, setUsername as saveUsername, getUserId, getUserColor } from '../lib/userSession';
import { api } from '../lib/api';

interface BoardSetupProps {
  onBoardSelect: (boardId: string) => void;
}

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
    <div className="p-2 bg-white/20 rounded-lg">
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <h3 className="font-semibold text-white text-sm">{title}</h3>
      <p className="text-white/70 text-xs mt-1">{description}</p>
    </div>
  </div>
);

export default function BoardSetup({ onBoardSelect }: BoardSetupProps) {
  const [boardName, setBoardName] = useState('');
  const [joinBoardId, setJoinBoardId] = useState('');
  const [username, setUsername] = useState(getUsername());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Private room states
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [joinPassword, setJoinPassword] = useState('');
  const [showJoinPassword, setShowJoinPassword] = useState(false);
  const [pendingPrivateBoard, setPendingPrivateBoard] = useState<{ boardId: string; title: string } | null>(null);

  const createBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim() || isLoading) return;

    // Validate password for private rooms
    if (isPrivate && roomPassword.length < 4) {
      setError('Password must be at least 4 characters for private rooms.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      saveUsername(username);

      const userId = getUserId();
      const response = await fetch(api.createBoard, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: boardName.trim(),
          isPrivate,
          password: isPrivate ? roomPassword : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onBoardSelect(data.board.boardId);
      } else {
        setError('Failed to create board. Please try again.');
      }
    } catch (error) {
      console.error('Error creating board:', error);
      setError('Failed to create board. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const joinBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinBoardId.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    try {
      // First validate that the board exists in the database
      const response = await fetch(api.validateBoard(joinBoardId.trim()));
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 404) {
          setError('Board not found! This Board ID does not exist. Please check the ID and try again, or create a new board.');
        } else if (response.status === 403) {
          setError('This board has been deactivated and is no longer available.');
        } else {
          setError(data.message || 'Failed to join board. Please try again.');
        }
        return;
      }

      // Check if board is private
      if (data.board.isPrivate) {
        setPendingPrivateBoard({ boardId: joinBoardId.trim(), title: data.board.title });
        setIsLoading(false);
        return;
      }

      // Board exists and is public, proceed to join
      saveUsername(username);
      onBoardSelect(joinBoardId.trim());
    } catch (error) {
      console.error('Error joining board:', error);
      setError('Failed to connect to server. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndJoinPrivateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPrivateBoard || !joinPassword.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(api.verifyBoardPassword(pendingPrivateBoard.boardId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: joinPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Incorrect password. Please try again.');
        return;
      }

      // Password verified, join the board
      saveUsername(username);
      onBoardSelect(pendingPrivateBoard.boardId);
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('Failed to verify password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPrivateJoin = () => {
    setPendingPrivateBoard(null);
    setJoinPassword('');
    setError('');
  };

  const userColor = getUserColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Hero section */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">Real-time Collaboration</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                DrawFlow.io
              </span>
            </h1>
            
            <p className="text-white/70 text-lg max-w-md mx-auto lg:mx-0">
              Draw, write, and collaborate with your team in real-time. Share ideas instantly on an infinite canvas.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              <FeatureCard 
                icon={Palette} 
                title="Drawing Tools" 
                description="Pen, colors, and eraser tools"
              />
              <FeatureCard 
                icon={Users} 
                title="Multi-User" 
                description="See everyone draw live"
              />
              <FeatureCard 
                icon={MessageSquare} 
                title="Live Chat" 
                description="Communicate while you draw"
              />
              <FeatureCard 
                icon={Zap} 
                title="Instant Sync" 
                description="Real-time updates via Socket.io"
              />
            </div>
          </div>

          {/* Right side - Form section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src="/logo.png" 
                    alt="DrawFlow.io" 
                    className="w-20 h-20 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300 object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-4 border-slate-900">
                    ✓
                  </div>
                </div>
              </div>

              {/* Username input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white/90 mb-2">👤 Your Display Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl mb-6">
                  <p className="text-red-200 font-semibold text-sm">{error}</p>
                </div>
              )}

              {/* Create Board Section */}
              <div className="space-y-4 mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <div className="p-1.5 bg-cyan-500/30 rounded-lg">
                    <PlusCircle size={18} className="text-cyan-400" />
                  </div>
                  Create New Board
                </h2>
                <form onSubmit={createBoard} className="space-y-3">
                  <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Board name (e.g., Team Brainstorm)"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:opacity-50 transition-all"
                  />
                  
                  {/* Private Room Toggle */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className={isPrivate ? "text-amber-400" : "text-white/50"} />
                      <span className="text-white/90 text-sm font-medium">Private Room</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        isPrivate ? 'bg-amber-500' : 'bg-white/20'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                          isPrivate ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                      {isPrivate ? (
                        <Lock size={10} className="absolute top-1.5 left-1.5 text-amber-500" />
                      ) : (
                        <Unlock size={10} className="absolute top-1.5 right-1.5 text-white/50" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Input for Private Room */}
                  {isPrivate && (
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={roomPassword}
                        onChange={(e) => setRoomPassword(e.target.value)}
                        placeholder="Set room password (min 4 chars)"
                        disabled={isLoading}
                        className="w-full px-4 py-3 pr-12 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={!boardName.trim() || !username.trim() || isLoading || (isPrivate && roomPassword.length < 4)}
                    className={`w-full px-4 py-3 text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
                      isPrivate 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/25' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-cyan-500/25'
                    }`}
                  >
                    {isPrivate ? <Lock size={18} /> : <PlusCircle size={18} />}
                    {isLoading ? 'Creating...' : isPrivate ? 'Create Private Board' : 'Create Board'}
                  </button>
                </form>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/50 font-medium">or</span>
                </div>
              </div>

              {/* Join Board Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <div className="p-1.5 bg-green-500/30 rounded-lg">
                    <LogIn size={18} className="text-green-400" />
                  </div>
                  Join Existing Board
                </h2>
                <form onSubmit={joinBoard} className="space-y-3">
                  <input
                    type="text"
                    value={joinBoardId}
                    onChange={(e) => setJoinBoardId(e.target.value)}
                    placeholder="Paste board ID here"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-50 transition-all font-mono text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!joinBoardId.trim() || !username.trim() || isLoading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <LogIn size={18} />
                    {isLoading ? 'Joining...' : 'Join Board'}
                  </button>
                </form>
              </div>

              {/* Footer tip */}
              <p className="text-center text-white/50 text-xs mt-6 pt-4 border-t border-white/10">
                💡 Share the Board ID with friends to collaborate in real-time!
                <br />
                🔒 Use private rooms for secure group collaboration!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Private Room Password Modal */}
      {pendingPrivateBoard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Lock size={24} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Private Room</h3>
                <p className="text-white/60 text-sm">{pendingPrivateBoard.title}</p>
              </div>
            </div>
            
            <p className="text-white/70 text-sm mb-4">
              This board is protected. Enter the password to join.
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl mb-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={verifyAndJoinPrivateBoard} className="space-y-4">
              <div className="relative">
                <input
                  type={showJoinPassword ? "text" : "password"}
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="Enter room password"
                  disabled={isLoading}
                  autoFocus
                  className="w-full px-4 py-3 pr-12 bg-white/10 border-2 border-amber-500/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowJoinPassword(!showJoinPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showJoinPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelPrivateJoin}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!joinPassword.trim() || isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  {isLoading ? 'Verifying...' : 'Join Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
