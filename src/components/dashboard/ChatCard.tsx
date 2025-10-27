import type { ChatRoom } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { timeAgo } from "@/utils/text";

type ChatCardProps = {
  chat: ChatRoom;
};

export default function ChatCard({ chat }: ChatCardProps) {
  return (
    <Link
      to="/$chatRoom"
      className={cn(
        "w-full min-h-20 rounded-lg text-left hover:bg-accent transition-colors"
      )}
      params={{
        chatRoom: String(chat.chat_id),
      }}
    >
      <div className="flex items-start gap-3 p-2">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={chat.chat_participants[0].profiles?.avatar_url || ""}
              alt={chat.chat_participants[0].profiles?.full_name}
            />
            <AvatarFallback>
              {chat.chat_participants[0].profiles?.full_name
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div
            className={`${chat.chat_participants[0].profiles?.is_online ? "bg-green-500" : "bg-gray-500"} absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-background rounded-full`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium truncate">
              {chat.chat_participants[0].profiles?.full_name}
            </h4>
            <span className="text-xs text-muted-foreground">
              {timeAgo(chat.created_at)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {/* <p className="text-sm text-muted-foreground truncate">
              {truncateText(chat.last_message_id)}
            </p> */}
            {/* {chat.unreadCount > 0 && (
              <Badge variant="default" className="ml-2 text-xs px-2 py-0.5">
                {chat.unreadCount}
              </Badge>
            )} */}
          </div>
          {/* 
          {chat.isGroup && (
            <p className="text-xs text-muted-foreground mt-1">
              {chat.participants} members
            </p>
          )} */}
        </div>
      </div>
    </Link>
  );
}
