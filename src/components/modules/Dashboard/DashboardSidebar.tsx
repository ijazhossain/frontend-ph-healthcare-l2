import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getNavItemsByRole } from "@/lib/navItems";
import { getUserInfo } from "@/services/auth.service";
import { NavSection } from "@/types/dashboard.types";
import DashboardSidebarContent from "./DashboardSidebarContent";

const DashboardSidebar = async() => {
    const userInfo = await getUserInfo()
    const navItems:NavSection[]=getNavItemsByRole(userInfo.role)
    const dashboardHome=getDefaultDashboardRoute(userInfo.role)
  return (
  <div><DashboardSidebarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome}/></div>
);
};
export default DashboardSidebar;
