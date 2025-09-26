import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    throw new Error("Something went wrong!");
    await new Promise((resolve) => setTimeout(() => resolve, 1000));
    return {
      postId: params.postId,
    };
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Some error problems!</div>,
});

function RouteComponent() {
  const { postId } = Route.useLoaderData();
  return <div>{postId} page heloooo </div>;
}
