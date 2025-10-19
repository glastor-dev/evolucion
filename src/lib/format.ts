/**
 * Formatea un número como moneda en pesos colombianos
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea un número como porcentaje
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("es-CO").format(value);
};
