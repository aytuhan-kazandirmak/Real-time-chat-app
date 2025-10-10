import ChatRoom from "@/components/dashboard/ChatRoom";
import { mockChats, mockMessages } from "@/mocks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$chatRoom")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      chatRoomId: params.chatRoom,
    };
  },
});

function RouteComponent() {
  const { chatRoomId } = Route.useLoaderData();
  const filteredChat = mockChats.filter((chat) => chat.id === chatRoomId);

  return <ChatRoom chat={filteredChat} messages={mockMessages} />;
}
