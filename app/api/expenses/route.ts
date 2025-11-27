// 지출결의서 목록 조회 및 생성 API Route

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: 지출결의서 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 쿼리 파라미터에서 정렬 옵션 가져오기
    const { searchParams } = new URL(request.url);
    const orderBy = searchParams.get('orderBy') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order(orderBy, { ascending: order === 'asc' });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('지출결의서 목록 조회 오류:', error);
    return NextResponse.json(
      { error: error.message || '지출결의서 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 지출결의서 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      receipt_image_url,
      expense_date,
      merchant_name,
      amount,
      category,
      account_code,
      description,
      status = 'submitted',
    } = body;

    // 필수 필드 검증
    if (!receipt_image_url || !expense_date || !merchant_name || !amount || !category) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // profiles 테이블에 사용자가 있는지 확인하고 없으면 생성
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      // 프로필이 없으면 생성
      const { error: insertProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null,
        });

      if (insertProfileError) {
        console.error('프로필 생성 오류:', insertProfileError);
        return NextResponse.json(
          { error: '프로필을 생성할 수 없습니다.' },
          { status: 500 }
        );
      }
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        receipt_image_url,
        expense_date,
        merchant_name,
        amount: parseFloat(amount),
        category,
        account_code: account_code || null,
        description: description || null,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error('지출결의서 생성 오류 상세:', {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        user_id: user.id,
      });
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('지출결의서 생성 오류:', error);
    return NextResponse.json(
      { error: error.message || '지출결의서를 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

