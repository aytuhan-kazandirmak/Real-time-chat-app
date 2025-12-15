import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { ChatRoom } from "@/types";

type FriendCardProps = {
  friend: ChatRoom;
};

export default function FriendCard({ friend }: FriendCardProps) {
  return (
    <Link
      to="/$chatRoom"
      params={{
        chatRoom: String(friend.chat_id),
      }}
      className="w-full min-h-20 flex items-center rounded-lg hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-3 p-2 h-full">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={
                friend.chat_participants[0].profiles?.avatar_url
                  ? friend.chat_participants[0].profiles?.avatar_url
                  : undefined
              }
              alt={friend.chat_participants[0].profiles?.full_name}
            />
            <AvatarFallback>
              {friend.chat_participants[0].profiles?.full_name
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div
            className={`${friend.chat_participants[0].profiles?.is_online ? "bg-green-500" : "bg-gray-500"} absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-background rounded-full`}
          />
        </div>

        <div>
          <h4 className="font-medium truncate">
            {friend.chat_participants[0].profiles?.full_name}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {friend.chat_participants[0].profiles?.email}
          </p>
          <p className="text-sm text-muted-foreground">
            {friend.chat_participants[0].profiles?.is_online}
          </p>
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
    </Link>
  );
}
