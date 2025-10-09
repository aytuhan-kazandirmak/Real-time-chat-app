import { mockMessages } from "@/mocks";
import ChatForm from "../form/ChatForm";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import { ScrollArea } from "../ui/scroll-area";

export default function ChatRoom({ chat, messages }) {
  return (
    <div className="relative hidden sm:block sm:flex-1 min-h-screen">
      <ChatHeader chat={chat[0]} />
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
