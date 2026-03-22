import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          📖 圣经知识库
        </h1>
        <p className="text-xl text-gray-600">
          Your comprehensive Bible study resource
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Link href="/bible" className="block">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-2 border-transparent hover:border-blue-500 h-full">
            <div className="text-4xl mb-4">📖</div>
            <h2 className="text-xl font-bold text-blue-900 mb-2">经文阅读 Bible</h2>
            <p className="text-gray-600">KJV、WEB英文版本及CUV中文译本，希伯来语原文</p>
          </div>
        </Link>

        <Link href="/knowledge" className="block">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-2 border-transparent hover:border-green-500 h-full">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-green-900 mb-2">知识库 Knowledge</h2>
            <p className="text-gray-600">以色列概况、耶路撒冷地理、圣经动植物等</p>
          </div>
        </Link>

        <Link href="/worship" className="block">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-2 border-transparent hover:border-purple-500 h-full">
            <div className="text-4xl mb-4">🎵</div>
            <h2 className="text-xl font-bold text-purple-900 mb-2">敬拜歌曲 Worship</h2>
            <p className="text-gray-600">中英文赞美诗、希伯来语敬拜歌曲、YouTube视频</p>
          </div>
        </Link>
      </div>

      {/* About Section */}
      <div className="bg-blue-50 rounded-xl p-8 mt-12">
        <h3 className="text-xl font-bold text-blue-900 mb-4">关于我们</h3>
        <p className="text-gray-700">
          欢迎来到圣经知识库！我们为使用中文和英文的基督徒及圣经学习者提供全面的资源服务。
          探索多语言圣经译本、原著希伯来语知识，以及丰富的敬拜诗歌。
        </p>
      </div>
    </div>
  );
}
