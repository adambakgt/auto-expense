// OpenAI Vision API를 사용한 영수증 OCR API Route

import { NextRequest, NextResponse } from "next/server";
import { analyzeReceipt } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // 인증 오류 로깅
    if (authError) {
      console.error("인증 오류:", authError);
    }

    if (!user) {
      console.error("사용자 인증 실패 - 사용자 정보 없음");
      // 쿠키 정보 확인 (디버깅용)
      const cookieHeader = request.headers.get("cookie");
      console.log("요청 쿠키:", cookieHeader ? "쿠키 존재" : "쿠키 없음");

      return NextResponse.json(
        { error: "인증이 필요합니다. 로그인 후 다시 시도해주세요." },
        { status: 401 }
      );
    }

    console.log("인증 성공:", user.id);

    // 요청 본문 파싱
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 제공되지 않았습니다." },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    let imageBuffer: Buffer = Buffer.from(arrayBuffer);

    // OpenAI Vision API가 지원하는 이미지 형식 확인
    // 지원 형식: PNG, JPEG, GIF, WebP
    const supportedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    let finalMimeType = "image/png"; // 기본값은 PNG

    // PDF 파일인지 확인
    const isPdf = fileType === "application/pdf" || fileName.endsWith(".pdf");

    // PDF 파일은 클라이언트에서 이미지로 변환되어 전송됨
    // 서버에서는 PDF를 직접 처리하지 않음
    if (isPdf) {
      return NextResponse.json(
        {
          error: "PDF 파일은 클라이언트에서 이미지로 변환되어야 합니다.",
        },
        { status: 400 }
      );
    }

    // 지원되는 형식이면 그대로 사용
    if (supportedTypes.includes(fileType)) {
      finalMimeType = fileType === "image/jpg" ? "image/jpeg" : fileType;
    } else {
      // 지원되지 않는 형식이면 PNG로 변환 시도
      try {
        console.log(`이미지 형식 변환 시도: ${fileType} (${file.name}) → PNG`);

        // sharp를 사용하여 이미지 메타데이터 확인
        const metadata = await sharp(imageBuffer).metadata();
        console.log(`이미지 메타데이터:`, {
          format: metadata.format,
          width: metadata.width,
          height: metadata.height,
          size: imageBuffer.length,
        });

        // PNG로 변환 (품질 유지, 최대 크기 제한)
        imageBuffer = await sharp(imageBuffer)
          .resize(4096, 4096, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .png({
            quality: 100,
            compressionLevel: 6,
          })
          .toBuffer();

        finalMimeType = "image/png";
        console.log(
          `이미지 변환 성공: ${fileType} → PNG (${imageBuffer.length} bytes)`
        );

        // 변환된 이미지가 유효한지 확인
        const verifyMetadata = await sharp(imageBuffer).metadata();
        if (!verifyMetadata.format || verifyMetadata.format !== "png") {
          throw new Error("변환된 이미지가 유효하지 않습니다.");
        }
      } catch (error: any) {
        console.error("이미지 변환 오류 상세:", {
          error: error.message,
          stack: error.stack,
          fileType,
          fileName: file.name,
          fileSize: file.size,
        });

        return NextResponse.json(
          {
            error: `이미지를 처리할 수 없습니다. PNG, JPEG, GIF, WebP 형식의 이미지를 업로드해주세요. (${
              fileType || "알 수 없는 형식"
            })`,
          },
          { status: 400 }
        );
      }
    }

    // 이미지 크기 확인 (20MB 제한)
    if (imageBuffer.length > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "이미지가 너무 큽니다. 최대 20MB까지 지원됩니다." },
        { status: 400 }
      );
    }

    // 이미지를 Base64로 변환
    const base64 = imageBuffer.toString("base64");

    // OpenAI API 호출하여 영수증 분석
    const result = await analyzeReceipt(base64, finalMimeType);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("OCR API 오류:", error);
    return NextResponse.json(
      { error: error.message || "영수증 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
