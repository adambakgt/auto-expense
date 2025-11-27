// 유틸리티 함수

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS 클래스 병합
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 금액 포맷팅 (천 단위 구분)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

// 날짜 포맷팅
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

// 파일 검증 (이미지 및 PDF 지원)
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB

  // 이미지 파일 또는 PDF 파일인지 확인
  const isImage = file.type.startsWith("image/");
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isImage && !isPdf) {
    return {
      valid: false,
      error: "이미지 파일 또는 PDF 파일만 업로드 가능합니다.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "파일 크기는 10MB 이하여야 합니다.",
    };
  }

  return { valid: true };
}

// PDF를 이미지로 변환하는 함수
export async function convertPdfToImage(file: File): Promise<File> {
  try {
    if (typeof window === "undefined") {
      throw new Error("PDF 변환은 클라이언트 사이드에서만 가능합니다.");
    }

    // pdfjs-dist를 동적으로 import
    const pdfjsLib = await import("pdfjs-dist");
    
    // Worker 설정 (CDN 사용)
    if (pdfjsLib.GlobalWorkerOptions) {
      // Worker를 CDN에서 로드
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    } else {
      throw new Error("PDF.js GlobalWorkerOptions를 찾을 수 없습니다.");
    }

    console.log("PDF 파일 읽기 시작:", file.name, file.size);

    // PDF 파일을 ArrayBuffer로 읽기
    const arrayBuffer = await file.arrayBuffer();
    console.log("PDF ArrayBuffer 크기:", arrayBuffer.byteLength);

    // PDF 문서 로드
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      verbosity: 0, // 로그 레벨 (0 = 오류만)
    }).promise;
    console.log("PDF 문서 로드 완료, 총 페이지 수:", pdf.numPages);

    // 첫 번째 페이지 가져오기 (영수증은 보통 1페이지)
    const page = await pdf.getPage(1);
    console.log("PDF 첫 페이지 로드 완료");

    // 렌더링 옵션 설정
    const viewport = page.getViewport({ scale: 2.0 }); // 해상도 향상을 위해 scale 2.0
    console.log("Viewport 크기:", viewport.width, "x", viewport.height);

    // Canvas 생성
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas context를 가져올 수 없습니다.");
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    console.log("Canvas 생성 완료:", canvas.width, "x", canvas.height);

    // PDF 페이지를 Canvas에 렌더링
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas, // 최신 버전에서 필수
    };

    await page.render(renderContext).promise;
    console.log("PDF 렌더링 완료");

    // Canvas를 Blob으로 변환
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("PDF를 이미지로 변환하는데 실패했습니다."));
            return;
          }

          console.log("Blob 생성 완료, 크기:", blob.size);

          // Blob을 File로 변환
          const imageFile = new File(
            [blob],
            file.name.replace(/\.pdf$/i, ".png"),
            {
              type: "image/png",
              lastModified: Date.now(),
            }
          );

          console.log(
            "PDF → 이미지 변환 완료:",
            imageFile.name,
            imageFile.size
          );
          resolve(imageFile);
        },
        "image/png",
        0.95 // 품질 설정
      );
    });
  } catch (error: any) {
    console.error("PDF 변환 오류 상세:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
    throw new Error(
      `PDF를 이미지로 변환할 수 없습니다: ${error.message || "알 수 없는 오류"}`
    );
  }
}

// 파일을 Base64로 변환
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // data:image/jpeg;base64, 부분 제거
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

// 파일명을 URL-safe하게 변환 (한글 및 특수문자 처리)
export function sanitizeFileName(fileName: string): string {
  // 파일 확장자 추출
  const lastDotIndex = fileName.lastIndexOf(".");
  const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : "";
  const nameWithoutExt = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;

  // 한글 및 특수문자를 제거하고 영문/숫자/하이픈/언더스코어만 유지
  const sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, "_") // 영문, 숫자, 하이픈, 언더스코어 외의 문자를 언더스코어로 변경
    .replace(/_+/g, "_") // 연속된 언더스코어를 하나로
    .replace(/^_|_$/g, ""); // 앞뒤 언더스코어 제거

  // 빈 문자열이면 기본값 사용
  const finalName = sanitized || "file";

  return `${finalName}${extension}`;
}

// 이미지 리사이징 함수 (용량 최적화)
export async function resizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      resolve(file); // 이미지가 아니면 원본 반환
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 원본 크기 확인
        const originalWidth = img.width;
        const originalHeight = img.height;

        // 리사이징 필요 여부 확인
        if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
          // 리사이징 불필요하면 원본 반환
          resolve(file);
          return;
        }

        // 비율 유지하며 리사이징
        let width = originalWidth;
        let height = originalHeight;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Canvas 생성
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context를 가져올 수 없습니다."));
          return;
        }

        // 이미지 그리기 (고품질 리샘플링)
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Canvas를 Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("이미지 리사이징에 실패했습니다."));
              return;
            }

            // Blob을 File로 변환
            const resizedFile = new File(
              [blob],
              file.name,
              {
                type: file.type || "image/jpeg",
                lastModified: Date.now(),
              }
            );

            console.log(
              `이미지 리사이징 완료: ${originalWidth}x${originalHeight} → ${width}x${height}, ` +
              `원본: ${(file.size / 1024).toFixed(2)}KB → 리사이즈: ${(resizedFile.size / 1024).toFixed(2)}KB`
            );

            resolve(resizedFile);
          },
          file.type || "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("이미지를 로드할 수 없습니다."));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("파일을 읽을 수 없습니다."));
    };

    reader.readAsDataURL(file);
  });
}
