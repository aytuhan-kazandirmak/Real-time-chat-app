import LoginForm from "@/components/form/LoginForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-muted/30 w-full flex items-center justify-center min-h-screen p-4">
      <LoginForm />
    </div>
  );
}
