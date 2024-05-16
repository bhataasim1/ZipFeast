type ProductProps = {
  id: number;
  name: string;
  image: string;
  price: number;
  weight: string;
}[];

export const Products: ProductProps = [
  {
    id: 1,
    name: "Apple",
    image: "https://images.unsplash.com/photo-1630563451961-ac2ff27616ab",
    price: 120,
    weight: "1 kg",
  },
  {
    id: 2,
    name: "Cadbury Dairy Milk Chocolate bar",
    image:
      "https://cdn.zeptonow.com/production///tr:w-350,ar-316-316,pr-true,f-auto,q-80/cms/product_variant/d22b1037-6f8d-4539-a86c-927a7f796e09.jpeg",
    price: 150,
    weight: "50 g",
  },
  {
    id: 3,
    name: "Detol Skin Care Handwash",
    image: "https://cdn.zeptonow.com/production///tr:w-350,ar-1000-1000,pr-true,f-auto,q-80/cms/product_variant/ce010b04-6c4b-45e1-8bf0-5732af7353c1.jpeg",
    price: 70,
    weight: "850 ml",
  },
  {
    id: 4,
    name: "Green Chilli",
    image: "https://cdn.zeptonow.com/production///tr:w-350,ar-3000-3000,pr-true,f-auto,q-80/cms/product_variant/f2a454cc-3e9a-412e-bae5-4fa247232dfa.jpeg",
    price: 19,
    weight: "100 g",
  },
  {
    id: 5,
    name: "Pineapple Slice",
    image: "https://cdn.zeptonow.com/production///tr:w-400,ar-3000-3000,pr-true,f-auto,q-80/cms/product_variant/349c11b5-3c37-4afe-a0df-a03483cbee30.jpeg",
    price: 80,
    weight: "200 g",
  },
  {
    id: 6,
    name: "Grapes",
    image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    price: 60,
    weight: "1 kg",
  },
  {
    id: 7,
    name: "Watermelon",
    image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    price: 40,
    weight: "1 kg",
  },
  {
    id: 8,
    name: "Strawberry",
    image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    price: 30,
    weight: "1 kg",
  },
];
