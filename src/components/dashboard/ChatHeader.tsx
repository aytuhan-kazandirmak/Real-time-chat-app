import type { ChatRoom } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
// import { Button } from "../ui/button";
// import { LogOut, Moon, Sun } from "lucide-react";

// import { useNavigate } from "@tanstack/react-router";
// import { useState } from "react";
// import { Spinner } from "../ui/spinner";
// import { useAuth } from "@/context/auth/useAuth";
// import { useTheme } from "@/context/theme/useAuth";

type ChatHeaderProps = {
  chat: ChatRoom | undefined;
};

export default function ChatHeader({ chat }: ChatHeaderProps) {
  // const { theme, themeChanger } = useTheme();
  // const { logout } = useAuth();
  // const [loading, setLoading] = useState<boolean>(false);
  // const navigate = useNavigate();

  // async function handleLogout() {
  //   setLoading(true);
  //   try {
  //     await logout();
  //     navigate({ to: "/login" });
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  if (!chat) return null;

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={chat.chat_participants?.[0].profiles?.avatar_url || ""}
            alt={chat.chat_participants?.[0].profiles?.full_name}
          />
          <AvatarFallback>
            {chat.chat_participants?.[0].profiles?.full_name
              .charAt(0)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <h3 className="font-medium">
            {chat.chat_participants?.[0].profiles?.full_name}
          </h3>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                chat.chat_participants?.[0].profiles?.is_online
                  ? "default"
                  : "secondary"
              }
              className="text-xs px-2 py-0.5"
            >
              {chat.chat_participants?.[0].profiles?.is_online
                ? "Online"
                : "Offline"}
            </Badge>
            {/* <span className="text-sm text-muted-foreground">
              {chat.participants} participants
            </span> */}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* <Button variant="ghost" size="icon">
          <Phone className="w-4 h-4" />
        </Button> */}
        {/* <Button
          disabled={loading}
          onClick={handleLogout}
          variant="ghost"
          size="icon"
        >
          {loading ? <Spinner /> : <LogOut />}
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
        </Button> */}
        {/* <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button> */}
      </div>
    </div>
  );
}
