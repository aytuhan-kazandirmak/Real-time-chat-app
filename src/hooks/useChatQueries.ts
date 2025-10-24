import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useGetChatsWithId(userId: string) {
  return useQuery({
    queryKey: ["getChatWithUserId", userId],
    enabled: !!userId,
    queryFn: async () => {

    
   const { data: userChats, error: userChatsError } = await supabase
  .from("chat_participants")
  .select("chat_id")
  .eq("user_id", userId);

  if (userChatsError) throw userChatsError;

  const chatIds = userChats.map((c) => c.chat_id);

  const { data: chatsWithParticipants, error:chatsWithParticipantsError } = await supabase
  .from("chats")
  .select(`
    chat_id,
    created_at,
    chat_participants!inner(
      user_id,
      profiles(full_name, avatar_url, is_online)
      
    )
  `)
  .in("chat_id", chatIds)
  .neq("chat_participants.user_id", userId) 
  .order("created_at", { ascending: false });
  if(chatsWithParticipantsError){
  console.log("chatsWithParticipantsError",chatsWithParticipantsError)
  }
    return chatsWithParticipants
    },
  });
}


export function useGetChatMessages (chatId:string){

  return useQuery({
    queryKey:["getChatMessages",chatId],
    queryFn:async()=>{
      const { data: messages, error } = await supabase
  .from("messages")
  .select(`
    id,
    content,
    created_at,
    chat_id,
    sender_id,
    profiles!inner (
      full_name,
      avatar_url
    )
  `)
  .eq("chat_id", chatId)
  .order("created_at", { ascending: true });
    if(error){
      console.log("getChatMessages",messages)
    }
    return messages

    }
  })

}