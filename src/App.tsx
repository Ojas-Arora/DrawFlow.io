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
        <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
          {/* Logo - Responsive */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="/logo.png" 
              alt="DrawFlow.io" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-lg object-cover"
            />
            <div className="hidden xs:block sm:block">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                DrawFlow.io
              </h1>
              <p className="text-slate-400 text-[10px] sm:text-xs hidden md:block">Real-time Drawing & Chat</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Board ID Badge - Responsive */}
            <div className="flex items-center gap-1 sm:gap-2 bg-slate-700/50 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-600/50">
              <Share2 size={14} className="text-cyan-400 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs text-slate-400 hidden md:inline">Board:</span>
              <code className="text-xs sm:text-sm font-mono text-cyan-300 font-semibold">
                {currentBoardId.slice(0, 6)}<span className="hidden sm:inline">...</span>
              </code>
              <button
                onClick={copyBoardId}
                className="p-1 sm:p-1.5 hover:bg-slate-600/50 rounded-lg transition-all"
                title="Copy Board ID"
              >
                {copied ? (
                  <Check size={14} className="text-green-400 sm:w-4 sm:h-4" />
                ) : (
                  <Copy size={14} className="text-slate-400 hover:text-white sm:w-4 sm:h-4" />
                )}
              </button>
            </div>

            {/* User Profile Button - Responsive */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg sm:rounded-xl border border-slate-600/50 transition-all"
              title="User Profile"
            >
              <div 
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white"
                style={{ backgroundColor: currentUser.userColor }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs sm:text-sm text-slate-300 hidden lg:block">{currentUser.username}</span>
              <UserCircle size={14} className="text-cyan-400 hidden sm:block sm:w-4 sm:h-4" />
            </button>

            {/* Leave Button - Responsive */}
            <button
              onClick={leaveBoard}
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg sm:rounded-xl font-semibold transition-all flex items-center gap-1 sm:gap-2 border border-red-500/30 text-xs sm:text-sm"
            >
              <LogOut size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Whiteboard Area - expands to fill available space */}
        <div className="flex-1 m-1 sm:m-2 bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 transition-all duration-300">
          <Whiteboard boardId={currentBoardId} />
        </div>
        
        {/* Chat Toggle Button - Modern Floating Action Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed top-1/2 -translate-y-1/2 z-50 group"
          style={{ right: showChat ? (window.innerWidth < 640 ? '100%' : window.innerWidth < 1024 ? '260px' : '328px') : '12px' }}
          title={showChat ? 'Hide Chat' : 'Show Chat'}
        >
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
            !showChat 
              ? 'animate-spin-slow bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 blur-md opacity-70' 
              : ''
          }`} style={{ animationDuration: '3s' }} />
          
          {/* Main button */}
          <div className={`relative flex flex-col items-center gap-1 transition-all duration-500 ${
            showChat 
              ? 'bg-slate-800/95 backdrop-blur-xl border border-slate-600/80 rounded-l-2xl px-2 py-3' 
              : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl px-3 py-4 shadow-2xl'
          }`}>
            {/* Shimmer effect when closed */}
            {!showChat && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            )}
            
            {/* Chat bubble icon with float animation */}
            <div className={`relative z-10 ${!showChat ? 'animate-float' : ''}`}>
              <MessageCircle 
                size={22} 
                className={`transition-all duration-300 ${
                  showChat 
                    ? 'text-slate-400 group-hover:text-white' 
                    : 'text-white drop-shadow-lg'
                }`} 
                fill={!showChat ? 'rgba(255,255,255,0.2)' : 'none'}
              />
              {/* Typing dots animation when closed */}
              {!showChat && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
            
            {/* Vertical text "CHAT" when closed */}
            {!showChat && (
              <div className="relative z-10 flex flex-col items-center mt-1">
                {'CHAT'.split('').map((letter, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] font-bold text-white/90 leading-tight"
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
              <ChevronRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            )}
            
            {/* Online indicator dot */}
            <div className={`absolute -top-1 -right-1 transition-all duration-300 ${
              !showChat 
                ? 'w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg shadow-green-400/50' 
                : 'w-2 h-2 bg-green-400 rounded-full'
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

        {/* Chat Sidebar - Responsive: Full screen on mobile, narrower on tablet */}
        {showChat && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowChat(false)}
            />
            <div className="fixed inset-y-0 right-0 w-full sm:w-64 lg:w-80 lg:relative lg:inset-auto m-0 sm:m-1 lg:m-2 lg:ml-1 flex-shrink-0 bg-slate-800 sm:rounded-xl lg:rounded-2xl shadow-2xl border-l sm:border border-slate-700/50 transition-all duration-300 z-50 animate-slide-in-right lg:animate-none">
              {/* Mobile close button */}
              <button
                onClick={() => setShowChat(false)}
                className="absolute top-2 right-2 p-2 bg-slate-700/50 rounded-lg lg:hidden z-10"
              >
                <ChevronRight size={20} className="text-slate-400" />
              </button>
              <Chat boardId={currentBoardId} />
            </div>
          </>
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
