import React, { useState } from 'react';
import { Share2, Copy, Check, Download, Smartphone, Globe, X } from 'lucide-react';
import type { ThemeId } from '../types.ts';
import { THEMES } from '../themes.ts';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeId;
  deferredPrompt: any;
  onInstall: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  theme,
  deferredPrompt,
  onInstall,
}) => {
  const [copied, setCopied] = useState(false);
  const isNews = theme === 'newspaper';
  const themeConfig = THEMES[theme];

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Explain Simply',
          text: 'Check out Explain Simply — understand difficult topics easily at your level!',
          url: currentUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-md p-5 space-y-4 shadow-2xl transition-all ${
          isNews
            ? 'bg-[#ede6d6] border-2 border-stone-900 shadow-[6px_6px_0px_#292524] font-serif text-stone-900 rounded-none'
            : themeConfig.cardBg +
              ' border ' +
              themeConfig.cardBorder +
              ' ' +
              themeConfig.cornerStyle +
              ' text-slate-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-current/20">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            <h3
              className={`font-bold text-base ${
                isNews ? 'font-serif uppercase text-stone-950 text-lg' : ''
              }`}
            >
              {isNews ? 'DISPATCH & SHARE' : 'Share & Install App'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/10 opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Share Link */}
        <div className="space-y-2">
          <span
            className={`text-xs font-semibold uppercase tracking-wider block ${
              isNews ? 'font-serif text-stone-800' : 'text-slate-400'
            }`}
          >
            Share with students or friends
          </span>

          <div
            className={`flex items-center gap-2 p-2 rounded-xl border text-xs ${
              isNews
                ? 'bg-[#fcfaf4] border-2 border-stone-800 rounded-none font-serif'
                : 'bg-black/30 border-white/10'
            }`}
          >
            <Globe className="w-4 h-4 opacity-50 flex-shrink-0" />
            <span className="truncate flex-1 font-mono text-[0.75rem] opacity-90">
              {currentUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-1.5 font-semibold text-xs flex items-center gap-1 transition-all ${
                isNews
                  ? 'bg-stone-900 text-white rounded-none shadow-[1px_1px_0px_#292524]'
                  : themeConfig.buttonPrimary + ' ' + themeConfig.cornerStyle
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className={`w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isNews
                  ? 'bg-[#e4ddcc] hover:bg-[#d8d0be] border-2 border-stone-800 text-stone-900 rounded-none shadow-[2px_2px_0px_#292524]'
                  : themeConfig.buttonSecondary + ' ' + themeConfig.cornerStyle
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share via WhatsApp, Messages, or Social</span>
            </button>
          )}

          <p className="text-[0.72rem] opacity-75 leading-relaxed pt-0.5">
            💡 <em>Catatan:</em> Pastikan tombol <strong>Share</strong> di pojok kanan atas AI Studio sudah disetel ke <strong>Public / Anyone with the link</strong> agar orang lain bisa langsung membuka tanpa error 403.
          </p>
        </div>

        {/* Section 2: Install as a Phone App (PWA) */}
        <div
          className={`p-3.5 space-y-2.5 border text-xs ${
            isNews
              ? 'bg-[#f4efe4] border-2 border-stone-800 rounded-none'
              : 'bg-white/5 border-white/10 rounded-2xl'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Install on Your Phone or PC</span>
          </div>

          <p className="opacity-80 text-[0.78rem] leading-relaxed">
            You can add <strong>Explain Simply</strong> directly to your home screen. It opens like
            a native app without the browser address bar!
          </p>

          {/* If 1-tap browser install is supported */}
          {deferredPrompt && (
            <button
              type="button"
              onClick={onInstall}
              className={`w-full py-2.5 font-bold flex items-center justify-center gap-2 transition-all ${
                isNews
                  ? 'bg-stone-900 text-white rounded-none shadow-[2px_2px_0px_#292524]'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-emerald-500/20'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen (1-Tap)</span>
            </button>
          )}

          {/* Manual install instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[0.72rem]">
            <div
              className={`p-2 border ${
                isNews ? 'bg-[#ede6d6] border-stone-800 rounded-none' : 'bg-black/20 border-white/5 rounded-xl'
              }`}
            >
              <strong className="block mb-0.5 text-emerald-400">Android (Chrome):</strong>
              Tap the <strong>⋮ menu</strong> at top right &rarr; tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
            </div>
            <div
              className={`p-2 border ${
                isNews ? 'bg-[#ede6d6] border-stone-800 rounded-none' : 'bg-black/20 border-white/5 rounded-xl'
              }`}
            >
              <strong className="block mb-0.5 text-blue-400">iPhone (Safari):</strong>
              Tap the <strong>Share</strong> button (box with arrow) &rarr; scroll down &amp; tap <strong>"Add to Home Screen"</strong>.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`w-full py-2 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity ${
            isNews ? 'font-serif underline' : ''
          }`}
        >
          Done
        </button>
      </div>
    </div>
  );
};
