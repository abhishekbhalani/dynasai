interface Env {
  AI?: {
    run(
      model: string,
      input: {
        messages: { role: string; content: string }[];
        max_tokens?: number;
      },
    ): Promise<{ response?: string } | string>;
  };
  ADMIN_PASSWORD?: string;
  ADMIN_USERNAME?: string;
  ADMIN_HOST?: string;
  TURNSTILE_SECRET?: string;
  PUBLIC_TURNSTILE_SITEKEY?: string;
  DB?: D1Database;
}
