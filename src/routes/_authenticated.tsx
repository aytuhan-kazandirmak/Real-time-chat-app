import ChatSidebar from "@/components/dashboard/ChatSidebar";
import { supabase } from "@/supabaseClient";
import {
  createFileRoute,
  Outlet,
  redirect,
  useParams,
} from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

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

// ekran belirli bir büyüklüğe gelene kadar sadece sidebar görünecek.
// yine ekran belirli bir seviyeye gelene kadar outlet görünmeyecek çünkü chatlara tıkladığımda direkt chatın açılması için
// erkan belirli bir büyüklüğü geçince bu kez hem sidebar hem de chatroom
// belki context ile ekran boyutunu dağıtıp ihtiyacım olan yerde kullanabilirim.

function AuthenticatedLayout() {
  const { chatRoom } = useParams({ strict: false });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex">
      {isMobile && chatRoom ? null : <ChatSidebar />}
      {!isMobile && !chatRoom ? (
        <div className="w-full  justify-center items-center hidden md:flex">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl mb-2">Welcome to ChatApp</h2>
              <p>Select a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
