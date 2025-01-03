import { TypographyH3 } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "@/lib/action";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import SignOutItem from "./sign-out-item";

export default async function Header() {
  const session = await getServerSession();

  const profile = session?.user?.image;
  const name = session?.user?.name;

  return (
    <Card className="p-0">
      <CardContent className="py-2 px-4">
        <header className="w-full h-fit flex items-center justify-between gap-4">
          <div>
            <TypographyH3>Authenty.</TypographyH3>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={profile ? profile : "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>
                    {name ? name.slice(0, 1) : "P"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account Action</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <SignOutItem />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </CardContent>
    </Card>
  );
}
