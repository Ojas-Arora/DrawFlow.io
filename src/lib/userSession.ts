export function getUserId(): string {
  let userId = localStorage.getItem('whiteboard_user_id');
  if (!userId) {
    userId = `user_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('whiteboard_user_id', userId);
  }
  return userId;
}

export function getUsername(): string {
  let username = localStorage.getItem('whiteboard_username');
  if (!username) {
    username = `User ${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem('whiteboard_username', username);
  }
  return username;
}

export function setUsername(name: string): void {
  localStorage.setItem('whiteboard_username', name);
}
