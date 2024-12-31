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

export default function SessionInfoCard({ session }: { session: Session }) {
  const { session: userSession } = session;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Session Info</CardTitle>
        <CardDescription>This is the user session info!</CardDescription>
      </CardHeader>
      <CardContent>
        <TypographyP>Id: {userSession.id}</TypographyP>
        <TypographyP>User Ip: {userSession.ipAddress}</TypographyP>
        <TypographyP>Device: {userSession.userAgent}</TypographyP>
        <TypographyP>Token: {userSession.token}</TypographyP>
        <TypographyP>
          Login at: {format(userSession.updatedAt, "dd-MMM-yyyy")}
        </TypographyP>
        <TypographyP>
          Session expire at: {format(userSession.expiresAt, "dd-MMM-yyyy")}
        </TypographyP>
      </CardContent>
    </Card>
  );
}
