import { supabase } from "@/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetSingleUserWithId(id: string) {
  return useQuery({
    queryKey: ["getSingleUserWithId", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id);

      if (error) {
        console.error("getUnfriendedProfiles contacts", error);
        return [];
      }

      return data;
    },
  });
}

export function useDiscoverFriendsQuery(id: string) {
  return useQuery({
    queryKey: ["getProfiles"],
    queryFn: async () => {
      const { data: contacts, error: contactError } = await supabase
        .from("contacts")
        .select("contact_id, user_id")
        .or(`user_id.eq.${id},contact_id.eq.${id}`);

      if (contactError) {
        console.error("getUnfriendedProfiles contacts", contactError);
        return [];
      }

      // Benimle bağlantılı (arkadaş olan) kullanıcı ID'lerini bul
      const connectedIds = contacts
        ? contacts.map((c) => (c.user_id === id ? c.contact_id : c.user_id))
        : [];

      // Kendimi de hariç tut
      connectedIds.push(id);

      // Artık bu ID’lerin dışındaki profilleri çek
      const { data: discoverFriends, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .not("id", "in", `(${connectedIds.join(",")})`);

      if (profilesError) {
        console.error("getUnfriendedProfiles profiles", profilesError);
        return [];
      }

      return discoverFriends;
    },
  });
}

export function useGetFriends(id?: string) {
  return useQuery({
    queryKey: ["getFriends", id],
    enabled: !!id,
    queryFn: async () => {
      const { data: contacts, error } = await supabase
        .from("contacts")
        .select(
          `
  user_id,
  contact_id,
  status,
  created_at,
  user:profiles!contacts_user_id_fkey (
    id,
    full_name,
    email,
    avatar_url,
    is_online
  ),
  contact:profiles!contacts_contact_id_fkey (
    id,
    full_name,
    email,
    avatar_url,
    is_online
  )
`
        )
        .or(`user_id.eq.${id},contact_id.eq.${id}`)
        .eq("status", "accepted");

      if (error) {
        console.error("useQuery", error);
        return [];
      }

      const friends = contacts.map((row) => {
        const friend = row.user_id === id ? row.contact : row.user;
        return {
          id: friend.id,
          full_name: friend.full_name,
          email: friend.email,
          created_at: row.created_at,
          avatar_url: friend.avatar_url,
          is_online: friend.is_online,
        };
      });
      return friends;
    },
  });
}

// export function useCreateChat() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async () => {
//       const { data, error } = await supabase
//         .from("chats")
//         .insert([{ some_column: "someValue", other_column: "otherValue" }])
//         .select();

//       if (error) {
//         return console.error("useCreateChat", error);
//       }
//       return data;
//     },
//     onSuccess() {
//       queryClient.invalidateQueries({
//         // burası doldurulacak
//       });
//     },
//   });
// }

export function useGetFriendRequest(id: string) {
  return useQuery({
    queryKey: ["getUsersFriendRequest"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select(
          `
    id,
    status,
    created_at,
    sender:profiles!contacts_user_id_fkey (
      id,
      full_name,
      email,
      avatar_url
    )
  `
        )
        .eq("contact_id", id)
        .eq("status", "pending");
      if (error) console.log("An error occured", error);

      return data;
    },
  });
}

// alt taraf use mutation kullanıcı arkadaşlık isteğini kabul etme veya reddetme burada hem bir id alınacak hem de bir parametre
// sil ya da kabul et parametresi

export function useAcceptFriendRequests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { userId: string; contactId: string }) => {
      const { data, error } = await supabase
        .from("contacts")
        .update({
          status: "accepted",
          created_at: new Date().toISOString(),
        })
        .eq("user_id", payload.userId)
        .eq("contact_id", payload.contactId)
        .select();

      if (error) {
        toast.error(`Something went wrong! ${error.message}`);
        return error;
      }
      return (
        data.length > 0 && toast.success("Friend request accepted successfuly!")
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [],
      });
    },
  });
}
export function useRejectFriendRequests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: number) => {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", requestId);
      if (error) {
        toast.error(`Something went wrong: ${error.message}`);
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUsersFriendRequest"] });
    },
  });
}
