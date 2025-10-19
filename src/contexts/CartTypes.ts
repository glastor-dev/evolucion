import { Product } from '../types/product';

export interface CartState {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  isOpen: boolean;
}

export interface CartContextType {
  state: CartState;
  addItem: (product: Product) => Promise<{ success: boolean; message?: string }>;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}