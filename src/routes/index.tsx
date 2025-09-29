import ChatSidebar from "@/components/dashboard/ChatSidebar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="h-screen">
      <ChatSidebar />
    </div>
  );
}
