import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'whiteboard_session';

interface Session {
  userId: string;
  username: string;
  userColor: string;
  createdAt: number;
}

function getRandomColor(): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getOrCreateSession(): Session {
  const stored = localStorage.getItem(SESSION_KEY);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid session, create new one
    }
  }

  const session: Session = {
    userId: uuidv4(),
    username: `User-${Math.random().toString(36).substr(2, 9)}`,
    userColor: getRandomColor(),
    createdAt: Date.now(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getUserId(): string {
  return getOrCreateSession().userId;
}

export function getUsername(): string {
  return getOrCreateSession().username;
}

export function getUserColor(): string {
  return getOrCreateSession().userColor;
}

export function setUsername(username: string): void {
  const session = getOrCreateSession();
  session.username = username;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
