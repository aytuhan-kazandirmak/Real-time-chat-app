import type { Chat } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";

type ChatHeaderProps = {
  chat: Chat;
};

export default function ChatHeader({ chat }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback>{chat.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <h3 className="font-medium">{chat.name}</h3>
          <div className="flex items-center gap-2">
            <Badge
              variant={chat.isOnline ? "default" : "secondary"}
              className="text-xs px-2 py-0.5"
            >
              {chat.isOnline ? "Online" : "Offline"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {chat.participants} participants
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Phone className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
