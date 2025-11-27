// 이미지 확대 모달 컴포넌트

"use client";

import { useEffect } from "react";

interface ImageModalProps {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({
  imageUrl,
  alt,
  isOpen,
  onClose,
}: ImageModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // 모달이 열릴 때 body 스크롤 방지 및 마진 제거
      const originalOverflow = document.body.style.overflow;
      const originalMargin = document.body.style.margin;
      const originalPadding = document.body.style.padding;

      document.body.style.overflow = "hidden";
      document.body.style.margin = "0";
      document.body.style.padding = "0";

      // html 요소도 확인
      if (document.documentElement) {
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = originalOverflow;
        document.body.style.margin = originalMargin;
        document.body.style.padding = originalPadding;

        if (document.documentElement) {
          document.documentElement.style.margin = "";
          document.documentElement.style.padding = "";
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 flex items-center justify-center bg-black bg-opacity-75"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
      }}
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
          aria-label="닫기"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 이미지 */}
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()} // 이미지 클릭 시 모달이 닫히지 않도록
        />
      </div>
    </div>
  );
}
