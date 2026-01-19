import { useState } from 'react';
import { PlusCircle, LogIn, Sparkles, Users, Palette, MessageSquare, Zap } from 'lucide-react';
import { getUsername, setUsername as saveUsername, getUserId, getUserColor } from '../lib/userSession';

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

  const createBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    try {
      saveUsername(username);

      const userId = getUserId();
      const response = await fetch('/api/board/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: boardName.trim(),
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
      saveUsername(username);
      onBoardSelect(joinBoardId.trim());
    } catch (error) {
      console.error('Error joining board:', error);
      setError('Failed to join board. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Collaborative
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Whiteboard
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
              {/* User avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
                    style={{ backgroundColor: userColor }}
                  >
                    🎨
                  </div>
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
                  <button
                    type="submit"
                    disabled={!boardName.trim() || !username.trim() || isLoading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} />
                    {isLoading ? 'Creating...' : 'Create Board'}
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
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
