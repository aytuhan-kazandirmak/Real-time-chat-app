import { MessageSquare, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import ChatCard from "./ChatCard";
import FriendCard from "./FriendCard";
import { mockChats, mockFriends, mockUser } from "@/mocks";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "friends">("chats");
  return (
    <div className="w-80 h-full max-h-screen border-r bg-background">
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

      <div className="flex justify-between items-center border-b">
        <button
          onClick={() => setActiveTab("chats")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "chats"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground cursor-pointer"
          )}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "friends"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground cursor-pointer"
          )}
        >
          Friends
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden border-b">
        <ScrollArea className="h-[460px]">
          {activeTab === "chats"
            ? mockChats.map((chat) => <ChatCard key={chat.id} chat={chat} />)
            : mockFriends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
        </ScrollArea>
      </div>

      <div className="p-3">
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
            <p className="text-sm font-medium">{mockUser?.name}</p>
            <p className="text-xs text-muted-foreground">{mockUser?.email}</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
