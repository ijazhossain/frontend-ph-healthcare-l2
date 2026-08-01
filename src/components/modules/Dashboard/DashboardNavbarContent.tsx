"use client"
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import { Input } from "@/components/ui/input";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

interface DashboardNavbarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}
const DashboardNavbarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardNavbarProps) => {
    const[isOpen,setIsOpen]=useState(false)
  return (
    
      <>
        {/* Mobile menu toggle button */}
<Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetTrigger
  className="md:hidden"
  render={
    <Button>
      <Menu />
    </Button>
  }
/>
<SheetContent side="left" className="w-64 p-0">
  <DashboardMobileSidebar userInfo={userInfo} dashboardHome={dashboardHome} navItems={navItems}/>
</SheetContent>
</Sheet>
        {/* Search component */}
<div className="flex-1 flex items-center justify-end gap-2">
  <div className="relative w-full max-w-md hidden sm:block">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"/>
    <Input type="text" placeholder="Search..." className="pl-9"/>
  </div>
</div>
        {/* Right side actions */}

        {/* Notification */}
<NotificationDropdown/>
        {/* User dropdown */}
<UserDropdown userInfo={userInfo}/>
      </>
    
  );
};
export default DashboardNavbarContent;
