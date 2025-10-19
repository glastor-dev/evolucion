import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types/product';
import { CartState } from '../contexts/CartTypes';
import { toast } from 'sonner';

interface CartStore {
  state: CartState;
  addItem: (product: Product) => Promise<{ success: boolean; message?: string }>;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      state: initialState,
      addItem: async (product: Product) => {
        try {
          if (!product || !product.id || !product.name) {
            throw new Error('Producto inválido');
          }

          const currentState = get().state;
          const existingItem = currentState.items.find(item => item.id === product.id);
          const quantity = product.quantity || 1;

          if (existingItem) {
            const updatedItems = currentState.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );

            set({
              state: {
                ...currentState,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
              }
            });
          } else {
            const newItem = {
              ...product,
              quantity: quantity,
            };

            set({
              state: {
                ...currentState,
                items: [...currentState.items, newItem],
                total: currentState.total + (product.price * quantity),
              }
            });
          }

          get().openCart();
          return {
            success: true,
            message: 'Producto agregado al carrito'
          };
        } catch (error) {
          console.error('CartStore - addItem - Error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Error al agregar al carrito';
          toast.error(errorMessage);
          return {
            success: false,
            message: errorMessage
          };
        }
      },
      removeItem: (productId: string) => {
        const currentState = get().state;
        const updatedItems = currentState.items.filter(item => item.id !== productId);
        set({
          state: {
            ...currentState,
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          }
        });
      },
      updateQuantity: async (productId: string, quantity: number) => {
        const currentState = get().state;
        if (quantity < 0) return;

        const updatedItems = currentState.items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        );

        set({
          state: {
            ...currentState,
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          }
        });
      },
      clearCart: () => {
        set({
          state: {
            ...initialState,
            isOpen: get().state.isOpen,
          }
        });
      },
      toggleCart: () => {
        const currentState = get().state;
        set({
          state: {
            ...currentState,
            isOpen: !currentState.isOpen,
          }
        });
      },
      openCart: () => {
        const currentState = get().state;
        set({
          state: {
            ...currentState,
            isOpen: true,
          }
        });
      },
      closeCart: () => {
        const currentState = get().state;
        set({
          state: {
            ...currentState,
            isOpen: false,
          }
        });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);