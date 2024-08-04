import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currencyFormatter";
import { LucideCalendarCheck } from "lucide-react";
// import { HomeServiceData } from "./homeServiceData";
import { ServiceProviderType } from "@/types/types";
import { Link } from "react-router-dom";

type HomeServiceProps = {
  service: ServiceProviderType;
};
const HomeService = ({ service }: HomeServiceProps) => {
  return (
    <Card className="w-full hover:border-2 hover:border-orange-600">
      <CardContent>
        <Link to={`/service/${service.id}`}>
          <div className="w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 p-2">
              <div className="w-full h-40">
                <img
                  src={service?.avatar || "https://via.placeholder.com/150"}
                  alt={service?.name || "Service"}
                  className="rounded-lg w-full h-full "
                  style={{ height: "10rem", objectFit: "contain" }} // Fixed height for consistency
                />
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-sm py-2 text-orange-600 font-medium truncate w-full overflow-ellipsis">
              {service?.name || "ZipFeast Name"}
            </h5>
            <span className="text-sm font-light">
              {service?.serviceType || "ZipFeast Role"}
            </span>
          </div>
        </Link>
        <h3 className="text-sm font-bold py-3">
          {formatCurrency(Number(service?.price || 500))}/day
        </h3>
        <a href={`tel:${service?.phone || ""}`}>
          <Button
            type="button"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold"
          >
            <LucideCalendarCheck size={20} className="mr-2" /> Book Now
          </Button>
        </a>
      </CardContent>
    </Card>
  );
};

export default HomeService;
