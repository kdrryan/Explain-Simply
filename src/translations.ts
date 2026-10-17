import type { AppLanguage, ExplanationLevel, ThemeId, ExampleTopic } from './types.ts';

export interface TranslationLevel {
  title: string;
  subtitle: string;
  badge: string;
  infoDesc: string;
}

export interface TranslationSchema {
  header: {
    appName: string;
    themeLabel: string;
    shareBtn: string;
    infoBtn: string;
    aiReady: string;
    setupNeeded: string;
    langSelectLabel: string;
    newspaperMasthead: {
      edition: string;
      weather: string;
      price: string;
    };
  };
  input: {
    textareaLabel: string;
    placeholder: Record<ThemeId, string>;
    topicsLabel: Record<ThemeId, string>;
    explainBtn: string;
    explainBtnNews: string;
    loadingBtn: string;
    loadingCats: string;
    loadingNews: string;
  };
  levels: Record<ExplanationLevel, TranslationLevel>;
  examples: Record<ThemeId, ExampleTopic[]>;
  results: {
    topicLabel: string;
    topicLabelNews: string;
    copy: string;
    copied: string;
    clear: string;
    switchPrompt: string;
    switchPromptNews: string;
    reExplainSuffix: string;
  };
  emptyState: {
    title: string;
    description: string;
  };
  about: {
    title: string;
    close: string;
    description: string;
  };
  share: {
    title: string;
    titleNews: string;
    shareHeading: string;
    copyBtn: string;
    copiedBtn: string;
    nativeShareBtn: string;
    installHeading: string;
    installDesc: string;
    installBtn: string;
    installedBtn: string;
    close: string;
  };
  error: {
    emptyQuestion: string;
    genericError: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationSchema> = {
  en: {
    header: {
      appName: 'Explain Simply',
      themeLabel: 'Theme:',
      shareBtn: 'Share / App',
      infoBtn: 'Info',
      aiReady: 'AI Ready',
      setupNeeded: 'Setup Needed',
      langSelectLabel: 'Language',
      newspaperMasthead: {
        edition: 'MORNING EDITION · VOL. LXXIV',
        weather: 'WEATHER: OPTIMAL FOR STUDYING',
        price: 'PRICE: FREE',
      },
    },
    input: {
      textareaLabel: 'Ask a question or topic to explain',
      placeholder: {
        dark: 'e.g., How does photosynthesis work? Why do airplanes fly?',
        pink: 'Ask anything sweet or curious... e.g. Why are flamingos pink?',
        cats: 'Ask the Purr-fessor! e.g., How do cats see in the dark?',
        space: 'Transmit your cosmic inquiry... e.g. What happens in a black hole?',
        newspaper: 'Enter a topic for the editorial desk... e.g. How does the stock market work?',
      },
      topicsLabel: {
        dark: 'Try an example topic:',
        pink: 'Sweet topics to try:',
        cats: 'Curious cat questions to explore:',
        space: 'Cosmic missions to investigate:',
        newspaper: 'Front-page topics to dispatch:',
      },
      explainBtn: 'Explain',
      explainBtnNews: 'Print Dispatch',
      loadingBtn: 'Explaining...',
      loadingCats: 'Thinking...',
      loadingNews: 'Dispatching...',
    },
    levels: {
      simple: {
        title: "Explain like I'm 10",
        subtitle: 'Super simple, direct & punchy answers (no long paragraphs, pure clarity)',
        badge: "EXPLAIN LIKE I'M 10",
        infoDesc: 'Concise, direct answers without long paragraphs or dense jargon.',
      },
      intermediate: {
        title: "Explain like I'm a student",
        subtitle: 'Expanded explanation with relatable analogies, step-by-step logic & practical examples',
        badge: "EXPLAIN LIKE A STUDENT",
        infoDesc: 'Expanded explanations with common analogies and step-by-step logic.',
      },
      detailed: {
        title: "Explain like I'm a professor",
        subtitle: 'Meticulous, rigorous & comprehensive academic breakdown of foundational laws',
        badge: "EXPLAIN LIKE A PROFESSOR",
        infoDesc: 'Meticulous, rigorous academic analysis covering foundational principles.',
      },
    },
    examples: {
      dark: [
        {
          label: 'Photosynthesis',
          question: 'How does photosynthesis turn sunlight, water, and air into food for plants?',
          category: 'Biology',
          emoji: '🌱',
        },
        {
          label: 'Airplane Flight',
          question: 'Why do heavy metal airplanes stay up in the air without falling?',
          category: 'Physics',
          emoji: '✈️',
        },
        {
          label: 'Inflation & Prices',
          question: 'What causes inflation and why do everyday prices rise over time?',
          category: 'Economics',
          emoji: '📈',
        },
        {
          label: 'DNA & Genes',
          question: 'How does DNA store instructions for building living organisms?',
          category: 'Genetics',
          emoji: '🧬',
        },
        {
          label: 'Black Holes',
          question: 'What is a black hole and what happens if something gets close to it?',
          category: 'Astronomy',
          emoji: '🕳️',
        },
      ],
      pink: [
        {
          label: 'Pink Flamingos',
          question: 'Why are flamingos pink and why do they stand on one leg?',
          category: 'Nature',
          emoji: '🦩',
        },
        {
          label: 'Rainbow Colors',
          question: 'How does light split inside tiny water raindrops to create a rainbow arc?',
          category: 'Optics',
          emoji: '🌈',
        },
        {
          label: 'Firefly Glow',
          question: 'How do tiny fireflies produce cool neon light inside their bellies?',
          category: 'Creatures',
          emoji: '✨',
        },
        {
          label: 'Cotton Candy',
          question: 'How does spinning molten crystal sugar turn into cloud-like cotton candy?',
          category: 'Food Science',
          emoji: '🍭',
        },
        {
          label: 'Music & Earworms',
          question: 'Why do catchy melody tunes get helplessly stuck repeating in our heads?',
          category: 'Psychology',
          emoji: '🎶',
        },
      ],
      cats: [
        {
          label: 'Why Cats Purr',
          question: 'How and why do cats purr, and is it true that purring can help heal bones?',
          category: 'Felines',
          emoji: '🐱',
        },
        {
          label: 'Night Vision',
          question: 'How do cat eyes see so sharply in almost total darkness?',
          category: 'Biology',
          emoji: '👀',
        },
        {
          label: 'Landing on Feet',
          question: 'What is the cat righting reflex that allows cats to twist mid-air and land on their feet?',
          category: 'Physics',
          emoji: '🐾',
        },
        {
          label: 'Knocking Things Off',
          question: 'Why do cats love swatting cups and pens off high tables?',
          category: 'Behavior',
          emoji: '📦',
        },
        {
          label: 'Cat Radar Whiskers',
          question: 'How do cat whiskers work like secret antennas to measure spaces and feel air currents?',
          category: 'Sensory',
          emoji: '✨',
        },
      ],
      space: [
        {
          label: 'Supernovas',
          question: 'What triggers a massive star to explode into a blinding supernova?',
          category: 'Astrophysics',
          emoji: '💥',
        },
        {
          label: 'Time Dilation',
          question: 'Why does time run slower near high gravity like black holes or at light speed?',
          category: 'Relativity',
          emoji: '⏳',
        },
        {
          label: 'Europa Ocean',
          question: 'Why do astronomers believe Jupiter’s icy moon Europa could harbor an alien ocean?',
          category: 'Planetary',
          emoji: '🪐',
        },
        {
          label: 'Vanishing Moon',
          question: 'What would happen to Earth’s tides, seasons, and rotation if the Moon disappeared?',
          category: 'Cosmology',
          emoji: '🌕',
        },
        {
          label: 'Solar Wind',
          question: 'What is the solar wind and how does Earth’s magnetic field keep us safe?',
          category: 'Geophysics',
          emoji: '☀️',
        },
      ],
      newspaper: [
        {
          label: 'Stock Market',
          question: 'How does the stock market actually work and why do share prices change every minute?',
          category: 'Finance',
          emoji: '📰',
        },
        {
          label: 'Printing Press',
          question: 'How did Gutenberg’s movable metal type printing press ignite the modern scientific era?',
          category: 'History',
          emoji: '🗞️',
        },
        {
          label: 'Central Banks',
          question: 'Why do central banks raise or cut interest rates and how does that affect normal citizens?',
          category: 'Economics',
          emoji: '🏛️',
        },
        {
          label: 'How Laws Pass',
          question: 'Why does it take so long for a proposed bill to travel through parliament and become law?',
          category: 'Civics',
          emoji: '⚖️',
        },
        {
          label: 'Supply & Demand',
          question: 'What is the core economic principle of supply and demand and how does it determine prices?',
          category: 'Markets',
          emoji: '📦',
        },
      ],
    },
    results: {
      topicLabel: 'Topic:',
      topicLabelNews: 'DISPATCH SUBJECT:',
      copy: 'Copy',
      copied: 'Copied!',
      clear: 'Clear',
      switchPrompt: 'Try another explanation depth for this topic:',
      switchPromptNews: 'Examine this dispatch at another depth:',
      reExplainSuffix: '→',
    },
    emptyState: {
      title: 'No explanation yet',
      description: 'Enter any tricky topic above or tap an example to get a breakdown customized to your level.',
    },
    about: {
      title: 'About Explain Simply',
      close: 'Close',
      description: 'Designed for phones and quick study sessions. All AI requests are securely handled by the server without exposing credentials to browser code. Built by @kdrryann.',
    },
    share: {
      title: 'Share & Install App',
      titleNews: 'DISPATCH & SHARE',
      shareHeading: 'Share with students or friends',
      copyBtn: 'Copy',
      copiedBtn: 'Copied!',
      nativeShareBtn: 'Share via WhatsApp, Messages, or Social',
      installHeading: 'Install as a Phone App (PWA)',
      installDesc: 'Add Explain Simply to your Home Screen for instant full-screen access without browser URL bars.',
      installBtn: 'Install App Now',
      installedBtn: 'Installed on Device',
      close: 'Close',
    },
    error: {
      emptyQuestion: 'Please type a question or choose an example topic.',
      genericError: 'Something went wrong while generating the explanation.',
    },
  },

  id: {
    header: {
      appName: 'Explain Simply',
      themeLabel: 'Tema:',
      shareBtn: 'Bagikan',
      infoBtn: 'Info',
      aiReady: 'AI Siap',
      setupNeeded: 'Perlu Setup',
      langSelectLabel: 'Bahasa',
      newspaperMasthead: {
        edition: 'EDISI PAGI · VOL. LXXIV',
        weather: 'CUACA: OPTIMAL UNTUK BELAJAR',
        price: 'HARGA: GRATIS',
      },
    },
    input: {
      textareaLabel: 'Tulis pertanyaan atau topik yang ingin dijelaskan',
      placeholder: {
        dark: 'Contoh: Bagaimana fotosintesis bekerja? Mengapa pesawat bisa terbang?',
        pink: 'Tanyakan apa saja yang ingin kamu tahu... Contoh: Mengapa burung flamingo berwarna pink?',
        cats: 'Tanyakan pada Purr-fessor! Contoh: Bagaimana kucing bisa melihat di kegelapan?',
        space: 'Kirimkan pertanyaan antariksamu... Contoh: Apa yang terjadi di dalam lubang hitam?',
        newspaper: 'Kirim topik untuk meja redaksi... Contoh: Bagaimana cara kerja pasar modal?',
      },
      topicsLabel: {
        dark: 'Coba contoh topik:',
        pink: 'Topik menarik untuk dicoba:',
        cats: 'Pertanyaan kucing yang bikin penasaran:',
        space: 'Misi kosmik untuk diselidiki:',
        newspaper: 'Topik berita halaman utama:',
      },
      explainBtn: 'Jelaskan',
      explainBtnNews: 'Cetak Berita',
      loadingBtn: 'Menjelaskan...',
      loadingCats: 'Sedang Berpikir...',
      loadingNews: 'Menerbitkan...',
    },
    levels: {
      simple: {
        title: "Explain like I'm 10",
        subtitle: 'Jawaban super ringkas, padat & to-the-point (tanpa paragraf panjang)',
        badge: "EXPLAIN LIKE I'M 10",
        infoDesc: 'Jawaban ringkas, to-the-point, tanpa bertele-tele & tanpa paragraf panjang.',
      },
      intermediate: {
        title: "Explain like I'm a student",
        subtitle: 'Penjelasan mendalam disertai analogi umum, mekanisme langkah demi langkah & contoh nyata',
        badge: "EXPLAIN LIKE A STUDENT",
        infoDesc: 'Penjelasan diperluas dengan analogi umum, mekanisme langkah demi langkah & contoh nyata.',
      },
      detailed: {
        title: "Explain like I'm a professor",
        subtitle: 'Analisis akademis teliti, mendalam & komprehensif mengupas tuntas prinsip dasar',
        badge: "EXPLAIN LIKE A PROFESSOR",
        infoDesc: 'Analisis teliti, mendalam, akademis & mengupas tuntas prinsip dasar secara komprehensif.',
      },
    },
    examples: {
      dark: [
        {
          label: 'Fotosintesis',
          question: 'Bagaimana fotosintesis mengubah sinar matahari, air, dan udara menjadi makanan tanaman?',
          category: 'Biologi',
          emoji: '🌱',
        },
        {
          label: 'Terbangnya Pesawat',
          question: 'Mengapa pesawat logam yang sangat berat bisa melayang di udara tanpa jatuh?',
          category: 'Fisika',
          emoji: '✈️',
        },
        {
          label: 'Inflasi & Harga',
          question: 'Apa penyebab inflasi dan mengapa harga barang kebutuhan naik seiring waktu?',
          category: 'Ekonomi',
          emoji: '📈',
        },
        {
          label: 'DNA & Gen',
          question: 'Bagaimana DNA menyimpan instruksi kode untuk membangun makhluk hidup?',
          category: 'Genetika',
          emoji: '🧬',
        },
        {
          label: 'Lubang Hitam',
          question: 'Apa itu lubang hitam dan apa yang terjadi jika ada benda yang mendekatinya?',
          category: 'Astronomi',
          emoji: '🕳️',
        },
      ],
      pink: [
        {
          label: 'Burung Flamingo',
          question: 'Mengapa burung flamingo berwarna merah muda dan suka berdiri dengan satu kaki?',
          category: 'Hewan',
          emoji: '🦩',
        },
        {
          label: 'Warna Pelangi',
          question: 'Bagaimana cahaya matahari terurai di butiran air hujan hingga membentuk pelangi melengkung?',
          category: 'Optika',
          emoji: '🌈',
        },
        {
          label: 'Kunang-kunang',
          question: 'Bagaimana kunang-kunang bisa menghasilkan cahaya neon dingin di dalam tubuhnya?',
          category: 'Alam',
          emoji: '✨',
        },
        {
          label: 'Kembang Gula',
          question: 'Bagaimana gula pasir kristal yang dipanaskan bisa berubah menjadi gulali selembut awan?',
          category: 'Sains Makanan',
          emoji: '🍭',
        },
        {
          label: 'Lagu Terngiang',
          question: 'Mengapa nada lagu tertentu bisa terus-menerus terngiang di dalam kepala kita?',
          category: 'Psikologi',
          emoji: '🎶',
        },
      ],
      cats: [
        {
          label: 'Dengkuran Kucing',
          question: 'Bagaimana dan mengapa kucing mendengkur (purring), dan benarkah dengkuran bisa membantu pemulihan?',
          category: 'Kucing',
          emoji: '🐱',
        },
        {
          label: 'Melihat di Gelap',
          question: 'Bagaimana mata kucing bisa melihat dengan sangat tajam di tempat yang hampir gelap gulita?',
          category: 'Biologi',
          emoji: '👀',
        },
        {
          label: 'Refleks Mendarat',
          question: 'Bagaimana kucing bisa memutar tubuhnya di udara dan selalu mendarat dengan keempat kakinya?',
          category: 'Fisika',
          emoji: '🐾',
        },
        {
          label: 'Menjatuhkan Barang',
          question: 'Mengapa kucing sering suka menyenggol cangkir atau pulpen jatuh dari atas meja?',
          category: 'Perilaku',
          emoji: '📦',
        },
        {
          label: 'Kumis Radar Kucing',
          question: 'Bagaimana kumis kucing bekerja seperti radar untuk mengukur celah dan merasakan arus udara?',
          category: 'Sensorik',
          emoji: '✨',
        },
      ],
      space: [
        {
          label: 'Supernova',
          question: 'Apa yang memicu bintang raksasa meledak menjadi supernova yang luar biasa terang?',
          category: 'Astrofisika',
          emoji: '💥',
        },
        {
          label: 'Dilatasi Waktu',
          question: 'Mengapa waktu berjalan lebih lambat di dekat gravitasi raksasa seperti lubang hitam?',
          category: 'Relativitas',
          emoji: '⏳',
        },
        {
          label: 'Lautan Bulan Europa',
          question: 'Mengapa para astronom yakin bulan es Europa milik Jupiter menyimpan lautan air di bawahnya?',
          category: 'Planetari',
          emoji: '🪐',
        },
        {
          label: 'Bila Bulan Hilang',
          question: 'Apa yang akan terjadi pada pasang surut air laut, musim, dan rotasi Bumi jika Bulan lenyap?',
          category: 'Kosmologi',
          emoji: '🌕',
        },
        {
          label: 'Angin Matahari',
          question: 'Apa itu angin matahari dan bagaimana medan magnet bumi melindungi kita dari radiasinya?',
          category: 'Geofisika',
          emoji: '☀️',
        },
      ],
      newspaper: [
        {
          label: 'Pasar Saham',
          question: 'Bagaimana sebenarnya pasar saham bekerja dan mengapa harga saham bisa naik-turun setiap menit?',
          category: 'Keuangan',
          emoji: '📰',
        },
        {
          label: 'Mesin Cetak',
          question: 'Bagaimana penemuan mesin cetak Gutenberg mengubah jalannya peradaban dan ilmu pengetahuan?',
          category: 'Sejarah',
          emoji: '🗞️',
        },
        {
          label: 'Bank Sentral',
          question: 'Mengapa bank sentral menaikkan atau menurunkan suku bunga dan bagaimana dampaknya bagi masyarakat?',
          category: 'Ekonomi',
          emoji: '🏛️',
        },
        {
          label: 'Pembuatan Undang-Undang',
          question: 'Mengapa proses sebuah rancangan undang-undang menjadi hukum resmi membutuhkan waktu panjang?',
          category: 'Hukum',
          emoji: '⚖️',
        },
        {
          label: 'Permintaan & Penawaran',
          question: 'Apa prinsip dasar supply and demand (penawaran dan permintaan) dalam menentukan harga barang?',
          category: 'Pasar',
          emoji: '📦',
        },
      ],
    },
    results: {
      topicLabel: 'Topik:',
      topicLabelNews: 'SUBJEK BERITA:',
      copy: 'Salin',
      copied: 'Tersalin!',
      clear: 'Hapus',
      switchPrompt: 'Coba tingkat penjelasan lain untuk topik ini:',
      switchPromptNews: 'Periksa laporan berita ini di tingkat kedalaman lain:',
      reExplainSuffix: '→',
    },
    emptyState: {
      title: 'Belum ada penjelasan',
      description: 'Ketik topik sulit di atas atau klik contoh topik untuk mendapatkan rangkuman sesuai tingkat pemahaman Anda.',
    },
    about: {
      title: 'Tentang Explain Simply',
      close: 'Tutup',
      description: 'Dirancang untuk ponsel dan sesi belajar cepat. Semua permintaan AI diproses secara aman di server tanpa mengekspos kredensial ke kode peramban. Dibuat oleh @kdrryann.',
    },
    share: {
      title: 'Bagikan & Pasang Aplikasi',
      titleNews: 'TERBITKAN & BAGIKAN',
      shareHeading: 'Bagikan ke teman atau siswa',
      copyBtn: 'Salin',
      copiedBtn: 'Tersalin!',
      nativeShareBtn: 'Bagikan lewat WhatsApp, Pesan, atau Sosmed',
      installHeading: 'Pasang sebagai Aplikasi HP (PWA)',
      installDesc: 'Tambahkan Explain Simply ke Layar Utama ponsel Anda untuk akses cepat layar penuh tanpa bilah URL peramban.',
      installBtn: 'Pasang Aplikasi Sekarang',
      installedBtn: 'Sudah Terpasang di Perangkat',
      close: 'Tutup',
    },
    error: {
      emptyQuestion: 'Silakan ketik pertanyaan atau pilih contoh topik.',
      genericError: 'Terjadi kendala saat menghasilkan penjelasan.',
    },
  },
};
