import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  MONGODB_URL,
  SENDER_EMAIL,
} from "../constants/env";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { resend } from "../resend";
import { twoFactor } from "better-auth/plugins";
import { Fascinate } from "next/font/google";

const client = new MongoClient(MONGODB_URL);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });

      if (error) {
        console.log("Email error: ", error);
      }
    },
  },

  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const { error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });

      if (error) {
        console.log("Email error: ", error);
      }
    },
  },

  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url, token }, request) => {
        const { data, error } = await resend.emails.send({
          from: SENDER_EMAIL,
          to: user.email,
          subject: "Confirm your account deletion",
          text: `Click the link to confirm deletion: ${url}`,
        });

        if (error) {
          console.log("Email error: ", error);
        }
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request
      ) => {
        const { data, error } = await resend.emails.send({
          from: SENDER_EMAIL,
          to: newEmail,
          subject: "Verify your email change",
          text: `Click the link to verify: ${url}`,
        });

        if (error) {
          console.log("Email error: ", error);
        }
      },
    },
  },
  appName: "Authenty",
  plugins: [
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          const { data, error } = await resend.emails.send({
            from: SENDER_EMAIL,
            to: user.email,
            subject: "2 Factor OTP",
            text: `Your 2 Factor OTP: ${otp}`,
          });

          if (error) {
            console.log("Email error: ", error);
          }
        },
      },
    }),
    nextCookies(),
  ],
});
