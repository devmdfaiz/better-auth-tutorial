"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Session } from "@/lib/auth/type";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Trash } from "lucide-react";
import {
  authClient,
  changeEmail,
  changePassword,
  deleteUser,
  signOut,
  updateUser,
} from "@/lib/auth/auth-client";
import { useToast } from "@/hooks/use-toast";
import { TypographyH4, TypographyP } from "@/components/ui/typography";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import { generateQR } from "@/lib/utils";

export default function UserActionCard({
  session,
  provider,
}: {
  session: Session;
  provider: string;
}) {
  return (
    <Card>
      {provider === "credential" ? (
        <>
          <CardHeader>
            <CardTitle className="text-xl">User Action</CardTitle>
            <CardDescription>
              Here you can update your profile info
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <UpdateUserInfo session={session} />
            <ChangeEmail session={session} />
            <ChangePassword />
            <TwoFA session={session} />
            <DeleteUser />
          </CardContent>
        </>
      ) : (
        <CardContent className="py-3">
          <TypographyP>User action is allowed in OAuth</TypographyP>
        </CardContent>
      )}
    </Card>
  );
}

const twoFaFormSchema = z.object({
  isEnabled: z.boolean(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at least 16 characters"),
});

type TwoFaFormType = z.infer<typeof twoFaFormSchema>;

export function TwoFA({ session }: { session: Session }) {
  const { toast } = useToast();

  const form = useForm<TwoFaFormType>({
    resolver: zodResolver(twoFaFormSchema),
    defaultValues: {
      isEnabled: session?.user?.twoFactorEnabled || false,
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: TwoFaFormType) {
    try {
      if (values.isEnabled) {
        const { data, error } = await authClient.twoFactor.enable({
          password: values.password,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast({
          title: "Success!",
          description: `${data}`,
        });
      }

      if (!values.isEnabled) {
        const { data, error } = await authClient.twoFactor.disable({
          password: values.password,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast({
          title: "Success!",
          description: `${data}`,
        });
      }
    } catch (error) {
      console.log("Error in enabling 2fs: ", error);

      toast({
        title: "Error!",
        description: `${error}`,
      });
    }
  }
  return (
    <>
      <div className="space-y-2">
        <TypographyH4 className="text-lg">
          2-Factor Authentication (2FA)
        </TypographyH4>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable 2FA</FormLabel>
                    <FormDescription>
                      Enhance your account security by enabling Two-Factor
                      Authentication.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly={false}
                    />
                  </FormControl>
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
                    <Input placeholder="#%$BY^6565vby" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isSubmitting ? (
              <Button>Run Action</Button>
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </form>
        </Form>
      </div>
    </>
  );
}

export function DeleteUser() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <TypographyH4 className="text-lg">Danger Zone</TypographyH4>
      <Button
        variant="destructive"
        disabled={isDeleting}
        onClick={async () => {
          setIsDeleting(true);
          try {
            await deleteUser({
              callbackURL: "/goodbyy", // you can provide a callback URL to redirect after deletion
            });
            setIsAlertOpen(true);
            toast({
              title: "Success!",
            });
          } catch (error) {
            toast({
              title: "Error!",
              description: `${error}`,
            });
          } finally {
            setIsDeleting(false);
          }
        }}
      >
        {!isDeleting ? (
          <>
            <Trash /> Delete Account
          </>
        ) : (
          <>
            <Loader2 className="animate-spin" /> deleting...
          </>
        )}
      </Button>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hello, Authenty User</AlertDialogTitle>
            <AlertDialogDescription>
              We send a confirmation email. Please go and confirm account
              deleting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const passwordFormSchema = z.object({
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(16, "New password must be at least 16 characters"),
  currentPassword: z
    .string()
    .min(8, "Current password must be at least 8 characters")
    .max(16, "Current password must be at least 16 characters"),
  revokeOtherSessions: z.boolean().default(true),
});

type PasswordChangeFormType = z.infer<typeof passwordFormSchema>;

export function ChangePassword() {
  const { toast } = useToast();
  const form = useForm<PasswordChangeFormType>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: PasswordChangeFormType) {
    console.log(values);

    try {
      await changePassword(values);
      toast({
        title: "Success!",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: `${error}`,
      });
    }
  }

  return (
    <div>
      <TypographyH4 className="text-lg">Change Password</TypographyH4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input placeholder="%b7$%B$ney345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input placeholder="#$%^b6547b65" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isSubmitting ? (
            <Button type="submit">Change</Button>
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </form>
      </Form>
    </div>
  );
}

const emailFormSchema = z.object({
  email: z.string().email(),
});

type EmailChangeFormType = z.infer<typeof emailFormSchema>;

export function ChangeEmail({ session }: { session: Session }) {
  const { user } = session;
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<EmailChangeFormType>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: user.email,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: EmailChangeFormType) {
    try {
      await changeEmail({
        newEmail: values.email,
        callbackURL: "/dashboard",
      });
      setIsAlertOpen(true);
      toast({
        title: "Success!",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: `${error}`,
      });
    }
  }

  return (
    <div>
      <TypographyH4 className="text-lg">Change Email</TypographyH4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="faizan@gmail.com" {...field} />
                </FormControl>
                <FormDescription>Remove this, add new new one.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isSubmitting ? (
            <Button type="submit">Change</Button>
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </form>
      </Form>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hello, Authenty User</AlertDialogTitle>
            <AlertDialogDescription>
              We send a email to your new email. Please go verify email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const userFormSchema = z.object({
  image: z.string().url(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters"),
});

type UserFormType = z.infer<typeof userFormSchema>;

export function UpdateUserInfo({ session }: { session: Session }) {
  const { user } = session;
  const { toast } = useToast();
  const form = useForm<UserFormType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      image: user?.image || "",
      name: user.name,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: UserFormType) {
    try {
      await updateUser(values);
      toast({
        title: "Success!",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: `${error}`,
      });
    }
  }

  return (
    <div>
      <TypographyH4 className="text-lg">Update Info</TypographyH4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Md Faizan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile</FormLabel>
                <FormControl>
                  <Input placeholder="https://...." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isSubmitting ? (
            <Button type="submit">Change</Button>
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </form>
      </Form>
    </div>
  );
}

export function SignOutItem() {
  const { toast } = useToast();
  const route = useRouter();

  return (
    <div
      onClick={async () => {
        try {
          await signOut();

          toast({
            title: "Sign out success!",
          });

          route.push("/sign-in");
        } catch (error) {
          toast({
            title: "Error!",
            description: `${error}`,
          });
        }
      }}
    >
      <DropdownMenuItem className="flex items-center justify-between gap-2">
        Log out <LogOut />
      </DropdownMenuItem>
    </div>
  );
}
