import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

const RootLayout = () => (
  <>
    <Toaster position="top-right" closeButton />
    <Outlet />
  </>
);

export const Route = createRootRoute({
  component: RootLayout,
});
