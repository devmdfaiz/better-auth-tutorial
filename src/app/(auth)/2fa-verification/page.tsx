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
import { useRouter } from "next/navigation";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { authClient } from "@/lib/auth/auth-client";

const otpFormSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be at least 6 digit")
    .max(16, "OTP must be at most 6 digit"),
});

type OtpForm = z.infer<typeof otpFormSchema>;

export default function TwoFAVerification({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  const { toast } = useToast();
  const { push } = useRouter();

  const form = useForm<OtpForm>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: OtpForm) {
    try {
      await authClient.twoFactor.verifyOtp(
        { code: values.otp },
        {
          onSuccess() {
            push("/dashboard");
          },
          onError(ctx) {
            toast({
              title: "Error!",
              description: ctx.error.message,
            });
          },
        }
      );
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
          <CardTitle className="text-xl">2 Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription
                      className="link cursor-pointer text-start w-full"
                      onClick={async () => {
                        const { data, error } =
                          await authClient.twoFactor.sendOtp();

                        if (error) {
                          toast({
                            title: "Error!",
                            description: error.message,
                          });
                        }

                        toast({
                          title: "Success!",
                        });
                      }}
                    >
                      Resend OTP
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isSubmitting ? (
                <Button type="submit">Verify</Button>
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
