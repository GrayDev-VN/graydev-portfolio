import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root } from "mdast";
import type { Plugin } from "unified";
import type { TocItem } from "./types.ts";

interface MarkdownNode {
  type: string;
  value?: string;
  alt?: string | null;
  depth?: number;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> };
}

function plainText(node: MarkdownNode): string {
  return node.value ?? node.alt ?? node.children?.map(plainText).join(" ") ?? "";
}

function headingText(node: MarkdownNode): string {
  return node.value ?? node.alt ?? node.children?.map(headingText).join("") ?? "";
}

function headingSlug(text: string): string {
  return text.replace(/[đĐ]/g, "d").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") || "section";
}

// Shared by the TOC and renderer; code fences do not create TOC entries.
export function annotateHeadings(tree: MarkdownNode): TocItem[] {
  const headings: TocItem[] = [];
  const used = new Set<string>();
  function visit(node: MarkdownNode) {
    if (node.type === "heading") {
      const text = headingText(node);
      const base = headingSlug(text);
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
      if (node.depth === 2 || node.depth === 3) headings.push({ id, text, level: node.depth });
    }
    node.children?.forEach(visit);
  }
  visit(tree);
  return headings;
}

export const remarkHeadingIds: Plugin<[], Root> = () => (tree) => { annotateHeadings(tree); };

export function analyzeMarkdown(content: string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content);
  const headings = annotateHeadings(tree);
  const words = plainText(tree).match(/\S+/g)?.length ?? 0;
  return { headings, readingMinutes: Math.max(1, Math.ceil(words / 200)) };
}
