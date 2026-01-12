import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import BoardSetup from './components/BoardSetup';
import Whiteboard from './components/Whiteboard';
import Chat from './components/Chat';
import ActiveUsers from './components/ActiveUsers';

function App() {
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Collaborative Whiteboard</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
              <span className="text-sm text-gray-600">Board ID:</span>
              <code className="text-sm font-mono text-gray-900">{currentBoardId.slice(0, 8)}...</code>
              <button
                onClick={copyBoardId}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy Board ID"
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <button
            onClick={leaveBoard}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Leave Board
          </button>
        </div>
        <ActiveUsers boardId={currentBoardId} />
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <Whiteboard boardId={currentBoardId} />
        </div>
        <div className="w-80 border-l border-gray-200">
          <Chat boardId={currentBoardId} />
        </div>
      </div>
    </div>
  );
}

export default App;
