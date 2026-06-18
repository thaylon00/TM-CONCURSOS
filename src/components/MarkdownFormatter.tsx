import React from "react";

interface MarkdownFormatterProps {
  text: string;
}

export default function MarkdownFormatter({ text }: MarkdownFormatterProps) {
  if (!text) return null;

  // Split content by paragraphs/double line-breaks
  const blocks = text.split(/\n\s*\n/);

  const renderInlineStyles = (content: string) => {
    // Regex for bold text: **text** -> strong
    // Regex for italic text: *text* -> em
    // Regex for inline code: `code` -> code markup
    let parsed = content;
    
    // Bold
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic
    parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Inline code
    parsed = parsed.replace(/`(.*?)`/g, "<code class='font-mono bg-slate-100 text-slate-800 px-1 rounded text-sm'>$1</code>");

    return <span dangerouslySetInnerHTML={{ __html: parsed }} />;
  };

  return (
    <div className="booklet-markdown font-serif text-slate-800 leading-relaxed text-lg">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Headers
        if (trimmed.startsWith("### ")) {
          const headerText = trimmed.replace("### ", "");
          return (
            <h3 key={idx} className="font-sans font-semibold text-lg text-slate-800 mt-6 mb-2">
              {renderInlineStyles(headerText)}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          const headerText = trimmed.replace("## ", "");
          return (
            <h2 key={idx} className="font-sans font-bold text-xl text-slate-900 mt-8 mb-3 border-b border-slate-200 pb-1">
              {renderInlineStyles(headerText)}
            </h2>
          );
        }
        if (trimmed.startsWith("h1 ") || trimmed.startsWith("# ")) {
          const headerText = trimmed.replace(/^#\s+|^h1\s+/, "");
          return (
            <h1 key={idx} className="font-sans font-black text-2xl text-slate-900 mt-10 mb-4 border-l-4 border-blue-600 pl-3">
              {renderInlineStyles(headerText)}
            </h1>
          );
        }

        // Check for specific callout blocks
        const isPegadinha = trimmed.toLowerCase().startsWith("🚨 atenção") || 
                            trimmed.toLowerCase().startsWith("⚠️ pegadinha") ||
                            trimmed.toLowerCase().startsWith("🚨 cuidado") ||
                            trimmed.toLowerCase().startsWith("erro comum");
        
        const isMacete = trimmed.toLowerCase().startsWith("💡 macete") || 
                         trimmed.toLowerCase().startsWith("💡 memorização") ||
                         trimmed.toLowerCase().startsWith("📌 bizu") ||
                         trimmed.toLowerCase().startsWith("dica:");

        const isExemplo = trimmed.toLowerCase().startsWith("💡 exemplo") ||
                          trimmed.toLowerCase().startsWith("💡 caso");

        const isCasoReal = trimmed.toLowerCase().startsWith("⚠️ caso") ||
                           trimmed.toLowerCase().startsWith("⚠️ recomendação");

        const isBlockquote = trimmed.startsWith("> ");

        if (isPegadinha) {
          return (
            <div key={idx} className="callout-pegadinha border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg my-4 font-sans text-base shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  {renderInlineStyles(trimmed)}
                </div>
              </div>
            </div>
          );
        }

        if (isMacete) {
          return (
            <div key={idx} className="callout-mnemonico border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg my-4 font-sans text-base shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-xl">💡</span>
                <div>
                  {renderInlineStyles(trimmed)}
                </div>
              </div>
            </div>
          );
        }

        if (isExemplo) {
          return (
            <div key={idx} className="callout-exemplo border-l-4 border-blue-500 bg-blue-50/60 p-4 rounded-r-lg my-4 font-sans text-base shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-xl">💡</span>
                <div>
                  {renderInlineStyles(trimmed)}
                </div>
              </div>
            </div>
          );
        }

        if (isCasoReal) {
          return (
            <div key={idx} className="callout-casoreal border-l-4 border-amber-500 bg-amber-50/60 p-4 rounded-r-lg my-4 font-sans text-base shadow-sm">
              <div className="flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  {renderInlineStyles(trimmed)}
                </div>
              </div>
            </div>
          );
        }

        if (isBlockquote) {
          const cleanText = trimmed.replace(/^>\s+/, "");
          return (
            <blockquote key={idx} className="border-l-4 border-orange-500 bg-orange-50/50 p-3 italic my-4 rounded-r text-base text-slate-700">
              {renderInlineStyles(cleanText)}
            </blockquote>
          );
        }

        // Bullet lists
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const items = trimmed.split(/\n[*|-]\s+/).map(item => item.replace(/^[*|-]\s+/, ""));
          return (
            <ul key={idx} className="list-disc list-inside space-y-1 mb-4 text-base pl-2 font-sans text-slate-700">
              {items.map((li, liIdx) => (
                <li key={liIdx} className="leading-relaxed">
                  {renderInlineStyles(li)}
                </li>
              ))}
            </ul>
          );
        }

        // Ordered/numbered lists
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split(/\n\d+\.\s+/).map((item, id) => item.replace(/^\d+\.\s+/, ""));
          return (
            <ol key={idx} className="list-decimal list-inside space-y-1 mb-4 text-base pl-2 font-sans text-slate-700">
              {items.map((li, liIdx) => (
                <li key={liIdx} className="leading-relaxed">
                  {renderInlineStyles(li)}
                </li>
              ))}
            </ol>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="mb-4 text-slate-700 leading-relaxed font-serif text-base md:text-lg">
            {renderInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
