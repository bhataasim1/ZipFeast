// import { USER_DASHBOARD } from "@/constant";
import UserSignUpForm from "../layout/form/user/UserSignUpForm"; 
import { Link } from "react-router-dom";
import SignUpImage from "@/assets/undraw_undraw_undraw_undraw_sign_up_ln1s_-1-_s4bc_-1-_ee41_-1-_kf4d.svg";

export default function SignUpPage() {

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex justify-center items-center">
        <div className="w-3/4">
          <img src={SignUpImage} alt="Sign Up" />
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill the details to create your account
            </p>
          </div>

          <UserSignUpForm />

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}