"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/better-auth/auth-client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

function TwoFaForm() {
  const { toast } = useToast();
  const { push } = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    await authClient.twoFactor.verifyOtp(
      { code: values.otp },
      {
        onSuccess() {
          toast({
            title: "Verified!",
          });

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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>2 Factor Authentication</CardTitle>
        <CardDescription>Enter your OTP to verify yourself</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex items-center justify-start flex-col w-full"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="mx-auto">
                  <FormLabel>One-Time Password</FormLabel>
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
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage />
                  <div className="flex items-center justify-end w-full h-fit">
                    <Button
                      className="w-full"
                      variant="link"
                      type="button"
                      onClick={async () => {
                        const { data, error } =
                          await authClient.twoFactor.sendOtp();

                        if (error) {
                          toast({
                            title: "Error!",
                            description: error.message,
                          });

                          return;
                        }

                        toast({
                          title: "Check your email",
                        });
                      }}
                    >
                      Request OTP
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default TwoFaForm;
