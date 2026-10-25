import React from "react";

/**
 * Renders a standard, clean ampersand glyph using Plus Jakarta Sans
 * to avoid Space Grotesk and JetBrains Mono stylized ampersands.
 */
export function CleanAmpersand({ className = "" }: { className?: string }) {
  return (
    <span className={`font-[Plus_Jakarta_Sans] inline-block font-bold ${className}`}>
      &amp;
    </span>
  );
}

/**
 * Automatically inspects a React node or string and replaces any '&'
 * with a CleanAmpersand component.
 */
export function formatWithAmpersand(node: React.ReactNode): React.ReactNode {
  if (!node) return node;

  if (typeof node === "string") {
    if (!node.includes("&")) return node;
    const parts = node.split("&");
    return parts.reduce<React.ReactNode[]>((acc, part, index) => {
      if (index > 0) {
        acc.push(
          <span key={`amp-${index}`} className="font-[Plus_Jakarta_Sans] inline-block font-bold">
            &amp;
          </span>
        );
      }
      acc.push(part);
      return acc;
    }, []);
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <React.Fragment key={i}>{formatWithAmpersand(child)}</React.Fragment>
    ));
  }

  if (React.isValidElement(node) && node.props && (node.props as { children?: React.ReactNode }).children) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return React.cloneElement(element, undefined, formatWithAmpersand(element.props.children));
  }

  return node;
}
