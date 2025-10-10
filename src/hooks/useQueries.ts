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
