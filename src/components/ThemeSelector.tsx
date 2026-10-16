import React from 'react';
import { Sparkles, Heart, Cat, Rocket, Newspaper, Palette } from 'lucide-react';
import type { ThemeId } from '../types.ts';
import { THEMES } from '../themes.ts';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const THEME_ICONS: Record<ThemeId, React.ComponentType<{ className?: string }>> = {
  dark: Sparkles,
  pink: Heart,
  cats: Cat,
  space: Rocket,
  newspaper: Newspaper,
};

const THEME_COLORS: Record<ThemeId, { dot: string; preview: string }> = {
  dark: { dot: 'bg-blue-500', preview: 'bg-[#121826] border-slate-700' },
  pink: { dot: 'bg-pink-400', preview: 'bg-[#2c1628] border-pink-700/60' },
  cats: { dot: 'bg-amber-500', preview: 'bg-[#291e17] border-amber-700/60' },
  space: { dot: 'bg-cyan-400', preview: 'bg-[#101535] border-indigo-700/60' },
  newspaper: { dot: 'bg-stone-800', preview: 'bg-[#ede6d6] border-stone-800' },
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  isOpen,
  onToggle,
}) => {
  const ActiveIcon = THEME_ICONS[currentTheme];
  const activeConfig = THEMES[currentTheme];
  const isNews = currentTheme === 'newspaper';

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        className={`text-xs px-2.5 py-1.5 flex items-center gap-1.5 transition-all min-h-[36px] ${
          isNews
            ? 'border-2 border-stone-800 bg-[#ede6d6] hover:bg-[#e4ddcc] text-stone-900 shadow-[1px_1px_0px_#292524]'
            : 'rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-700 text-slate-200'
        }`}
        title="Change application theme"
        aria-label="Change application theme"
        aria-expanded={isOpen}
      >
        <ActiveIcon className="w-3.5 h-3.5" />
        <span className="font-semibold hidden sm:inline">{activeConfig.name}</span>
        <span className="font-semibold sm:hidden">Theme</span>
        <Palette className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Dropdown Menu / Swatch Tray */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            onClick={onToggle}
            aria-hidden="true"
          />
          <div
            className={`absolute right-0 mt-2 w-64 z-50 p-2.5 shadow-2xl transition-all ${
              isNews
                ? 'bg-[#ede6d6] border-2 border-stone-900 shadow-[6px_6px_0px_#292524] rounded-none'
                : 'bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-700/50">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isNews ? 'text-stone-900 font-serif' : 'text-slate-400'
                }`}
              >
                Choose Theme
              </span>
              <span className="text-[0.7rem] text-slate-400">5 styles</span>
            </div>

            <div className="space-y-1">
              {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                const conf = THEMES[id];
                const Icon = THEME_ICONS[id];
                const isSelected = id === currentTheme;
                const { dot, preview } = THEME_COLORS[id];

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onSelectTheme(id);
                      onToggle();
                    }}
                    className={`w-full flex items-center justify-between p-2 text-xs text-left transition-all ${
                      conf.cornerStyle
                    } ${
                      isSelected
                        ? isNews
                          ? 'bg-stone-900 text-white font-bold'
                          : 'bg-blue-600/20 text-white border border-blue-500/40 font-semibold'
                        : isNews
                        ? 'hover:bg-stone-300 text-stone-900'
                        : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 flex items-center justify-center rounded-lg border ${preview}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span>{conf.name}</span>
                          {id === 'pink' && <span className="text-[0.65rem]">♡</span>}
                          {id === 'cats' && <span className="text-[0.65rem]">🐾</span>}
                          {id === 'space' && <span className="text-[0.65rem]">🚀</span>}
                          {id === 'newspaper' && <span className="text-[0.65rem]">📰</span>}
                        </div>
                        <div className="text-[0.68rem] opacity-70 truncate max-w-[130px]">
                          {conf.tagline}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      {isSelected && (
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-blue-400">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
