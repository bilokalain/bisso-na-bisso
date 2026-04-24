import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { markdown: string };

/**
 * Renders trusted, admin-authored Markdown with Tailwind prose styling. The
 * content comes from the `/admin/guides` editor — we don't accept
 * user-submitted HTML, so we don't need a sanitizer here.
 */
export function GuideContent({ markdown }: Props) {
  return (
    <div className="prose prose-neutral max-w-none font-sans text-lg leading-relaxed text-ink prose-headings:font-display prose-headings:tracking-tight prose-headings:text-ink prose-a:text-forest prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-forest-deep prose-strong:text-ink prose-ul:text-ink prose-ol:text-ink prose-li:marker:text-ink-muted prose-blockquote:border-l-forest prose-blockquote:bg-forest-soft prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:not-italic prose-code:rounded prose-code:bg-sand prose-code:px-1 prose-code:py-0.5 prose-code:text-ink prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
