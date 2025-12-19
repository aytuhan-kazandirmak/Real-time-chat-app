// import ChatHeader from "@/components/dashboard/ChatHeader";
import ChatMessage from "@/components/dashboard/ChatMessage";

import { useAuth } from "@/context/auth/useAuth";
import {
  useGetChatDetails,
  useGetChatMessages,
  useMarkMessagesAsRead,
} from "@/hooks/useChatQueries";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

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
  const { data: chatDetails } = useGetChatDetails(
    chatRoomId,
    session?.user.id || ""
  );

  const { mutateAsync: messagesAsRead } = useMarkMessagesAsRead();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log(
    "chatDetails?.chat_participants?.[0].is_typing",
    chatDetails?.chat_participants?.[0].is_typing
  );

  return (
    <div
      className="flex w-full flex-col relative overflow-hidden"
      style={{
        height: "100vh",
        border: "3px solid blue",
        minHeight: "-webkit-fill-available",
      }}
    >
      {/* <div className="sticky top-0 right-0 z-10">
        <ChatHeader chatRoomId={chatRoomId} />
      </div> */}
      <div className="bg-purple-300 h-[79px]">fdgdfg</div>
      <div className="flex-1 overflow-y-auto bg-green-300 min-h-0">
        <div className="space-y-4 p-4">
          {messages?.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {chatDetails?.chat_participants?.[0].is_typing && (
            <div className="flex items-center gap-2 text-sm text-green-400 italic">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-green-400/70 rounded-full animate-bounce" />
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
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className=" bg-blue-300 h-[84px]">asd</div>
      {/* <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full ">
          <div className="space-y-4  relative">
            {messages?.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {chatDetails?.chat_participants?.[0].is_typing ? (
              <div className="flex items-center gap-2 text-sm text-green-400  italic pl-4 absolute left-0 bottom-0">
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
            ) : null}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div> */}

      {/* <div className="sticky bottom-0 right-0">
        <ChatForm roomId={chatRoomId} />
      </div> */}
    </div>
  );
}
