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
  validateBoard: (boardId: string) => `${API_BASE_URL}/api/board/${boardId}/validate`,
  verifyBoardPassword: (boardId: string) => `${API_BASE_URL}/api/board/${boardId}/verify-password`,
  getBoardHistory: (boardId: string) => `${API_BASE_URL}/api/board/${boardId}/history`,
  health: `${API_BASE_URL}/api/health`,
};

// Server status types
export type ServerStatus = 'checking' | 'online' | 'waking' | 'offline';

// Check server health with timeout
export async function checkServerHealth(timeout = 5000): Promise<{ status: ServerStatus; latency?: number }> {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(api.health, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const latency = Date.now() - startTime;
      return { status: 'online', latency };
    }
    return { status: 'offline' };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return { status: 'waking' };
    }
    return { status: 'offline' };
  }
}

// Warm up the server - call this when page loads
export async function warmUpServer(): Promise<ServerStatus> {
  console.log('🔥 Warming up server...');
  
  // First quick check
  const quickCheck = await checkServerHealth(3000);
  if (quickCheck.status === 'online') {
    console.log(`✅ Server is online (${quickCheck.latency}ms)`);
    return 'online';
  }
  
  // Server might be waking up, keep trying
  console.log('⏳ Server is waking up from cold start...');
  
  // Try up to 60 seconds for cold start (Render can take up to 50s)
  const maxAttempts = 12;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const check = await checkServerHealth(5000);
    if (check.status === 'online') {
      console.log(`✅ Server is now online (attempt ${i + 2}, ${check.latency}ms)`);
      return 'online';
    }
  }
  
  console.log('❌ Server failed to wake up');
  return 'offline';
}
