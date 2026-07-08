import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

/** Renders assistant answers with markdown support (bullets, code, tables)
 * using only the app's existing type scale and palette — no new colors or
 * font sizes are introduced. */
export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold text-[#18181B]">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => (
          <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--sb-accent)] underline underline-offset-2"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-3 border-l-2 border-[#E9E9EE] pl-3 text-[#52525B] last:mb-0">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const isBlock = Boolean(className);
          if (isBlock) {
            return (
              <code className="block overflow-x-auto rounded-[10px] bg-[#18181B] px-3.5 py-3 font-mono text-[13px] leading-relaxed text-[#F4F4F5]">
                {children}
              </code>
            );
          }
          return (
            <code className="rounded-[6px] bg-[#F4F4F5] px-1.5 py-0.5 font-mono text-[13px] text-[#27272A]">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="mb-3 last:mb-0">{children}</pre>,
        table: ({ children }) => (
          <div className="mb-3 overflow-x-auto last:mb-0">
            <table className="w-full border-collapse text-left text-[13.5px]">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b border-[#E9E9EE]">{children}</thead>,
        th: ({ children }) => (
          <th className="px-3 py-2 font-semibold text-[#18181B]">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-t border-[#F2F2F5] px-3 py-2 text-[#3F3F46]">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
