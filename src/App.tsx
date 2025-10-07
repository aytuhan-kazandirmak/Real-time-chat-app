import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthContextProvider } from "./context/auth/AuthProvider";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const router = createRouter({
  routeTree,
});

function InnerApp() {
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthContextProvider>
      <InnerApp />
    </AuthContextProvider>
  );
}
