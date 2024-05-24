import DashboardSidebarNav from "../layout/profile/DashboardSidebar";

const ProfilePage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <DashboardSidebarNav />
      {children}
    </div>
  );
};

export default ProfilePage;
