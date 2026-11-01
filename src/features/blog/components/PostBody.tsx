import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import CodeBlock from "./CodeBlock";
import { remarkHeadingIds } from "../markdown";
import { formatWithAmpersand } from "@/components/CleanAmpersand";

function codeText(node: { value?: string; children?: Parameters<typeof codeText>[0][] }): string {
  return node.value ?? node.children?.map(codeText).join("") ?? "";
}

function Heading({ level, id, children }: ComponentPropsWithoutRef<"h2"> & { level: 2 | 3 }) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id} className={`scroll-mt-28 font-[Space_Grotesk] font-bold text-white group ${level === 2 ? "mt-12 mb-4 text-2xl sm:text-3xl border-b border-[#1e293b] pb-3" : "mt-8 mb-3 text-xl"}`}>
      {formatWithAmpersand(children)}
      <a href={`#${id}`} className="ml-2 text-base text-indigo-400 opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Link to section">#</a>
    </Tag>
  );
}

// Server Component: Markdown parsing stays out of the client bundle.
export default function PostBody({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkHeadingIds]}
      rehypePlugins={[[rehypeHighlight, { detect: false, plainText: ["text", "txt", "plaintext"] }]]}
      components={{
        pre: ({ node, children }) => {
          const code = node?.children.find((child) => child.type === "element" && child.tagName === "code");
          const classes = code?.type === "element" ? code.properties.className : [];
          const language = Array.isArray(classes) ? String(classes.find((name) => String(name).startsWith("language-")) ?? "").replace(/^language-/, "") : "";
          return <CodeBlock language={language} text={code ? codeText(code) : ""}>{children}</CodeBlock>;
        },
        h2: ({ id, children }) => <Heading level={2} id={id}>{children}</Heading>,
        h3: ({ id, children }) => <Heading level={3} id={id}>{children}</Heading>,
        table: ({ children }) => <div className="my-8 overflow-x-auto"><table className="w-full border-collapse text-sm [&_th]:border [&_th]:border-slate-700 [&_th]:bg-slate-900 [&_th]:p-3 [&_th]:text-left [&_td]:border [&_td]:border-slate-700 [&_td]:p-3">{children}</table></div>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
