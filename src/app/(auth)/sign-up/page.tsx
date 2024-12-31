import { Metadata } from "next";
import { SignUpForm } from "../_components/auth-form";

export const metadata: Metadata = {
  title: "Sign up | Authenty",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
