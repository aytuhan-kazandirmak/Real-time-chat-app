import { useAuth } from "@/context/auth/useAuth";
import { useGetChatParticipantTyping } from "@/hooks/useChatQueries";

type TypingInfoProps = {
  chatRoomId: number;
};

export default function TypingInfo({ chatRoomId }: TypingInfoProps) {
  const { session } = useAuth();

  const { data: typingData } = useGetChatParticipantTyping(
    chatRoomId,
    session?.user.id || ""
  );

  const isTyping = typingData?.is_typing ?? false;

  return (
    <>
      {isTyping ? (
        <div className="flex items-center gap-2 text-sm text-green-400  italic pl-4 w-full">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 bg-green-400/70 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 bg-green-400/70 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 bg-green-400/70 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          <span>typing...</span>
        </div>
      ) : null}
    </>
  );
}
