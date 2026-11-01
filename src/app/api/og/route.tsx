import { ImageResponse } from "next/og";
import { getBlogPost } from "@/lib/blog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return new Response("Not found", { status: 404 });
  const post = await getBlogPost(slug);
  if (!post) return new Response("Not found", { status: 404 });
  const vi = searchParams.get("locale") === "vi";
  const title = vi ? post.titleVi : post.title;
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#080c15", padding: "64px", color: "#f8fafc", borderLeft: "12px solid #818cf8" }}>
    <div style={{ display: "flex", color: "#a5b4fc", fontSize: 26 }}>{vi ? post.categoryVi : post.category}</div>
    <div style={{ display: "flex", fontSize: title.length > 95 ? 45 : 56, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
    <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: 24 }}><span>Gray Nguyen</span><span>{post.publishedAt} · {vi ? post.readingTimeVi : post.readingTime}</span></div>
  </div>, { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
