import { useState } from 'react';
import { PlusCircle, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getUsername, setUsername as saveUsername } from '../lib/userSession';

interface BoardSetupProps {
  onBoardSelect: (boardId: string) => void;
}

export default function BoardSetup({ onBoardSelect }: BoardSetupProps) {
  const [boardName, setBoardName] = useState('');
  const [joinBoardId, setJoinBoardId] = useState('');
  const [username, setUsername] = useState(getUsername());
  const [isLoading, setIsLoading] = useState(false);

  const createBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim() || isLoading) return;

    setIsLoading(true);
    try {
      saveUsername(username);

      const { data, error } = await supabase
        .from('boards')
        .insert({ name: boardName.trim() })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        onBoardSelect(data.id);
      }
    } catch (error) {
      console.error('Error creating board:', error);
      alert('Failed to create board. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const joinBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinBoardId.trim() || isLoading) return;

    setIsLoading(true);
    try {
      saveUsername(username);

      const { data, error } = await supabase
        .from('boards')
        .select('id')
        .eq('id', joinBoardId.trim())
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        alert('Board not found. Please check the Board ID and try again.');
        return;
      }

      onBoardSelect(joinBoardId.trim());
    } catch (error) {
      console.error('Error joining board:', error);
      alert('Failed to join board. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Collaborative Whiteboard</h1>
          <p className="text-gray-600">Create or join a board to start collaborating in real-time</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <PlusCircle size={20} />
              Create New Board
            </h2>
            <form onSubmit={createBoard} className="space-y-3">
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Enter board name"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={!boardName.trim() || !username.trim() || isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Board'}
              </button>
            </form>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <LogIn size={20} />
              Join Existing Board
            </h2>
            <form onSubmit={joinBoard} className="space-y-3">
              <input
                type="text"
                value={joinBoardId}
                onChange={(e) => setJoinBoardId(e.target.value)}
                placeholder="Enter board ID"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={!joinBoardId.trim() || !username.trim() || isLoading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Joining...' : 'Join Board'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
