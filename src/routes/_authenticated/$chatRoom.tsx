import ChatMessage from "@/components/dashboard/ChatMessage";
import ChatForm from "@/components/form/ChatForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetChatMessages } from "@/hooks/useChatQueries";
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
  const { data: messages } = useGetChatMessages(chatRoomId);
  console.log("messages", messages);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex w-full flex-col h-full max-h-screen">
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages?.map((message) => (
              <ChatMessage message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="flex-shrink-0">
        <ChatForm />
      </div>
    </div>
  );
}
