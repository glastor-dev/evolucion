import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StockNotificationModal } from './StockNotificationModal';
import { useStockNotifications } from '@/hooks/useStockNotifications';

interface OutOfStockBannerProps {
  productId: string;
  productName: string;
  productImage?: string;
  expectedRestockDate?: string;
  className?: string;
}

export const OutOfStockBanner: React.FC<OutOfStockBannerProps> = ({
  productId,
  productName,
  productImage,
  expectedRestockDate,
  className = '',
}) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { getNotificationsForProduct, simulateStockReturn } = useStockNotifications();

  const activeNotifications = getNotificationsForProduct(productId);
  const hasActiveNotifications = activeNotifications.length > 0;

  const handleNotifyClick = () => {
    setShowNotificationModal(true);
  };

  const handleSimulateRestock = () => {
    // Función para simular que el producto vuelve a estar en stock
    simulateStockReturn(productId);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Agotado
              </Badge>
              {hasActiveNotifications && (
                <Badge variant="secondary" className="text-xs">
                  <Bell className="w-3 h-3 mr-1" />
                  {activeNotifications.length} notificación{activeNotifications.length > 1 ? 'es' : ''} activa{activeNotifications.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <h3 className="font-medium text-gray-900 mb-1">
              Producto temporalmente agotado
            </h3>
            
            <p className="text-sm text-gray-600 mb-3">
              Este producto no está disponible en este momento. 
              {expectedRestockDate && (
                <span className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  Reposición estimada: {expectedRestockDate}
                </span>
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleNotifyClick}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Bell className="w-4 h-4 mr-2" />
                {hasActiveNotifications ? 'Gestionar notificaciones' : 'Notificarme cuando esté disponible'}
              </Button>
              
              {/* Botón para simular restock (solo para demo) */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  onClick={handleSimulateRestock}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  🔧 Simular restock
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Información adicional */}
        <div className="mt-4 pt-3 border-t border-orange-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>💡 Te notificaremos por email cuando vuelva a estar disponible</span>
            <span>📦 Envío gratis en tu próxima compra</span>
          </div>
        </div>
      </motion.div>

      <StockNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        productId={productId}
        productName={productName}
        productImage={productImage}
      />
    </>
  );
};