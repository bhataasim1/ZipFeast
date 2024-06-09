import { Route, Routes } from "react-router-dom";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit/AuthProvider";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import { LOGIN_ENDPOINT, MERCHANT_DASHBOARD } from "./constants/endpoints";
import SignUpPage from "./pages/Signup-Page";
import Layout from "./components/RootLayout";
import SigninPage from "./pages/Signin-Page";

const store = createStore({
  authName: "token",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const AppRoutes = () => {
  return (
    <AuthProvider store={store}>
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Layout>
                <SigninPage />
              </Layout>
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Layout>
                <SignUpPage />
              </Layout>
            </>
          }
        />

        <Route element={<AuthOutlet fallbackPath={LOGIN_ENDPOINT} />}>
          <Route
            path={MERCHANT_DASHBOARD}
            element={
              <Layout>
                <h1>Dashboard</h1>
              </Layout>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
