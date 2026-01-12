import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { supabase, ActiveUser } from '../lib/supabase';
import { getUserId, getUsername } from '../lib/userSession';

interface ActiveUsersProps {
  boardId: string;
}

export default function ActiveUsers({ boardId }: ActiveUsersProps) {
  const [users, setUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    const updatePresence = async () => {
      const userId = getUserId();
      const username = getUsername();

      try {
        const { error } = await supabase
          .from('active_users')
          .upsert({
            board_id: boardId,
            user_id: userId,
            username,
            last_seen: new Date().toISOString()
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 5000);

    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('active_users')
          .select('*')
          .eq('board_id', boardId)
          .gte('last_seen', new Date(Date.now() - 10000).toISOString());

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
    const refreshInterval = setInterval(loadUsers, 3000);

    const channel = supabase
      .channel(`presence:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_users',
          filter: `board_id=eq.${boardId}`
        },
        () => {
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      clearInterval(refreshInterval);
      supabase.removeChannel(channel);

      supabase
        .from('active_users')
        .delete()
        .eq('board_id', boardId)
        .eq('user_id', getUserId())
        .then(() => {});
    };
  }, [boardId]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200">
      <Users size={18} className="text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {users.length} {users.length === 1 ? 'user' : 'users'} online
      </span>
      <div className="flex -space-x-2 ml-2">
        {users.slice(0, 5).map((user, index) => (
          <div
            key={user.id}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
            title={user.username}
            style={{ zIndex: users.length - index }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
        ))}
        {users.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
            +{users.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
