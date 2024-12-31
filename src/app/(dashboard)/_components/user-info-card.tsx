import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { Session } from "@/lib/auth/type";
import { format } from "date-fns";

export default function UserInfoCard({ session }: { session: Session }) {
  const { user } = session;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">User Info</CardTitle>
        <CardDescription>This is the whole user info!</CardDescription>
      </CardHeader>
      <CardContent>
        <TypographyP>Id: {user.id}</TypographyP>
        <TypographyP>Name: {user.name}</TypographyP>
        <TypographyP>Email: {user.email}</TypographyP>
        <TypographyP>
          2FA: {user.twoFactorEnabled ? "Enabled" : "Disabled"}
        </TypographyP>
        <TypographyP>
          Joined at: {format(user.createdAt, "dd-MMM-yyyy")}
        </TypographyP>
      </CardContent>
    </Card>
  );
}
