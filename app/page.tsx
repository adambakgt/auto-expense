import Navbar from '@/components/layout/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            경비 처리 자동화
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            영수증만 업로드하면 AI가 지출결의서를 자동으로 작성해드립니다
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              로그인
            </a>
            <a
              href="/signup"
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              회원가입
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

