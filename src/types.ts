export type ExplanationLevel = 'simple' | 'intermediate' | 'detailed';

export type AppLanguage = 'en' | 'id';

export type AppState = 'empty' | 'loading' | 'error' | 'result';

export type ThemeId = 'dark' | 'pink' | 'cats' | 'space' | 'newspaper';

export interface ExplanationResult {
  explanation: string;
  level: ExplanationLevel;
  question: string;
  timestamp: number;
}

export interface ApiStatus {
  configured: boolean;
  provider: string;
  model: string;
}

export interface ExampleTopic {
  label: string;
  question: string;
  category: string;
  emoji?: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  subtitle: string;
  iconName: string;
  fontClass: string;
  // Page & layout styling
  pageBg: string;
  headerBg: string;
  headerBorder: string;
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  // Button styling
  buttonPrimary: string;
  buttonSecondary: string;
  buttonText: string;
  // Accent & text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentText: string;
  pillBg: string;
  pillHover: string;
  pillBorder: string;
  pillText: string;
  // Special decorative touches
  cornerStyle: string; // e.g. rounded-2xl or rounded-none (newspaper)
  bulletColor: string;
  examples: ExampleTopic[];
}
