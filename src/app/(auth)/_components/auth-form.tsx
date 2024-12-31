"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signIn, signUp } from "@/lib/action";
import { TypographyP } from "@/components/ui/typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { GoogleButton } from "./oauth-button";

interface AuthResponse {
  message: string;
  status: number;
}

const signUpFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters"),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at least 16 characters"),
});

type SignUpForm = z.infer<typeof signUpFormSchema>;

export function SignUpForm() {
  const { toast } = useToast();
  const route = useRouter();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: SignUpForm) {
    try {
      const res = JSON.parse(await signUp(values)) as AuthResponse;

      if (res.status === 201) {
        toast({
          title: res.message,
        });

        route.push(`/verify-email?email=${values.email}`);

        return;
      }

      throw new Error(res.message);
    } catch (error) {
      toast({
        title: "Error!",
        description: `${error}`,
      });
    }
  }
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mdfaizan@gmail.com" {...field} />
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
                    <Input placeholder="#$TYWv35w5344gf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TypographyP>
              Already have an account?{" "}
              <Link href="/sign-in" className="link">
                Sign In
              </Link>
            </TypographyP>
            <div className="w-full">
              {!isSubmitting ? (
                <Button className="w-full" type="submit">
                  Sign Up
                </Button>
              ) : (
                <Loader2 className="animate-spin mx-auto" />
              )}
            </div>
          </form>
        </Form>

        <GoogleButton />
      </CardContent>
    </Card>
  );
}

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at least 16 characters"),
});

type SignInForm = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const route = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: SignInForm) {
    try {
      const res = JSON.parse(await signIn(values)) as AuthResponse;

      if (res.status === 200) {
        toast({
          title: res.message,
        });

        const { data, error } = await authClient.twoFactor.sendOtp();

        if (error) {
          toast({
            title: "Error!",
            description: error.message,
          });
        }

        route.push(`/2fa-verification?email=${values.email}`);

        return;
      }

      throw new Error(res.message);
    } catch (error) {
      toast({
        title: "Error!",
        description: `${error}`,
      });
    }
  }
  return (
    <>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="mdfaizan@gmail.com" {...field} />
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
                      <Input placeholder="#$TYWv35w5344gf" {...field} />
                    </FormControl>
                    <FormDescription
                      className="link cursor-pointer text-end w-full"
                      onClick={() => {
                        setIsDialogOpen(true);
                      }}
                    >
                      Forget Password?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TypographyP>
                Don't have an account?{" "}
                <Link href="/sign-up" className="link">
                  Sign Up
                </Link>
              </TypographyP>
              <div className="w-full">
                {!isSubmitting ? (
                  <Button className="w-full" type="submit">
                    Sign In
                  </Button>
                ) : (
                  <Loader2 className="animate-spin mx-auto" />
                )}
              </div>
            </form>
          </Form>

          <GoogleButton />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Authenty want your email info!</DialogTitle>
          </DialogHeader>
          <div>
            <ForgetPasswordForm setIsDialogOpen={setIsDialogOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const forgetPasswordFormSchema = z.object({
  email: z.string().email(),
});

type ForgetPasswordForm = z.infer<typeof forgetPasswordFormSchema>;

export function ForgetPasswordForm({
  setIsDialogOpen,
}: {
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();

  const form = useForm<ForgetPasswordForm>({
    resolver: zodResolver(forgetPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: ForgetPasswordForm) {
    try {
      await authClient.forgetPassword({
        email: values.email,
        redirectTo: "/reset-password",
      });

      toast({
        title: "Success!",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: `${error}`,
      });
    } finally {
      setIsDialogOpen(false);
    }
  }

  return (
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
              <FormMessage />
            </FormItem>
          )}
        />
        {!isSubmitting ? (
          <Button type="submit">Send Reset Email</Button>
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </form>
    </Form>
  );
}
