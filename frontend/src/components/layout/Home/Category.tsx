import { Badge } from "@/components/ui/badge";
import { useState } from "react";

//This is a dummy data for category list
const categoryList: { id: number; name: string }[] = [
  {
    id: 1,
    name: "Category 1",
  },
  {
    id: 2,
    name: "Category 2",
  },
  {
    id: 3,
    name: "Category 3",
  },
  {
    id: 4,
    name: "Category 4",
  },
  {
    id: 5,
    name: "Category 5",
  },
  {
    id: 6,
    name: "Category 6",
  },
];

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const handleCategory = (id: number) => {
    // console.log("Category Clicked", id);
    setSelectedCategory(id);
  };

  return (
    <div className="container my-2 flex">
      <div className="flex flex-wrap justify-center md:justify-start gap-3">
        {categoryList.map((category) => (
          <Badge
            key={category.id}
            className={`p-[7px] cursor-pointer ${
              selectedCategory === category.id ? "bg-orange-600" : ""
            }`}
            variant={"outline"}
            onClick={() => handleCategory(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Category;
