import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

const HomeCarousel = () => {
  return (
    <div className="container flex w-full justify-center items-center mt-3">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-full justify-center flex items-center"
      >
        <CarouselContent>
          {Array.from({ length: 8 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/3 w-full justify-center"
            >
              <div className="p-1">
                <Link to="/product/1">
                  <Card className="h-full w-full">
                    <div className="relative w-full h-full">
                      <CardContent className="h-full flex items-center justify-center p-0">
                        <div className="w-full h-full overflow-hidden">
                          <img
                            src="https://cdn.zeptonow.com/production///tr:w-969,ar-969-558,pr-true,f-auto,q-80/inventory/banner/d362a646-c6be-4c80-8c13-afd7ea648678.png"
                            alt="product"
                            className="object-cover w-full h-full"
                            style={{ aspectRatio: "16/9" }}
                          />
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
