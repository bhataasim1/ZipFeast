import { Route, Routes } from "react-router-dom";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit/AuthProvider";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import { LOGIN_ENDPOINT, MERCHANT_DASHBOARD, MERCHANT_ORDERS, MERCHANT_PRODUCTS } from "./constants/endpoints";
import SignUpPage from "./pages/Signup-Page";
import Layout from "./components/RootLayout";
import SigninPage from "./pages/Signin-Page";
import { MerchantDashboard } from "./components/dashboard/MerchantDashboard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { DashboardProducts } from "./components/dashboard/products/DashboardProducts";
import { DashboardOrders } from "./components/dashboard/orders/DashboardOrders";

const store = createStore({
  authName: "merchant_token",
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
              <DashboardLayout>
                <MerchantDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path={MERCHANT_PRODUCTS}
            element={
              <DashboardLayout>
                <DashboardProducts />
              </DashboardLayout>
            }
          />
           <Route
            path={MERCHANT_ORDERS}
            element={
              <DashboardLayout>
                <DashboardOrders />
              </DashboardLayout>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
