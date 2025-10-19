import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency } from "@/lib/format";
import { updateProductStock } from "@/services/localProducts";
import {
  Check,
  CreditCard,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";

interface PaymentFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: "card" | "transfer" | "cash";
}

export const CartDrawer: React.FC = () => {
  const { state: { items = [], total, isOpen }, removeItem, updateQuantity, clearCart, closeCart } = useCart();
  
  // Log para debugging
  console.log('CartDrawer - items:', items);
  console.log('CartDrawer - isOpen:', isOpen);

  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    console.log('CartDrawer - handleQuantityChange:', { id, newQuantity });
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      await updateQuantity(id, newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convierte strings de moneda (€, $ COP) a número seguro para mostrar como COP
  const parseCurrencyToNumber = (value: string): number => {
    const normalized = value
      .replace(/[^\d.,-]/g, "") // deja solo dígitos y separadores
      .replace(/\./g, "") // elimina separador de miles
      .replace(",", "."); // normaliza decimal
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Actualizar stock para cada producto en el carrito
      items.forEach(item => {
        updateProductStock(item.id, item.quantity);
      });

      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsProcessing(false);
      setOrderCompleted(true);

      // Limpiar carrito después de 3 segundos
      setTimeout(() => {
        clearCart();
        setOrderCompleted(false);
        setShowPayment(false);
        closeCart();
      }, 3000);
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay - solo cubre el área izquierda */}
      <div className="flex-1 bg-black/50 transition-opacity" onClick={closeCart} />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl transition-transform">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                {showPayment ? "Finalizar Compra" : "Carrito de Compras"}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {orderCompleted ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">¡Pedido Confirmado!</h3>
                <p className="text-muted-foreground mb-4">
                  Gracias por tu compra. Te contactaremos pronto para coordinar la entrega.
                </p>
                <Badge className="bg-green-500">
                  Pedido #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </Badge>
              </div>
            ) : showPayment ? (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Información Personal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Nombre completo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Teléfono</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Dirección de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Dirección</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium">Ciudad</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Código Postal</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Método de Pago</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <option value="card">Tarjeta de Crédito/Débito</option>
                      <option value="transfer">Transferencia Bancaria</option>
                      <option value="cash">Pago Contra Entrega</option>
                    </select>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Procesando..." : "Confirmar Pedido"}
                </Button>
              </form>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
                <p className="text-muted-foreground">
                  Agrega algunos productos para comenzar
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.price)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setShowPayment(true)}
                  >
                    Proceder al Pago
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
