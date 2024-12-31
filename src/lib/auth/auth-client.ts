import { createAuthClient } from "better-auth/react";
import { BASE_URL } from "../constants/env";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [
    twoFactorClient({
      /**
       * You can handle this in the onSuccess callback or by providing a onTwoFactorRedirect callback in the plugin config.
       @docs https://www.better-auth.com/docs/plugins/2fa#sign-in-with-2fa
       */
      // I don't why this is not working
      // onTwoFactorRedirect() {
      //   window.location.href = `/two-factor-verification`;
      // },
    }),
  ],
});

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  sendVerificationEmail,
  forgetPassword,
  twoFactor,
  updateUser,
  changeEmail,
  changePassword,
  deleteUser,
} = authClient;
