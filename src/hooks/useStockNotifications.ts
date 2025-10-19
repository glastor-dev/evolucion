import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/toast';

export interface StockNotification {
  id: string;
  productId: string;
  productName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  notified: boolean;
}

const STORAGE_KEY = 'stock-notifications';

export const useStockNotifications = () => {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<StockNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveNotifications = useCallback((newNotifications: StockNotification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
  }, []);

  const addNotification = useCallback((
    productId: string,
    productName: string,
    email: string,
    phone?: string
  ) => {
    // Verificar si ya existe una notificación para este producto y email
    const existingNotification = notifications.find(
      n => n.productId === productId && n.email === email
    );

    if (existingNotification) {
      toast({
        title: "Ya registrado",
        description: "Ya tienes una notificación activa para este producto.",
        variant: "default",
      });
      return false;
    }

    const newNotification: StockNotification = {
      id: `${productId}-${email}-${Date.now()}`,
      productId,
      productName,
      email,
      phone,
      createdAt: new Date(),
      notified: false,
    };

    const updatedNotifications = [...notifications, newNotification];
    saveNotifications(updatedNotifications);

    toast({
      title: "¡Notificación activada!",
      description: `Te avisaremos cuando "${productName}" vuelva a estar disponible.`,
      variant: "default",
    });

    return true;
  }, [notifications, saveNotifications]);

  const removeNotification = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    saveNotifications(updatedNotifications);

    toast({
      title: "Notificación cancelada",
      description: "Ya no recibirás avisos para este producto.",
      variant: "default",
    });
  }, [notifications, saveNotifications]);

  const getNotificationsForProduct = useCallback((productId: string) => {
    return notifications.filter(n => n.productId === productId && !n.notified);
  }, [notifications]);

  const getUserNotifications = useCallback((email: string) => {
    return notifications.filter(n => n.email === email && !n.notified);
  }, [notifications]);

  const markAsNotified = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, notified: true } : n
    );
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Simular notificación cuando un producto vuelve a estar en stock
  const simulateStockReturn = useCallback((productId: string) => {
    const productNotifications = getNotificationsForProduct(productId);
    
    if (productNotifications.length > 0) {
      productNotifications.forEach(notification => {
        // En una aplicación real, aquí se enviaría un email/SMS
        addToast({
          type: "success",
          title: "¡Producto disponible!",
          description: `"${notification.productName}" ya está en stock. ¡Cómpralo ahora!`,
          duration: 8000,
        });
        
        markAsNotified(notification.id);
      });
    }
  }, [getNotificationsForProduct, markAsNotified]);

  return {
    notifications,
    addNotification,
    removeNotification,
    getNotificationsForProduct,
    getUserNotifications,
    markAsNotified,
    simulateStockReturn,
  };
};