import type { Chat } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import truncateText from "@/utils/text";
import { Link } from "@tanstack/react-router";

type ChatCardProps = {
  chat: Chat;
};

export default function ChatCard({ chat }: ChatCardProps) {
  return (
    <Link
      to="/$chatRoom"
      className={cn(
        "w-full p-3 rounded-lg text-left hover:bg-accent transition-colors mb-1"
      )}
      params={{
        chatRoom: chat.id,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback>{chat.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          {chat.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium truncate">{chat.name}</h4>
            <span className="text-xs text-muted-foreground">
              {chat.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground truncate">
              {truncateText(chat.lastMessage)}
            </p>
            {chat.unreadCount > 0 && (
              <Badge variant="default" className="ml-2 text-xs px-2 py-0.5">
                {chat.unreadCount}
              </Badge>
            )}
          </div>

          {chat.isGroup && (
            <p className="text-xs text-muted-foreground mt-1">
              {chat.participants} members
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
