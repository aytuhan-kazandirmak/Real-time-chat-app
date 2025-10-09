import ChatSidebar from "@/components/dashboard/ChatSidebar";
import { supabase } from "@/supabaseClient";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login" });
    }
  },
  pendingComponent: () => <div>Loading...</div>,
});

function AuthenticatedLayout() {
  return (
    <div className="h-screen flex">
      <ChatSidebar />
      <Outlet />
    </div>
  );
}
