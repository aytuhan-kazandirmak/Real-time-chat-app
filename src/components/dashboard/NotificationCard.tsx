import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
  const { user: contact } = friendRequest;
  return (
    <>
      <div
        key={contact.id}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
      >
        <Avatar className="w-12 h-12 shrink-0">
          <AvatarImage src={contact?.avatar} alt={contact?.name} />
          <AvatarFallback>
            {contact.full_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-medium">{contact.full_name}</h4>
              <p className="text-xs text-muted-foreground">
                {timeAgo(friendRequest.created_at)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="default"
              //   onClick={() =>
              //     handleAccept(friendRequest.id, friendRequest.name)
              //   }
              //   disabled={isProcessing}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              //   onClick={() => handleReject(request.id, request.name)}
              //   disabled={isProcessing}
              className="flex-1"
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
