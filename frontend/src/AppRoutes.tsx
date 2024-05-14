import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/RootLayout";
import Homepage from "./components/pages/Homepage";
import { SIGN_IN } from "./constant/endpoins";

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
            <div>Sign In Page</div>
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
