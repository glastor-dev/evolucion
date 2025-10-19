import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Package, Mail, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStockNotifications, StockNotification } from '@/hooks/useStockNotifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationManagerProps {
  userEmail?: string;
  className?: string;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  userEmail,
  className = '',
}) => {
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);
  const { notifications, removeNotification, simulateStockReturn } = useStockNotifications();

  // Filtrar notificaciones por email del usuario si se proporciona
  const userNotifications = userEmail 
    ? notifications.filter(n => n.email === userEmail && !n.notified)
    : notifications.filter(n => !n.notified);

  const handleRemoveNotification = (notificationId: string) => {
    removeNotification(notificationId);
  };

  const handleSimulateRestock = (productId: string) => {
    simulateStockReturn(productId);
  };

  if (userNotifications.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No tienes notificaciones activas</h3>
          <p className="text-sm text-muted-foreground">
            Cuando un producto que te interesa esté agotado, puedes activar una notificación para que te avisemos cuando vuelva a estar disponible.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificaciones de Stock
          <Badge variant="secondary" className="ml-auto">
            {userNotifications.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          <AnimatePresence>
            {userNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b last:border-b-0"
              >
                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                      <Package className="w-4 h-4 text-orange-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate mb-1">
                        {notification.productName}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Mail className="w-3 h-3" />
                        <span>{notification.email}</span>
                        {notification.phone && (
                          <>
                            <span>•</span>
                            <span>{notification.phone}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Activada {formatDistanceToNow(new Date(notification.createdAt), { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {/* Botón para simular restock (solo en desarrollo) */}
                      {process.env.NODE_ENV === 'development' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSimulateRestock(notification.productId)}
                          className="h-8 w-8 p-0 text-xs"
                          title="Simular restock"
                        >
                          🔧
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveNotification(notification.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Cancelar notificación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="p-4 bg-muted/30 border-t">
          <p className="text-xs text-muted-foreground text-center">
            💡 Te notificaremos por email cuando estos productos vuelvan a estar disponibles
          </p>
        </div>
      </CardContent>
    </Card>
  );
};