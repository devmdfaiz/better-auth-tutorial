import { getServerSession } from "@/lib/auth/auth-utility";
import { redirect } from "next/navigation";
import UserInfoCard from "../_components/user-info-card";
import SessionInfoCard from "../_components/session-info-card";
import UserActionCard from "../_components/user-action";
import Header from "../_components/header";
import { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Dashboard | Authenty",
};

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/sign-n");
  }

  const { provider } = (
    await auth.api.listUserAccounts({
      headers: headers(),
    })
  )[0];

  return (
    <>
      <Header />
      <UserInfoCard session={session} />
      <SessionInfoCard session={session} />
      <UserActionCard session={session} provider={provider} />
    </>
  );
}
