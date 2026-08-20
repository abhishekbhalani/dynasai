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
}
