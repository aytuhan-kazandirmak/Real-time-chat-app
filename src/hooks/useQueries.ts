import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useProfileQuery(id?: string) {
  return useQuery({
    queryKey: ["getProfiles"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", id);

      if (error) {
        return console.error("Profil sorgu hatası:", error);
      }

      return profiles;
    },
  });
}
