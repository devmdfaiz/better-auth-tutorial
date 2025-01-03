"use client";

import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { TypographyP } from "@/components/ui/typography";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { authClient } from "@/lib/better-auth/auth-client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { GoogleButton } from "./oauth-button";

const signUpFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must have at least 2 characters")
    .max(20, "Name must have at most 20 characters"),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .max(16, "Password must have at most 16 characters"),
});

type SignUpForm = z.infer<typeof signUpFormSchema>;

export function SignUpFormComp() {
  const { toast } = useToast();
  const { push } = useRouter();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: SignUpForm) {
    const { email, name, password } = values;
    await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: async (cxt) => {
          toast({
            title: "Success!",
          });
          push(`/email-verification?email=${email}`);
        },
        onError: async (cxt) => {
          toast({
            title: "Error!",
            description: cxt.error.message,
          });
        },
      }
    );
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="card-title">Sign Up</CardTitle>
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
                    <Input placeholder="rt4yeb5$VW$^Bun" {...field} />
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
    .min(8, "Password must have at least 8 characters")
    .max(16, "Password must have at most 16 characters"),
});

type SignInForm = z.infer<typeof signInFormSchema>;

export function SignInFormComp() {
  const [isForgetClick, setIsForgetClick] = useState(false);
  const { toast } = useToast();
  const { push } = useRouter();

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
    const { email, password } = values;
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: async (cxt) => {
          toast({
            title: "Success!",
          });

          const { data, error } = await authClient.twoFactor.sendOtp();

          push("/2fa-verification");
        },
        onError: async (cxt) => {
          toast({
            title: "Error!",
            description: cxt.error.message,
          });
        },
      }
    );
  }

  return (
    <>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="card-title">Sign In</CardTitle>
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
                      <Input placeholder="rt4yeb5$VW$^Bun" {...field} />
                    </FormControl>
                    <FormMessage />
                    <div className="flex items-center justify-end w-full h-fit">
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => {
                          setIsForgetClick(true);
                        }}
                      >
                        Forget Password?
                      </Button>
                    </div>
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

      <ForgetPasswordAlert
        isForgetClick={isForgetClick}
        setIsForgetClick={setIsForgetClick}
      />
    </>
  );
}

const forgetPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgetForm = z.infer<typeof forgetPasswordSchema>;

export function ForgetPasswordAlert({
  isForgetClick,
  setIsForgetClick,
}: {
  isForgetClick: boolean;
  setIsForgetClick: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();

  const form = useForm<ForgetForm>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: ForgetForm) {
    const { email } = values;
    await authClient.forgetPassword(
      {
        email,
        redirectTo: "/reset-password",
      },
      {
        onSuccess: (ctx) => {
          toast({
            title: "Success!",
          });

          setIsForgetClick(false);
        },
        onError: (ctx) => {
          toast({
            title: "Error!",
            description: ctx.error.message,
          });
        },
      }
    );
  }

  return (
    <Dialog open={isForgetClick} onOpenChange={setIsForgetClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Authenty, want your email!</DialogTitle>
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
              <div className="w-full">
                {!isSubmitting ? (
                  <Button className="w-full" type="submit">
                    Send
                  </Button>
                ) : (
                  <Loader2 className="animate-spin mx-auto" />
                )}
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

const resetPassFormSchema = z.object({
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .max(16, "Password must have at most 16 characters"),
});

type ResetPassForm = z.infer<typeof resetPassFormSchema>;

export function ResetPassComp() {
  const { toast } = useToast();
  const { push } = useRouter();

  const form = useForm<ResetPassForm>({
    resolver: zodResolver(resetPassFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: ResetPassForm) {
    const { password } = values;
    await authClient.resetPassword(
      {
        newPassword: password,
      },
      {
        onSuccess: async (cxt) => {
          toast({
            title: "Success!",
          });

          push("/sign-in");
        },
        onError: async (cxt) => {
          toast({
            title: "Error!",
            description: cxt.error.message,
          });
        },
      }
    );
  }

  return (
    <>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="card-title">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="rt4yeb5$VW$^Bun" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full">
                {!isSubmitting ? (
                  <Button className="w-full" type="submit">
                    Reset
                  </Button>
                ) : (
                  <Loader2 className="animate-spin mx-auto" />
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
