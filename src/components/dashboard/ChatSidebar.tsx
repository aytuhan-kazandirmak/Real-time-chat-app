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
} from "@/hooks/useUserQueries";
import { Badge } from "../ui/badge";
import FriendRequestCard from "./FriendRequestCard";
import DiscoverUserCard from "./DiscoverUserCard";
import { useGetChatsWithId } from "@/hooks/useChatQueries";

import ChatCardSkeleton from "../skeleton/ChatCardSkeleton";
import ProfileCard from "./ProfileCard";

export default function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "chats" | "friends" | "notifications" | "discover"
  >("chats");

  const { session } = useAuth();

  const { data: userChatRooms, isLoading: isLoadingChatRooms } =
    useGetChatsWithId(session?.user.id || "");
  const { data: friendRequests } = useGetFriendRequest(session?.user.id || "");
  const { data: discoverFriends } = useDiscoverFriendsQuery(
    session?.user.id || ""
  );

  const emptyArray = Array.from({ length: 9 });
  const filteredChatList = userChatRooms?.filter(
    (chat) => chat.last_message_id !== null
  );
  const sortedChatList = filteredChatList?.slice().sort((a, b) => {
    // Null kontrolü - mesaj olmayan chatler en alta gitsin
    if (!a.last_message_created_at && !b.last_message_created_at) return 0;
    if (!a.last_message_created_at) return 1; // a alta gitsin
    if (!b.last_message_created_at) return -1; // b alta gitsin

    // En yeni mesaj en üstte
    return b.last_message_created_at.localeCompare(a.last_message_created_at);
  });
  const sortedChatListLength = sortedChatList?.length || 0;
  return (
    <div className="flex flex-col w-full md:w-96 h-dvh border-r bg-background ">
      {/* search input */}
      <div className="p-4 md:border-b">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare />
          <h2 className="font-semibold">Typing Dots</h2>
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

      <div className="flex justify-between items-center md:border-b fixed left-0 right-0 bottom-0 md:static z-10">
        <button
          onClick={() => setActiveTab("chats")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium md:border-b-2 max-md:border-t-2 transition-colors flex justify-center items-center",
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
            "flex-1 px-4 py-3 text-sm font-medium md:border-b-2 max-md:border-t-2 transition-colors flex justify-center items-center",
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
            "flex-1 px-4 py-3 text-sm font-medium md:border-b-2 max-md:border-t-2 transition-colors flex justify-center items-center",
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
            "flex-1 px-4 py-3 text-sm font-medium md:border-b-2 max-md:border-t-2 transition-colors relative flex justify-center items-center",
            activeTab === "notifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex items-center justify-center gap-1">
            <Bell />
            {friendRequests && friendRequests?.length >= 1 ? (
              <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                {friendRequests?.length}
              </Badge>
            ) : null}
          </div>
        </button>
        {/* <Link
          to={"/profile"}
          className="md:hidden flex-1 px-4 py-3 text-sm font-medium transition-colors relative flex justify-center items-center"
        >
          {" "}
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={userDetails?.avatar_url || ""}
              alt={userDetails?.full_name}
            />
            <AvatarFallback>
              {userDetails?.full_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link> */}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          {activeTab === "chats" ? (
            <>
              {isLoadingChatRooms
                ? emptyArray.map((_, index) => <ChatCardSkeleton key={index} />)
                : sortedChatList && sortedChatList.length > 0
                  ? sortedChatList.map((chat, index) => (
                      <ChatCard
                        key={chat.chat_id}
                        index={index}
                        chat={chat}
                        sortedChatListLength={sortedChatListLength}
                      />
                    ))
                  : null}
            </>
          ) : activeTab === "friends" ? (
            <div className="flex flex-col gap-2">
              {userChatRooms?.map((friend) => (
                <FriendCard key={friend.chat_id} friend={friend} />
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

      <ProfileCard currentUserId={session?.user.id || ""} />
    </div>
  );
}
