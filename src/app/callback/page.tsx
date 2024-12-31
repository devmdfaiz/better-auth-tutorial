import { getServerSession } from "@/lib/auth/auth-utility";
import { redirect } from "next/navigation";

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: { callback: string };
}) {
  const redirectPath = searchParams?.callback;
  const session = await getServerSession();

  if (session) {
    return redirect("/dashboard");
  }

  return redirect(redirectPath);
}
