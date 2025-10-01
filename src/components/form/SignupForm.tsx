import { useReducer } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";

import { Eye, EyeOff, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { H4 } from "../typography/H4";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";

const formSchema = z
  .object({
    fullName: z.string().trim().min(1, { message: "Full name is required" }),
    email: z.email(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters!" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at lesat 6 characters!",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });
type InitialStateType = {
  password: boolean;
  confirmPassword: boolean;
};
type ActionType =
  | { type: "TOGGLE_PASSWORD" }
  | { type: "TOGGLE_CONFIRM_PASSWORD" };

const initialState: InitialStateType = {
  password: false,
  confirmPassword: false,
};

function reducer(state: InitialStateType, action: ActionType) {
  switch (action.type) {
    case "TOGGLE_PASSWORD": {
      return { ...state, password: !state.password };
    }
    case "TOGGLE_CONFIRM_PASSWORD": {
      return { ...state, confirmPassword: !state.confirmPassword };
    }
    default:
      return state;
  }
}

export default function SignupForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { fullName, email, password } = values;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName: fullName,
        },
      },
    });
    if (error) {
      console.log("error:", error);
    }
  }
  return (
    <Card className="max-w-md w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <MessageSquare /> <H4>ChatApp</H4>
        </CardTitle>
        <CardDescription className="text-center mt-2">
          {" "}
          <p className="text-sm">Create account</p>
          <p className="text-muted-foreground text-sm">
            Sign up to start chatting with friends
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={state.password ? "text" : "password"}
                        placeholder="Create a password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => dispatch({ type: "TOGGLE_PASSWORD" })}
                      >
                        {" "}
                        {state.password ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={state.confirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          dispatch({ type: "TOGGLE_CONFIRM_PASSWORD" })
                        }
                      >
                        {" "}
                        {state.confirmPassword ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              onClick={() => toast.success("Event has been created.")}
              type="submit"
              className="w-full"
            >
              Create account
            </Button>
            <FormDescription className="text-center">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-black">
                Sign in
              </Link>
            </FormDescription>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
