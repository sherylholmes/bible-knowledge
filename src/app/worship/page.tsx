"use client";

import { useState } from "react";

interface Song {
  id: string;
  title: string;
  titleEn: string;
  category: "chinese" | "english" | "hebrew";
  youtubeId: string;
  background?: string;
}

const songs: Song[] = [
  {
    id: "hosanna",
    title: "和撒那",
    titleEn: "Hosanna",
    category: "chinese",
    youtubeId: "33ZlGdNVaG8",
    background: "「和撒那」是圣经中最常见的赞美呼喊之一，源自希伯来语「הוֹשִׁיעָה נָא」（Hoshia-na），意思是「求你拯救」或「赞美归于神」。这首诗歌表达对主耶稣的赞美和敬拜，在新约福音书中，耶稣荣进耶路撒冷时，众人高喊「和撒那！奉主名来的以色列王是应当称颂的！」（约翰福音12:13）"
  },
  {
    id: "lily-of-the-valley",
    title: "谷中百合花",
    titleEn: "The Lily of the Valley",
    category: "english",
    youtubeId: "YofWQiepn18",
    background: "「谷中百合花」是一首经典的基督教赞美诗，歌词取自雅歌2:1「我是沙仑的玫瑰花，是谷中的百合花」。诗歌表达信徒与主之间纯美的关系，主耶稣是那谷中清洁美丽的百合花，在众多试探和忧虑中给予信徒安慰和力量。"
  },
  {
    id: "one-day",
    title: "有一天",
    titleEn: "One Day",
    category: "chinese",
    youtubeId: "p_GoSBedSBw",
    background: "「有一天」是一首充满盼望的敬拜歌曲。歌词传达基督徒对永恒荣耀的盼望——有一天主要再来，擦去我们一切的眼泪，那日将不再有死亡、悲哀、哭号和疼痛。这首歌安慰和鼓励所有仰望主再来的人。"
  },
  {
    id: "jerusalem-of-gold",
    title: "金色的耶路撒冷",
    titleEn: "Jerusalem of Gold",
    category: "hebrew",
    youtubeId: "JH8gtdDA5x0",
    background: "「金色的耶路撒冷」（Yerushalayim Shel Zahav）是以色列最著名的歌曲之一，由 Naomi Shemer 于 1967 年创作。这首歌描绘了耶路撒冷的美丽和神圣，表达了以色列人对这块应许之地的深厚感情。虽然不是传统赞美诗，但在以色列和世界各地的基督徒中也广受欢迎，因为它反映了圣经中圣城耶路撒冷的荣耀。"
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
      <p className="text-gray-600 mb-8">中英文赞美诗、希伯来语敬拜歌曲</p>

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
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>点击播放</span>
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
              {/* YouTube Embed */}
              <div className="mb-6">
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${activeSong.youtubeId}`}
                    title={activeSong.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-xl"
                  ></iframe>
                </div>
              </div>

              {/* Background */}
              {activeSong.background && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2">📖 诗歌背景</h3>
                  <p className="text-gray-700 text-sm">{activeSong.background}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      {!activeSong && filteredSongs.length > 0 && (
        <div className="bg-purple-50 rounded-xl p-6 mt-4">
          <h2 className="font-bold text-purple-900 mb-2">💡 温馨提示</h2>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• 点击任意歌曲卡片查看详情和观看视频</li>
            <li>• 使用顶部分类筛选不同语言的歌曲</li>
            <li>• 输入关键词搜索你想要的歌曲</li>
            <li>• 视频可直接在页面内播放</li>
          </ul>
        </div>
      )}
    </div>
  );
}
