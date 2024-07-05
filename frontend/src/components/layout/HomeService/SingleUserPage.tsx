import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomeServices } from "@/API/HomeServices";
import { formatCurrency } from "@/lib/currencyFormatter";
import { ServiceProviderType } from "@/types/types";
import { Button } from "@/components/ui/button";
import { LucideCalendarCheck } from "lucide-react";

export const SingleUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceProviderType | null>(null);
  const [loading, setLoading] = useState(false);
  const homeServices = new HomeServices();

  useEffect(() => {
    if (id) {
      setLoading(true);
      homeServices
        .getServiceProviderById(Number(id))
        .then((response) => {
          //   console.log(response);
          if (response.data) {
            setService(response.data.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="container mx-auto my-5 px-4">
      {service && (
        <div className="flex flex-col lg:flex-row">
          <Card className="lg:w-[30%] mb-4 lg:mb-0 lg:mr-4">
            <CardContent>
              <div className="h-full w-full mt-3">
                <img
                  src={service.avatar}
                  alt={service.name}
                  className="rounded-lg w-full h-full "
                  style={{ height: "24rem", objectFit: "contain" }} // Fixed height
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col lg:w-1/2">
            <div className="mb-4">
              <h5 className="text-2xl font-bold truncate w-full overflow-ellipsis">
                Name: <span className="text-orange-600">{service.name}</span>
              </h5>
              <div className="text-lg mt-3">
                <p>
                  Phone:{" "}
                  <a
                    href={`tel:${service.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {service.phone}
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${service.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {service.email}
                  </a>
                </p>
                <p>
                  Address:{" "}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      service.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {service.address}
                  </a>
                </p>
                <p>City: {service.city}</p>
                <p>State: {service.state}</p>
                <p>Pincode: {service.pincode}</p>
              </div>
              <h3 className="font-bold py-3">
                Daily Wages:{" "}
                <span className="text-orange-600">
                  {formatCurrency(Number(service.price))} per Day
                </span>
              </h3>
              <h3 className="font-bold">
                Occupation:{" "}
                <span className="text-orange-600">{service.serviceType}</span>
              </h3>
              <div className="flex mt-3">
                <a href={`tel:${service?.phone}`}>
                  <Button
                    type="button"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold"
                  >
                    <LucideCalendarCheck size={20} className="mr-2" /> Book Now
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
