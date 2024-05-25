import { authUserType } from "@/types/types";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import ProfileUpdate from "./form/ProfileUpdate";
import ProfileImageUploadCard from "./form/ProfileUploadImage";

export default function UserDashboard() {
  const authUser: authUserType | null = useAuthUser();
  return (
    <>
      <div className="flex-1 p-2 px-4 w-full">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi,
            <span className="font-bold text-orange-500 m-4">
              {authUser?.name}
            </span>
            👋
          </h2>
        </div>
        <ProfileImageUploadCard />
        <ProfileUpdate />
      </div>
    </>
  );
}
