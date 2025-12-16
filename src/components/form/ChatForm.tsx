import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useSendMessage, useSetTypingStatus } from "@/hooks/useChatQueries";
import { useAuth } from "@/context/auth/useAuth";
import { useRef, useState } from "react";

const formSchema = z.object({
  message: z.string().trim().min(1),
});

type ChatForm = {
  roomId: number;
};

export default function ChatForm({ roomId }: ChatForm) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const sendMessage = useSendMessage(roomId);
  const { session } = useAuth();
  const { mutateAsync: setTypingStatus } = useSetTypingStatus();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const payload = {
      content: values.message,
      chat_id: roomId,
      sender_id: session?.user.id || "",
    };

    sendMessage.mutate(payload);

    form.reset();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    const payload = {
      roomId,
      userId: session?.user.id || "",
    };

    // 🔸 1. Input boşsa => yazıyor görünmesin
    if (value.trim().length === 0) {
      if (isTyping) {
        setTypingStatus({ ...payload, isTyping: false });
        setIsTyping(false);
      }
      return;
    }

    // 🔸 2. Eğer kullanıcı ilk kez yazmaya başladıysa
    if (!isTyping) {
      setTypingStatus({ ...payload, isTyping: true });
      setIsTyping(true);
    }

    // 🔸 3. Eski timeout varsa temizle
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // 🔸 4. 3 saniye boyunca yazmazsa => yazıyor false
    typingTimeout.current = setTimeout(() => {
      setTypingStatus({ ...payload, isTyping: false });
      setIsTyping(false);
    }, 1000);
  }

  return (
    <div className="sticky bottom-0 left-0 w-full h-[84px] border-t bg-background flex items-center max-md:mb-[70px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2 w-full px-4"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl onChange={onChange}>
                  <Input
                    autoComplete="off"
                    {...field}
                    //   onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    //   disabled={disabled}
                    className="w-full"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            // disabled={!message.trim() || disabled}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
