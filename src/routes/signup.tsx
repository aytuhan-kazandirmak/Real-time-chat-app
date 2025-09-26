import SignupForm from "@/components/form/SignupForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-muted/30 w-full flex items-center justify-center min-h-screen p-4">
      <SignupForm />
    </div>
  );
}
