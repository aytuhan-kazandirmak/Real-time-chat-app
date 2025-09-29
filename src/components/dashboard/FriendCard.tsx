import type { Friend } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

type FriendCardProps = {
  friend: Friend;
};

export default function FriendCard({ friend }: FriendCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors mb-1">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={friend.avatar} alt={friend.name} />
            <AvatarFallback>
              {friend.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {friend.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        <div>
          <h4 className="font-medium">{friend.name}</h4>
          <p className="text-sm text-muted-foreground">{friend.status}</p>
        </div>
      </div>

      <Button size="sm" variant="ghost" className="shrink-0">
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
