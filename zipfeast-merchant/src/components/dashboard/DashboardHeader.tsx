import { Search } from "lucide-react";
// import DashboardBreadCrumbs from "./DashboardBreadCrumbs";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import { Input } from "../ui/input";
import { ModeToggle } from "../themes/ModeToggle";
import { UserNav } from "../User-Nav";

const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <DashboardMobileSidebar />
      {/* <DashboardBreadCrumbs /> */}
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <ModeToggle />
      <UserNav />
    </header>
  );
};

export default DashboardHeader;
