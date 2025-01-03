"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/better-auth/auth-client";

function EmailVerificationComp({ email }: { email: string }) {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
      </CardHeader>
      <CardContent>
        <TypographyP>
          Hey, we send email verification email to your email go and verify
          email. If you verified email then refresh this page. If email not
          received then{" "}
          <span
            className="link cursor-pointer"
            onClick={async () => {
              await authClient.sendVerificationEmail(
                {
                  email,
                  callbackURL: "/dashboard",
                },
                {
                  onSuccess: () => {
                    toast({
                      title: "Success!",
                    });
                  },
                  onError: (ctx) => {
                    toast({
                      title: "Error!",
                      description: ctx.error.message,
                    });
                  },
                }
              );
            }}
          >
            request again
          </span>
        </TypographyP>
      </CardContent>
    </Card>
  );
}

export default EmailVerificationComp;
