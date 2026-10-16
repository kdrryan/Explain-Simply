/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  RotateCcw,
  AlertTriangle,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Heart,
  Cat,
  Rocket,
  Newspaper,
  Share2,
} from 'lucide-react';
import { MarkdownView } from './components/MarkdownView.tsx';
import { ThemeSelector } from './components/ThemeSelector.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { THEMES } from './themes.ts';
import type { ExplanationLevel, AppState, ExplanationResult, ApiStatus, ExampleTopic, ThemeId } from './types.ts';

const LEVEL_DESCRIPTIONS: Record<
  ExplanationLevel,
  { title: string; subtitle: string; label: string; badge: string }
> = {
  simple: {
    title: "Explain like I'm 10",
    subtitle: 'Jawaban super simple, singkat & to-the-point (tanpa paragraf panjang)',
    label: "Explain like I'm 10",
    badge: "EXPLAIN LIKE I'M 10",
  },
  intermediate: {
    title: "Explain like I'm a student",
    subtitle: 'Penjelasan diperluas dengan analogi umum, logika & contoh nyata',
    label: "Explain like I'm a student",
    badge: "EXPLAIN LIKE A STUDENT",
  },
  detailed: {
    title: "Explain like I'm a professor",
    subtitle: 'Analisis teliti, mendalam, akademis & komprehensif mengupas prinsip inti',
    label: "Explain like I'm a professor",
    badge: "EXPLAIN LIKE A PROFESSOR",
  },
};

