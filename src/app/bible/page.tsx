"use client";

import { useState } from "react";

const BIBLE_API = "https://bible-api.com";

// 中文圣经和合本（常用经文）
const CHINESE_BIBLE: Record<string, Record<string, string>> = {
  "John": {
    "1:1": "太初有道，道与　神同在，道就是　神。",
    "1:14": "道成了肉身，住在我们中间，充充满满地有恩典有真理。",
    "3:16": "神爱世人，甚至将他的独生子赐给他们，叫一切信他的，不至灭亡，反得永生。",
    "3:17": "因为神差他的儿子降世，不是要定世人的罪，乃是要叫世人因他得救。",
    "14:6": "耶稣说：「我就是道路，真理，生命；若不借着我，没有人能到父那里去。」",
  },
  "Romans": {
    "3:23": "因为世人都犯了罪，亏缺了　神的荣耀；",
    "8:28": "我们晓得万事都互相效力，叫爱　神的人得益处，就是按他旨意被召的人。",
    "8:39": "是高处的，是低处的，是别的受造之物，都不能叫我们与　神的爱隔绝；这爱是在我们的主基督耶稣里的。",
  },
  "Genesis": {
    "1:1": "起初　神创造天地。",
  },
  "Psalms": {
    "23:1": "耶和华是我的牧者，我必不致缺乏。",
    "23:4": "我虽然行过死荫的幽谷，也不怕糟害，因为你与我同在。",
  },
  "Proverbs": {
    "3:5": "你要专心仰赖耶和华，不可倚靠自己的聪明。",
  },
  "Isaiah": {
    "40:31": "但那等候耶和华的，必重新得力。他们必如鹰展翅上腾。",
  },
  "Matthew": {
    "11:28": "凡劳苦担重担的人，可以到我这里来，我就使你们得安息。",
  },
  "Exodus": {
    "3:14": "神对摩西说：「我是自有永有的。」",
  },
  "1 John": {
    "4:19": "我们爱，因为　神先爱我们。",
  },
};

const SBL_GREEK_NT: Record<string, Record<string, string>> = {
  "John": {
    "1": "1 Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος. 2 Οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν. 3 πάντα διʼ αὐτοῦ ἐγένετο, καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἓν ὃ γέγονεν.",
    "3:16": "16 Οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον, ὥστε τὸν υἱὸν τὸν μονογενῆ ἔδωκεν, ἵνα πᾶς ὁ πιστεύων εἰς αὐτὸν μὴ ἀπόληται ἀλλʼ ἔχῃ ζωὴν αἰώνιον.",
  },
  "Romans": {
    "3:23": "23 πάντες γὰρ ἥμαρτον καὶ ὑστεροῦνται τῆς δόξης τοῦ θεοῦ",
    "8:28": "28 Οἴδαμεν δὲ ὅτι τοῖς ἀγαπῶσιν τὸν θεὸν πάντα συνεργεῖ εἰς ἀγαθόν, τοῖς κατὰ πρόθεσιν κλητοῖς οὖσιν.",
  },
  "Genesis": {
    "1:1": "1 בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
  },
  "Psalms": {
    "23:1": "1 מִזְמוֹר לְדָוִד יְהוָה רֹעִי לֹא אֶחְסָר",
  }
};

const NT_BOOKS = ["matthew", "mark", "luke", "john", "acts", "romans", 
  "1 corinthians", "2 corinthians", "galatians", "ephesians", "philippians",
  "colossians", "1 thessalonians", "2 thessalonians", "1 timothy", "2 timothy",
  "titus", "philemon", "hebrews", "james", "1 peter", "2 peter", "1 john", 
  "2 john", "3 john", "jude", "revelation"];

