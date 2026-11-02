import { isIP } from "node:net";
import { JOB_SOURCE_NAMES, JOB_SOURCE_HOSTS } from "../types.ts";
import type { JobSourceName } from "../types.ts";

export interface SourceConfig {
  name: JobSourceName;
  enabled: boolean;
  mode?: "json-feed" | "jsonld" | "smartrecruiters" | "lever";
  companySlugs?: string[];
  feedUrl?: string;
  pageUrls?: string[];
  listingUrls?: string[];
  detailPathPrefixes?: string[];
  allowedHosts?: string[];
  permissionReference?: string;
}

export function isPublicHostname(host: string): boolean {
  return host === host.toLowerCase() && host.length <= 253 && !isIP(host)
    && /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host)
    && !/(?:^|\.)(?:localhost|local|internal|lan|home|test|invalid|example|onion)$/.test(host);
}

export function parseSourceConfigs(input: unknown): SourceConfig[] {
  if (!Array.isArray(input) || input.length > JOB_SOURCE_NAMES.length) throw new Error("Expected a source configuration array");
  const names = new Set<string>();
  return input.map(raw => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Invalid source configuration");
    const value = raw as Record<string, unknown>;
    if (!JOB_SOURCE_NAMES.includes(value.name as JobSourceName) || typeof value.enabled !== "boolean" || names.has(String(value.name))) throw new Error("Invalid or duplicate source name");
    names.add(String(value.name));
    const name = value.name as JobSourceName;
    const mode = value.mode ?? "json-feed";
    if (!["json-feed", "jsonld", "smartrecruiters", "lever"].includes(String(mode))) throw new Error("Invalid collection mode");
    if ((mode === "smartrecruiters" && name !== "SmartRecruiters") || (mode === "lever" && name !== "Lever")) throw new Error("Employer API mode must match its source");
    if (value.permissionReference !== undefined && (typeof value.permissionReference !== "string" || !value.permissionReference.trim() || value.permissionReference.length > 2000)) throw new Error("Invalid permission reference");
    if (value.allowedHosts !== undefined && (!Array.isArray(value.allowedHosts) || !value.allowedHosts.length || value.allowedHosts.some(host => typeof host !== "string" || !isPublicHostname(host)))) throw new Error("Invalid public host allowlist");
    const hosts = value.allowedHosts as string[] | undefined;
    if (value.enabled && (!hosts || !value.permissionReference || (mode === "json-feed" && !value.feedUrl) || (mode === "jsonld" && !value.pageUrls && !value.listingUrls))) throw new Error("Enabled sources require permission, URLs and an explicit host allowlist");
    let companySlugs: string[] | undefined;
    if (value.companySlugs !== undefined) {
      if (!Array.isArray(value.companySlugs) || !value.companySlugs.length || value.companySlugs.length > 5 || value.companySlugs.some(slug => typeof slug !== "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(slug))) throw new Error("Expected 1-5 safe employer company slugs");
      companySlugs = [...new Set(value.companySlugs as string[])];
    }
    if (value.enabled && (mode === "smartrecruiters" || mode === "lever")) {
      const apiHost = mode === "lever" ? "api.lever.co" : "api.smartrecruiters.com";
      if (!companySlugs || !hosts?.includes(apiHost)) throw new Error("Employer API sources require company slugs and their official API host");
    }
    let feedUrl: string | undefined;
    if (value.feedUrl !== undefined) {
      if (typeof value.feedUrl !== "string" || value.feedUrl.length > 2048) throw new Error("Invalid feed URL");
      let url: URL;
      try { url = new URL(value.feedUrl); } catch { throw new Error("Invalid feed URL"); }
      if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash || !isPublicHostname(url.hostname) || !hosts?.includes(url.hostname)) throw new Error("Feed URL must use HTTPS on an exact allowed public host");
      feedUrl = url.href;
    }
    let pageUrls: string[] | undefined;
    if (value.pageUrls !== undefined) {
      if (!Array.isArray(value.pageUrls) || !value.pageUrls.length || value.pageUrls.length > 20) throw new Error("HTML collection requires 1-20 posting URLs");
      pageUrls = value.pageUrls.map(page => {
        if (typeof page !== "string" || page.length > 2048) throw new Error("Invalid posting URL");
        let url: URL;
        try { url = new URL(page); } catch { throw new Error("Invalid posting URL"); }
        if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash || !hosts?.includes(url.hostname) || !JOB_SOURCE_HOSTS[name].includes(url.hostname) || url.pathname === "/") throw new Error("Posting URLs must use the official source host and exact allowlist");
        return url.href;
      });
      if (new Set(pageUrls).size !== pageUrls.length) throw new Error("Duplicate posting URL");
    }
    let detailPathPrefixes: string[] | undefined;
    if (value.detailPathPrefixes !== undefined) {
      if (!Array.isArray(value.detailPathPrefixes) || !value.detailPathPrefixes.length || value.detailPathPrefixes.length > 10 || value.detailPathPrefixes.some(prefix => typeof prefix !== "string" || prefix.length > 200 || !/^\/(?:[a-zA-Z0-9_-]+\/)+$/.test(prefix))) throw new Error("Expected safe non-root posting path prefixes ending in slash");
      detailPathPrefixes = [...new Set(value.detailPathPrefixes as string[])];
    }
    let listingUrls: string[] | undefined;
    if (value.listingUrls !== undefined) {
      if (!Array.isArray(value.listingUrls) || !value.listingUrls.length || value.listingUrls.length > 3 || !detailPathPrefixes) throw new Error("Discovery requires 1-3 listing URLs and detail path prefixes");
      listingUrls = value.listingUrls.map(page => {
        if (typeof page !== "string" || page.length > 2048) throw new Error("Invalid listing URL");
        let url: URL;
        try { url = new URL(page); } catch { throw new Error("Invalid listing URL"); }
        if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash || !hosts?.includes(url.hostname) || !JOB_SOURCE_HOSTS[name].includes(url.hostname)) throw new Error("Listing URLs must use the official source host and exact allowlist");
        return url.href;
      });
      if (new Set(listingUrls).size !== listingUrls.length) throw new Error("Duplicate listing URL");
    }
    return { name, enabled: value.enabled, ...(value.mode !== undefined ? { mode: mode as SourceConfig["mode"] } : {}), ...(companySlugs ? { companySlugs } : {}), ...(feedUrl ? { feedUrl } : {}), ...(pageUrls ? { pageUrls } : {}), ...(listingUrls ? { listingUrls } : {}), ...(detailPathPrefixes ? { detailPathPrefixes } : {}), ...(hosts ? { allowedHosts: [...new Set(hosts)] } : {}), ...(value.permissionReference ? { permissionReference: String(value.permissionReference).trim() } : {}) };
  });
}
