import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/RootLayout";
import Homepage from "./components/pages/Homepage";
import { SIGN_IN, SIGN_UP } from "./constant/endpoins";
import SignupPage from "./components/pages/Signup-Page";
import SigninPage from "./components/pages/Signin-Page";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <Layout>
            <Homepage />
          </Layout>
        }
      />

      <Route
        path={SIGN_IN}
        element={
          <Layout>
            <SigninPage />
          </Layout>
        }
      />

      <Route
        path={SIGN_UP}
        element={
          <Layout>
            <SignupPage />
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;