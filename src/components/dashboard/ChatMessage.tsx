import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { useAuth } from "@/context/auth/useAuth";
import { Check, CheckCheck } from "lucide-react";

type ChatMessageProps = {
  message: ChatMessage;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const { session } = useAuth();
  const isOwn = session?.user.id === message.sender_id;

  return (
    <div
      className={cn(
        "flex gap-3 max-w-xs",
        isOwn ? "ml-auto mr-4 flex-row-reverse" : "mr-auto ml-4"
      )}
    >
      {/* {!isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage
            src={message.profiles?.avatar_url || ""}
            alt={message.profiles?.full_name}
          />
          <AvatarFallback>
            {message.profiles?.full_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )} */}

      <div
        className={cn(
          "flex flex-col gap-1",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {/* {!isOwn && (
          <span className="text-sm text-muted-foreground px-1">
            {message.profiles?.full_name}
          </span>
        )} */}

        <div
          className={cn(
            "rounded-2xl px-4 py-2 max-w-full break-words",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-md mt-2"
              : "bg-muted text-foreground rounded-bl-md mt-4"
          )}
        >
          {message.content}
          <div className="flex justify-between gap-4">
            <div
              className={cn(
                "text-xs mt-1 opacity-70",
                isOwn ? "text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {isOwn && (
              <div className="flex items-center gap-1 mt-1">
                {message?.status === "sending" ? (
                  // ⏳ Gönderiliyor
                  <Check className="text-gray-400" size={16} />
                ) : (
                  message?.status === "sent" || !message?.is_read
                )}

                {message.is_read ? (
                  <CheckCheck className="text-blue-400" size={16} />
                ) : (
                  <CheckCheck className="text-gray-400" size={16} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
