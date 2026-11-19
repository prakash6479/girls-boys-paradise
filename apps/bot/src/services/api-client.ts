/** Server-side client for authenticated bot-to-API calls. Never import this module in browser code. */
export class CommunityApiClient {
  constructor(private readonly baseUrl: string, private readonly secret: string) {
    if (!secret) throw new Error("BOT_API_SECRET must be configured before making bot API requests.");
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(new URL(path.replace(/^\//, ""), `${this.baseUrl.replace(/\/$/, "")}/`), {
      headers: { Authorization: `Bearer ${this.secret}`, Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Community API returned HTTP ${response.status}.`);
    return response.json() as Promise<T>;
  }
}
