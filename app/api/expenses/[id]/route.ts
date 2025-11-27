// 지출결의서 수정 및 삭제 API Route

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: 지출결의서 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: '지출결의서를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('지출결의서 조회 오류:', error);
    return NextResponse.json(
      { error: error.message || '지출결의서를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 지출결의서 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const updateData: any = {};

    if (body.expense_date) updateData.expense_date = body.expense_date;
    if (body.merchant_name) updateData.merchant_name = body.merchant_name;
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
    if (body.category) updateData.category = body.category;
    if (body.account_code !== undefined) updateData.account_code = body.account_code || null;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.status) updateData.status = body.status;

    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: '지출결의서를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('지출결의서 수정 오류:', error);
    return NextResponse.json(
      { error: error.message || '지출결의서를 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 지출결의서 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('지출결의서 삭제 오류:', error);
    return NextResponse.json(
      { error: error.message || '지출결의서를 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

