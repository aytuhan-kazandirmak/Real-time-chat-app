import { supabase } from "@/supabaseClient";
import { useMutation } from "@tanstack/react-query";

type UploadImagePayload = {
  filePath: string;
  file: File;
};

type UploadImageResult = {
  publicUrl: string;
};

export function useUploadImage() {
  return useMutation({
    mutationFn: async (
      payload: UploadImagePayload
    ): Promise<UploadImageResult> => {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(payload.filePath, payload.file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Public URL'i al ve return et
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(payload.filePath);

      return {
        publicUrl: data.publicUrl,
      };
    },
  });
}
