import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { AuthContextProvider } from "@/context/AuthContext";
const RootLayout = () => (
  <>
    <ThemeContextProvider>
      <AuthContextProvider>
        <Toaster position="top-right" closeButton />
        <Outlet />
        <TanStackRouterDevtools />
      </AuthContextProvider>
    </ThemeContextProvider>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