// Sefaria book name mapping (English to Hebrew Bible book names)
const HEBREW_BOOKS: Record<string, string> = {
  "genesis": "Genesis", "exodus": "Exodus", "leviticus": "Leviticus", 
  "numbers": "Numbers", "deuteronomy": "Deuteronomy", "joshua": "Joshua",
  "judges": "Judges", "ruth": "Ruth", "1 samuel": "1 Samuel", "2 samuel": "2 Samuel",
  "1 kings": "1 Kings", "2 kings": "2 Kings", "1 chronicles": "1 Chronicles",
  "2 chronicles": "2 Chronicles", "ezra": "Ezra", "nehemiah": "Nehemiah",
  "esther": "Esther", "job": "Job", "psalms": "Psalms", "proverbs": "Proverbs",
  "ecclesiastes": "Ecclesiastes", "song of solomon": "Song of Solomon",
  "isaiah": "Isaiah", "jeremiah": "Jeremiah", "lamentations": "Lamentations",
  "ezekiel": "Ezekiel", "daniel": "Daniel", "hosea": "Hosea", "joel": "Joel",
  "amos": "Amos", "obadiah": "Obadiah", "jonah": "Jonah", "micah": "Micah",
  "nahum": "Nahum", "habakkuk": "Habakkuk", "zephaniah": "Zephaniah",
  "haggai": "Haggai", "zechariah": "Zechariah", "malachi": "Malachi"
};

const TRANSLATIONS = [
  { code: "cuv", name: "CUV 中文", description: "和合本（繁体）- 常用经文" },
  { code: "kjv", name: "KJV 英文", description: "King James Version" },
  { code: "web", name: "WEB 英文", description: "World English Bible" },
];

interface Verse {
  verse: number;
  text: string;
}

interface SearchResult {
  reference: string;
  verses: Verse[];
  translation: string;
  translationName: string;
}

