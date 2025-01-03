import { redirect } from "next/navigation";
import { ResetPassComp } from "../_components/auth-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackURL: string }>;
}) {
  const callbackURL = (await searchParams).callbackURL;

  // if (!callbackURL) {
  //   redirect("/sign-in");
  // }

  return <ResetPassComp />;
}
