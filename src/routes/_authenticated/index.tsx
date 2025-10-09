import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="bg-red-300 w-full">Lütfen bir mesaj seçiniz!!!</div>;
}
