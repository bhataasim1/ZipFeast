import { LucideGithub, LucideInstagram } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <Link to="/" className="font-bold text-xl flex">
            Zip<span className="text-orange-600 italic ml-1">Feast</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Beyond Shopping - its a Feast.
          </p>
          <span className="flex space-x-3">
            <Link
              to="https://instagram.com/bhataasim1"
              target="_blank"
              className="text-primary"
            >
              <LucideInstagram className="w-8 h-8 mt-4" />
            </Link>
            <Link
              to="https://instagram.com/bhataasim1"
              target="_blank"
              className="text-primary"
            >
              <LucideGithub className="w-8 h-8 mt-4" />
            </Link>
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* <h3 className="font-bold text-lg">Categories</h3> */}
          <div>
            <Link to="/products" className="opacity-60 hover:opacity-100">
              Fruits and Vegetables
            </Link>
          </div>

          <div>
            <Link to="/products" className="opacity-60 hover:opacity-100">
              Atta and Flour
            </Link>
          </div>

          <div>
            <Link to="/products" className="opacity-60 hover:opacity-100">
              Tea and Coffee
            </Link>
          </div>

          <div>
            <Link to="/products" className="opacity-60 hover:opacity-100">
              Bread and Bakery
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* <h3 className="font-bold text-lg">Pages</h3> */}
          <div>
            <Link to="/services" className="opacity-80 hover:opacity-100 text-orange-600">
              Explore Home Services
            </Link>
          </div>

          <div>
            <Link to="/services/register" className="opacity-80 hover:opacity-100 text-orange-600">
              Register as Service Provider
            </Link>
          </div>

          <div>
            <Link to="/services/login" className="opacity-80 hover:opacity-100 text-orange-600">
              Sign in as Service Provider
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* <h3 className="font-bold text-lg">Contact</h3> */}
          <div>
            <Link to="/about" className="opacity-60 hover:opacity-100">
              About Us
            </Link>
          </div>

          <div>
            <Link to="/contact" className="opacity-60 hover:opacity-100">
              Contact Us
            </Link>
          </div>

          <div>
            <Link to="/contact" className="opacity-60 hover:opacity-100">
              Careers
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* <h3 className="font-bold text-lg">Community</h3> */}
          <div>
            <h3 className="text-sm">Download App</h3>
          </div>

          <div>
            <Link to="/">
              <Button variant="outline" className="w-full p-5">
                Google Play
              </Button>
            </Link>
          </div>

          <div>
            <Link to="/">
              <Button variant="outline" className="w-full p-5">
                IOS App Store
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
};
