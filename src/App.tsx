import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthContextProvider } from "./context/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./context/auth/useAuth";
import { useLastSeenUpdater } from "./hooks/useChatQueries";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
});

function InnerApp() {
  const { session } = useAuth(); // örneğin supabase auth user
  useLastSeenUpdater(session?.user.id); // burada sadece çağırıyoruz
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <InnerApp />
      </QueryClientProvider>
    </AuthContextProvider>
  );
}
