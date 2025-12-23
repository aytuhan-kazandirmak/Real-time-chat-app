import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { isActive } from "@/utils/text";
import { useGetSingleUserWithId } from "@/hooks/useUserQueries";

type ProfileCardProps = {
  currentUserId: string;
};

export default function ProfileCard({ currentUserId }: ProfileCardProps) {
  const { data: userDetails } = useGetSingleUserWithId(currentUserId);
  console.log(userDetails);

  return (
    <Link
      className="p-1 w-full h-[84px] border-t max-md:hidden"
      to={"/profile"}
    >
      <Button variant="ghost" className="w-full justify-start gap-3 p-3 h-full">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={userDetails?.avatar_url || ""}
              alt={userDetails?.full_name}
            />
            <AvatarFallback>
              {userDetails?.full_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
            className={`${isActive(userDetails?.updated_at) ? "bg-green-500" : "bg-gray-500"} absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-background rounded-full`}
          />
        </div>
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium">{userDetails?.full_name}</p>
          <p className="text-xs text-muted-foreground">{userDetails?.email}</p>
        </div>
      </Button>
    </Link>
  );
}
