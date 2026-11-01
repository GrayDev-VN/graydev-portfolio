// Configure the canonical production origin. Never guess a production domain.
export function siteOrigin(): string | undefined {
  const raw = process.env.SITE_URL?.trim() || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
  if (!raw) return undefined;
  const url = new URL(raw);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("SITE_URL must be an HTTP(S) origin without a path, credentials, query or fragment.");
  return url.origin;
}
export function canonical(path: string) {
  const origin = siteOrigin();
  return origin ? `${origin}${path.endsWith("/") ? path : `${path}/`}` : undefined;
}
