export default function DiscoverUsersList() {
  return (
    <div></div>
    // <div className="p-2">
    //   {users.map((user) => {

    //     return (
    //       <div
    //         key={user.id}
    //         className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors mb-2"
    //       >
    //         <Avatar className="w-12 h-12 shrink-0">
    //           <AvatarImage src={user.avatar} alt={user.name} />
    //           <AvatarFallback>
    //             {user.name.charAt(0).toUpperCase()}
    //           </AvatarFallback>
    //         </Avatar>

    //         <div className="flex-1 min-w-0">
    //           <div className="mb-2">
    //             <h4 className="font-medium">{user.name}</h4>
    //             <p className="text-sm text-muted-foreground truncate">
    //               {user.email}
    //             </p>
    //             {user.bio && (
    //               <p className="text-sm text-muted-foreground mt-1">
    //                 {user.bio}
    //               </p>
    //             )}
    //             {user.mutualFriends > 0 && (
    //               <p className="text-xs text-muted-foreground mt-1">
    //                 {user.mutualFriends} mutual friend
    //                 {user.mutualFriends !== 1 ? "s" : ""}
    //               </p>
    //             )}
    //           </div>

    //           <Button
    //             size="sm"
    //             variant={requestSent ? "outline" : "default"}
    //             // onClick={() => handleSendRequest(user.id, user.name)}
    //             disabled={isProcessing || requestSent}
    //             className="w-full"
    //           >
    //             <UserPlus className="w-4 h-4 mr-1" />
    //             {requestSent ? "Request Sent" : "Send Request"}
    //           </Button>
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>
  );
}
