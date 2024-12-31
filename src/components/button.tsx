"use client";

import { signIn, signUp } from "@/lib/action";
import { Button } from "./ui/button";
import { signOut, useSession } from "@/lib/auth/auth-client";

export function SignInButton() {
  const session = useSession();
  return (
    <div>
      <Button onClick={() => signIn()}>SignIn</Button>
      <Button onClick={() => signUp()}>SignUp</Button>
      <Button onClick={() => signOut()}>SignOut</Button>
      {JSON.stringify(session)}
    </div>
  );
}
