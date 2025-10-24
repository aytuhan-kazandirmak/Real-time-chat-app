import type { Profiles } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/context/auth/useAuth";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { useState } from "react";
type DiscoverUserCardProps = {
  user: Profiles;
};

export default function DiscoverUserCard({ user }: DiscoverUserCardProps) {
  const [requestSent, setRequestSent] = useState(false);
  const { session } = useAuth();

  async function handleClick() {
    if (!session?.user.id) return;

    const { data: existingRequests, error: checkError } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("contact_id", user.id)
      .in("status", ["pending", "accepted"]);

    if (checkError) {
      console.error(checkError);
      toast("An error occurred while checking friend requests!");
      return;
    }

    if (existingRequests && existingRequests.length > 0) {
      const request = existingRequests[0];

      if (request.status === "pending") {
        toast("Friend request already sent and pending!");
        return;
      }

      if (request.status === "accepted") {
        toast("You are already friends!");
        return;
      }
    }

    const { error: insertError } = await supabase
      .from("contacts")
      .insert([
        { user_id: session?.user.id, contact_id: user.id, status: "pending" },
      ]);

    if (insertError) {
      console.error(insertError);
      toast("Friend request could not be sent!");
      return;
    }
    setRequestSent(true);
    toast("Friend request has been sent!");
  }
  return (
    <div
      key={user.id}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
    >
      <Avatar className="w-12 h-12 shrink-0">
        <AvatarImage
          src={user.avatar_url || undefined}
          alt={user.avatar_url || undefined}
        />
        <AvatarFallback>
          {user.full_name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <h4 className="font-medium">{user.full_name}</h4>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          {/* {user.bio && (
            <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>
          )} */}
          {/* {user.mutualFriends > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {user.mutualFriends} mutual friend
              {user.mutualFriends !== 1 ? "s" : ""}
            </p>
          )} */}
        </div>

        <Button
          size="sm"
          // variant={requestSent ? "outline" : "default"}
          onClick={handleClick}
          // disabled={isProcessing || requestSent}
          className="w-full"
        >
          <UserPlus className="w-4 h-4 mr-1" />
          {requestSent ? "Request Sent" : "Send Request"}
        </Button>
      </div>
    </div>
  );
}
