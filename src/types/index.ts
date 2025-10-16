import type { Tables } from "@/database.types";

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

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isOwn: boolean;
}
// export interface Profiles {
//   avatar_url: string | null;
//   created_at: string;
//   email: string;
//   full_name: string;
//   id: string;
//   is_online: boolean;
//   updated_at: string | null;
// }


export type Profiles = Pick<Tables<"profiles">,"avatar_url"|"created_at"|"email"|"full_name"|"is_online"|"id">


export type FriendRequest=Pick<Tables<"contacts">, "id"|"created_at"|"status"> & {
  sender: Pick<Tables<'profiles'>, 'id'|'full_name'|"email"|"avatar_url">}


