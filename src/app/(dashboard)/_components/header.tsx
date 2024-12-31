import { Card, CardContent } from "@/components/ui/card";
import { TypographyH3 } from "@/components/ui/typography";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "@/lib/auth/auth-utility";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutItem } from "./user-action";

export default async function Header() {
  const session = await getServerSession();
  const profile = session?.user?.image;
  const name = session?.user?.name;
  return (
    <Card>
      <CardContent className="py-2">
        <div className="flex items-center justify-between">
          <TypographyH3>Authenty.</TypographyH3>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={!profile ? "https://github.com/shadcn.png" : profile}
                  alt="profile"
                />
                <AvatarFallback>{name ? name.slice(0, 1) : "P"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Account Action</DropdownMenuLabel>
              <SignOutItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
