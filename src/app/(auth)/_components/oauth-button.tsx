"use client";

import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/lib/auth/auth-client";
import { RiGoogleFill } from "@remixicon/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function GoogleButton() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();

  return (
    <div className="w-full space-y-3 mt-3">
      <TypographyMuted className="text-center">or</TypographyMuted>
      <Button
        disabled={isGoogleLoading}
        className="bg-[#DB4437] text-white after:flex-1 hover:bg-[#DB4437]/90 w-full"
        onClick={async () => {
          setIsGoogleLoading(true);
          try {
            const { data, error } = await signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
            });

            if (error) {
              throw new Error(error.message);
            }

            toast({
              title: "Success!",
            });
          } catch (error) {
            toast({
              title: "Error!",
              description: `${error}`,
            });
          } finally {
            setIsGoogleLoading(false);
          }
        }}
      >
        <span className="pointer-events-none me-2 flex-1">
          {!isGoogleLoading ? (
            <RiGoogleFill className="opacity-60" size={16} aria-hidden="true" />
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </span>
        Login with Google
      </Button>
    </div>
  );
}
