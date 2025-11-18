import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/auth/useAuth";
import { useTheme } from "@/context/theme/useAuth";
import { supabase } from "@/supabaseClient";
import {
  createFileRoute,
  redirect,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, Camera, LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login" });
    }
  },
  pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
  const { theme, themeChanger } = useTheme();
  const { logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen ">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            {canGoBack ? (
              <Button
                onClick={() => router.history.back()}
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            ) : null}
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>
          </div>

          {/* Quick logout button in header */}
          <Button
            variant="outline"
            disabled={loading}
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-4">
                <Spinner /> Log Out
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <LogOut className="w-4 h-4" /> Log Out
              </div>
            )}
          </Button>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="asd" alt="Aytuhan Kazandırmak" />
                  <AvatarFallback className="text-lg">
                    {/* {user?.name?.charAt(0).toUpperCase()} */}
                    Aytuhan Kazandırmak
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                  // onClick={handleAvatarChange}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-medium">Aytuhan Kazandırmak</h3>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  // onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  // value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <Button
            // onClick={handleSave} disabled={isLoading}
            >
              {/* {isLoading ? "Saving..." : "Save Changes"} */}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Theme</h4>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred theme:{" "}
                  {theme === "dark" ? `System (dark)` : `System (light)`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => themeChanger()}
                className="h-8 w-8 px-0"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
