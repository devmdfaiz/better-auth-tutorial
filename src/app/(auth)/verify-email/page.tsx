"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";

function EmailVerification({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  const { toast } = useToast();

  const email = searchParams.email;
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
              try {
                await authClient.sendVerificationEmail({
                  email,
                  callbackURL: "/dashboard",
                });

                toast({
                  title: "Success!",
                });
              } catch (error) {
                toast({
                  title: "Error!",
                  description: `${error}`,
                });
              }
            }}
          >
            request again
          </span>
        </TypographyP>
      </CardContent>
    </Card>
  );
}

export default EmailVerification;
