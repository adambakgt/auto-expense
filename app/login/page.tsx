"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const signup = searchParams.get('signup');

  // 회원가입 완료 후 리다이렉트된 경우 이메일 인증 메시지 생성
  const emailConfirmationMessage =
    signup === 'success' && email
      ? `회원가입이 완료되었습니다! ${email}로 인증 이메일을 발송했습니다. 이메일을 확인하여 계정을 활성화해주세요.`
      : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
        <p className="text-gray-600 mb-6">경비 처리 자동화 시스템에 로그인하세요</p>

        <AuthForm mode="login" emailConfirmationMessage={emailConfirmationMessage} />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

