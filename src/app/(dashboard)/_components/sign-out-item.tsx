"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/better-auth/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

function SignOutItem() {
  const { push } = useRouter();
  const { toast } = useToast();

  return (
    <DropdownMenuItem
      className="flex items-center justify-between gap-3"
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast({
                title: "Sign out success!",
              });
              push("/sign-in");
            },

            onError: (cxt) => {
              toast({
                title: "Error!",
                description: cxt.error.message,
              });
            },
          },
        });
      }}
    >
      Sign Out <LogOut />
    </DropdownMenuItem>
  );
}

export default SignOutItem;
