import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currencyFormatter";
import { LucidePhoneCall } from "lucide-react";
import { HomeServiceData } from "./homeServiceData";

type HomeServiceProps = {
  service: HomeServiceData;
};
const HomeService = ({ service }: HomeServiceProps) => {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5 p-2">
            <div className="w-full h-40">
              <img
                src={service?.image || "https://via.placeholder.com/150"}
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
            {service?.role || "ZipFeast Role"}
          </span>
        </div>
        <h3 className="text-sm font-bold py-3">
          {formatCurrency(Number(service?.price || 500))}/day
        </h3>
        <a href={`tel:${service?.phone || ""}`}>
          <Button
            type="button"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold"
          >
            <LucidePhoneCall size={16} className="mr-2" /> Call Now
          </Button>
        </a>
      </CardContent>
    </Card>
  );
};

export default HomeService;
