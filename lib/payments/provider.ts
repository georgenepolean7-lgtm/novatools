import {
  PaymentConfiguration,
  PaymentOrder,
  PaymentVerificationRequest,
  PaymentVerificationResult,
} from "./types";

export const DEFAULT_PAYMENT_CONFIG: PaymentConfiguration = {
  enabled: false, // Dormant by default
  premiumEnabled: false, // Dormant by default
  amount: 99, // ₹99 Lifetime
  currency: "INR",
  provider: "razorpay",
  lifetimeAccess: true,
};

export class PaymentGatewayManager {
  private config: PaymentConfiguration;

  constructor(config: PaymentConfiguration = DEFAULT_PAYMENT_CONFIG) {
    this.config = config;
  }

  public isPaymentActive(): boolean {
    return this.config.enabled && this.config.premiumEnabled;
  }

  public async createOrder(userId: string): Promise<PaymentOrder> {
    if (!this.isPaymentActive()) {
      throw new Error("Payment gateway is currently disabled by system administrator.");
    }

    return {
      orderId: `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      amount: this.config.amount,
      currency: this.config.currency,
      provider: this.config.provider,
      status: "created",
      userId,
      createdAt: new Date().toISOString(),
    };
  }

  public async verifyPayment(req: PaymentVerificationRequest): Promise<PaymentVerificationResult> {
    if (!this.isPaymentActive()) {
      return { verified: false, orderId: req.orderId, paymentId: req.paymentId, error: "Payments inactive" };
    }
    // Server-side cryptographic HMAC SHA-256 signature verification placeholder
    return {
      verified: true,
      orderId: req.orderId,
      paymentId: req.paymentId,
    };
  }
}

export const paymentGateway = new PaymentGatewayManager();
