"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

const passwordFormSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at least 16 characters"),
});

type PasswordForm = z.infer<typeof passwordFormSchema>;

export default function SignInForm() {
  const { toast } = useToast();
  const route = useRouter();
  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: PasswordForm) {
    try {
      await authClient.resetPassword({ newPassword: values.password });

      toast({
        title: "Success!",
      });

      route.push("/sign-in");
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
          <CardTitle className="text-xl">Reset Password</CardTitle>
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
                      <Input placeholder="#$TYWv35w5344gf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isSubmitting ? (
                <Button type="submit">Reset Now</Button>
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
