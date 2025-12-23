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

import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

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

  const { mutateAsync: messagesAsRead } = useMarkMessagesAsRead();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (!messages || !session) return;

    // 1️⃣ Eğer yeni mesaj geldiyse ve bu mesaj bana ait değilse
    const hasUnread = messages.some(
      (m) => !m.is_read && m.sender_id !== session.user.id
    );

    // 2️⃣ Chat açıkken otomatik okundu say
    if (hasUnread) {
      messagesAsRead(chatRoomId);
    }
  }, [messages, chatRoomId, session, messagesAsRead]);

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
