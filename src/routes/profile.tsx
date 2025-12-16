import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/auth/useAuth";
import { useTheme } from "@/context/theme/useAuth";
import { useUploadImage } from "@/hooks/useUploadImage";
import {
  useGetSingleUserWithId,
  useUpdateProfileName,
  useUpdateProfilePhoto,
} from "@/hooks/useUserQueries";
import { supabase } from "@/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  redirect,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, Camera, Loader2, LogOut, Moon, Sun } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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

const formSchema = z.object({
  full_name: z.string().trim().min(1),
});

function RouteComponent() {
  const { session } = useAuth();
  const { data: profileDetails } = useGetSingleUserWithId(
    session?.user.id || ""
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profileDetails?.full_name || "",
    },
  });
  const { theme, themeChanger } = useTheme();
  const { logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateProfilePhoto();
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutateAsync: updateFullname } = useUpdateProfileName();
  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        alert("Dosya boyutu 2MB'dan küçük olmalı");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;

      // ÖNEMLİ: Path kullanıcı ID'si ile başlamalı
      const filePath = `${session?.user.id}/${fileName}`;

      // Upload işlemi
      uploadImage(
        { filePath, file },
        {
          onSuccess: (data) => {
            // 2. Yükleme başarılı, UI'ı güncelle
            setAvatarUrl(data.publicUrl);

            // 3. Database'i güncelle
            updateProfile(
              {
                userId: session?.user.id || "",
                newPayload: { avatar_url: data.publicUrl },
              },
              {
                onSuccess: () => {
                  toast.success("Profile picture successfully uploaded!");
                },
                onError: (error) => {
                  toast.error("Something went wrong!" + error.message);
                },
              }
            );
          },
          onError: (error) => {
            toast.error("Something went wrong!" + error.message);
          },
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateFullname(values.full_name);
  };

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
  const isLoading = isUploading || isUpdating;

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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadAvatar}
                  disabled={isLoading}
                />

                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={
                      avatarUrl ? avatarUrl : profileDetails?.avatar_url || ""
                    }
                    alt={profileDetails?.full_name}
                  />
                  <AvatarFallback className="text-lg">
                    {profileDetails?.full_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                  onClick={handleAvatarChange}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div>
                <h3 className="font-medium">{profileDetails?.full_name}</h3>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Change Your Fullname</FormLabel>
                          <FormControl>
                            <Input
                              id="name"
                              {...field}
                              autoComplete="off"
                              placeholder="Enter the new fullname"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      className="mt-4"
                      type="submit"
                      // onClick={handleSave} disabled={isLoading}
                    >
                      {/* {isLoading ? "Saving..." : "Save Changes"} */}
                      Save Your Fullname
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
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

        <Button
          variant="outline"
          disabled={loading}
          onClick={handleLogout}
          className="hidden max-md:flex items-center gap-2 w-full"
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
    </div>
  );
}
