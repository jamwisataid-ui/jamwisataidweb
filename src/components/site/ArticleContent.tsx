import type { ReactNode } from "react";

type Node = { type?: string; text?: string; attrs?: Record<string, unknown>; marks?: Array<{ type?: string }>; content?: Node[] };

function renderNode(node: Node, key: number | string): ReactNode {
  if (node.type === "text") {
    let content: ReactNode = node.text ?? "";
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") content = <strong>{content}</strong>;
      if (mark.type === "italic") content = <em>{content}</em>;
      if (mark.type === "code") content = <code>{content}</code>;
    }
    return <span key={key}>{content}</span>;
  }
  const children = node.content?.map((child, index) => renderNode(child, `${key}-${index}`));
  if (node.type === "heading") { const level = Number(node.attrs?.level ?? 2); return level === 3 ? <h3 key={key}>{children}</h3> : <h2 key={key}>{children}</h2>; }
  if (node.type === "bulletList") return <ul key={key}>{children}</ul>;
  if (node.type === "orderedList") return <ol key={key}>{children}</ol>;
  if (node.type === "listItem") return <li key={key}>{children}</li>;
  if (node.type === "blockquote") return <blockquote key={key}>{children}</blockquote>;
  if (node.type === "hardBreak") return <br key={key} />;
  return <p key={key}>{children}</p>;
}

export function ArticleContent({ document }: { document: Record<string, unknown> }) {
  const root = document as Node;
  return <div className="article-content">{root.content?.map((node, index) => renderNode(node, index))}</div>;
}
