import { supabase } from "@/supabaseClient";
import type { ChatMessage, ChatRoom } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";



export function useGetChatsWithId(userId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["getChatWithUserId", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data: userChats, error: userChatsError } = await supabase
        .from("chat_participants")
        .select("chat_id")
        .eq("user_id", userId);

      if (userChatsError) throw userChatsError;

      const chatIds = userChats.map((c) => c.chat_id);

      const { data, error } = await supabase
        .from("chats")
        .select(`
          chat_id,
          created_at,
          last_message_id,
          last_message_content,
          last_message_created_at,
          last_message_sender_id,
          last_message_is_read,
          chat_participants!inner(
            user_id,
            profiles(full_name, avatar_url, is_online, updated_at),
            is_typing
          )
        `)
        .in("chat_id", chatIds)
        .neq("chat_participants.user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    },
  });

const chatIds = query.data?.map(c => c.chat_id).join(",") ?? "";

useEffect(() => {
  if (!userId || !chatIds) return;

  const channel = supabase
    .channel(`user-chats-${userId}`)
    // chats tablosu için
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "chats",
        filter: `chat_id=in.(${chatIds})`,
      },
      (payload) => {
        queryClient.setQueryData<ChatRoom[]>(
          ["getChatWithUserId", userId],
          (oldData) => {
          
            if (!oldData) return [payload.new as ChatRoom];
           return oldData.map((chat) => {
  if (chat.chat_id !== (payload.new as ChatRoom).chat_id) return chat;

  return {
    ...chat,
    last_message_id: payload.new.last_message_id,
    last_message_content: payload.new.last_message_content,
    last_message_created_at: payload.new.last_message_created_at,
    last_message_sender_id: payload.new.last_message_sender_id,
    last_message_is_read: payload.new.last_message_is_read,
    chat_participants: chat.chat_participants, // eski katılımcıları koru
  };
});
          }
        );
      }
    )

    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "chat_participants",
        filter: `chat_id=in.(${chatIds})`,
      },
      (payload) => {
        queryClient.setQueryData<ChatRoom[]>(
          ["getChatWithUserId", userId],
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.map((chat) => {
              if (chat.chat_id !== (payload.new as ChatRoom).chat_id) return chat;

              return {
                ...chat,
                chat_participants: chat?.chat_participants?.map((p) =>
                  p.user_id === (payload.new as any).user_id
                    ? { ...p, is_typing: (payload.new as any).is_typing }
                    : p
                ),
              };
            });
          }
        );
      }
    )
    // profiles tablosu için (online/offline ve updated_at)
.on(
  "postgres_changes",
  {
    event: "UPDATE",
    schema: "public",
    table: "profiles",
  },
  (payload) => {
 
    
    queryClient.setQueryData<ChatRoom[]>(
  ["getChatWithUserId", userId],
  (oldData) => {
    if (!oldData) return oldData;

    const updatedProfile = payload.new;

    return oldData.map((chat) => ({
      ...chat,
      chat_participants: chat?.chat_participants?.map((p) =>
        p.user_id === updatedProfile.id
          ? {
              ...p,
              profiles: {
                ...p.profiles,
                is_online: updatedProfile.is_online ?? p.profiles?.is_online ?? false,
                updated_at: updatedProfile.updated_at ?? p.profiles?.updated_at ?? null,
                full_name: updatedProfile.full_name ?? p.profiles?.full_name ?? "",
                avatar_url: updatedProfile.avatar_url ?? p.profiles?.avatar_url ?? null,
              },
            }
          : p
      ),
    }));
  }
);

  }
)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [userId, chatIds, queryClient]);

  return query;
}

