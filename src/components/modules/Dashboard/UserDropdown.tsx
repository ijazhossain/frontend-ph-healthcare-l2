import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserInfo } from "@/types/user.types"
import { Key, LogOut, User } from "lucide-react"
import Link from "next/link"

interface UserDropdownProps {
  userInfo: UserInfo
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
  render={
    <Button variant="outline" size="icon" className="rounded-full">
      <span className="text-sm font-semibold">
        {userInfo.name.charAt(0).toUpperCase()}
      </span>
    </Button>
  }
/>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{userInfo.name}</p>

              <p className="text-xs text-muted-foreground">{userInfo.email}</p>

              <p className="text-xs text-primary capitalize">
                {userInfo.role.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer p-0">
          <Link href="/my-profile" className="flex items-center w-full px-2 py-1.5">
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer p-0">
          <Link href="/change-password" className="flex items-center w-full px-2 py-1.5">
            <Key className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {}}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown