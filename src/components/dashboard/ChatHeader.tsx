import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ChevronLeft } from "lucide-react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { useGetChatDetails } from "@/hooks/useChatQueries";
import { useAuth } from "@/context/auth/useAuth";
import { isActive } from "@/utils/text";
// import { Button } from "../ui/button";
// import { LogOut, Moon, Sun } from "lucide-react";

// import { useNavigate } from "@tanstack/react-router";
// import { useState } from "react";
// import { Spinner } from "../ui/spinner";
// import { useAuth } from "@/context/auth/useAuth";
// import { useTheme } from "@/context/theme/useAuth";

type ChatHeaderProps = {
  chatRoomId: number;
};

export default function ChatHeader({ chatRoomId }: ChatHeaderProps) {
  const { session } = useAuth();
  const { data: chat } = useGetChatDetails(chatRoomId, session?.user.id || "");

  const router = useRouter();
  const canGoBack = useCanGoBack();

  if (!chat) return null;
  console.log("online?", chat);

  return (
    <div className="flex items-center px-4 gap-3 border-b bg-background h-[62px] md:h-[72px]">
      {canGoBack ? (
        <ChevronLeft
          onClick={() => router.history.back()}
          className="md:hidden"
          size={35}
        />
      ) : null}

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

      <div className="flex flex-col ">
        <h3 className="font-medium">
          {chat.chat_participants?.[0].profiles?.full_name}
        </h3>
        <div className="flex items-center gap-2">
          {isActive(chat?.chat_participants?.[0]?.profiles?.updated_at) ? (
            <Badge
              variant={"default"}
              className="text-xs px-2 py-0.5 bg-green-700 text-white"
            >
              Online
            </Badge>
          ) : (
            <Badge variant={"secondary"} className="text-xs px-2 py-0.5 ">
              Offline
            </Badge>
          )}
          {/* header da ve is typingde sorun var  */}

          {/* <span className="text-sm text-muted-foreground">
              {chat.participants} participants
            </span> */}
        </div>
      </div>
    </div>
  );
}
