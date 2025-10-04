import { Truck, ShieldCheck, CreditCard } from "lucide-react";

export const BenefitsBar = () => {
  return (
    <div className="w-full bg-black/80 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 py-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-green-400" aria-hidden="true" />
            <span>Envío gratis en compras superiores a $50</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <span>Garantía oficial Makita</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            <span>Pago seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};