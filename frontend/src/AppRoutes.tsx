import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/RootLayout";
import Homepage from "./components/pages/Homepage";
import { SIGN_IN, SIGN_UP } from "./constant/endpoins";
import SignupPage from "./components/pages/Signup-Page";
import SigninPage from "./components/pages/Signin-Page";
import { Header } from "./components/layout/Header";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import { SingleProduct } from "./components/layout/Home/product/SingleProduct";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit/AuthProvider";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import ProfilePage from "./components/pages/ProfilePage";
import UserDashboard from "./components/layout/profile/UserDashboard";
import UserOrders from "./components/layout/profile/UserOrders";
import CheckoutPage from "./components/pages/CheckoutPage";
import SearchAndStorePage from "./components/pages/SearchAndStorePage";

const store = createStore({
  authName: "token",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const AppRoutes = () => {
  return (
    <AuthProvider store={store}>
      <ShoppingCartProvider>
        <Routes>
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Homepage />
              </>
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

          <Route
            path="/product/:id"
            element={
              <Layout>
                <SingleProduct />
              </Layout>
            }
          />

          <Route
            path="/search"
            element={
              <Layout>
                <SearchAndStorePage />
              </Layout>
            }
          />

          <Route element={<AuthOutlet fallbackPath={SIGN_IN} />}>
            <Route
              path="/user/profile"
              element={
                <Layout>
                  <ProfilePage children={<UserDashboard />} />
                </Layout>
              }
            />
            <Route
              path="/user/orders"
              element={
                <Layout>
                  <ProfilePage children={<UserOrders />} />
                </Layout>
              }
            />

            <Route
              path="/checkout"
              element={
                <Layout>
                  <CheckoutPage />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </ShoppingCartProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
