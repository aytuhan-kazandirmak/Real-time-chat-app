import type { Chat } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Moon, MoreVertical, Phone, Sun, Video } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

type ChatHeaderProps = {
  chat: Chat;
};

export default function ChatHeader({ chat }: ChatHeaderProps) {
  const { theme, themeChanger } = useContext(ThemeContext);
  console.log("theme", theme);
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => themeChanger()}
          className="h-8 w-8 px-0"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
