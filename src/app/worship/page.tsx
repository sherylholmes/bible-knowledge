"use client";

import { useState } from "react";

interface Song {
  id: string;
  title: string;
  titleEn: string;
  category: "chinese" | "english" | "hebrew";
  lyrics: string[];
  youtubeId?: string;
  background?: string;
}

const songs: Song[] = [
  {
    id: "amazing-grace",
    title: "奇异恩典",
    titleEn: "Amazing Grace",
    category: "english",
    youtubeId: "yC6r_5kZqV4",
    background: "约翰·牛顿（John Newton）于1779年创作，是世界上最著名的赞美诗之一。约翰·牛顿曾是奴隶贸易商，后成为牧师，这首歌表达了他从罪恶中得到救赎的感恩之情。",
    lyrics: [
      "Amazing grace, how sweet the sound",
      "That saved a wretch like me",
      "I once was lost, but now am found",
      "Was blind but now I see",
      "",
      "'Twas grace that taught my heart to fear",
      "And grace my fears relieved",
      "How precious did that grace appear",
      "The hour I first believed"
    ]
  },
  {
    id: "what-a-friend",
    title: "千古保障",
    titleEn: "What a Friend We Have in Jesus",
    category: "english",
    youtubeId: "Da86kRpuXaM",
    background: "由约瑟·史克文（Joseph Scriven）于1855年创作，词曲优美，表达了信徒与主耶稣之间亲密的友谊和倚靠。史克文曾经历两次失去未婚妻的痛苦，这首歌安慰了无数人。",
    lyrics: [
      "What a friend we have in Jesus",
      "All our sins and griefs to bear",
      "What a privilege to carry",
      "Everything to God in prayer",
      "",
      "O what peace we often forfeit",
      "O what needless pain we bear",
      "All because we do not carry",
      "Everything to God in prayer"
    ]
  },
  {
    id: "shinu",
    title: "何等爱慕",
    titleEn: "Shinu (שמעו)",
    category: "hebrew",
    youtubeId: "H1N_cHgK-8U",
    background: "这是一首优美的希伯来语敬拜歌曲，歌词来自申命记6:4-5「以色列啊，你要听！耶和华我们神是独一的主。你要尽心、尽性、尽力爱耶和华你的神。」",
    lyrics: [
      "שמעו עמי ואדברה",
      "ישראל אם לו אבוא",
      "ה' אלהינו ה' אחד",
      "",
      "ואהבת את ה' אלהיך",
      "בכל לבבך ובכל נפשך",
      "ובכל מאדך"
    ]
  },
  {
    id: "ehye",
    title: "自有永有",
    titleEn: "Ehye (אהיה)",
    category: "hebrew",
    youtubeId: "Jl4Lis8FjCU",
    background: "「自有永有」是神在出埃及记3:14对摩西的启示：「我是自有永有的。」这首希伯来语敬拜歌曲表达了神永恒不变的属性。",
    lyrics: [
      "אהיה אשר אהיה",
      "ה' נצח הוא",
      "קדמון ואחרון",
      "מלך עולם",
      "",
      "אני הוא התחלה",
      "וגם הסוף",
      "כבודי לך אענה"
    ]
  },
  {
    id: "ruach",
    title: "圣灵吹拂",
    titleEn: "Ruach (רוח)",
    category: "hebrew",
    youtubeId: "Yl59DrKHE4Q",
    background: "「圣灵啊，我感谢你」是一首充满活力的中文敬拜诗歌，表达对圣灵降临的感恩和渴望。",
    lyrics: [
      "圣灵如鸽子降临",
      "滋润每颗心灵",
      "主的爱如活水江河",
      "流进万国万民",
      "",
      "主啊我们需要你",
      "像需要呼吸空气",
      "圣灵如风随意吹",
      "带来生命的气息"
    ]
  },
  {
    id: "doxology",
    title: "荣耀颂",
    titleEn: "Doxology",
    category: "chinese",
    youtubeId: "X-Rx7-GLxm0",
    background: "「荣耀颂」是基督教崇拜中经典的赞美诗，歌词源自使徒保罗的教导，荣耀归于圣父、圣子、圣灵三位一体的神。",
    lyrics: [
      "荣耀归于圣父圣子圣灵",
      "起初这样",
      "现今这样",
      "以后也这样",
      "",
      "荣耀归与全能的父神",
      "独生的子",
      "和圣灵",
      "真神全能于无穷"
    ]
  },
  {
    id: "holy-holy-holy",
    title: "圣哉圣哉圣哉",
    titleEn: "Holy, Holy, Holy",
    category: "english",
    youtubeId: "oBs2Sk_6Kc4",
    background: "由雷金纳德·希伯（Reginald Heber）作词，于1826年创作。这首歌歌词取自以赛亚书6:3和启示录4:8，表达对圣洁三位一体神的赞美。",
    lyrics: [
      "Holy, holy, holy",
      "Lord God Almighty",
      "Early in the morning",
      "Our song shall rise to Thee",
      "",
      "Holy, holy, holy",
      "Merciful and mighty",
      "God in three persons",
      "Blessed Trinity"
    ]
  },
  {
    id: "be-thou-my-vision",
    title: "为我民爱我永活神",
    titleEn: "Be Thou My Vision",
    category: "english",
    youtubeId: "Y7BDgNotdXw",
    background: "这是一首古老的爱尔兰赞美诗，歌词表达了对神引导的渴望，祈求神成为我们人生各方面的异象和力量。",
    lyrics: [
      "Be thou my vision",
      "O Lord of my heart",
      "Naught be all else to me",
      "Save that thou art",
      "",
      "Thou my best thought",
      "By day or by night",
      "Waking or sleeping",
      "Thy presence my light"
    ]
  }
];

