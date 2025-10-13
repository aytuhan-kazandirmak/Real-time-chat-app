import type { Profiles } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/context/auth/useAuth";
import { toast } from "sonner";

type FriendCardProps = {
  friend: Profiles;
};

export default function FriendCard({ friend }: FriendCardProps) {
  const { session } = useAuth();
  async function handleClick() {
    const { error } = await supabase
      .from("contacts")
      .insert([
        { user_id: session?.user.id, contact_id: friend.id, status: "pending" },
      ]);

    if (error) {
      toast("Friend request could not be sent!");
    }
    return toast("Friend request has been sent!");
  }
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors mb-1">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={friend.avatar_url ? friend.avatar_url : undefined}
              alt={friend.full_name}
            />
            <AvatarFallback>
              {friend.full_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {friend.is_online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        <div>
          <h4 className="font-medium">{friend.full_name}</h4>
          <p className="text-sm text-muted-foreground">{friend.is_online}</p>
        </div>
      </div>

      <Button
        onClick={handleClick}
        size="sm"
        variant="ghost"
        className="shrink-0"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
