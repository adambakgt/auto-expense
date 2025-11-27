// 카드내역 업로드 목록 조회 및 생성 API Route

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: 카드내역 업로드 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('card_uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('카드내역 업로드 목록 조회 오류:', error);
    return NextResponse.json(
      { error: error.message || '카드내역 업로드 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 카드내역 업로드 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 제공되지 않았습니다.' }, { status: 400 });
    }

    // 파일명 생성
    const fileName = `${user.id}/${Date.now()}_${file.name}`;

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('card-uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 공개 URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage.from('card-uploads').getPublicUrl(uploadData.path);

    // 데이터베이스에 기록 저장
    const { data, error } = await supabase
      .from('card_uploads')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: publicUrl,
        status: 'uploaded',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('카드내역 업로드 오류:', error);
    return NextResponse.json(
      { error: error.message || '카드내역 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

