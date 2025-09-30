import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
const formSchema = z.object({
  message: z.string().trim().min(1),
});

export default function ChatForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    form.reset();
  }

  return (
    <div className="sticky bottom-0 left-0 w-full h-[84px] border-t bg-background flex items-center">
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
                <FormControl>
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
