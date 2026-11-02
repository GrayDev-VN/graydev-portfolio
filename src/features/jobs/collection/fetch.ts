import { lookup } from "node:dns";
import { request } from "node:https";
import { isIP } from "node:net";
import type { LookupFunction } from "node:net";

export const MAX_FEED_BYTES = 10 * 1024 * 1024;
export const JOBS_CRAWLER_AGENT = "GrayDevJobsBot";
export class FeedFetchError extends Error {
  readonly retryable: boolean;
  constructor(message: string, retryable = false) { super(message); this.name = "FeedFetchError"; this.retryable = retryable; }
}

// Conservative global-unicast policy; never allow loopback, LAN, documentation,
// transition, link-local, multicast or mapped IPv4 routes to internal services.
export function isPublicAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) {
    const [a, b, c] = address.split(".").map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && (b === 0 || b === 168 || (b === 88 && c === 99)))
      || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100)))
      || (a === 203 && b === 0 && c === 113));
  }
  if (family !== 6) return false;
  const parts = address.toLowerCase().split(":");
  const first = parseInt(parts[0], 16);
  if (!Number.isFinite(first) || first < 0x2000 || first >= 0x3fff || first === 0x2002) return false;
  // Restrict special-purpose 2001::/23, including Teredo and benchmarking.
  if (first === 0x2001 && (parseInt(parts[1] || "0", 16) < 0x200 || parseInt(parts[1], 16) === 0xdb8)) return false;
  return true;
}

type AddressResolver = (hostname: string, callback: (error: NodeJS.ErrnoException | null, addresses: { address: string; family: number }[]) => void) => void;
export function createPublicLookup(resolveAddresses: AddressResolver = (hostname, callback) => lookup(hostname, { all: true, verbatim: true }, callback)): LookupFunction {
  return (hostname, options, callback) => {
    resolveAddresses(hostname, (error, addresses) => {
    if (error) { callback(new FeedFetchError("Feed DNS lookup failed", true), "", 4); return; }
    if (!addresses.length || addresses.some(item => !isPublicAddress(item.address))) { callback(new FeedFetchError("Feed DNS resolved to a blocked address"), "", 4); return; }
    // Return only these validated answers to this very connection: no second DNS lookup.
    if (options.all) callback(null, addresses);
    else callback(null, addresses[0].address, addresses[0].family);
    });
  };
}
export const publicLookup = createPublicLookup();

export const secureFeedFetch: typeof fetch = async (input, init) => {
  const url = new URL(String(input));
  const accept = new Headers(init?.headers).get("accept") ?? "application/json";
  if (!["application/json", "text/html", "text/plain"].includes(accept)) throw new FeedFetchError("Unsupported response type");
  return new Promise<Response>((resolve, reject) => {
    const req = request(url, {
      method: "GET", agent: false, lookup: publicLookup, signal: init?.signal ?? undefined,
      headers: { accept, "user-agent": `${JOBS_CRAWLER_AGENT}/1.0 (authorized job collector)`, "accept-encoding": "identity" },
    }, response => {
      const headers = new Headers();
      for (const [key, value] of Object.entries(response.headers)) if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      const status = response.statusCode ?? 502;
      if (status < 200 || status >= 300) { response.destroy(); resolve(new Response(null, { status, headers })); return; }
      if (!matchesContentType(headers.get("content-type"), accept)) { response.destroy(); reject(new FeedFetchError("Unexpected response content type")); return; }
      if (headers.has("content-encoding") && headers.get("content-encoding") !== "identity") { response.destroy(); reject(new FeedFetchError("Compressed feeds are not supported")); return; }
      if (Number(headers.get("content-length")) > MAX_FEED_BYTES) { response.destroy(); reject(new FeedFetchError("Feed exceeds the size limit")); return; }
      let bytes = 0;
      const chunks: Buffer[] = [];
      response.on("data", (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > MAX_FEED_BYTES) { response.destroy(new FeedFetchError("Feed exceeds the size limit")); return; }
        chunks.push(chunk);
      });
      response.on("error", error => reject(error instanceof FeedFetchError ? error : new FeedFetchError("Feed connection failed", true)));
      response.on("end", () => resolve(new Response(status === 204 || status === 205 ? null : new Uint8Array(Buffer.concat(chunks)), { status, headers })));
    });
    req.on("error", error => reject(error instanceof FeedFetchError ? error : new FeedFetchError("Feed request failed", true)));
    req.end();
  });
};

function matchesContentType(value: string | null, expected: string): boolean { return (value ?? "").split(";", 1)[0].trim().toLowerCase() === expected; }

export async function readBoundedText(response: Response, contentType: "application/json" | "text/html" | "text/plain"): Promise<string> {
  if (!matchesContentType(response.headers.get("content-type"), contentType)) throw new FeedFetchError("Unexpected response content type");
  if (Number(response.headers.get("content-length")) > MAX_FEED_BYTES) { await response.body?.cancel(); throw new FeedFetchError("Feed exceeds the size limit"); }
  const reader = response.body?.getReader();
  if (!reader) throw new FeedFetchError("Feed body is empty");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_FEED_BYTES) { await reader.cancel(); throw new FeedFetchError("Feed exceeds the size limit"); }
      chunks.push(value);
    }
    const body = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
    try { return new TextDecoder("utf-8", { fatal: true }).decode(body); } catch { throw new FeedFetchError("Response contains invalid UTF-8"); }
  } finally { reader.releaseLock(); }
}

export async function readFeedJson(response: Response): Promise<unknown> {
  const text = await readBoundedText(response, "application/json");
  try { return JSON.parse(text); } catch { throw new FeedFetchError("Feed contains invalid JSON"); }
}
