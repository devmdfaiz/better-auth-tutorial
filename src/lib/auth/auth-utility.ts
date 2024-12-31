import { headers } from "next/headers";
import { auth } from "./auth";
import { signIn, twoFactor } from "./auth-client";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  return session;
}

export async function send2FaOtp() {
  const { data, error } = await twoFactor.sendOtp();
  if (data) {
    // redirect or show the user to enter the code
  }

  throw new Error(error?.message);
}

export async function verifyOtp(code: string) {
  await twoFactor.verifyOtp(
    { code },
    {
      onSuccess() {
        //redirect the user on success
      },
      onError(ctx) {
        throw new Error(ctx.error.message);
      },
    }
  );
}

export async function enable2Fa(password: string) {
  const { data, error } = await twoFactor.enable({
    password,
  });

  if (data) {
    // write your logic
  }

  throw new Error(error?.message);
}
