"use server";

import { auth } from "./auth/auth";

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "/dashboard",
        asResponse: true,
      },
    });

    return JSON.stringify({
      message: "Success!",
      status: 200,
    });
  } catch (error) {
    console.log("Error in sign in: ", error);

    return JSON.stringify({
      message: `${error}`,
      status: 500,
    });
  }
};

export const signUp = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        asResponse: true,
      },
    });

    return JSON.stringify({
      message: "Success!",
      status: 201,
    });
  } catch (error) {
    console.log("Error in sign up: ", error);

    return JSON.stringify({
      message: `${error}`,
      status: 500,
    });
  }
};
