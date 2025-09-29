import type { Chat, Friend, User } from "@/types";

export const mockChats: Chat[] = [
  {
    id: "1",
    name: "Team Workspace",
    avatar:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=40&h=40&fit=crop&crop=face",
    lastMessage: "Perfect! I'll upload them to the shared drive...",
    timestamp: new Date(Date.now() - 300000),
    unreadCount: 0,
    isOnline: true,
    isGroup: true,
    participants: 8,
  },
  {
    id: "2",
    name: "Alice Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=40&h=40&fit=crop&crop=face",
    lastMessage: "Hey! Did you see the latest designs?",
    timestamp: new Date(Date.now() - 600000),
    unreadCount: 2,
    isOnline: true,
    isGroup: false,
    participants: 2,
  },
  {
    id: "3",
    name: "Design Team",
    avatar:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop&crop=face",
    lastMessage: "Sarah: The mockups look great!",
    timestamp: new Date(Date.now() - 1200000),
    unreadCount: 0,
    isOnline: true,
    isGroup: true,
    participants: 5,
  },
  {
    id: "4",
    name: "Bob Smith",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    lastMessage: "Thanks for the feedback!",
    timestamp: new Date(Date.now() - 3600000),
    unreadCount: 0,
    isOnline: false,
    isGroup: false,
    participants: 2,
  },
];

export const mockFriends: Friend[] = [
  {
    id: "carol",
    name: "Carol Wilson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    isOnline: true,
    status: "Available",
  },
  {
    id: "david",
    name: "David Brown",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    isOnline: true,
    status: "In a meeting",
  },
  {
    id: "emma",
    name: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=40&h=40&fit=crop&crop=face",
    isOnline: false,
    status: "Away",
  },
  {
    id: "frank",
    name: "Frank Miller",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    isOnline: true,
    status: "Available",
  },
];

export const mockUser: User = {
  id: "1",
  name: "Ali Yılmaz",
  email: "ali.yilmaz@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
};
