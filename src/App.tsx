import { useState } from 'react';
import { Copy, Check, LogOut, Share2, UserCircle } from 'lucide-react';
import BoardSetup from './components/BoardSetup';
import Whiteboard from './components/Whiteboard';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';
import { getOrCreateSession } from './lib/userSession';

function App() {
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getOrCreateSession());

  const copyBoardId = () => {
    if (currentBoardId) {
      navigator.clipboard.writeText(currentBoardId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const leaveBoard = () => {
    setCurrentBoardId(null);
  };

  if (!currentBoardId) {
    return <BoardSetup onBoardSelect={setCurrentBoardId} />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="DrawFlow.io" 
              className="w-10 h-10 rounded-xl shadow-lg object-cover"
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                DrawFlow.io
              </h1>
              <p className="text-slate-400 text-xs">Real-time Drawing & Chat</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Board ID Badge */}
            <div className="flex items-center gap-2 bg-slate-700/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600/50">
              <Share2 size={16} className="text-cyan-400" />
              <span className="text-xs text-slate-400">Board:</span>
              <code className="text-sm font-mono text-cyan-300 font-semibold">
                {currentBoardId.slice(0, 8)}...
              </code>
              <button
                onClick={copyBoardId}
                className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-all"
                title="Copy Board ID"
              >
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} className="text-slate-400 hover:text-white" />
                )}
              </button>
            </div>

            {/* User Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/50 transition-all"
              title="User Profile"
            >
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: currentUser.userColor }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-300 hidden sm:block">{currentUser.username}</span>
              <UserCircle size={16} className="text-cyan-400" />
            </button>

            {/* Leave Button */}
            <button
              onClick={leaveBoard}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl font-semibold transition-all flex items-center gap-2 border border-red-500/30"
            >
              <LogOut size={16} />
              Leave
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Whiteboard Area */}
        <div className="flex-1 m-2 mr-1 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
          <Whiteboard boardId={currentBoardId} />
        </div>
        
        {/* Chat Sidebar */}
        <div className="w-80 m-2 ml-1 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
          <Chat boardId={currentBoardId} />
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        onUsernameChange={(newUsername) => {
          setCurrentUser(prev => ({ ...prev, username: newUsername }));
        }}
        onColorChange={(newColor) => {
          setCurrentUser(prev => ({ ...prev, userColor: newColor }));
        }}
      />
    </div>
  );
}

export default App;
