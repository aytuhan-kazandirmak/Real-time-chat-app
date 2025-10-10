import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full  justify-center items-center hidden md:flex">
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl mb-2">Welcome to ChatApp</h2>
          <p>Select a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    </div>
  );
}