const THEME_PILL_ICONS: Record<ThemeId, React.ComponentType<{ className?: string }>> = {
  dark: Sparkles,
  pink: Heart,
  cats: Cat,
  space: Rocket,
  newspaper: Newspaper,
};

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('explain_simply_theme');
      if (saved && saved in THEMES) return saved as ThemeId;
    } catch {
      // ignore
    }
    return 'dark';
  });

  const [question, setQuestion] = useState('');
  const [level, setLevel] = useState<ExplanationLevel>('simple');
  const [appState, setAppState] = useState<AppState>('empty');
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMissingKey, setIsMissingKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const currentThemeConfig = THEMES[theme];
  const isNews = theme === 'newspaper';
  const isPink = theme === 'pink';
  const isCats = theme === 'cats';
  const isSpace = theme === 'space';

  // Persist theme & update body classes
  useEffect(() => {
    try {
      localStorage.setItem('explain_simply_theme', theme);
    } catch {
      // ignore
    }

    if (isNews) {
      document.body.className = 'bg-[#f4efe4] text-stone-900 min-h-screen antialiased';
    } else if (isPink) {
      document.body.className = 'bg-[#1c0f18] text-pink-50 min-h-screen antialiased';
    } else if (isCats) {
      document.body.className = 'bg-[#18120e] text-amber-50 min-h-screen antialiased';
    } else if (isSpace) {
      document.body.className = 'bg-[#060814] text-indigo-50 min-h-screen antialiased';
    } else {
      document.body.className = 'bg-[#090d16] text-[#e2e8f0] min-h-screen antialiased';
    }
  }, [theme, isNews, isPink, isCats, isSpace]);

  // Check initial API status
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data: ApiStatus) => {
        setApiStatus(data);
        if (!data.configured) {
          setIsMissingKey(true);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch server status:', err);
      });

    // PWA beforeinstallprompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsShareModalOpen(false);
      }
    } catch {
      // ignore
    }
  };

  const handleSelectTheme = (newTheme: ThemeId) => {
    setTheme(newTheme);
  };

  const handleExplain = async (targetQuestion?: string, targetLevel?: ExplanationLevel) => {
    const q = (targetQuestion ?? question).trim();
    const l = targetLevel ?? level;

    if (!q) {
      setErrorMessage('Please type a question or choose an example topic.');
      setAppState('error');
      textareaRef.current?.focus();
      return;
    }

    setAppState('loading');
    setErrorMessage('');
    setIsMissingKey(false);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, level: l }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'MISSING_API_KEY' || response.status === 503) {
          setIsMissingKey(true);
        }
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      setResult({
        explanation: data.explanation,
        level: data.level || l,
        question: data.question || q,
        timestamp: Date.now(),
      });
      setAppState('result');

      // On mobile, smoothly scroll down toward the answer
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong while generating the explanation.');
      setAppState('error');
    }
  };

  const handleClear = () => {
    setQuestion('');
    setResult(null);
    setAppState('empty');
    setErrorMessage('');
    setIsMissingKey(false);
    textareaRef.current?.focus();
  };

  const handleSelectExample = (ex: ExampleTopic) => {
    setQuestion(ex.question);
    handleExplain(ex.question, level);
  };

  const handleCopy = async () => {
    if (!result?.explanation) return;
    try {
      await navigator.clipboard.writeText(
        `Question: ${result.question}\n\nExplanation (${result.level.toUpperCase()}):\n\n${result.explanation}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const switchLevelAndReExplain = (newLevel: ExplanationLevel) => {
    setLevel(newLevel);
    if (result?.question) {
      handleExplain(result.question, newLevel);
    }
  };

  return (
    <div
      className={`min-h-screen ${currentThemeConfig.pageBg} ${currentThemeConfig.fontClass} flex flex-col transition-colors duration-300`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-20 transition-colors duration-300 ${currentThemeConfig.headerBg} ${
          isNews ? 'border-b-2 border-stone-800' : 'border-b'
        }`}
      >
        {/* Special Newspaper Masthead Banner */}
        {isNews && (
          <div className="border-b border-stone-800/60 bg-[#e4ddcc] px-4 py-1 text-[0.68rem] font-serif uppercase tracking-wider text-stone-700 flex justify-between items-center max-w-2xl mx-auto">
            <span>MORNING EDITION · VOL. LXXIV</span>
            <span>WEATHER: OPTIMAL FOR STUDYING</span>
            <span>PRICE: FREE</span>
          </div>
        )}

        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo / Header Branding */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 flex items-center justify-center transition-transform hover:scale-105 ${
                isNews
                  ? 'border-2 border-stone-900 bg-stone-900 text-amber-50 shadow-[1px_1px_0px_#292524]'
                  : isPink
                  ? 'rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-300'
                  : isCats
                  ? 'rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  : isSpace
                  ? 'rounded-2xl bg-indigo-500/20 border border-cyan-500/40 text-cyan-300'
                  : 'rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400'
              }`}
            >
              {isCats ? (
                <Cat className="w-5 h-5" />
              ) : isPink ? (
                <Heart className="w-5 h-5 fill-pink-400/30" />
              ) : isSpace ? (
                <Rocket className="w-5 h-5" />
              ) : isNews ? (
                <Newspaper className="w-5 h-5" />
              ) : (
                <BookOpen className="w-5 h-5" />
              )}
            </div>

            <div>
              <h1
                className={`text-base font-bold tracking-tight leading-tight flex items-center gap-1.5 ${
                  isNews
                    ? 'font-serif text-lg uppercase tracking-wider text-stone-950 font-black'
                    : currentThemeConfig.textPrimary
                }`}
              >
                <span>{isNews ? 'THE DAILY EXPLAINER' : 'Explain Simply'}</span>
                {isCats && <span className="text-xs">🐾</span>}
                {isPink && <span className="text-xs text-pink-400">♡</span>}
                {isSpace && <span className="text-xs text-cyan-400">✧</span>}
              </h1>
            </div>
          </div>

          {/* Right Header Controls: Info + Status */}
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className={`text-xs px-2.5 py-1.5 flex items-center gap-1 transition-colors min-h-[36px] ${
                isNews
                  ? 'border-2 border-stone-800 bg-[#ede6d6] hover:bg-[#e4ddcc] text-stone-900 shadow-[1px_1px_0px_#292524]'
                  : currentThemeConfig.buttonSecondary + ' ' + currentThemeConfig.cornerStyle
              }`}
              title="Share or Install App"
            >
              <Share2 className="w-3.5 h-3.5 opacity-80" />
              <span className="hidden sm:inline">Share / App</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className={`text-xs px-2.5 py-1.5 flex items-center gap-1 transition-colors min-h-[36px] ${
                isNews
                  ? 'border-2 border-stone-800 bg-[#ede6d6] hover:bg-[#e4ddcc] text-stone-900 shadow-[1px_1px_0px_#292524]'
                  : currentThemeConfig.buttonSecondary + ' ' + currentThemeConfig.cornerStyle
              }`}
              title="About Explain Simply"
            >
              <HelpCircle className="w-3.5 h-3.5 opacity-70" />
              <span className="hidden sm:inline">Info</span>
            </button>

            {apiStatus && (
              <span
                className={`text-[0.7rem] px-2 py-1 flex items-center gap-1.5 font-medium ${
                  isNews
                    ? 'border-2 border-stone-800 bg-[#e4ddcc] text-stone-900 shadow-[1px_1px_0px_#292524]'
                    : currentThemeConfig.cornerStyle +
                      ' border ' +
                      (apiStatus.configured
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-400')
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isNews
                      ? 'bg-stone-900'
                      : apiStatus.configured
                      ? 'bg-emerald-400'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="hidden sm:inline">
                  {apiStatus.configured ? 'AI Ready' : 'Setup Needed'}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Quick Theme Switcher Pills Row */}
        <div
          className={`px-4 py-1.5 overflow-x-auto no-scrollbar border-t ${
            isNews
              ? 'border-stone-800/40 bg-[#ede6d6]/60'
              : 'border-white/5 bg-black/10'
          }`}
        >
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs">
            <span
              className={`text-[0.7rem] uppercase font-bold tracking-wider mr-1 ${
                isNews ? 'font-serif text-stone-700' : currentThemeConfig.textMuted
              }`}
            >
              Theme:
            </span>
            {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
              const cfg = THEMES[tId];
              const Icon = THEME_PILL_ICONS[tId];
              const isActive = tId === theme;

              return (
                <button
                  key={tId}
                  type="button"
                  onClick={() => handleSelectTheme(tId)}
                  className={`px-2.5 py-1 text-xs whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isNews
                      ? isActive
                        ? 'bg-stone-900 text-white font-bold border border-stone-900 shadow-[1px_1px_0px_#292524]'
                        : 'bg-[#e4ddcc] text-stone-800 hover:bg-[#d8d0be] border border-stone-600'
                      : isActive
                      ? 'bg-white/15 text-white font-semibold border border-white/20'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                  } ${isNews ? 'rounded-none' : 'rounded-full'}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cfg.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container - Android First */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 flex flex-col gap-4">
        {/* Info / Setup Guide Drawer */}
        {showSetupGuide && (
          <div
            className={`p-4 text-sm space-y-3 shadow-lg ${
              isNews
                ? 'bg-[#ede6d6] border-2 border-stone-900 shadow-[4px_4px_0px_#292524] text-stone-900 font-serif'
                : currentThemeConfig.cardBg +
                  ' ' +
                  currentThemeConfig.cardBorder +
                  ' border ' +
                  currentThemeConfig.cornerStyle +
                  ' ' +
                  currentThemeConfig.textSecondary
            }`}
          >
            <div
              className={`flex items-center justify-between pb-2 border-b ${
                isNews ? 'border-stone-800' : 'border-slate-800'
              }`}
            >
              <h3
                className={`font-semibold flex items-center gap-1.5 ${
                  isNews ? 'font-serif uppercase text-base text-stone-950 font-bold' : currentThemeConfig.textPrimary
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                About Explain Simply
              </h3>
              <button
                type="button"
                onClick={() => setShowSetupGuide(false)}
                className="text-xs opacity-70 hover:opacity-100 px-2 py-1"
              >
                Close
              </button>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              Designed for phones and quick study sessions. All AI requests are securely
              handled by the server without exposing credentials to browser code. Built by @kdrryann.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div
                className={`p-2.5 ${
                  isNews
                    ? 'bg-[#f4efe4] border-2 border-stone-800'
                    : 'rounded-xl bg-black/20 border border-white/10'
                }`}
              >
                <span className="font-semibold text-emerald-400 block mb-1">Explain like I'm 10</span>
                Concise, direct answers without long paragraphs or dense jargon.
              </div>
              <div
                className={`p-2.5 ${
                  isNews
                    ? 'bg-[#f4efe4] border-2 border-stone-800'
                    : 'rounded-xl bg-black/20 border border-white/10'
                }`}
              >
                <span className="font-semibold text-blue-400 block mb-1">Explain like I'm a student</span>
                Expanded explanations with common analogies and step-by-step logic.
              </div>
              <div
                className={`p-2.5 ${
                  isNews
                    ? 'bg-[#f4efe4] border-2 border-stone-800'
                    : 'rounded-xl bg-black/20 border border-white/10'
                }`}
              >
                <span className="font-semibold text-purple-400 block mb-1">Explain like I'm a professor</span>
                Meticulous, rigorous academic analysis covering foundational principles.
              </div>
            </div>
          </div>
        )}

        {/* Missing API Key Banner if unconfigured */}
        {apiStatus && !apiStatus.configured && (
          <div
            className={`p-4 text-sm space-y-2 ${
              isNews
                ? 'bg-amber-100 border-2 border-stone-900 shadow-[3px_3px_0px_#292524] text-stone-900'
                : 'bg-amber-950/40 border border-amber-600/40 rounded-2xl text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-amber-500">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>AI Setup Required</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              To enable live AI explanations, configure your{' '}
              <code className="bg-amber-900/30 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-700/50">
                GEMINI_API_KEY
              </code>{' '}
              in your environment or the AI Studio Secrets panel.
            </p>
          </div>
        )}

        {/* Input Card */}
        <section
          className={`p-4 sm:p-5 flex flex-col gap-3.5 transition-all ${
            currentThemeConfig.cardBg
          } ${currentThemeConfig.cardBorder} ${
            isNews ? 'border-2' : 'border'
          } ${currentThemeConfig.cornerStyle}`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="topic-input"
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isNews ? 'font-serif text-stone-950 font-bold' : currentThemeConfig.textMuted
                }`}
              >
                {isNews ? 'EDITORIAL INQUIRY / TOPIC' : 'Topic or Question'}
              </label>
              {question.length > 0 && (
                <span className="text-[0.7rem] opacity-60">{question.length}/500</span>
              )}
            </div>
            <textarea
              id="topic-input"
              ref={textareaRef}
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleExplain();
                }
              }}
              placeholder={currentThemeConfig.inputPlaceholder}
              maxLength={500}
              className={`w-full p-3.5 text-base transition-colors resize-y min-h-[96px] ${
                currentThemeConfig.inputBg
              } ${currentThemeConfig.inputBorder} ${currentThemeConfig.inputText} ${
                isNews ? 'font-serif rounded-none' : currentThemeConfig.cornerStyle
              }`}
            />
          </div>

          {/* Example Pills - Filtered per Theme */}
          <div className="space-y-1.5">
            <span
              className={`text-xs block font-medium ${
                isNews ? 'font-serif text-stone-800 italic' : currentThemeConfig.textMuted
              }`}
            >
              {isCats
                ? 'Curious cat questions to explore:'
                : isPink
                ? 'Sweet topics to try:'
                : isSpace
                ? 'Cosmic missions to investigate:'
                : isNews
                ? 'Front-page topics to dispatch:'
                : 'Try an example topic:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {currentThemeConfig.examples.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => handleSelectExample(ex)}
                  className={`text-xs px-3 py-1.5 active:scale-95 transition-all text-left flex items-center gap-1.5 min-h-[34px] ${
                    currentThemeConfig.pillBg
                  } ${currentThemeConfig.pillBorder} ${currentThemeConfig.pillHover} ${
                    currentThemeConfig.pillText
                  } ${isNews ? 'rounded-none shadow-[1px_1px_0px_#292524] font-serif' : currentThemeConfig.cornerStyle}`}
                >
                  <span className="text-sm">{ex.emoji || '✨'}</span>
                  <span className="font-medium">{ex.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls: Level Dropdown + Explain Button */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 flex flex-col justify-center">
              <label htmlFor="level-select" className="sr-only">
                Explanation Level
              </label>
              <select
                id="level-select"
                value={level}
                onChange={(e) => setLevel(e.target.value as ExplanationLevel)}
                className={`w-full h-12 px-3.5 text-sm font-medium transition-colors cursor-pointer ${
                  isNews
                    ? 'bg-[#fcfaf4] text-stone-900 border-2 border-stone-800 rounded-none font-serif'
                    : currentThemeConfig.inputBg +
                      ' ' +
                      currentThemeConfig.inputBorder +
                      ' ' +
                      currentThemeConfig.cornerStyle +
                      ' ' +
                      currentThemeConfig.textPrimary
                }`}
              >
                <option value="simple">
                  {isNews ? "Explain like I'm 10 (Simple)" : isCats ? "Explain like I'm 10 (Simple 🐱)" : "Explain like I'm 10"}
                </option>
                <option value="intermediate">
                  {isNews ? "Explain like I'm a student" : "Explain like I'm a student"}
                </option>
                <option value="detailed">
                  {isNews ? "Explain like I'm a professor" : "Explain like I'm a professor"}
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => handleExplain()}
              disabled={appState === 'loading' || !question.trim()}
              className={`h-12 px-6 font-semibold text-sm flex items-center justify-center gap-2 transition-all min-w-[130px] disabled:opacity-40 disabled:cursor-not-allowed ${
                currentThemeConfig.buttonPrimary
              } ${isNews ? 'rounded-none font-serif' : currentThemeConfig.cornerStyle}`}
            >
              {appState === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {isCats ? 'Thinking...' : isNews ? 'Dispatching...' : 'Explaining...'}
                  </span>
                </>
              ) : (
                <>
                  <span>{isNews ? 'Print Dispatch' : 'Explain'}</span>
                  {isCats ? (
                    <Cat className="w-4 h-4" />
                  ) : isPink ? (
                    <Heart className="w-4 h-4 fill-white/20" />
                  ) : isSpace ? (
                    <Rocket className="w-4 h-4" />
                  ) : isNews ? (
                    <Newspaper className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </>
              )}
            </button>
          </div>

          <div
            className={`text-[0.72rem] ${
              isNews ? 'font-serif italic text-stone-700' : currentThemeConfig.textMuted
            }`}
          >
            {LEVEL_DESCRIPTIONS[level].subtitle}
          </div>
        </section>

        {/* Answer Area - Ref for smooth scrolling */}
        <section ref={outputRef} className="scroll-mt-20">
          {/* EMPTY STATE */}
          {appState === 'empty' && (
            <div
              className={`p-8 text-center flex flex-col items-center justify-center space-y-3 ${
                isNews
                  ? 'bg-[#ede6d6]/70 border-2 border-dashed border-stone-800 rounded-none font-serif'
                  : currentThemeConfig.cardBg +
                    '/50 border border-dashed border-slate-800/80 ' +
                    currentThemeConfig.cornerStyle
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center ${
                  isNews
                    ? 'border-2 border-stone-800 bg-[#e4ddcc] text-stone-800'
                    : 'rounded-2xl bg-black/20 border border-white/10 ' + currentThemeConfig.accentText
                }`}
              >
                {isCats ? (
                  <Cat className="w-6 h-6" />
                ) : isPink ? (
                  <Heart className="w-6 h-6" />
                ) : isSpace ? (
                  <Rocket className="w-6 h-6" />
                ) : isNews ? (
                  <Newspaper className="w-6 h-6" />
                ) : (
                  <BookOpen className="w-6 h-6" />
                )}
              </div>
              <div className="max-w-xs space-y-1">
                <h3
                  className={`text-sm font-semibold ${
                    isNews ? 'font-serif uppercase tracking-wider text-stone-900 font-bold' : currentThemeConfig.textPrimary
                  }`}
                >
                  {isNews ? 'NO DISPATCH FILED YET' : isCats ? 'Awaiting Cat Curiosity' : 'No explanation yet'}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isNews ? 'font-serif text-stone-700' : currentThemeConfig.textMuted
                  }`}
                >
                  {isNews
                    ? 'Submit a topic above to print an educational breakdown in your morning edition.'
                    : 'Enter any tricky topic above or tap an example to get a breakdown customized to your level.'}
                </p>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {appState === 'loading' && (
            <div
              className={`p-8 text-center flex flex-col items-center justify-center space-y-4 ${
                isNews
                  ? 'bg-[#ede6d6] border-2 border-stone-800 shadow-[3px_3px_0px_#292524] rounded-none font-serif'
                  : currentThemeConfig.cardBg +
                    ' border ' +
                    currentThemeConfig.cardBorder +
                    ' ' +
                    currentThemeConfig.cornerStyle
              }`}
            >
              <div className="w-10 h-10 border-3 border-current/20 border-t-current rounded-full animate-spin text-blue-500" />
              <div className="space-y-1 max-w-xs">
                <h3
                  className={`text-sm font-semibold ${
                    isNews ? 'font-serif uppercase text-stone-950 font-bold' : currentThemeConfig.textPrimary
                  }`}
                >
                  {isCats
                    ? 'The Purr-fessor is crafting your answer...'
                    : isNews
                    ? 'Setting movable type & printing dispatch...'
                    : isPink
                    ? 'Sweetening and clarifying your explanation...'
                    : isSpace
                    ? 'Decoding cosmic transmissions...'
                    : `Preparing your ${LEVEL_DESCRIPTIONS[level].title.toLowerCase()} explanation...`}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isNews ? 'font-serif text-stone-700' : currentThemeConfig.textMuted
                  }`}
                >
                  Breaking down the concept into bite-sized, digestible ideas.
                </p>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {appState === 'error' && (
            <div
              className={`p-5 space-y-3.5 text-left ${
                isNews
                  ? 'bg-[#fcf5e8] border-2 border-red-800 shadow-[3px_3px_0px_#7f1d1d] rounded-none font-serif text-stone-900'
                  : 'bg-red-950/30 border border-red-800/40 rounded-2xl'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-900/40 border border-red-700/50 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.68rem] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-800/50 text-red-300">
                      {isMissingKey ? 'Setup Required' : 'Notice'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed font-medium text-red-200">{errorMessage}</p>
                </div>
              </div>

              {isMissingKey && (
                <div
                  className={`p-3.5 text-xs space-y-2 ${
                    isNews
                      ? 'bg-[#ede6d6] border border-stone-800 font-serif'
                      : 'bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300'
                  }`}
                >
                  <p className="font-semibold">How to configure the AI key:</p>
                  <ol className="list-decimal pl-4 space-y-1 opacity-90">
                    <li>In Google AI Studio, open the <strong>Settings &gt; Secrets</strong> panel.</li>
                    <li>Add a secret named <code className="font-mono text-xs font-bold">GEMINI_API_KEY</code>.</li>
                    <li>Or set <code className="font-mono text-xs font-bold">GEMINI_API_KEY</code> in your server's <code className="font-mono text-xs font-bold">.env</code> file.</li>
                  </ol>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleExplain()}
                  className={`text-xs px-3.5 py-2 font-medium min-h-[40px] flex items-center gap-1.5 transition-colors ${
                    isNews
                      ? 'bg-stone-900 text-white hover:bg-stone-800 border-2 border-stone-900 font-serif shadow-[1px_1px_0px_#292524]'
                      : 'bg-red-800/50 hover:bg-red-700/50 text-red-100 rounded-lg border border-red-700/60'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className={`text-xs px-3.5 py-2 font-medium min-h-[40px] transition-colors ${
                    isNews
                      ? 'bg-[#ede6d6] text-stone-900 hover:bg-[#e4ddcc] border-2 border-stone-800 font-serif shadow-[1px_1px_0px_#292524]'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 rounded-lg border border-slate-700/60'
                  }`}
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

          {/* RESULT STATE */}
          {appState === 'result' && result && (
            <article
              className={`p-4 sm:p-6 shadow-sm space-y-4 ${
                currentThemeConfig.cardBg
              } ${currentThemeConfig.cardBorder} ${
                isNews ? 'border-2' : 'border'
              } ${currentThemeConfig.cornerStyle}`}
            >
              {/* Header Bar */}
              <div
                className={`flex flex-wrap items-center justify-between gap-2 pb-3 border-b ${
                  isNews ? 'border-stone-800 border-b-2' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs uppercase font-bold tracking-wider px-2.5 py-1 ${
                      isNews
                        ? 'bg-stone-900 text-amber-50 font-serif rounded-none'
                        : isPink
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded-full'
                        : isCats
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full'
                        : isSpace
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-md'
                    }`}
                  >
                    {isCats && '🐾 '}
                    {isPink && '♡ '}
                    {isSpace && '🚀 '}
                    {isNews && 'EDITION: '}
                    {LEVEL_DESCRIPTIONS[result.level]?.badge || result.level.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`text-xs px-2.5 py-1.5 flex items-center gap-1 min-h-[36px] transition-colors ${
                      isNews
                        ? 'border-2 border-stone-800 bg-[#ede6d6] hover:bg-[#e4ddcc] text-stone-900 font-serif shadow-[1px_1px_0px_#292524]'
                        : currentThemeConfig.buttonSecondary + ' ' + currentThemeConfig.cornerStyle
                    }`}
                    title="Copy explanation"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 opacity-70" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className={`text-xs px-2.5 py-1.5 flex items-center gap-1 min-h-[36px] transition-colors ${
                      isNews
                        ? 'border-2 border-stone-800 bg-[#ede6d6] hover:bg-[#e4ddcc] text-stone-900 font-serif shadow-[1px_1px_0px_#292524]'
                        : currentThemeConfig.buttonSecondary + ' ' + currentThemeConfig.cornerStyle
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 opacity-70" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Question Echo */}
              <div
                className={`p-3 text-xs flex items-start gap-2 ${
                  isNews
                    ? 'bg-[#fcfaf4] border-2 border-stone-800 font-serif'
                    : 'bg-black/20 border border-white/5 ' + currentThemeConfig.cornerStyle
                }`}
              >
                <span
                  className={`font-semibold flex-shrink-0 ${
                    isNews ? 'text-stone-900 font-bold uppercase' : currentThemeConfig.textMuted
                  }`}
                >
                  {isNews ? 'DISPATCH SUBJECT:' : 'Topic:'}
                </span>
                <span
                  className={`font-medium italic ${
                    isNews ? 'text-stone-950 font-serif' : currentThemeConfig.textPrimary
                  }`}
                >
                  "{result.question}"
                </span>
              </div>

              {/* Formatted Markdown Body */}
              <div className="pt-1">
                <MarkdownView content={result.explanation} theme={theme} />
              </div>

              {/* Switch Level Quick Actions */}
              <div
                className={`mt-6 pt-4 border-t space-y-2 ${
                  isNews ? 'border-stone-800' : 'border-white/10'
                }`}
              >
                <span
                  className={`text-xs block font-medium ${
                    isNews ? 'font-serif italic text-stone-800' : currentThemeConfig.textMuted
                  }`}
                >
                  {isNews
                    ? 'Examine this dispatch at another depth:'
                    : 'Try another explanation depth for this topic:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['simple', 'intermediate', 'detailed'] as ExplanationLevel[]).map((lvl) => {
                    if (lvl === result.level) return null;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => switchLevelAndReExplain(lvl)}
                        className={`text-xs px-3 py-1.5 capitalize transition-all min-h-[36px] ${
                          isNews
                            ? 'bg-[#ede6d6] hover:bg-[#e4ddcc] border-2 border-stone-800 text-stone-900 font-serif shadow-[1px_1px_0px_#292524]'
                            : currentThemeConfig.buttonSecondary +
                              ' ' +
                              currentThemeConfig.cornerStyle
                        }`}
                      >
                        {LEVEL_DESCRIPTIONS[lvl]?.title || lvl} &rarr;
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`mt-auto py-4 px-4 text-center text-xs border-t transition-colors ${
          isNews
            ? 'border-stone-800/80 bg-[#ede6d6] font-serif text-stone-700'
            : 'border-white/5 text-slate-500'
        }`}
      >
        <p>
          {isNews ? (
            <span>THE DAILY EXPLAINER · by @kdrryann</span>
          ) : isCats ? (
            <span>Explain Simply 🐾 Purr-fessor Edition &bull; by @kdrryann</span>
          ) : isPink ? (
            <span>Explain Simply ♡ Cutie Edition &bull; by @kdrryann</span>
          ) : isSpace ? (
            <span>Explain Simply 🚀 Cosmic Mission &bull; by @kdrryann</span>
          ) : (
            <span>Explain Simply &bull; by @kdrryann</span>
          )}
        </p>
      </footer>

      {/* Share and App Install Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        theme={theme}
        deferredPrompt={deferredPrompt}
        onInstall={handleInstall}
      />
    </div>
  );
}
