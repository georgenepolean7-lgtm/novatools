export type PaymentProviderType = "razorpay" | "stripe" | "cashfree" | "manual";

export interface PaymentConfiguration {
  enabled: boolean;
  premiumEnabled: boolean;
  amount: number;
  currency: string;
  provider: PaymentProviderType;
  lifetimeAccess: boolean;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  provider: PaymentProviderType;
  status: "created" | "paid" | "failed" | "refunded";
  userId?: string;
  createdAt: string;
}

export interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  provider: PaymentProviderType;
}

export interface PaymentVerificationResult {
  verified: boolean;
  orderId: string;
  paymentId: string;
  userId?: string;
  error?: string;
}
