import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$chatRoom")({
  component: RouteComponent,
  loader: async ({ params }) => {
    await new Promise((resolve) => setTimeout(() => resolve, 1000));
    return {
      messageId: params.chatRoom,
    };
  },
});

function RouteComponent() {
  const { messageId } = Route.useLoaderData();
  return <div>Hello "/$chatRoom"!</div>;
}
