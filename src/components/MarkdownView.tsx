import React from 'react';
import type { ThemeId } from '../types.ts';

interface MarkdownViewProps {
  content: string;
  theme?: ThemeId;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, theme = 'dark' }) => {
  const isNews = theme === 'newspaper';
  const isPink = theme === 'pink';
  const isCats = theme === 'cats';
  const isSpace = theme === 'space';

  // Text color tokens per theme
  const boldClass = isNews
    ? 'text-stone-950 font-bold'
    : isPink
    ? 'text-pink-100 font-bold'
    : isCats
    ? 'text-amber-100 font-bold'
    : isSpace
    ? 'text-cyan-200 font-bold'
    : 'text-white font-semibold';

  const bodyTextClass = isNews
    ? 'text-stone-900 font-serif leading-[1.75] text-[1.05rem]'
    : isPink
    ? 'text-pink-100/95 leading-relaxed text-[0.98rem]'
    : isCats
    ? 'text-amber-100/95 leading-relaxed text-[0.98rem]'
    : isSpace
    ? 'text-indigo-100/95 leading-relaxed text-[0.98rem]'
    : 'text-slate-300 leading-relaxed text-[0.98rem]';

  const codeClass = isNews
    ? 'px-1.5 py-0.5 rounded-none bg-[#ded6c3] text-stone-900 font-mono text-xs border border-stone-700'
    : isPink
    ? 'px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 font-mono text-xs border border-pink-800/60'
    : isCats
    ? 'px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 font-mono text-xs border border-amber-800/60'
    : isSpace
    ? 'px-1.5 py-0.5 rounded bg-indigo-950 text-cyan-300 font-mono text-xs border border-indigo-800/60'
    : 'px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-sm border border-slate-700/60';

  const bulletColor = isNews
    ? 'bg-stone-900'
    : isPink
    ? 'bg-pink-400'
    : isCats
    ? 'bg-amber-400'
    : isSpace
    ? 'bg-cyan-400'
    : 'bg-blue-400';

  // Parse inline styles: bold, italic, inline code
  const renderInline = (text: string): React.ReactNode => {
    const boldParts = text.split(/(\*\*.*?\*\*)/g);

    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        const inner = bPart.slice(2, -2);
        return (
          <strong key={bIdx} className={boldClass}>
            {inner}
          </strong>
        );
      }

      // Inside regular text, handle inline code (`...`)
      const codeParts = bPart.split(/(`.*?`)/g);
      return codeParts.map((cPart, cIdx) => {
        if (cPart.startsWith('`') && cPart.endsWith('`')) {
          return (
            <code key={`${bIdx}-${cIdx}`} className={codeClass}>
              {cPart.slice(1, -1)}
            </code>
          );
        }

        // Inside regular text, handle italic (*...*)
        const italicParts = cPart.split(/(\*[^*]+?\*)/g);
        return italicParts.map((iPart, iIdx) => {
          if (iPart.startsWith('*') && iPart.endsWith('*') && !iPart.startsWith('**')) {
            return (
              <em
                key={`${bIdx}-${cIdx}-${iIdx}`}
                className={isNews ? 'italic text-stone-900' : 'italic opacity-90'}
              >
                {iPart.slice(1, -1)}
              </em>
            );
          }
          return <React.Fragment key={`${bIdx}-${cIdx}-${iIdx}`}>{iPart}</React.Fragment>;
        });
      });
    });
  };

  // Group lines into blocks (headings, lists, paragraphs)
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];

  let currentList: string[] = [];
  let isOrderedList = false;

  const flushList = () => {
    if (currentList.length === 0) return;
    const items = [...currentList];
    const ordered = isOrderedList;
    currentList = [];

    if (ordered) {
      blocks.push(
        <ol
          key={`ol-${blocks.length}`}
          className={`my-3 pl-5 space-y-2 list-decimal ${
            isNews ? 'text-stone-900' : bodyTextClass
          }`}
        >
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    } else {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="my-3 space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className={`flex items-start gap-2.5 ${bodyTextClass}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${bulletColor} mt-2 flex-shrink-0`} />
              <div className="flex-1">{renderInline(item)}</div>
            </li>
          ))}
        </ul>
      );
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Check for Heading 2 (## ...)
    if (trimmed.startsWith('## ')) {
      flushList();
      const headingText = trimmed.replace(/^##\s+/, '');
      const isKeyTakeaway = headingText.toLowerCase().includes('takeaway');
      const isAnalogy = headingText.toLowerCase().includes('analogy');

      // Theme-specific heading classes
      let headingContainer = 'mt-6 mb-3 pt-2';
      let titleStyle = 'text-lg md:text-xl font-bold tracking-tight flex items-center gap-2';

      if (isNews) {
        headingContainer = 'mt-6 mb-3 pt-2 border-b-2 border-stone-800 pb-1';
        titleStyle = 'text-xl font-bold font-serif uppercase tracking-normal text-stone-950 flex items-center gap-2';
      } else if (isPink) {
        titleStyle += isKeyTakeaway
          ? ' text-pink-300'
          : isAnalogy
          ? ' text-rose-300'
          : ' text-pink-100';
      } else if (isCats) {
        titleStyle += isKeyTakeaway
          ? ' text-amber-300'
          : isAnalogy
          ? ' text-amber-200'
          : ' text-amber-100';
      } else if (isSpace) {
        titleStyle += isKeyTakeaway
          ? ' text-cyan-300'
          : isAnalogy
          ? ' text-purple-300'
          : ' text-indigo-100';
      } else {
        titleStyle += isKeyTakeaway
          ? ' text-amber-300'
          : isAnalogy
          ? ' text-emerald-300'
          : ' text-white';
      }

      blocks.push(
        <div key={`h2-${blocks.length}`} className={headingContainer}>
          <h2 className={titleStyle}>
            {isKeyTakeaway && (
              <span
                className={`text-xs uppercase px-2 py-0.5 rounded font-mono ${
                  isNews
                    ? 'bg-stone-900 text-white'
                    : isPink
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                    : isCats
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : isSpace
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                }`}
              >
                {isNews ? 'KEY DISPATCH' : isCats ? '🐾 PURR-NOTE' : isPink ? '♡ KEY NOTE' : 'KEY NOTE'}
              </span>
            )}
            {renderInline(headingText)}
          </h2>
        </div>
      );
      continue;
    }

    // Check for Heading 3 (### ...)
    if (trimmed.startsWith('### ')) {
      flushList();
      const headingText = trimmed.replace(/^###\s+/, '');
      blocks.push(
        <h3
          key={`h3-${blocks.length}`}
          className={`text-base md:text-lg font-semibold mt-4 mb-2 ${
            isNews
              ? 'font-serif text-stone-900 italic font-bold'
              : isPink
              ? 'text-pink-200'
              : isCats
              ? 'text-amber-200'
              : isSpace
              ? 'text-indigo-200'
              : 'text-slate-100'
          }`}
        >
          {renderInline(headingText)}
        </h3>
      );
      continue;
    }

    // Check for Heading 1 (# ...)
    if (trimmed.startsWith('# ')) {
      flushList();
      const headingText = trimmed.replace(/^#\s+/, '');
      blocks.push(
        <h1
          key={`h1-${blocks.length}`}
          className={`text-xl md:text-2xl font-bold mt-6 mb-3 pb-2 ${
            isNews
              ? 'font-serif text-stone-950 uppercase border-b-4 border-double border-stone-800'
              : isPink
              ? 'text-pink-100 border-b border-pink-900/40'
              : isCats
              ? 'text-amber-100 border-b border-amber-900/40'
              : isSpace
              ? 'text-indigo-100 border-b border-indigo-900/40'
              : 'text-white border-b border-slate-800'
          }`}
        >
          {renderInline(headingText)}
        </h1>
      );
      continue;
    }

    // Check for bullet list item (- ... or * ...)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (isOrderedList) flushList();
      isOrderedList = false;
      currentList.push(trimmed.slice(2));
      continue;
    }

    // Check for numbered list (1. ... 2. ...)
    const numMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numMatch) {
      if (!isOrderedList && currentList.length > 0) flushList();
      isOrderedList = true;
      currentList.push(numMatch[1]);
      continue;
    }

    // Regular paragraph
    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className={`my-2.5 ${bodyTextClass}`}>
        {renderInline(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{blocks}</div>;
};
