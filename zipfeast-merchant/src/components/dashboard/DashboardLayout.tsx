import DashboardNav from "./DashboardNav";
import DashboardHeader from "./DashboardHeader";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardHeader />
      </div>
      {children}
    </div>
  );
};

export default DashboardLayout;
