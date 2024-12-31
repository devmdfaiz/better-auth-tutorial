import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  MONGODB_URI,
  SENDER_EMAIL,
} from "../constants/env";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { resend } from "../email/resend";

const client = new MongoClient(MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  /**
   * Set your database option.
   * I am using mongodb.
   * You can any database.
   * If you are using any ORM like, prizma or drizzle then you need migrate your database
   @docs https://www.better-auth.com/docs/concepts/database
   */
  database: mongodbAdapter(db),
  /**
   * emailAndPassword is used for enabling login via email and password
   @docs https://www.better-auth.com/docs/authentication/email-password
   */
  emailAndPassword: {
    enabled: true, // Mark this true to use email & password verification
    autoSignIn: true, // Mark this true for auto sign-in after sign-up
    requireEmailVerification: true, // Mark this true to restrict unverified users this will reduce spam (recommended => true)
    sendResetPassword: async ({ user, url, token }, request) => {
      // Send email if user requested password reset
      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: user.email,
        subject: "Password Reset",
        text: `Your Password Reset Link ${url}`,
      });

      if (error) {
        return console.error({ error });
      }
    },
  },
  /**
   * emailVerification is used for verification of email after SignUP
   @docs https://www.better-auth.com/docs/authentication/email-password
   */
  emailVerification: {
    autoSignInAfterVerification: true, // Mark this true to auto sign in after email verification (Recommended => true)
    sendOnSignUp: true, // Mark this true to auto send email verification link after sign up (Recommended => true)
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Send email if user requested password reset

      const urlToUpdate = new URL(url);

      urlToUpdate.searchParams.set("callbackURL", "/dashboard");

      const updatedUrl = urlToUpdate.toString();

      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: user.email,
        subject: "Email verification",
        text: `Your Email verification Link ${updatedUrl}`,
      });

      if (error) {
        return console.error({ error });
      }
    },
  },
  /**
   * Better Auth includes a built-in rate limiter to help manage traffic and prevent abuse. By default, in production mode, the rate limiter is set to:

@time Window: 60 seconds
@requests Max Requests: 100 requests
@docs https://www.better-auth.com/docs/concepts/rate-limit
   */
  rateLimit: {
    storage: "database", // Rate limit data is stored in memory, which may not be suitable for many use cases, particularly in serverless environments (Recommended => database)
    modelName: "rateLimit", // set you model name
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },

  appName: "Authenty", // provide your app name. It'll be used as an issuer.

  /**
   * "user" is responsible for updating user related info
   @docs https://www.better-auth.com/docs/concepts/users-accounts
   */
  user: {
    /**
     * This is responsible, if user want to change their email
     @docs https://www.better-auth.com/docs/concepts/users-accounts#change-email
     */
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request
      ) => {
        try {
          await resend.emails.send({
            from: SENDER_EMAIL,
            to: newEmail,
            subject: "Verify your email change",
            text: `Click the link to verify: ${url}`,
          });
        } catch (error) {
          console.log(
            "Error in sending change email verification email: ",
            error
          );
        }
      },
    },
    /**
     * This is responsible, if user want to delete their account
     @docs https://www.better-auth.com/docs/concepts/users-accounts#delete-user
     */
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async (
        { user, url, token },
        request // The original request object (optional)
      ) => {
        // Your email sending logic here
        // Example: sendEmail(data.user.email, "Verify Deletion", data.url);

        try {
          await resend.emails.send({
            from: SENDER_EMAIL,
            to: user.email,
            subject: "Verify your identity to delete account",
            text: `Click the link to verify: ${url}`,
          });
        } catch (error) {
          console.log(
            "Error in sending change email verification email: ",
            error
          );
        }
      },
    },
  },
  plugins: [
    /**
     * Its plugin for enabling 2FA
     @docs https://www.better-auth.com/docs/plugins/2fa
     */
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          console.log("otp: ", otp);

          const { data, error } = await resend.emails.send({
            from: SENDER_EMAIL,
            to: user.email,
            subject: "2FA",
            text: `Your 2FA OTP ${otp}`,
          });

          if (error) {
            return console.error({ error });
          }
        },
      },
    }),
    /**
     * nextCookies plugin in required in every project * and make sure this is the last plugin in the array
     @docs 
     */
    nextCookies(),
  ],
});
