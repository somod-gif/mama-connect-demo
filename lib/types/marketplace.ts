export type ProductCategory =
  | "NUTRITION"
  | "MATERNITY"
  | "BABY_CARE"
  | "WELLNESS"
  | "TESTS"
  | "SUPPORT";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  priceKobo: number;
  images: string[];
  clinicalTags: string[];
  requiresPrescription: boolean;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsPage {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPriceKobo: number;
  lineTotalKobo: number;
  image: string | null;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotalKobo: number;
}

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export interface Payment {
  id: string;
  orderId: string;
  status: PaymentStatus;
  reference: string | null;
  invoiceReference: string | null;
  amountKobo: number;
  amountPaidKobo: number | null;
  method: string | null;
  providerDetails: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInstructions {
  amountNaira: number;
  orderNumber: string;
  invoiceReference: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  checkoutUrl: string;
  transactionReference: string;
  expiresAt: string;
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  quantity: number;
  unitPriceKobo: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  patientId: string | null;
  status: OrderStatus;
  subtotalKobo: number;
  deliveryFeeKobo: number;
  totalKobo: number;
  deliveryType: string;
  deliveryAddress: string | null;
  timeline: Array<{ status: string; at: string; note?: string }>;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment: Payment | null;
}

export interface CheckoutResult {
  order: Order;
  paymentInstructions: PaymentInstructions;
}

export interface PaymentStatusResult {
  status: PaymentStatus;
  reference: string;
  amountPaidKobo?: number;
  message?: string;
}
