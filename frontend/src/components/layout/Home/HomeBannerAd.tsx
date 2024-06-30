import { Link } from "react-router-dom";
import bookNowService from "@/assets/ZipFeast.png";

export const BannerAd = () => {
  return (
    <section className="container py-3">
      <div className="bg-muted/50 border rounded-lg h-full">
        <Link to="/services">
          <img
            src={bookNowService}
            alt="Banner Ad"
            className="w-full overflow-hidden rounded-lg"
            style={{ objectFit: "fill", height: "15rem"}}
          />
        </Link>
      </div>
    </section>
  );
};
