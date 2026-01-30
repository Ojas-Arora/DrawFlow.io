import { useState } from 'react';
import { Copy, Check, LogOut, Share2, UserCircle, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [showChat, setShowChat] = useState(true);

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
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 shadow-xl flex-shrink-0">
        <div className="flex items-center justify-between px-2 md:px-4 py-2 md:py-3">
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src="/logo.png" 
              alt="DrawFlow.io" 
              className="w-7 h-7 md:w-10 md:h-10 rounded-xl shadow-lg object-cover"
            />
            <div>
              <h1 className="text-sm md:text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                DrawFlow.io
              </h1>
              <p className="text-slate-400 text-[8px] md:text-xs">Real-time Drawing & Chat</p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            {/* Board ID Badge */}
            <div className="flex items-center gap-1 md:gap-2 bg-slate-700/50 backdrop-blur-sm px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl border border-slate-600/50">
              <Share2 className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
              <span className="text-[8px] md:text-xs text-slate-400">Board:</span>
              <code className="text-[10px] md:text-sm font-mono text-cyan-300 font-semibold">
                {currentBoardId.slice(0, 8)}...
              </code>
              <button
                onClick={copyBoardId}
                className="p-0.5 md:p-1.5 hover:bg-slate-600/50 rounded-lg transition-all"
                title="Copy Board ID"
              >
                {copied ? (
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 md:w-4 md:h-4 text-slate-400 hover:text-white" />
                )}
              </button>
            </div>

            {/* User Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-1 md:gap-2 px-1.5 md:px-3 py-1 md:py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg md:rounded-xl border border-slate-600/50 transition-all"
              title="User Profile"
            >
              <div 
                className="w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold text-white"
                style={{ backgroundColor: currentUser.userColor }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-[10px] md:text-sm text-slate-300">{currentUser.username}</span>
              <UserCircle className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
            </button>

            {/* Leave Button */}
            <button
              onClick={leaveBoard}
              className="px-2 md:px-4 py-1 md:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg md:rounded-xl font-semibold transition-all flex items-center gap-1 md:gap-2 border border-red-500/30 text-[10px] md:text-base"
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4" />
              Leave
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Whiteboard Area - expands to fill available space */}
        <div className="flex-1 m-1 md:m-2 bg-slate-800 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 transition-all duration-300">
          <Whiteboard boardId={currentBoardId} />
        </div>
        
        {/* Chat Toggle Button - Modern Floating Action Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className={`fixed top-1/2 -translate-y-1/2 z-50 group transition-all duration-300 ${
            showChat ? 'right-[192px] md:right-[320px]' : 'right-2 md:right-3'
          }`}
          title={showChat ? 'Hide Chat' : 'Show Chat'}
        >
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-xl md:rounded-2xl transition-all duration-700 ${
            !showChat 
              ? 'animate-spin-slow bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 blur-md opacity-70' 
              : ''
          }`} style={{ animationDuration: '3s' }} />
          
          {/* Main button */}
          <div className={`relative flex flex-col items-center gap-0.5 md:gap-1 transition-all duration-500 ${
            showChat 
              ? 'bg-slate-800/95 backdrop-blur-xl border border-slate-600/80 rounded-l-xl md:rounded-l-2xl px-1.5 md:px-2 py-2 md:py-3' 
              : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl md:rounded-2xl px-2 md:px-3 py-2.5 md:py-4 shadow-2xl'
          }`}>
            {/* Shimmer effect when closed */}
            {!showChat && (
              <div className="absolute inset-0 rounded-xl md:rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            )}
            
            {/* Chat bubble icon with float animation */}
            <div className={`relative z-10 ${!showChat ? 'animate-float' : ''}`}>
              <MessageCircle 
                className={`w-4 h-4 md:w-[22px] md:h-[22px] transition-all duration-300 ${
                  showChat 
                    ? 'text-slate-400 group-hover:text-white' 
                    : 'text-white drop-shadow-lg'
                }`} 
                fill={!showChat ? 'rgba(255,255,255,0.2)' : 'none'}
              />
              {/* Typing dots animation when closed */}
              {!showChat && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
            
            {/* Vertical text "CHAT" when closed */}
            {!showChat && (
              <div className="relative z-10 flex flex-col items-center mt-0.5 md:mt-1">
                {'CHAT'.split('').map((letter, i) => (
                  <span 
                    key={i} 
                    className="text-[7px] md:text-[10px] font-bold text-white/90 leading-tight"
                    style={{ 
                      animationDelay: `${i * 100}ms`,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            )}
            
            {/* Arrow when open */}
            {showChat && (
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            )}
            
            {/* Online indicator dot */}
            <div className={`absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 transition-all duration-300 ${
              !showChat 
                ? 'w-2.5 h-2.5 md:w-4 md:h-4 bg-green-400 rounded-full border md:border-2 border-white shadow-lg shadow-green-400/50' 
                : 'w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full'
            }`}>
              {!showChat && (
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
              )}
            </div>
          </div>
        </button>
        
        {/* Add custom keyframes for float animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          .animate-float {
            animation: float 2s ease-in-out infinite;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-48 md:w-80 m-1 md:m-2 md:ml-1 flex-shrink-0 bg-slate-800 rounded-xl md:rounded-2xl shadow-2xl border border-slate-700/50 transition-all duration-300">
            <Chat boardId={currentBoardId} />
          </div>
        )}
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
