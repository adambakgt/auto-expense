// 지출결의서 수정 및 삭제 API Route

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "지출결의서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("지출결의서 조회 오류:", error);
    return NextResponse.json(
      {
        error: error.message || "지출결의서를 불러오는 중 오류가 발생했습니다.",
      },
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
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updateData: any = {};

    if (body.expense_date) updateData.expense_date = body.expense_date;
    if (body.merchant_name) updateData.merchant_name = body.merchant_name;
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
    if (body.category) updateData.category = body.category;
    if (body.account_code !== undefined)
      updateData.account_code = body.account_code || null;
    if (body.description !== undefined)
      updateData.description = body.description || null;
    if (body.status) updateData.status = body.status;

    const { data, error } = await supabase
      .from("expenses")
      .update(updateData)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "지출결의서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("지출결의서 수정 오류:", error);
    return NextResponse.json(
      {
        error: error.message || "지출결의서를 수정하는 중 오류가 발생했습니다.",
      },
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
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 먼저 지출결의서 정보 조회 (영수증 이미지 URL 확인용)
    const { data: expense, error: fetchError } = await supabase
      .from("expenses")
      .select("receipt_image_url")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (fetchError) throw fetchError;

    if (!expense) {
      return NextResponse.json(
        { error: "지출결의서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Storage에서 영수증 이미지 파일 삭제
    if (expense.receipt_image_url) {
      try {
        // Supabase Storage URL에서 파일 경로 추출
        // URL 형식: https://{project-id}.supabase.co/storage/v1/object/public/receipts/{user_id}/{filename}
        const url = new URL(expense.receipt_image_url);
        const pathParts = url.pathname.split("/");

        // '/storage/v1/object/public/receipts/{user_id}/{filename}' 형식에서 경로 추출
        const receiptsIndex = pathParts.indexOf("receipts");
        if (receiptsIndex !== -1 && pathParts.length > receiptsIndex + 1) {
          // 'receipts' 이후의 경로를 추출 (user_id/filename)
          const filePath = pathParts.slice(receiptsIndex + 1).join("/");

          console.log("Storage 파일 삭제 시도:", filePath);

          // Storage에서 파일 삭제
          const { error: storageError } = await supabase.storage
            .from("receipts")
            .remove([filePath]);

          if (storageError) {
            console.warn(
              "Storage 파일 삭제 실패 (레코드는 삭제됨):",
              storageError.message
            );
            // Storage 삭제 실패해도 레코드는 삭제 진행
          } else {
            console.log("Storage 파일 삭제 성공:", filePath);
          }
        }
      } catch (urlError: any) {
        console.warn(
          "영수증 이미지 URL 파싱 실패 (레코드는 삭제됨):",
          urlError.message
        );
        // URL 파싱 실패해도 레코드는 삭제 진행
      }
    }

    // 지출결의서 레코드 삭제
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("지출결의서 삭제 오류:", error);
    return NextResponse.json(
      {
        error: error.message || "지출결의서를 삭제하는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
