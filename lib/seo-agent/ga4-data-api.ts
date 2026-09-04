/**
 * Nova Tools Autonomous SEO Agent - Google Analytics 4 Data API Adapter
 *
 * Implements direct, read-only integration with the official Google Analytics Data API v1beta.
 * Uses native Node.js crypto for RFC 7523 JWT bearer token signing.
 * Strictly read-only: Only executes properties/{propertyId}:runReport.
 * Never stores or exposes credentials.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { SEO_AGENT_CONFIG } from "./config";
import { GA4DataApiStatus, GA4ReportMetric, MetricProvenance } from "./types";

export interface Ga4ServiceAccountCredentials {
  client_email: string;
  private_key: string;
  project_id?: string;
}

export interface Ga4RunReportResponse {
  dimensionHeaders?: Array<{ name: string }>;
  metricHeaders?: Array<{ name: string; type: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value: string }>;
    metricValues?: Array<{ value: string }>;
  }>;
  rowCount?: number;
  metadata?: Record<string, unknown>;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 20000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`GA4 API request to ${url} timed out after ${timeoutMs}ms`));
  }, timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

export class Ga4DataApiAdapter {
  private propertyId: string;
  private cachedAccessToken: string | null = null;
  private tokenExpiresAt = 0;
  private cachedStatusResult: {
    timestamp: number;
    result: { status: GA4DataApiStatus; message: string };
  } | null = null;

  constructor(propertyId?: string) {
    this.propertyId = propertyId || SEO_AGENT_CONFIG.GA4_PROPERTY_ID || "";
  }

  /**
   * Retrieves Service Account credentials from environment variables or file path.
   * Supports:
   * 1. GA4_KEY_FILE / GA4_SERVICE_ACCOUNT_KEY_FILE / GA4_SERVICE_ACCOUNT_KEY_PATH / GOOGLE_APPLICATION_CREDENTIALS (file path)
   * 2. GA4_SERVICE_ACCOUNT_KEY / GA4_CREDENTIALS_JSON (inline JSON string, base64, or file path)
   * 3. GA4_CLIENT_EMAIL and GA4_PRIVATE_KEY (individual env vars)
   */
  private getCredentials(): Ga4ServiceAccountCredentials | null {
    // 1. File path references
    const filePathCandidates = [
      process.env.GA4_KEY_FILE,
      process.env.GA4_SERVICE_ACCOUNT_KEY_FILE,
      process.env.GA4_SERVICE_ACCOUNT_KEY_PATH,
      process.env.GA4_SERVICE_ACCOUNT_FILE,
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
      process.env.GA4_SERVICE_ACCOUNT_KEY,
      process.env.GA4_CREDENTIALS_JSON,
    ].filter(Boolean) as string[];

    for (const candidate of filePathCandidates) {
      const trimmed = candidate.trim().replace(/^["']|["']$/g, "");
      if (trimmed.startsWith("{")) continue;

      const resolved = path.isAbsolute(trimmed)
        ? trimmed
        : path.resolve(process.cwd(), trimmed);

      if (fs.existsSync(resolved)) {
        try {
          const stat = fs.statSync(resolved);
          if (stat.isFile()) {
            const raw = fs.readFileSync(resolved, "utf8");
            const parsed = JSON.parse(raw);
            if (parsed.client_email && parsed.private_key) {
              return {
                client_email: parsed.client_email,
                private_key: parsed.private_key.replace(/\\n/g, "\n"),
                project_id: parsed.project_id,
              };
            }
          }
        } catch {
          // Continue to next candidate
        }
      }
    }

    // 2. Direct inline JSON string or base64 JSON
    const inlineJson =
      process.env.GA4_SERVICE_ACCOUNT_KEY ||
      process.env.GA4_CREDENTIALS_JSON ||
      "";

    if (inlineJson.trim() && (inlineJson.trim().startsWith("{") || !inlineJson.trim().includes("."))) {
      try {
        const raw = inlineJson.trim().startsWith("{")
          ? inlineJson.trim()
          : Buffer.from(inlineJson.trim(), "base64").toString("utf8");
        const parsed = JSON.parse(raw);
        if (parsed.client_email && parsed.private_key) {
          return {
            client_email: parsed.client_email,
            private_key: parsed.private_key.replace(/\\n/g, "\n"),
            project_id: parsed.project_id,
          };
        }
      } catch {
        // Invalid inline JSON format
      }
    }

    // 3. Individual environment variables
    const clientEmail = process.env.GA4_CLIENT_EMAIL;
    const privateKey = process.env.GA4_PRIVATE_KEY;
    if (clientEmail && privateKey) {
      return {
        client_email: clientEmail.trim(),
        private_key: privateKey.trim().replace(/\\n/g, "\n"),
      };
    }

    return null;
  }

  /**
   * Exchanges Service Account credentials for a short-lived Google OAuth access token.
   * Uses standard RFC 7523 JWT Bearer flow signed with RSA-SHA256 via native Node crypto.
   */
  private async getAccessToken(): Promise<{
    token: string | null;
    status: GA4DataApiStatus;
    error?: string;
  }> {
    // Check in-memory token cache (with 5-minute safety buffer)
    if (this.cachedAccessToken && Date.now() < this.tokenExpiresAt - 300000) {
      return { token: this.cachedAccessToken, status: "CONNECTED" };
    }

    const creds = this.getCredentials();
    if (!creds) {
      return {
        token: null,
        status: "NOT_CONFIGURED",
        error:
          "GA4 Data API Service Account credentials not configured. Provide GA4_SERVICE_ACCOUNT_KEY or GA4_CLIENT_EMAIL & GA4_PRIVATE_KEY in environment variables.",
      };
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const header = { alg: "RS256", typ: "JWT" };
      const claimSet = {
        iss: creds.client_email,
        scope: "https://www.googleapis.com/auth/analytics.readonly",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      };

      const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
      const encodedClaim = Buffer.from(JSON.stringify(claimSet)).toString("base64url");
      const signatureInput = `${encodedHeader}.${encodedClaim}`;

      const signer = crypto.createSign("RSA-SHA256");
      signer.update(signatureInput);
      const signature = signer.sign(creds.private_key, "base64url");

      const assertion = `${signatureInput}.${signature}`;

      const tokenRes = await fetchWithTimeout(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion,
          }),
        },
        15000
      );

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        return {
          token: null,
          status: "AUTH_ERROR",
          error: `Google OAuth2 token exchange rejected (HTTP ${tokenRes.status}): ${errorText}`,
        };
      }

      const tokenData = (await tokenRes.json()) as {
        access_token: string;
        expires_in: number;
        token_type: string;
      };

      this.cachedAccessToken = tokenData.access_token;
      this.tokenExpiresAt = Date.now() + tokenData.expires_in * 1000;

      return { token: this.cachedAccessToken, status: "CONNECTED" };
    } catch (err) {
      return {
        token: null,
        status: "AUTH_ERROR",
        error: `JWT signing or token request failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  /**
   * Health and connectivity check for direct GA4 Data API reporting.
   */
  async checkStatus(): Promise<{ status: GA4DataApiStatus; message: string }> {
    const isNumeric = /^\d+$/.test(this.propertyId.trim());
    if (!this.propertyId || !isNumeric) {
      return {
        status: "NOT_CONFIGURED",
        message: `Invalid or missing GA4_PROPERTY_ID (${this.propertyId || "empty"}). Numeric Property ID required.`,
      };
    }

    if (this.cachedStatusResult && Date.now() - this.cachedStatusResult.timestamp < 60000) {
      return this.cachedStatusResult.result;
    }

    const { token, status, error } = await this.getAccessToken();
    if (!token) {
      const result = { status, message: error || "Direct GA4 Data API unconfigured." };
      this.cachedStatusResult = { timestamp: Date.now(), result };
      return result;
    }

    // Ping runReport with a minimal 1-day check (with 15s timeout)
    try {
      const pingRes = await fetchWithTimeout(
        `https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateRanges: [{ startDate: "yesterday", endDate: "today" }],
            metrics: [{ name: "activeUsers" }],
            limit: 1,
          }),
        },
        15000
      );

      if (pingRes.status === 403) {
        const result = {
          status: "AUTH_ERROR" as const,
          message: `Permission denied on GA4 Property ${this.propertyId}. Ensure Service Account has Viewer role in GA4 Property Access Management.`,
        };
        this.cachedStatusResult = { timestamp: Date.now(), result };
        return result;
      }

      if (!pingRes.ok) {
        const result = {
          status: "API_ERROR" as const,
          message: `GA4 Data API returned HTTP ${pingRes.status}: ${pingRes.statusText}`,
        };
        this.cachedStatusResult = { timestamp: Date.now(), result };
        return result;
      }

      const result = {
        status: "CONNECTED" as const,
        message: `Direct Google Analytics Data API v1beta active for Property ${this.propertyId}`,
      };
      this.cachedStatusResult = { timestamp: Date.now(), result };
      return result;
    } catch (err) {
      const result = {
        status: "API_ERROR" as const,
        message: `GA4 Data API ping failed: ${err instanceof Error ? err.message : String(err)}`,
      };
      this.cachedStatusResult = { timestamp: Date.now(), result };
      return result;
    }
  }

  /**
   * Fetches aggregate property overview metrics (activeUsers, sessions, screenPageViews).
   */
  async getOverviewReport(dateRange: {
    startDate: string;
    endDate: string;
  }): Promise<{
    metrics: GA4ReportMetric[];
    status: GA4DataApiStatus;
    message: string;
  }> {
    return this.executeReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagementRate" },
        { name: "averageSessionDuration" },
      ],
      dateRange,
    });
  }

  /**
   * Fetches organic search traffic metrics filtered by sessionDefaultChannelGroup = "Organic Search".
   */
  async getOrganicReport(dateRange: {
    startDate: string;
    endDate: string;
  }): Promise<{
    metrics: GA4ReportMetric[];
    status: GA4DataApiStatus;
    message: string;
  }> {
    return this.executeReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagementRate" },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: {
            matchType: "EXACT",
            value: "Organic Search",
          },
        },
      },
      dateRange,
    });
  }

  /**
   * Fetches page-level reporting using landingPagePlusQueryString.
   */
  async getPageReport(
    dateRange: { startDate: string; endDate: string },
    limit = 500
  ): Promise<{
    metrics: GA4ReportMetric[];
    status: GA4DataApiStatus;
    message: string;
  }> {
    return this.executeReport({
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: "landingPagePlusQueryString" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagementRate" },
        { name: "averageSessionDuration" },
      ],
      limit,
      dateRange,
    });
  }

  /**
   * Core executor for runReport queries.
   */
  private async executeReport(params: {
    dateRanges: Array<{ startDate: string; endDate: string }>;
    dimensions?: Array<{ name: string }>;
    metrics: Array<{ name: string }>;
    dimensionFilter?: Record<string, unknown>;
    limit?: number;
    dateRange: { startDate: string; endDate: string };
  }): Promise<{
    metrics: GA4ReportMetric[];
    status: GA4DataApiStatus;
    message: string;
  }> {
    const timestamp = new Date().toISOString();

    const { token, status, error } = await this.getAccessToken();
    if (!token) {
      return { metrics: [], status, message: error || "Direct GA4 Data API unconfigured." };
    }

    try {
      const url = `https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`;
      const bodyPayload: Record<string, unknown> = {
        dateRanges: params.dateRanges,
        metrics: params.metrics,
      };

      if (params.dimensions && params.dimensions.length > 0) {
        bodyPayload.dimensions = params.dimensions;
      }
      if (params.dimensionFilter) {
        bodyPayload.dimensionFilter = params.dimensionFilter;
      }
      if (params.limit) {
        bodyPayload.limit = params.limit;
      }

      const res = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyPayload),
        },
        25000
      );

      if (res.status === 403) {
        return {
          metrics: [],
          status: "AUTH_ERROR",
          message: `Permission denied on Property ${this.propertyId}. Service Account needs Viewer permission.`,
        };
      }

      if (!res.ok) {
        const errText = await res.text();
        return {
          metrics: [],
          status: "API_ERROR",
          message: `GA4 Data API HTTP ${res.status}: ${errText.slice(0, 200)}`,
        };
      }

      const data = (await res.json()) as Ga4RunReportResponse;
      const rows = data.rows || [];

      if (rows.length === 0) {
        return {
          metrics: [],
          status: "NO_DATA",
          message: `GA4 Data API returned 0 rows for ${params.dateRange.startDate} to ${params.dateRange.endDate}`,
        };
      }

      const metrics: GA4ReportMetric[] = rows.map((row) => {
        const dimVal = row.dimensionValues?.[0]?.value || "";
        const activeUsers = Number(row.metricValues?.[0]?.value || 0);
        const sessions = Number(row.metricValues?.[1]?.value || 0);
        const screenPageViews = Number(row.metricValues?.[2]?.value || 0);
        const engagementRate = Number(row.metricValues?.[3]?.value || 0);
        const averageSessionDuration = Number(row.metricValues?.[4]?.value || 0);

        const provenance: MetricProvenance = {
          source: "GOOGLE_ANALYTICS_4",
          property: this.propertyId,
          dateRange: params.dateRange,
          retrievalTimestamp: timestamp,
          pageOrQuery: dimVal || "AGGREGATE_OVERVIEW",
          metric: "GA4_DATA_API_ROW",
          value: sessions,
        };

        return {
          pagePath: dimVal,
          channelGroup: dimVal,
          activeUsers,
          sessions,
          screenPageViews,
          engagementRate,
          averageSessionDuration,
          dateRange: params.dateRange,
          provenance,
        };
      });

      return {
        metrics,
        status: "CONNECTED",
        message: `Retrieved ${metrics.length} real metrics from GA4 Data API for Property ${this.propertyId}`,
      };
    } catch (err) {
      return {
        metrics: [],
        status: "API_ERROR",
        message: `GA4 Data API execution failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }
}
