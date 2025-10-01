import { mockMessages } from "@/mocks";
import ChatForm from "../form/ChatForm";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import { ScrollArea } from "../ui/scroll-area";

export default function ChatRoom() {
  return (
    <div className="relative hidden sm:block sm:flex-1 min-h-screen">
      <ChatHeader
        chat={{
          id: "1",
          name: "Team Workspace",
          avatar:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=40&h=40&fit=crop&crop=face",
          lastMessage: "Perfect! I'll upload them to the shared drive...",
          timestamp: new Date(Date.now() - 300000),
          unreadCount: 0,
          isOnline: true,
          isGroup: true,
          participants: 8,
        }}
      />
      <div className="min-h-0 overflow-hidden">
        {" "}
        <ScrollArea className="h-[527px] w-full p-4">
          {mockMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </ScrollArea>
      </div>

      <ChatForm />
    </div>
  );
}
