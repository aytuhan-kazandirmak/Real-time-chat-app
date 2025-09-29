export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  isGroup: boolean;
  participants: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  status: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
