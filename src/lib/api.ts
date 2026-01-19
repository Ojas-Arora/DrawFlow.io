// API Configuration for frontend
// Uses environment variable or falls back to Render production URL

const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || 
    import.meta.env.VITE_SOCKET_URL || 
    'https://whiteboard-backend-rzxs.onrender.com';
  // Remove trailing slash if present
  return url.replace(/\/$/, '');
};

export const API_BASE_URL = getBaseUrl();

export const api = {
  createBoard: `${API_BASE_URL}/api/board/create`,
  createUser: `${API_BASE_URL}/api/user/create`,
  getBoardHistory: (boardId: string) => `${API_BASE_URL}/api/board/${boardId}/history`,
  health: `${API_BASE_URL}/api/health`,
};
