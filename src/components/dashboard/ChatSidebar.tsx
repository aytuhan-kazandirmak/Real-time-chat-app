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
  useGetSingleUserWithId,
} from "@/hooks/useUserQueries";
import { Badge } from "../ui/badge";
import FriendRequestCard from "./FriendRequestCard";
import DiscoverUserCard from "./DiscoverUserCard";
import { useGetChatsWithId } from "@/hooks/useChatQueries";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { isActive } from "@/utils/text";
import { Link } from "@tanstack/react-router";
import ChatCardSkeleton from "../skeleton/ChatCardSkeleton";

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

  const { data: userDetails } = useGetSingleUserWithId(session?.user.id || "");
  console.log("userDetailssssssssss", userDetails);
  const emptyArray = Array.from({ length: 9 });

  return (
    <div className="flex flex-col w-full md:w-96 min-h-screen border-r bg-background relative">
      {/* search input */}
      <div className="p-4 border-b">
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

      <div className="flex justify-between items-center border-b ">
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
        <ScrollArea className="h-full">
          {activeTab === "chats" ? (
            <div className="flex flex-col gap-2">
              {userChatRooms && userChatRooms.length > 0
                ? userChatRooms.map((chat) => (
                    <ChatCard key={chat.chat_id} chat={chat} />
                  ))
                : emptyArray.map((_, index) => (
                    <ChatCardSkeleton key={index} />
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

      {userDetails ? (
        <Link
          className="p-1 sticky bottom-0 left-0 w-full h-[84px] border-t"
          to={"/profile"}
        >
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 p-3 h-full"
          >
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={userDetails?.avatar_url || ""}
                  alt={userDetails?.full_name}
                />
                <AvatarFallback>
                  {userDetails?.full_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={`${isActive(userDetails?.updated_at) ? "bg-green-500" : "bg-gray-500"} absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-background rounded-full`}
              />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">{userDetails?.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {userDetails?.email}
              </p>
            </div>
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
