// 회원가입 API Route
// 서버 사이드에서 비밀번호를 안전하게 처리

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 회원가입 (Supabase가 서버에서 비밀번호를 안전하게 해시화)
    const { data, error } = await supabase.auth.signUp({
      email,
      password, // 원본 비밀번호 (Supabase가 서버에서 해시화)
      options: {
        data: {
          full_name: fullName || "",
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 이메일 인증 필요 여부 확인
    // Supabase는 이메일 인증이 활성화되어 있으면 session이 null이고 user가 생성됨
    const requiresEmailConfirmation = !data.session && data.user;

    return NextResponse.json(
      {
        user: data.user,
        requiresEmailConfirmation,
        email: data.user?.email,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { error: error.message || "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