const categories = [
  { id: "all", label: "全部 All", emoji: "🎵" },
  { id: "chinese", label: "中文 Chinese", emoji: "🇨🇳" },
  { id: "english", label: "英文 English", emoji: "🇺🇸" },
  { id: "hebrew", label: "希伯来语 Hebrew", emoji: "🇮🇱" },
];

export default function WorshipPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSongs = songs.filter((song) => {
    const matchesCategory = activeCategory === "all" || song.category === activeCategory;
    const matchesSearch =
      searchTerm === "" ||
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.titleEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-purple-900 mb-2">🎵 敬拜歌曲 Worship</h1>
      <p className="text-gray-600 mb-8">中英文赞美诗、希伯来语敬拜歌曲、YouTube视频</p>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索歌曲... Search songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full transition ${
              activeCategory === cat.id
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-purple-100 border border-gray-200"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Song Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredSongs.map((song) => (
          <button
            key={song.id}
            onClick={() => setActiveSong(song)}
            className="text-left p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-purple-400 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">
                {song.category === "chinese" ? "🇨🇳" : song.category === "english" ? "🇺🇸" : "🇮🇱"}
              </span>
              <div>
                <h3 className="font-bold text-gray-900">{song.title}</h3>
                <p className="text-sm text-gray-500">{song.titleEn}</p>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {song.youtubeId && "🎬 YouTube"}
            </div>
          </button>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">🎵</p>
          <p>没有找到相关歌曲 / No songs found</p>
        </div>
      )}

      {/* Song Detail Modal */}
      {activeSong && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {activeSong.category === "chinese" ? "🇨🇳" : activeSong.category === "english" ? "🇺🇸" : "🇮🇱"}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{activeSong.title}</h2>
                  <p className="text-gray-500">{activeSong.titleEn}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSong(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* YouTube Video */}
              {activeSong.youtubeId && (
                <div className="mb-6">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${activeSong.youtubeId}?rel=0`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeSong.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    ▶️ 在 YouTube 上观看
                  </a>
                </div>
              )}

              {/* Background */}
              {activeSong.background && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2">📖 诗歌背景</h3>
                  <p className="text-gray-700 text-sm">{activeSong.background}</p>
                </div>
              )}

              {/* Lyrics */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4">🎤 歌词 Lyrics</h3>
                <div className="space-y-1 text-gray-700">
                  {activeSong.lyrics.map((line, index) => (
                    <p key={index} className={line === "" ? "h-4" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      {!activeSong && filteredSongs.length > 0 && (
        <div className="bg-purple-50 rounded-xl p-6 mt-4">
          <h2 className="font-bold text-purple-900 mb-2">💡 温馨提示</h2>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• 点击任意歌曲卡片查看详情和视频</li>
            <li>• 使用顶部分类筛选不同语言的歌曲</li>
            <li>• 输入关键词搜索你想要的歌曲</li>
            <li>• 后续将支持更多歌曲和歌词显示</li>
          </ul>
        </div>
      )}
    </div>
  );
}