export default function BiblePage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedTranslation, setSelectedTranslation] = useState("cuv");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [originalLabel, setOriginalLabel] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parseReference = (ref: string): { book: string; chapter: number; verse?: number } | null => {
    const match = ref.match(/^([a-zA-Z\s]+)\s*(\d+)\s*:\s*(\d+)?$/i);
    if (!match) return null;
    return {
      book: match[1].trim(),
      chapter: parseInt(match[2]),
      verse: match[3] ? parseInt(match[3]) : undefined
    };
  };

  const isOldTestament = (ref: string): boolean => {
    const lowerRef = ref.toLowerCase();
    for (const book of NT_BOOKS) {
      if (lowerRef.includes(book)) return false;
    }
    return true;
  };

  // Fetch Hebrew text from Sefaria API
  const fetchHebrewText = async (ref: string): Promise<string | null> => {
    try {
      const parsed = parseReference(ref);
      if (!parsed) return null;
      
      const bookKey = parsed.book.toLowerCase();
      const sefariaBook = HEBREW_BOOKS[bookKey];
      if (!sefariaBook) return null;
      
      // Format: Genesis.1.1 (dot separator)
      const chapterVerse = parsed.verse 
        ? `${parsed.chapter}.${parsed.verse}`
        : `${parsed.chapter}.1`;
      
      const response = await fetch(`https://www.sefaria.org/api/texts/${sefariaBook}.${chapterVerse}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.he && data.he.length > 0) {
        // Clean HTML tags and entities, preserve line breaks
        const cleanHebrew = data.he
          .map((line: string) => line
            .replace(/<[^>]*>/g, '')
            .replace(/&thinsp;/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/<br\s*\/?>/gi, '\n'))
          .join('\n');
        return cleanHebrew;
      }
      return null;
    } catch {
      return null;
    }
  };

  const getGreekText = (ref: string): string | null => {
    const match = ref.match(/^([a-zA-Z\s]+)\s*(\d+)\s*:\s*(\d+)$/i);
    if (!match) return null;
    
    const book = match[1].trim();
    const chapter = parseInt(match[2]);
    const verse = parseInt(match[3]);
    const bookKey = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();
    const verseKey = `${chapter}:${verse}`;
    
    if (SBL_GREEK_NT[bookKey]?.[verseKey]) {
      return SBL_GREEK_NT[bookKey][verseKey];
    }
    
    if (bookKey === "John" && chapter === 3) {
      return SBL_GREEK_NT["John"]?.["3:16"] || null;
    }
    
    return null;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);
    setOriginalText(null);

    try {
      // 如果选择中文圣经，使用内置数据
      if (selectedTranslation === "cuv") {
        const match = searchInput.match(/^([a-zA-Z\s]+)\s*(\d+)\s*:\s*(\d+)$/i);
        if (match) {
          const book = match[1].trim();
          const chapter = match[2];
          const verse = match[3];
          const verseKey = `${chapter}:${verse}`;
          const bookKey = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();
          
          const chineseText = CHINESE_BIBLE[bookKey]?.[verseKey];
          if (chineseText) {
            setResult({
              reference: `${bookKey} ${verseKey}`,
              verses: [{ verse: parseInt(verse), text: chineseText }],
              translation: "cuv",
              translationName: "中文和合本（繁体）"
            });
            
            // 同时获取原文（希腊语或希伯来语）
            if (!isOldTestament(searchInput)) {
              const greek = getGreekText(searchInput);
              if (greek) {
                setOriginalText(greek);
                setOriginalLabel("希腊语原文 (Greek SBLGNT)");
              }
            } else {
              const hebrew = await fetchHebrewText(searchInput);
              if (hebrew) {
                setOriginalText(hebrew);
                setOriginalLabel("希伯来语原文 (Hebrew - Sefaria)");
              }
            }
          } else {
            setError(`抱歉，中文和合本暂无此经文。我们收录了约40节常用经文。`);
          }
        } else {
          setError("请输入正确格式的经文，如：John 3:16");
        }
      } else {
        // 英文圣经使用 API
        const cleanRef = searchInput.trim().replace(/\s+/g, "%20");
        const response = await fetch(`${BIBLE_API}/${cleanRef}?translation=${selectedTranslation}`);
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        setResult({
          reference: data.reference,
          verses: data.verses?.map((v: any) => ({ verse: v.verse, text: v.text })) || [{ verse: 1, text: data.text }],
          translation: data.translation_id,
          translationName: data.translation_name
        });

        if (!isOldTestament(searchInput)) {
          const greek = getGreekText(searchInput);
          if (greek) {
            setOriginalText(greek);
            setOriginalLabel("希腊语原文 (Greek SBLGNT)");
          }
        } else {
          // Fetch Hebrew for Old Testament
          const hebrew = await fetchHebrewText(searchInput);
          if (hebrew) {
            setOriginalText(hebrew);
            setOriginalLabel("希伯来语原文 (Hebrew - Sefaria)");
          }
        }
      }
      
    } catch (err: any) {
      setError(err.message || "无法获取经文，请检查输入格式");
    } finally {
      setLoading(false);
    }
  };

  const handleRandomVerse = async () => {
    const randomVerses = [
      "John 3:16", "Psalms 23:1", "Proverbs 3:5", "Isaiah 40:31",
      "Romans 8:28", "Genesis 1:1", "Exodus 3:14", "Matthew 11:28",
      "John 1:1", "Romans 3:23", "John 14:6", "1 John 4:19"
    ];
    const randomRef = randomVerses[Math.floor(Math.random() * randomVerses.length)];
    setSearchInput(randomRef);
    setLoading(true);
    setError("");
    
    try {
      // 如果选择中文圣经，使用内置数据
      if (selectedTranslation === "cuv") {
        const match = randomRef.match(/^([a-zA-Z\s]+)\s*(\d+)\s*:\s*(\d+)$/i);
        if (match) {
          const book = match[1].trim();
          const chapter = match[2];
          const verse = match[3];
          const verseKey = `${chapter}:${verse}`;
          const bookKey = book.charAt(0).toUpperCase() + book.slice(1).toLowerCase();
          
          const chineseText = CHINESE_BIBLE[bookKey]?.[verseKey];
          if (chineseText) {
            setResult({
              reference: `${bookKey} ${verseKey}`,
              verses: [{ verse: parseInt(verse), text: chineseText }],
              translation: "cuv",
              translationName: "中文和合本（繁体）"
            });
            
            // 获取原文
            if (!isOldTestament(randomRef)) {
              const greek = getGreekText(randomRef);
              if (greek) {
                setOriginalText(greek);
                setOriginalLabel("希腊语原文 (Greek SBLGNT)");
              }
            } else {
              const hebrew = await fetchHebrewText(randomRef);
              if (hebrew) {
                setOriginalText(hebrew);
                setOriginalLabel("希伯来语原文 (Hebrew - Sefaria)");
              }
            }
          }
        }
      } else {
        // 英文圣经使用 API
        const response = await fetch(`${BIBLE_API}/${randomRef}?translation=${selectedTranslation}`);
        if (!response.ok) throw new Error("Failed");
        
        const data = await response.json();
        setResult({
          reference: data.reference,
          verses: data.verses?.map((v: any) => ({ verse: v.verse, text: v.text })) || [{ verse: 1, text: data.text }],
          translation: data.translation_id,
          translationName: data.translation_name
        });
        
        if (!isOldTestament(randomRef)) {
          const greek = getGreekText(randomRef);
          if (greek) {
            setOriginalText(greek);
            setOriginalLabel("希腊语原文 (Greek SBLGNT)");
          } else {
            setOriginalText(null);
          }
        } else {
          const hebrew = await fetchHebrewText(randomRef);
          if (hebrew) {
            setOriginalText(hebrew);
            setOriginalLabel("希伯来语原文 (Hebrew - Sefaria)");
          } else {
            setOriginalText(null);
          }
        }
      }
    } catch {
      setError("获取随机经文失败");
    } finally {
      setLoading(false);
    }
  };

  const currentTranslation = TRANSLATIONS.find(t => t.code === selectedTranslation);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">📖 经文阅读 Bible</h1>
        <p className="text-gray-600">免费经文 API · {currentTranslation?.description}</p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="输入经文，如：John 3:16"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
          >
            {loading ? "加载中..." : "查询"}
          </button>
          <button
            type="button"
            onClick={handleRandomVerse}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
          >
            🎲
          </button>
        </form>

        {/* Translation Selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {TRANSLATIONS.map((t) => (
            <button
              key={t.code}
              onClick={() => setSelectedTranslation(t.code)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedTranslation === t.code
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">正在加载经文...</p>
        </div>
      )}

      {/* Result Display */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Main Translation */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-bold">{result.reference}</h2>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {result.translationName}
                </span>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-800 leading-relaxed text-xl font-serif">
                {result.verses.map((verse, index) => (
                  <span key={index}>
                    <sup className="text-blue-600 font-bold text-sm mx-0.5">{verse.verse}</sup>
                    {verse.text}{" "}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Original Greek Text */}
          {originalText && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg overflow-hidden border-2 border-amber-200">
              <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-6 py-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xl font-bold">🇬🇷 {originalLabel}</h3>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    SBL Greek NT
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-2xl leading-loose font-serif text-gray-800">
                  {originalText}
                </p>
                <div className="mt-4 text-sm text-amber-700 bg-amber-100 rounded-lg p-3">
                  💡 希腊语经文使用 <strong>SBL Greek New Testament</strong> 文本，这是学术标准希腊语新约圣经。
                </div>
              </div>
            </div>
          )}

          {/* No Greek Available */}
          {!originalText && !isOldTestament(result.reference) && (
            <div className="bg-gray-100 rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🇬🇷</span>
                <h3 className="text-lg font-bold text-gray-700">希腊语原文</h3>
              </div>
              <p className="text-gray-500 text-sm">
                此经文的希腊语原文暂未收录。SBL Greek NT 已收录 John 1, 3:16, Romans 3:23, 8:28 等常用经文。
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow">
            <span className="text-sm text-gray-500">
              共 {result.verses.length} 节经文
              {originalText && <span className="ml-2 text-green-600">✓ 含希腊语原文</span>}
            </span>
            <div className="flex gap-2">
              <button onClick={handleRandomVerse} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                🎲 随机经文
              </button>
              <button 
                onClick={() => {
                  const text = `${result.reference}\n\n${result.verses.map(v => `(${v.verse}) ${v.text}`).join(" ")}`;
                  navigator.clipboard.writeText(text);
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
              >
                📋 复制
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature List */}
      {!result && !loading && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">✨ 功能特点</h3>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-start gap-2"><span>📖</span><span>KJV、WEB 英文版本</span></li>
            <li className="flex items-start gap-2"><span>📖</span><span>CUV 中文和合本</span></li>
            <li className="flex items-start gap-2"><span>🔍</span><span>快速查询经文</span></li>
            <li className="flex items-start gap-2"><span>🎲</span><span>随机经文功能</span></li>
            <li className="flex items-start gap-2"><span>🇬🇷</span><span>希腊语原文（SBLGNT）</span></li>
            <li className="flex items-start gap-2"><span>📋</span><span>一键复制经文</span></li>
          </ul>
        </div>
      )}
    </div>
  );
}
