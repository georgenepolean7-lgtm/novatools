/**
 * Nova Tools Autonomous SEO Agent - AI Provider Abstraction
 * Supports Local Ollama (Qwen 4B) for local development and Cloud AI API (OpenAI/Gemini/Groq/etc.)
 * for GitHub Actions cloud execution without downloading large local models.
 */

import { SEO_AGENT_CONFIG } from "./config";

export interface AIProviderHealth {
  connected: boolean;
  status: "CONNECTED" | "NOT_CONNECTED" | "FALLBACK_MODE";
  providerName: string;
  model: string;
  message: string;
}

export interface AIProvider {
  readonly providerName: string;
  readonly name: string;
  readonly modelName: string;
  checkHealth(): Promise<AIProviderHealth>;
  isAvailable(): Promise<boolean>;
  generateCompletion(prompt: string): Promise<string | null>;
}

/**
 * Local Ollama Provider (for local development/testing with Qwen3:4b or other local models)
 */
export class LocalOllamaProvider implements AIProvider {
  readonly providerName = "LocalOllamaProvider";
  get name(): string {
    return this.providerName;
  }
  readonly modelName: string;
  private ollamaBaseUrl: string;
  private customEndpoint: string;
  private timeoutMs: number;
  private isCachedAvailable: boolean | null = null;

  constructor(
    optionsOrBaseUrl?: string | { model?: string; baseUrl?: string; customEndpoint?: string; timeoutMs?: number },
    model?: string,
    timeoutMs?: number
  ) {
    if (typeof optionsOrBaseUrl === "string") {
      this.ollamaBaseUrl = optionsOrBaseUrl;
      this.modelName = model || SEO_AGENT_CONFIG.LLM.MODEL || "qwen3:4b";
      this.customEndpoint = "";
      this.timeoutMs = timeoutMs || 2500;
    } else {
      this.modelName = optionsOrBaseUrl?.model || SEO_AGENT_CONFIG.LLM.MODEL || "qwen3:4b";
      this.ollamaBaseUrl = optionsOrBaseUrl?.baseUrl || SEO_AGENT_CONFIG.LLM.OLLAMA_BASE_URL || "http://localhost:11434";
      this.customEndpoint = optionsOrBaseUrl?.customEndpoint || SEO_AGENT_CONFIG.LLM.CUSTOM_OPENAI_ENDPOINT || "";
      this.timeoutMs = optionsOrBaseUrl?.timeoutMs || 2500;
    }
  }

  async isAvailable(): Promise<boolean> {
    const health = await this.checkHealth();
    return health.connected;
  }

  async checkHealth(): Promise<AIProviderHealth> {
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      const endpoint = this.customEndpoint || `${this.ollamaBaseUrl}/api/tags`;
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 2500);
      if (typeof timeoutId.unref === "function") timeoutId.unref();

      const res = await fetch(endpoint, { signal: controller.signal });
      if (res.ok) {
        this.isCachedAvailable = true;
        return {
          connected: true,
          status: "CONNECTED",
          providerName: this.providerName,
          model: this.modelName,
          message: `Local Ollama active at ${this.ollamaBaseUrl} with model ${this.modelName}`,
        };
      }
      this.isCachedAvailable = false;
      return {
        connected: false,
        status: "NOT_CONNECTED",
        providerName: this.providerName,
        model: this.modelName,
        message: `Ollama returned HTTP ${res.status}: ${res.statusText}`,
      };
    } catch (err) {
      this.isCachedAvailable = false;
      return {
        connected: false,
        status: "NOT_CONNECTED",
        providerName: this.providerName,
        model: this.modelName,
        message: `Local Ollama instance unreachable: ${err instanceof Error ? err.message : String(err)}`,
      };
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async generateCompletion(prompt: string): Promise<string | null> {
    const controller = new AbortController();
    const timeoutMs = SEO_AGENT_CONFIG.TIMEOUTS?.LLM_TIMEOUT_MS || SEO_AGENT_CONFIG.LLM?.TIMEOUT_MS || 12000;
    let isTimedOut = false;
    let timeoutId: NodeJS.Timeout | null = null;
    timeoutId = setTimeout(() => {
      isTimedOut = true;
      controller.abort();
    }, timeoutMs);
    if (typeof timeoutId.unref === "function") timeoutId.unref();

    try {
      const url = this.customEndpoint || `${this.ollamaBaseUrl}/api/generate`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.modelName,
          prompt,
          stream: false,
          format: "json",
          temperature: SEO_AGENT_CONFIG.LLM.TEMPERATURE,
        }),
      });

      if (!res.ok) return null;
      const json = await res.json();

      // Qwen3:4b may place JSON in json.response, or inside json.thinking / think tags
      const responseText = (json?.response || "").trim();
      const thinkingText = (json?.thinking || "").trim();

      if (responseText && responseText.includes("{")) {
        return responseText;
      }
      if (thinkingText && thinkingText.includes("{")) {
        return thinkingText;
      }
      if (responseText) return responseText;
      if (json?.choices?.[0]?.message?.content) return json.choices[0].message.content;

      return null;
    } catch {
      if (isTimedOut) {
        throw new Error(`TIMEOUT: LLM generation exceeded ${timeoutMs}ms`);
      }
      return null;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
}

