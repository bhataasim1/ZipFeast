import { REGISTER_ENDPOINT } from "@/constants/endpoints";
import { Link } from "react-router-dom";
import SignInImage from "@/assets/undraw_access_account_re_8spm.svg";
import MerchantLoginForm from "@/components/form/Signin-form";

export default function SigninPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <MerchantLoginForm />
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to={REGISTER_ENDPOINT} className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center">
        <div className="w-3/4">
          <img src={SignInImage} alt="Sign In" />
        </div>
      </div>
    </div>
  );
}
