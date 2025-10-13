import { supabase } from "@/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfilesQuery(id?: string) {
  return useQuery({
    queryKey: ["getProfiles"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", id);

      if (error) {
        return console.error("useQuery", error);
      }

      return profiles;
    },
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("chats")
        .insert([{ some_column: "someValue", other_column: "otherValue" }])
        .select();

      if (error) {
        return console.error("useCreateChat", error);
      }
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        // burası doldurulacak
      });
    },
  });
}

export function useGetFriendRequest(id: string | undefined) {
  return useQuery({
    queryKey: ["getUsersFriendRequest"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select(
          `
    user_id,
    status,
    created_at,
    user:profiles (
      id,
      full_name,
      email
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

// export function useDeleteOrAcceptFriendRequests(id: string | undefined) {
//   return useQuery({
//     queryKey: ["getUsersFriendRequest"],
//     queryFn: async () => {
//     const { data, error } = await supabase
//       .from("contacts")
//       .update({
//         status: "accepted",
//         created_at: new Date().toISOString(),
//       })
//       .eq("user_id", userId)
//       .eq("contact_id", myId)
//       .select();
//       if (error) console.log("An error occured", error);

//       return data;
//     },
//   });
// }
