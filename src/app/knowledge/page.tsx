"use client";

import { useState } from "react";

interface KnowledgeItem {
  id: string;
  title: string;
  titleEn: string;
  emoji: string;
  summary: string;
  content: string[];
  bgColor: string;
  borderColor: string;
}

const knowledgeData: KnowledgeItem[] = [
  {
    id: "israel",
    title: "以色列概况",
    titleEn: "Israel Overview",
    emoji: "🇮🇱",
    summary: "了解以色列国的地理、历史与现状",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
    content: [
      "以色列国位于中东，地处地中海东岸，北接黎巴嫩，东北邻叙利亚，东邻约旦，南邻埃及加沙地带和红海。",
      "国土面积约22,000平方公里，从北到南全长约470公里，最宽处约135公里。",
      "地形多样：北部为山脉和丘陵，中部为中央山谷，南部为内盖夫沙漠，西部为沿海平原。",
      "气候以地中海型为主，冬季温暖多雨，夏季炎热干燥。主要语言为希伯来语和阿拉伯语。",
      "以色列是世界上唯一以犹太人为主体民族的国家，首都为耶路撒冷。",
      "1948年建国，作为犹太民族回归先祖之地的重要历史事件，实现了几千年来犹太人的复国梦想。",
      "经济发达，在科技、農業、醫藥等領域有重要貢獻，被稱為「創新之國」。"
    ]
  },
  {
    id: "jerusalem",
    title: "耶路撒冷地理",
    titleEn: "Jerusalem Geography",
    emoji: "🕍",
    summary: "圣城耶路撒冷的地形与分区",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-400",
    content: [
      "耶路撒冷位于以色列中部，海拔约800米，是一座建在山丘上的城市。",
      "城市主要分为老城和新城区。老城面积约1平方公里，被城墙环绕。",
      "老城分为四个区域：犹太区、基督区、穆斯林区和亚美尼亚区。",
      "圣殿山位于老城东北部，是犹太教最神圣的地方，第一、第二圣殿曾建于此。",
      "西墙（哭墙）位于圣殿山西侧，是第二圣殿残留的唯一遗迹，是犹太教最神圣的祈祷场所。",
      "基督教圣墓教堂位于老城基督区，据说是耶稣被钉十字架、埋葬和复活的地方。",
      "圆顶清真寺（金顶清真寺）坐落在圣殿山上，是耶路撒冷最著名的地标之一。",
      "橄榄山位于老城东侧，从山顶可俯瞰老城全景，也是观看日出的绝佳地点。"
    ]
  },
  {
    id: "plants",
    title: "圣经动植物",
    titleEn: "Biblical Plants & Animals",
    emoji: "🌿",
    summary: "圣经中提到的植物与动物",
    bgColor: "bg-green-50",
    borderColor: "border-green-400",
    content: [
      "葡萄树：以色列最重要的农作物之一，在圣经中象征以色列和神的子民。\"我是真葡萄树\"（约15:1）",
      "无花果树：地中海地区常见果树，象征和平与富足。",
      "橄榄树：象征平安与圣灵，鸽子叼回橄榄枝是挪亚洪水后平安的预兆。",
      "香柏木：黎巴嫩香柏木在圣经中象征力量与尊贵，所罗门用香柏木建造圣殿。",
      "吗哪：以色列人在旷野获得的神奇食物，象征基督是\"生命的粮\"。",
      "羔羊：逾越节的羔羊预表耶稣为世人的罪被钉十字架。",
      "鸽子：圣灵的象征，耶稣受洗时圣灵如鸽子降下。",
      "鱼：在加利利海捕鱼是早期门徒的重要活动，\"得人如得鱼\"是耶稣的呼召。"
    ]
  },
  {
    id: "history",
    title: "历史背景",
    titleEn: "Historical Background",
    emoji: "📜",
    summary: "从族长时期到现代的历史脉络",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-400",
    content: [
      "族长时期（约公元前2000-1800年）：亚伯拉罕、以撒、雅各的故事，以色列民族的起源。",
      "出埃及（约公元前1446年）：摩西带领以色列人出埃及，过红海，接受律法。",
      "士师时期（约公元前1380-1050年）：以色列人进入迦南后，在士师治理下的分散时期。",
      "统一王国时期（约公元前1050-930年）：扫罗、大卫、所罗门三位国王，以色列达到鼎盛。",
      "分裂王国时期（约公元前930-586年）：分为北国以色列和南国犹大。",
      "被掳时期（约公元前586-538年）：巴比伦攻陷耶路撒冷，犹大人被掳至巴比伦。",
      "回归与重建（约公元前538-400年）：波斯帝国允许犹大人回归，重建圣殿和城墙。",
      "希腊化和马加比时期：亚历山大大帝征服后，希腊文化影响加深，马加比起义恢复宗教自由。"
    ]
  },
  {
    id: "culture",
    title: "文化背景",
    titleEn: "Cultural Background",
    emoji: "🎭",
    summary: "希伯来文化与传统",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-400",
    content: [
      "安息日（Shabbat）：每周五日落到周六日落，是犹太教最神圣的时间，纪念神创世后休息。",
      "割礼：男婴出生第八天行割礼，是与神立约的标记。",
      "逾越节（Passover）：纪念以色列人出埃及，食用无酵饼和苦菜。",
      "住棚节（Sukkot）：纪念以色列人在旷野住帐篷的时期。",
      "五经（Torah）：摩西五经是犹太教律法的核心，包括创世、出埃及、利未记、民数记、申命记。",
      "会堂（Synagogue）：犹太人聚会、学习和祈祷的场所。",
      "洁净与不洁净：犹太律法中关于食物和日常生活的规定。",
      "希伯来新年（Rosh Hashanah）和赎罪日（Yom Kippur）：犹太历最重要的两个节日。"
    ]
  }
];

export default function KnowledgePage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeItem = activeId ? knowledgeData.find((item) => item.id === activeId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-900 mb-2">📚 知识库 Knowledge</h1>
      <p className="text-gray-600 mb-8">探索圣经相关的背景知识，包括以色列历史、地理、文化等内容</p>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {knowledgeData.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(activeId === item.id ? null : item.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              activeId === item.id
                ? `${item.bgColor} ${item.borderColor} shadow-lg scale-105`
                : "bg-white border-gray-200 hover:border-green-400 hover:shadow-md"
            }`}
          >
            <div className="text-3xl mb-2">{item.emoji}</div>
            <h3 className="font-bold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.titleEn}</p>
            <p className="text-sm text-gray-600 mt-2">{item.summary}</p>
          </button>
        ))}
      </div>

      {/* Detailed Content */}
      {activeItem && (
        <div className={`${activeItem.bgColor} rounded-xl border-2 ${activeItem.borderColor} p-6 shadow-lg`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{activeItem.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{activeItem.title}</h2>
              <p className="text-gray-500">{activeItem.titleEn}</p>
            </div>
          </div>
          <div className="space-y-3">
            {activeItem.content.map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <button
            onClick={() => setActiveId(null)}
            className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            关闭
          </button>
        </div>
      )}

      {/* All Topics Summary */}
      {!activeId && (
        <div className="bg-white rounded-xl shadow-md p-6 mt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📖 内容概览</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            {knowledgeData.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <span>{item.emoji}</span>
                <div>
                  <span className="font-medium text-gray-800">{item.title}</span>
                  <span> — {item.summary}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">
            点击上方任意主题卡片查看详细内容
          </p>
        </div>
      )}
    </div>
  );
}
