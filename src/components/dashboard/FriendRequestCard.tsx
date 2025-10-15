import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAcceptFriendRequests } from "@/hooks/useQueries";
import { useAuth } from "@/context/auth/useAuth";
import { toast } from "sonner";

function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000); // fark saniye cinsinden

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} month ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

export default function NotificationCard({ friendRequest }) {
  const { session } = useAuth();

  const { mutateAsync: acceptFriend, isPending: isPendingAcceptFriend } =
    useAcceptFriendRequests();
  const { sender } = friendRequest;

  async function handleAcceptFriend() {
    await acceptFriend({
      contactId: session?.user.id,
      userId: sender.id,
    });
  }
  return (
    <>
      <div
        key={sender.id}
        className="flex gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
      >
        <Avatar className="w-12 h-12 shrink-0">
          <AvatarImage src={sender?.avatar} alt={sender?.name} />
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
              //   onClick={() => handleReject(request.id, request.name)}
              //   disabled={isProcessing}
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
