import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetSingleUserWithId } from "@/hooks/useUserQueries";

type ProfileCardMobileProps = {
  currentUserId: string;
};

export default function ProfileCardMobile({
  currentUserId,
}: ProfileCardMobileProps) {
  const { data: userDetails } = useGetSingleUserWithId(currentUserId);

  return (
    <Link
      to={"/profile"}
      className="md:hidden flex-1 px-4 py-3 text-sm font-medium transition-colors relative flex justify-center items-center"
    >
      {" "}
      <Avatar className="w-8 h-8">
        <AvatarImage
          src={userDetails?.avatar_url || ""}
          alt={userDetails?.full_name}
        />
        <AvatarFallback>
          {userDetails?.full_name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
