export const APP_NAME = "Altheia";
export const APP_TAGLINE = "A Verdade da Beleza";
export const APP_DESCRIPTION =
  "Cosméticos de luxo formulados com ingredientes raros para revelar a luminosidade natural da sua pele.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Número de produtos por página na listagem */
export const PRODUCTS_PER_PAGE = 12;

/** Mapeamento visual dos status de pedido */
export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: "Aguardando pagamento",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};
