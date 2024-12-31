"use client";

import { TypographyP } from "@/components/ui/typography";
import { authClient } from "@/lib/auth/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Status {
  isLoading: boolean;
  error: any;
}

export default function Enable2FA({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const route = useRouter();
  const [status, setStatus] = useState<Status>({
    isLoading: false,
    error: null,
  });

  const code = searchParams.code;

  console.log("code: ", code);

  useEffect(() => {
    async function verify() {
      setStatus({ isLoading: true, error: null });
      try {
        const { data, error } = await authClient.twoFactor.verifyTotp({
          code,
        });

        if (error) {
          throw new Error(error.message);
        }

        return route.push("/dashboard");
      } catch (error) {
        setStatus({ isLoading: false, error });
      }
    }

    verify();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {status.isLoading && <Loader2 className="animate-spin" />}

      {status.error && <TypographyP>{`${status.error}`}</TypographyP>}
    </div>
  );
}
