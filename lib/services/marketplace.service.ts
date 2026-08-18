import { api } from "@/services/api";
import type {
  CartSummary,
  CheckoutResult,
  Order,
  PaymentStatusResult,
  Product,
  ProductsPage,
} from "@/lib/types/marketplace";

export interface BrowseProductsParams {
  category?: string;
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

class MarketplaceService {
  async getProducts(params: BrowseProductsParams): Promise<ProductsPage> {
    const response = await api.get<ProductsPage>("/products", { params });
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<{ data: Product }>(`/products/${id}`);
    return response.data.data;
  }

  async getCart(): Promise<CartSummary> {
    const response = await api.get<CartSummary>("/cart");
    return response.data;
  }

  async addToCart(productId: string, quantity = 1): Promise<CartSummary> {
    const response = await api.post<CartSummary>("/cart/items", {
      productId,
      quantity,
    });
    return response.data;
  }

  async updateCartItem(productId: string, quantity: number): Promise<CartSummary> {
    const response = await api.patch<CartSummary>(`/cart/items/${productId}`, {
      quantity,
    });
    return response.data;
  }

  async removeCartItem(productId: string): Promise<void> {
    await api.delete(`/cart/items/${productId}`);
  }

  async checkout(deliveryType = "CHEW_PICKUP"): Promise<CheckoutResult> {
    const response = await api.post<CheckoutResult>("/orders", {
      deliveryType,
    });
    return response.data;
  }

  async listOrders(): Promise<Order[]> {
    const response = await api.get<{ data: Order[] }>("/orders");
    return response.data.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await api.get<{ data: Order }>(`/orders/${id}`);
    return response.data.data;
  }

  async payOrder(id: string): Promise<CheckoutResult> {
    const response = await api.post<CheckoutResult>(`/orders/${id}/pay`);
    return response.data;
  }

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.post<{ data: Order }>(`/orders/${id}/cancel`);
    return response.data.data;
  }

  async paymentStatus(id: string): Promise<PaymentStatusResult> {
    const response = await api.get<PaymentStatusResult>(`/orders/${id}/payment-status`);
    return response.data;
  }
}

export const marketplaceService = new MarketplaceService();
