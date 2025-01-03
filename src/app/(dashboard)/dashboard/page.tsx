import { getServerSession } from "@/lib/action";
import Header from "../_components/header";
import UserInfoCard from "../_components/user-info-card";
import { redirect } from "next/navigation";
import UserSessionInfoCard from "../_components/user-session-info-card";
import UserActions from "../_components/user-actions";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    return redirect("/sign-in");
  }

  const { provider } = (
    await auth.api.listUserAccounts({
      headers: await headers(),
    })
  )[0];

  return (
    <>
      <Header />
      <UserInfoCard session={session} />
      <UserSessionInfoCard session={session} />
      <UserActions session={session} provider={provider} />
    </>
  );
}
