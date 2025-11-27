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
      return NextResponse.json({ error: error.message }, { status: 401 });
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

