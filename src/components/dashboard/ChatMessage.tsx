import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { Message } from "@/types";

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-3 max-w-xs",
        message.isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {!message.isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback>
            {message.sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-1",
          message.isOwn ? "items-end" : "items-start"
        )}
      >
        {!message.isOwn && (
          <span className="text-sm text-muted-foreground px-1">
            {message.sender.name}
          </span>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2 max-w-full break-words",
            message.isOwn
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          {message.content}
        </div>

        <span className="text-xs text-muted-foreground px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
