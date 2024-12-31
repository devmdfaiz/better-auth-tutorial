import { Metadata } from "next";
import { SignInForm } from "../_components/auth-form";

export const metadata: Metadata = {
  title: "Sign in | Authenty",
};

export default function SignInPage() {
  return <SignInForm />;
}
