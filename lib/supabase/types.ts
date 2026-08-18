import { Database, UserRole, Json } from "./database.types";

export type { Database, UserRole, Json };

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  isPremium: boolean;
  premiumExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserToolFavorite {
  id: string;
  userId: string;
  toolSlug: string;
  createdAt: string;
}

export interface ToolUsageMetric {
  id: string;
  userId: string | null;
  toolSlug: string;
  usageCount: number;
  lastUsedAt: string;
  createdAt: string;
}

export interface ToolFeedbackItem {
  id: string;
  userId: string | null;
  toolSlug: string;
  rating: number;
  feedback: string | null;
  createdAt: string;
}

export interface SystemSettings {
  id: string;
  paymentEnabled: boolean;
  premiumEnabled: boolean;
  premiumAmountInr: number;
  adFreeAccess: boolean;
  maintenanceMode: boolean;
  signupEnabled?: boolean;
  updatedAt: string;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string | null;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Json;
  createdAt: string;
}
