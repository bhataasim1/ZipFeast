import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const DashboardBreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <BreadcrumbItem key={to}>
              {isLast ? (
                <BreadcrumbPage className="capitalize">{value}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={to} className="capitalize">
                      {value}
                    </Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadCrumbs;
