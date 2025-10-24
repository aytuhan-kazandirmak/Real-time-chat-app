import { useGetChatMessages } from "@/hooks/useChatQueries";
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
  const { data: messages } = useGetChatMessages(chatRoomId);
  console.log("messages", messages);
  return <div></div>;
}
