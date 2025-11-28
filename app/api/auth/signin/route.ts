// 로그인 API Route
// 서버 사이드에서 비밀번호를 안전하게 처리

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 로그인 (Supabase가 서버에서 비밀번호를 검증)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password, // 원본 비밀번호 (Supabase가 서버에서 검증)
    });

    if (error) {
      // 사용자 친화적인 에러 메시지로 변환
      let userFriendlyMessage = error.message;

      if (error.message === "Email not confirmed") {
        userFriendlyMessage =
          "이메일 인증이 완료되지 않았습니다. 회원가입 시 발송된 이메일을 확인하여 계정을 활성화해주세요.";
      } else if (error.message === "Invalid login credentials") {
        userFriendlyMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (error.message.includes("email")) {
        userFriendlyMessage = "이메일 주소를 확인해주세요.";
      } else if (error.message.includes("password")) {
        userFriendlyMessage = "비밀번호를 확인해주세요.";
      }

      return NextResponse.json({ error: userFriendlyMessage }, { status: 401 });
    }

    // 세션 쿠키 설정을 위해 응답 헤더에 쿠키 추가
    const response = NextResponse.json(
      { user: data.user, session: data.session },
      { status: 200 }
    );

    return response;
  } catch (error: any) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      { error: error.message || "로그인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
