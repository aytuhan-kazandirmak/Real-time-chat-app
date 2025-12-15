import type { ChatRoom } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import truncateText, { isActive, timeAgo } from "@/utils/text";
import { useAuth } from "@/context/auth/useAuth";
import { CheckCheck } from "lucide-react";
import { useGetChatMessages } from "@/hooks/useChatQueries";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";

type ChatCardProps = {
  chat: ChatRoom;
};

export default function ChatCard({ chat }: ChatCardProps) {
  const { session } = useAuth();
  const { data: messages } = useGetChatMessages(chat.chat_id);

  const [unreadCount, setUnreadCount] = useState<number>();

  useEffect(() => {
    const unreadMessages = messages?.filter(
      (item) => item.is_read === false && item.sender_id !== session?.user.id
    );
    const unreadCount = unreadMessages?.length ?? 0;
    setUnreadCount(unreadCount);
  }, [messages, session?.user.id]);

  return (
    <Link
      to="/$chatRoom"
      className={cn(
        "w-full min-h-20 flex items-center rounded-lg text-left hover:bg-accent transition-colors"
      )}
      params={{
        chatRoom: String(chat.chat_id),
      }}
    >
      <div className="flex items-center gap-3 p-2 w-full">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={chat?.chat_participants?.[0]?.profiles?.avatar_url || ""}
              alt={chat?.chat_participants?.[0]?.profiles?.full_name}
            />
            <AvatarFallback>
              {chat?.chat_participants?.[0]?.profiles?.full_name
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div
            className={`${isActive(chat?.chat_participants?.[0]?.profiles?.updated_at) ? "bg-green-500" : "bg-gray-500"} absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-background rounded-full`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between mb-1">
            <h4 className="font-medium truncate">
              {chat?.chat_participants?.[0]?.profiles?.full_name}
            </h4>
            <span className="text-xs text-muted-foreground">
              {timeAgo(chat.last_message_created_at)}
            </span>
          </div>
          <div>
            {chat?.chat_participants?.[0]?.is_typing ? (
              <div className="flex items-center gap-2 text-sm text-green-400 italic">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-green-400/70 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-green-400/70 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-green-400/70 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span>typing...</span>
              </div>
            ) : (
              <div className="text-sm font-thin dark:text-gray-300 text-gray-700 flex items-center justify-between">
                {chat.last_message_sender_id === session?.user.id ? (
                  <div className="flex items-center gap-2">
                    {truncateText(chat.last_message_content)}
                    {chat.last_message_is_read ? (
                      <CheckCheck className="text-blue-400" size={16} />
                    ) : (
                      <CheckCheck size={16} />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    {truncateText(chat.last_message_content)}
                  </div>
                )}
                {unreadCount && unreadCount > 0 ? (
                  <Badge variant="default" className="ml-2 text-xs px-2 py-0.5">
                    {unreadCount}
                  </Badge>
                ) : null}
              </div>
            )}
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
