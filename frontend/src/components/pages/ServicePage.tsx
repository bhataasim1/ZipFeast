/* eslint-disable react-hooks/exhaustive-deps */
// import { homeServiceData } from "../layout/HomeService/homeServiceData";
import HomeService from "../layout/HomeService/HomeService";
import { HomeServices } from "@/API/HomeServices";
import { useEffect, useState } from "react";
import { ServiceProviderType } from "@/types/types";

const ServicePage = () => {
  const homeServices = new HomeServices();
  const [serviceProviders, setServiceProviders] = useState<
    ServiceProviderType[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchAllServiceProviders = async () => {
    setLoading(true);
    try {
      const response = await homeServices.getAllServiceProviders();
      // console.log(response.data.data);
      if (response.data) {
        setServiceProviders(response.data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllServiceProviders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-2 mb-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {serviceProviders?.map((service) => (
        <HomeService key={service.id} service={service} />
      ))}
    </div>
  );
};

export default ServicePage;