/**
 * Cloud AI Provider (for GitHub Actions production execution using standard cloud APIs)
 * Compatible with OpenAI, Groq, Google Gemini OpenAI endpoint, OpenRouter, Mistral, etc.
 * Credentials come exclusively from environment variables (GitHub Actions Secrets).
 */
export class CloudAIProvider implements AIProvider {
  readonly providerName = "CloudAIProvider";
  get name(): string {
    return this.providerName;
  }
  readonly modelName: string;
  private apiKey: string;
  private endpoint: string;

  async isAvailable(): Promise<boolean> {
    const health = await this.checkHealth();
    return health.connected;
  }

  constructor(options?: { model?: string; apiKey?: string; endpoint?: string }) {
    this.apiKey =
      options?.apiKey ||
      process.env.CLOUD_AI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      "";

    this.endpoint =
      options?.endpoint ||
      process.env.CLOUD_AI_ENDPOINT ||
      "https://api.openai.com/v1/chat/completions";

    this.modelName =
      options?.model ||
      process.env.CLOUD_AI_MODEL ||
      process.env.SEO_AGENT_MODEL ||
      "gpt-4o-mini";
  }

  async checkHealth(): Promise<AIProviderHealth> {
    if (!this.apiKey) {
      return {
        connected: false,
        status: "NOT_CONNECTED",
        providerName: this.providerName,
        model: this.modelName,
        message: "No CLOUD_AI_API_KEY or OPENAI_API_KEY configured in environment secrets.",
      };
    }

    return {
      connected: true,
      status: "CONNECTED",
      providerName: this.providerName,
      model: this.modelName,
      message: `Cloud AI provider ready with model ${this.modelName} (endpoint: ${new URL(this.endpoint).hostname})`,
    };
  }

  async generateCompletion(prompt: string): Promise<string | null> {
    if (!this.apiKey) {
      return null;
    }

    const controller = new AbortController();
    const timeoutMs = SEO_AGENT_CONFIG.TIMEOUTS?.LLM_TIMEOUT_MS || SEO_AGENT_CONFIG.LLM?.TIMEOUT_MS || 15000;
    let isTimedOut = false;
    let timeoutId: NodeJS.Timeout | null = null;
    timeoutId = setTimeout(() => {
      isTimedOut = true;
      controller.abort();
    }, timeoutMs);
    if (typeof timeoutId.unref === "function") timeoutId.unref();

    try {
      const res = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: "system",
              content: "You are an expert technical SEO specialist. Return only valid JSON adhering strictly to the schema.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: SEO_AGENT_CONFIG.LLM.TEMPERATURE,
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.warn(`[CloudAIProvider] API returned HTTP ${res.status}: ${errorText.slice(0, 200)}`);
        return null;
      }

      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.includes("{")) {
        return content.trim();
      }

      // Handle reasoning models where output may reside in reasoning_content or thinking
      const reasoning = json?.choices?.[0]?.message?.reasoning_content;
      if (typeof reasoning === "string" && reasoning.includes("{")) {
        return reasoning.trim();
      }

      return content || null;
    } catch {
      if (isTimedOut) {
        throw new Error(`TIMEOUT: Cloud AI generation exceeded ${timeoutMs}ms`);
      }
      return null;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
}

/**
 * AI Provider Factory
 * Auto-selects CloudAIProvider if cloud credentials are present or requested,
 * otherwise selects LocalOllamaProvider for local development and offline testing.
 */
export function getAIProvider(override?: "local" | "cloud" | AIProvider): AIProvider {
  if (override && typeof override === "object" && "generateCompletion" in override) {
    return override;
  }

  if (override === "cloud") {
    return new CloudAIProvider();
  }

  if (override === "local") {
    return new LocalOllamaProvider();
  }

  const hasCloudKey = Boolean(
    process.env.CLOUD_AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY
  );

  const explicitlyCloud = (process.env.AI_PROVIDER || "").toLowerCase() === "cloud";

  if (hasCloudKey || explicitlyCloud) {
    return new CloudAIProvider();
  }

  return new LocalOllamaProvider();
}
