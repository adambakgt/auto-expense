"use client";

// 인증 폼 컴포넌트 (로그인/회원가입 공통)

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "login" | "signup";
  emailConfirmationMessage?: string | null;
}

export default function AuthForm({
  mode,
  emailConfirmationMessage: initialEmailConfirmationMessage,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailConfirmationMessage, setEmailConfirmationMessage] = useState<
    string | null
  >(initialEmailConfirmationMessage || null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        // 회원가입 - API Route를 통해 서버 사이드에서 처리
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password, // 원본 비밀번호 (서버에서 안전하게 처리)
            fullName,
          }),
          credentials: "include", // 쿠키 포함
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "회원가입에 실패했습니다.");
        }

        if (data.user) {
          // 이메일 인증이 필요한 경우 로그인 페이지로 리다이렉트
          if (data.requiresEmailConfirmation) {
            // 쿼리 파라미터로 이메일 전달하여 로그인 페이지로 이동
            router.push(
              `/login?email=${encodeURIComponent(data.email)}&signup=success`
            );
          } else {
            // 이메일 인증이 필요 없는 경우 (또는 이미 인증된 경우) 대시보드로 이동
            router.push("/dashboard");
            router.refresh();
          }
        }
      } else {
        // 로그인 - API Route를 통해 서버 사이드에서 처리
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password, // 원본 비밀번호 (서버에서 안전하게 처리)
          }),
          credentials: "include", // 쿠키 포함
        });

        const data = await response.json();

        if (!response.ok) {
          // 서버에서 이미 친화적인 메시지로 변환되어 오지만, 추가 변환 가능
          let errorMessage = data.error || "로그인에 실패했습니다.";

          // 클라이언트 사이드에서도 추가 변환 (필요시)
          if (
            errorMessage.includes("Email not confirmed") ||
            errorMessage.includes("이메일 인증")
          ) {
            errorMessage =
              "이메일 인증이 완료되지 않았습니다. 회원가입 시 발송된 이메일을 확인하여 계정을 활성화해주세요.";
          }

          throw new Error(errorMessage);
        }

        // 로그인 성공 시 대시보드로 이동
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이름
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="홍길동"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="example@company.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="6자 이상"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {emailConfirmationMessage && mode === "login" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md text-sm space-y-2">
          <p className="font-medium">{emailConfirmationMessage}</p>
          <p className="text-xs text-blue-600 mt-1">
            이메일을 확인하지 못하셨나요? 스팸 폴더도 확인해보세요.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
      </button>
    </form>
  );
}
