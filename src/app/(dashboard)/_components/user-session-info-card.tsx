import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { Session } from "@/lib/better-auth/auth-types";
import { format } from "date-fns";

export default async function UserSessionInfoCard({ session }: { session: Session }) {
  const { session: userSession } = session;

  const { createdAt, expiresAt, id, ipAddress, userAgent } = userSession;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="card-title">Session Info</CardTitle>
      </CardHeader>
      <CardContent>
        <TypographyP>Session id: {id}</TypographyP>
        <TypographyP>IP Address: {ipAddress}</TypographyP>
        <TypographyP>Device: {userAgent}</TypographyP>
        <TypographyP>
          Logged in at: {format(createdAt, "dd-MMM-yyyy")}
        </TypographyP>
        <TypographyP>
          Session end at: {format(expiresAt, "dd-MMM-yyyy")}
        </TypographyP>
      </CardContent>
    </Card>
  );
}

