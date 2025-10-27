import {
  Bell,
  MessageSquare,
  MessageSquareText,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import ChatCard from "./ChatCard";
import FriendCard from "./FriendCard";
// import { mockChats, mockUser } from "@/mocks";
// import { Button } from "../ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/context/auth/useAuth";
import {
  useDiscoverFriendsQuery,
  useGetFriendRequest,
  useGetFriends,
} from "@/hooks/useUserQueries";
import { Badge } from "../ui/badge";
import FriendRequestCard from "./FriendRequestCard";
import DiscoverUserCard from "./DiscoverUserCard";
import { useGetChatsWithId } from "@/hooks/useChatQueries";

export default function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "chats" | "friends" | "notifications" | "discover"
  >("chats");

  const { session } = useAuth();

  const { data: userChatRooms } = useGetChatsWithId(session?.user.id || "");
  const { data: friendRequests } = useGetFriendRequest(session?.user.id || "");
  const { data: friendList } = useGetFriends(session?.user.id);
  const { data: discoverFriends } = useDiscoverFriendsQuery(
    session?.user.id || ""
  );
  console.log("userChats", userChatRooms);
  return (
    <div className="w-full md:w-96 min-h-screen border-r bg-background relative">
      {/* search input */}
      <div className="p-4 border-b flex-1">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare />
          <h2 className="font-semibold">Messages</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search chats and friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex justify-between items-center border-b flex-1">
        <button
          onClick={() => setActiveTab("chats")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors flex justify-center items-center",
            activeTab === "chats"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground cursor-pointer"
          )}
        >
          <MessageSquareText />
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors flex justify-center items-center",
            activeTab === "friends"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground cursor-pointer"
          )}
        >
          <Users />
        </button>

        <button
          onClick={() => setActiveTab("discover")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors flex justify-center items-center",
            activeTab === "discover"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground cursor-pointer"
          )}
        >
          <UserPlus />
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors relative flex justify-center items-center",
            activeTab === "notifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center justify-center gap-1">
            <Bell className="w-4 h-4" />
            {friendRequests && friendRequests?.length >= 1 ? (
              <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                {friendRequests?.length}
              </Badge>
            ) : null}
          </div>
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-[450px]">
          {activeTab === "chats" ? (
            <div className="flex flex-col gap-2">
              {userChatRooms?.map((chat) => (
                <ChatCard key={chat.chat_id} chat={chat} />
              ))}
            </div>
          ) : activeTab === "friends" ? (
            <div className="flex flex-col gap-2">
              {friendList?.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          ) : activeTab === "discover" ? (
            discoverFriends?.map((discoverFriend) => (
              <div className="p-2" key={discoverFriend.id}>
                <DiscoverUserCard user={discoverFriend} />
              </div>
            ))
          ) : (
            <div className="p-2">
              {friendRequests?.map((friendRequest) => (
                <FriendRequestCard
                  friendRequest={friendRequest}
                  key={friendRequest.sender.id}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* <div className="px-3 fixed bottom-0 w-full h-[84px] border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-auto p-3"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={mockUser?.avatar} alt={mockUser?.name} />
            <AvatarFallback>
              {mockUser?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <p className="text-sm font-medium">
              {session?.user?.user_metadata.full_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.user_metadata.email}
            </p>
          </div>
        </Button>
      </div> */}
    </div>
  );
}
