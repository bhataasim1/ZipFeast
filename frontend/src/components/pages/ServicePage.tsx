import { homeServiceData } from "../layout/HomeService/homeServiceData";
import HomeService from "../layout/HomeService/HomeService";

const ServicePage = () => {
  return (
    <div className="container mt-2 mb-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {homeServiceData.map((service) => (
        <HomeService key={service.id} service={service} />
      ))}
    </div>
  );
};

export default ServicePage;
