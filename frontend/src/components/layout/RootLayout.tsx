// import Footer from "@/components/footer";

import { Header } from "./Header";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
