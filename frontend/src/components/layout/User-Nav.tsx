import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { BASE_ENDPOINT, USER_PROFILE } from "@/constant/endpoins";
import useSignOut from "react-auth-kit/hooks/useSignOut";
// import { CrudServices } from "@/API/CrudServices";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { authUserType } from "@/types/types";

export function UserNav() {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const authUser: authUserType | null = useAuthUser();
  // const crudServices = new CrudServices();

  const handleRoute = (url: string) => {
    navigate(url);
  };

  const handleLogOut = async () => {
    // await crudServices.logoutUser();
    signOut();
    navigate(BASE_ENDPOINT);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={authUser?.avatar || "my Image"}
              alt={authUser?.name}
            />
            <AvatarFallback>{authUser?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{authUser?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {authUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleRoute(USER_PROFILE)}>
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogOut()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
