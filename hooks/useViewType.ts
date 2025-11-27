// 뷰 타입 관리 커스텀 훅 (카드/리스트 전환)

import { useState, useEffect } from "react";

type ViewType = "card" | "list";

/**
 * 지출결의서 목록 뷰 타입 관리 훅
 * localStorage에 사용자 설정을 저장하여 다음 방문 시에도 유지
 * Hydration 오류 방지를 위해 클라이언트에서만 localStorage 접근
 */
export function useViewType() {
  // 기본값은 'card'로 시작 (서버와 클라이언트 모두 동일)
  const [viewType, setViewTypeState] = useState<ViewType>("card");

  // 클라이언트 마운트 후 localStorage에서 뷰 타입 불러오기
  useEffect(() => {
    const savedViewType = localStorage.getItem("expense-view-type");
    if (savedViewType === "card" || savedViewType === "list") {
      setViewTypeState(savedViewType);
    }
  }, []);

  // 뷰 타입 변경 함수 (localStorage에 자동 저장)
  const setViewType = (type: ViewType) => {
    setViewTypeState(type);
    if (typeof window !== "undefined") {
      localStorage.setItem("expense-view-type", type);
    }
  };

  return { viewType, setViewType };
}
