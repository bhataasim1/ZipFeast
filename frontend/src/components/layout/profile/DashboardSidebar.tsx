import {
  dashboardNavItems,
  homeServiceDashboardNavItems,
} from "@/constant/navItems";
import { Nav } from "../Nav";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { authUserType } from "@/types/types";

const DashboardSidebarNav = () => {
  const authUser: authUserType | null = useAuthUser();
  return (
    <div className="hidden md:flex fixed inset-0 sm:relative sm:w-[15%] overflow-y-auto rounded-lg mt-2 border-r">
      <div className="flex flex-col h-screen">
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-2xl font-bold tracking-tight">
            {authUser?.name || "User"}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto m-2">
          {!authUser?.serviceType ? (
            <Nav items={dashboardNavItems} mobile={true} />
          ) : (
            <Nav items={homeServiceDashboardNavItems} mobile={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebarNav;
