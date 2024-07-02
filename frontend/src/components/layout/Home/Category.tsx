import { ProductServices } from "@/API/ProductServices";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const productServices = new ProductServices();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await productServices.getCategories();
      console.log("Categories", response.data.data);
      setCategories(response.data.data)
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategory = (id: number) => {
    // console.log("Category Clicked", id);
    setSelectedCategory(id);
  };

  if (loading) {
    return <div>Loading Categories</div>
  }

  return (
    <div className="container my-2 flex">
      <div className="flex flex-wrap justify-center md:justify-start gap-3">
        {categories.map((category, index) => (
          <Badge
            key={index}
            className={`p-[7px] cursor-pointer ${
              selectedCategory === index ? "bg-orange-600 text-white" : ""
            }`}
            variant={"outline"}
            onClick={() => handleCategory(index)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Category;
