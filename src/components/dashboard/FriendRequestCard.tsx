import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  useAcceptFriendRequests,
  useRejectFriendRequests,
} from "@/hooks/useUserQueries";
import { useAuth } from "@/context/auth/useAuth";
import type { FriendRequest } from "@/types";
import { timeAgo } from "@/utils/text";

type FriendRequestCardProps = {
  friendRequest: FriendRequest;
};

export default function FriendRequestCard({
  friendRequest,
}: FriendRequestCardProps) {
  const { session } = useAuth();

  const { mutateAsync: acceptFriendRequest, isPending: isPendingAcceptFriend } =
    useAcceptFriendRequests();

  const { mutateAsync: deleteFriendRequest, isPending: isPendingDeleteFriend } =
    useRejectFriendRequests();
  const { sender } = friendRequest;

  async function handleAcceptFriend() {
    await acceptFriendRequest({
      contactId: session?.user.id || "",
      userId: sender.id,
    });
  }

  async function handleDeleteFriendRequest() {
    await deleteFriendRequest(friendRequest.id);
  }

  return (
    <>
      <div
        key={sender.id}
        className="flex gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
      >
        <Avatar className="w-12 h-12 shrink-0">
          <AvatarImage
            src={sender?.avatar_url ? sender?.avatar_url : undefined}
            alt={sender?.avatar_url ? sender?.avatar_url : undefined}
          />

          <AvatarFallback>
            {sender.full_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h4 className="font-medium">{sender.full_name}</h4>
            <p className="text-sm text-muted-foreground truncate">
              {sender.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {timeAgo(friendRequest.created_at)} · 3 mutual friends
            </p>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleAcceptFriend}
              disabled={isPendingAcceptFriend}
              className="flex-1 cursor-pointer"
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteFriendRequest}
              disabled={isPendingDeleteFriend}
              className="flex-1 cursor-pointer"
            >
              <X className="w-4 h-4 mr-1" />
              Decline
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
