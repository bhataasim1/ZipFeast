import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import ShoppingCart from "@/components/layout/cart/ShoppingCart";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ProductType } from "@/types/types";
import { ProductServices } from "@/API/ProductServices";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
  product: ProductType;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

// eslint-disable-next-line react-refresh/only-export-components
export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const productServices = new ProductServices();

  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    productServices.getAllProducts().then((response) => {
      if (response.data) {
        setProducts(response.data.data);
      }
    });
  }, []);

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }
  const increaseCartQuantity = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setCartItems((currItems) => {
        const existingItem = currItems.find((item) => item.id === id);
        if (existingItem) {
          return currItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...currItems, { id, quantity: 1, product }];
        }
      });
    }
  };
  const decreaseCartQuantity = (id: number) => {
    setCartItems((currItems) => {
      const existingItem = currItems.find((item) => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return currItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return currItems.filter((item) => item.id !== id);
      }
    });
  };
  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        clearCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isCartOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
