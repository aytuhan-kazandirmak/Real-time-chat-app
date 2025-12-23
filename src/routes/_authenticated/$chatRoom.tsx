// import ChatHeader from "@/components/dashboard/ChatHeader";
import ChatHeader from "@/components/dashboard/ChatHeader";
import ChatMessage from "@/components/dashboard/ChatMessage";
import TypingInfo from "@/components/dashboard/TypingInfo";
import ChatForm from "@/components/form/ChatForm";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useAuth } from "@/context/auth/useAuth";
import {
  useGetChatMessages,
  useMarkMessagesAsRead,
} from "@/hooks/useChatQueries";

import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export const Route = createFileRoute("/_authenticated/$chatRoom")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const chatRoomId = Number(params.chatRoom);

    return { chatRoomId };
  },
});

function RouteComponent() {
  const { chatRoomId } = Route.useLoaderData();
  const { session } = useAuth();
  const { data: messages } = useGetChatMessages(chatRoomId);

  const [isVisible, setIsVisible] = useState(!document.hidden);
  const { mutateAsync: messagesAsRead } = useMarkMessagesAsRead();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chatRoom } = useParams({ strict: false });
  console.log("chatRoom", chatRoom);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  }, []);

  useLayoutEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 2️⃣ Kullanıcı chat'teyse VE sayfa görünürse mesajları okundu yap
  useEffect(() => {
    if (!messages || !session || !isVisible) return;

    const unreadMessages = messages.filter(
      (m) => !m.is_read && m.sender_id !== session.user.id
    );

    if (unreadMessages.length > 0) {
      // Debounce ile - çok sık güncelleme olmasın
      const timeoutId = setTimeout(() => {
        messagesAsRead(chatRoomId);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [messages, session, isVisible, chatRoomId, messagesAsRead]);

  return (
    <div className="flex w-full flex-col relative overflow-hidden h-dvh">
      <ChatHeader chatRoomId={chatRoomId} />

      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full ">
          <div className="space-y-4  relative">
            {messages?.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div>
              <TypingInfo
                chatRoomId={chatRoomId}
                scrollToBottom={scrollToBottom}
              />
            </div>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <ChatForm roomId={chatRoomId} />
    </div>
  );
}
