import { Link } from "react-router-dom";

export const BannerAd = () => {
  return (
    <section className="container py-3">
      <div className="bg-muted/50 border rounded-lg">
        <Link to="/products">
          <img
            src="https://cdn.zeptonow.com/web-static-assets-prod/artifacts/10.9.9/tr:w-1280,ar-1438-235,pr-true,f-auto,q-80//images/paan-corner/paan-corner-banner-desktop.png"
            alt="Banner Ad"
            className="w-full relative overflow-hidden object-cover max-w-full"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Link>
      </div>
    </section>
  );
};