export function useGetChatDetails(chatId: number, currentUserId: string) {
  const queryClient = useQueryClient();

  // 1️⃣ Normal fetch
  const query = useQuery({
    queryKey: ["getChatDetails", chatId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chats")
        .select(`
          chat_id,
          created_at,
          last_message_id,
          chat_participants!inner(
            user_id,
            is_typing,
            profiles(full_name, avatar_url, is_online, updated_at)
          )
        `)
        .eq("chat_id", chatId)
        .neq("chat_participants.user_id", currentUserId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!chatId,
  });

  // 2️⃣ Realtime subscription
  useEffect(() => {
    if (!chatId) return;

    const channel = supabase.channel(`chat-details-${chatId}`);

    // chats tablosu
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "chats", filter: `chat_id=eq.${chatId}` },
      (payload) => {
        queryClient.setQueryData(["getChatDetails", chatId], payload.new);
      }
    );

    // chat_participants tablosu
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "chat_participants", filter: `chat_id=eq.${chatId}` },
      (payload) => {
        queryClient.setQueryData(["getChatDetails", chatId], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            chat_participants: oldData?.chat_participants?.map((p: any) =>
              p.user_id === payload.new.user_id ? { ...p, is_typing: payload.new.is_typing } : p
            ),
          };
        });
      }
    );

    // profiles tablosu
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "profiles" },
      (payload) => {
        queryClient.setQueryData(["getChatDetails", chatId], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            chat_participants: oldData?.chat_participants?.map((p: any) =>
              p.user_id === payload.new.id
                ? {
                    ...p,
                    profiles: {
                      ...p.profiles,
                      is_online: payload.new.is_online ?? p.profiles?.is_online ?? false,
                      updated_at: payload.new.updated_at ?? p.profiles?.updated_at ?? null,
                      full_name: payload.new.full_name ?? p.profiles?.full_name ?? "",
                      avatar_url: payload.new.avatar_url ?? p.profiles?.avatar_url ?? null,
                    },
                  }
                : p
            ),
          };
        });
      }
    );

    // subscribe
    channel.subscribe();

    // ❌ cleanup artık senkron
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, queryClient]);

  return query;
}


export function useGetChatMessages(chatId: number) {
  const queryClient = useQueryClient();

  // 1️⃣ Normal Query (ilk fetch)
  const query = useQuery({
    queryKey: ["getChatMessages", chatId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          chat_id,
          sender_id,
          is_read,
          profiles!inner (
            full_name,
            avatar_url
          )
        `
        )
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!chatId, // chatId yoksa fetch etme
  });

  // 2️⃣ Realtime dinleyici (React Query cache güncelleme)
useEffect(() => {
  if (!chatId) return;

  const channel = supabase
    .channel(`chat-room-${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        queryClient.setQueryData(["getChatMessages", chatId], (oldData: ChatMessage[] = []) => {
          const newMessage = payload.new as ChatMessage;
          const oldMessage = payload.old as ChatMessage;

          switch (payload.eventType) {
            case "INSERT":
              // yeni mesaj eklendi
              return [...oldData, newMessage];

            case "UPDATE":
              // is_read veya content değiştiyse güncelle
              return oldData.map((msg) =>
                msg.id === newMessage.id ? { ...msg, ...newMessage } : msg
              );

            case "DELETE":
              // mesaj silindiyse çıkar
              return oldData.filter((msg) => msg.id !== oldMessage.id);

            default:
              return oldData;
          }
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [chatId, queryClient]);

  return query;
}


export function useSendMessage (){
  return useMutation({
    mutationFn:async(payload:{content:string; chat_id:number;sender_id:string})=>{


      const { error } = await supabase
      .from('messages')
      .insert([
          { content:payload.content, chat_id: payload.chat_id, sender_id: payload.sender_id },
      ])
      .select()


      if(error){
        console.log("useSendMessage", error)
      }
    },

  })
} 


export function useLastSeenUpdater(userId?: string) {
  return useQuery({
    queryKey: ["lastSeenUpdater", userId],
    queryFn: async () => {
      if (!userId) return;
      const { error } = await supabase
        .from("profiles")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (error) throw error;
      return true;
    },
    refetchInterval: 30_000, // her 30 sn’de bir çalışır
    enabled: !!userId, // userId varsa aktif et
  });
}


export function useSetTypingStatus(){
 return useMutation({
  mutationFn:async(payload:{roomId:number; userId:string; isTyping:boolean})=>{
        const { data, error } = await supabase
      .from("chat_participants")
      .update({ is_typing: payload.isTyping })
      .eq("chat_id", payload.roomId)
      .eq("user_id", payload.userId);

    if (error) {
      console.error("Typing status update error:", error);
    }

    return data;
  }
 })
}

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: number) => {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("chat_id", chatId)
        .eq("is_read", false);

      if (error) throw error;
    },
    onSuccess: (_, chatId) => {
      // Cache’teki mesajları da güncelle
      queryClient.setQueryData(["getChatMessages", chatId], (oldData: any[] = []) =>
        oldData.map((msg) => ({ ...msg, is_read: true }))
      );
    },
  });
}