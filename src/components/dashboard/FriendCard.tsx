import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { Profiles } from "@/types";

type FriendCardProps = {
  friend: Profiles;
};

export default function FriendCard({ friend }: FriendCardProps) {
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

          <div
            className={`${friend.is_online ? "bg-green-500" : "bg-gray-500"} absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-background rounded-full`}
          />
        </div>

        <div>
          <h4 className="font-medium">{friend.full_name}</h4>
          <p className="text-sm text-muted-foreground truncate">
            {friend.email}
          </p>
          <p className="text-sm text-muted-foreground">{friend.is_online}</p>
        </div>
      </div>

      {/* belki buraya kullanıcıyı arkadaş listesinden çıkarma ya da bloklama gelebilir */}

      {/* <Button
        onClick={handleClick}
        size="sm"
        variant="ghost"
        className="shrink-0"
      >
        <Plus className="w-4 h-4" />
      </Button> */}
    </div>
  );
}
