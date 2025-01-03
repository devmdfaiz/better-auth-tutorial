import { redirect } from "next/navigation";
import EmailVerificationComp from "./_components/email-verification-comp";

async function EmailVerification({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const email = (await searchParams)?.email || "";

  if(!email){
    redirect("/sign-in")
  }

  return <EmailVerificationComp email={email} />;
}

export default EmailVerification;
