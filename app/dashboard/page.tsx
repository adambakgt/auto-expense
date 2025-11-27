"use client";

// 통합 대시보드 페이지
// 동적 렌더링 강제 (클라이언트 전용 라이브러리 사용으로 인해)
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import ReceiptUploadZone from "@/components/ReceiptUploadZone";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseCard from "@/components/ExpenseCard";
import ExpenseListItem from "@/components/ExpenseListItem";
import ExpenseListSkeleton from "@/components/ExpenseListSkeleton";
import StatCardSkeleton from "@/components/StatCardSkeleton";
import UploadHistorySkeleton from "@/components/UploadHistorySkeleton";
import FileUpload from "@/components/ui/FileUpload";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Expense, ExpenseFormData, CardUpload } from "@/lib/types";
import {
  formatCurrency,
  sanitizeFileName,
  resizeImage,
  formatDate,
} from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewType, setViewType] = useState<"card" | "list">("card"); // 기본값으로 시작 (서버와 동일)
  const [isClient, setIsClient] = useState(false);
  // 카드내역 업로드 관련 state
  const [cardUploads, setCardUploads] = useState<CardUpload[]>([]);
  const [cardUploadLoading, setCardUploadLoading] = useState(true);
  const [cardUploading, setCardUploading] = useState(false);
  const [cardUploadError, setCardUploadError] = useState<string | null>(null);
  const [showCardUpload, setShowCardUpload] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // 클라이언트 마운트 후 localStorage에서 뷰 타입 불러오기 (Hydration 오류 방지)
  useEffect(() => {
    setIsClient(true);
    const savedViewType = localStorage.getItem("expense-view-type");
    if (savedViewType === "card" || savedViewType === "list") {
      setViewType(savedViewType);
    }
  }, []);

  // 지출결의서 목록 불러오기
  useEffect(() => {
    fetchExpenses();
  }, []);

  // 카드내역 업로드 목록 불러오기
  const fetchCardUploads = async () => {
    try {
      const response = await fetch("/api/card-uploads", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("목록을 불러오는데 실패했습니다.");
      const data = await response.json();
      setCardUploads(data);
    } catch (error) {
      console.error("카드내역 업로드 목록 조회 오류:", error);
    } finally {
      setCardUploadLoading(false);
    }
  };

  useEffect(() => {
    fetchCardUploads();
  }, []);

  // 카드내역 파일 업로드 처리
  const handleCardFileSelect = async (file: File) => {
    setCardUploading(true);
    setCardUploadError(null);

    try {
      // Excel/CSV 파일만 허용
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      const allowedExtensions = [".xls", ".xlsx", ".csv"];

      const fileExtension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      const isValidType =
        allowedTypes.includes(file.type) ||
        allowedExtensions.includes(fileExtension);

      if (!isValidType) {
        throw new Error(
          "Excel (.xls, .xlsx) 또는 CSV 파일만 업로드 가능합니다."
        );
      }

      // FormData 생성
      const formData = new FormData();
      formData.append("file", file);

      // API 호출
      const response = await fetch("/api/card-uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "업로드에 실패했습니다.");
      }

      // 성공 시 목록 새로고침 및 업로드 UI 닫기
      await fetchCardUploads();
      setShowCardUpload(false);
      alert("카드내역이 업로드되었습니다.");
    } catch (err: any) {
      setCardUploadError(err.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setCardUploading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses", {
        credentials: "include", // 쿠키를 포함하여 인증 정보 전달
      });
      if (!response.ok) throw new Error("목록을 불러오는데 실패했습니다.");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("지출결의서 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 영수증 이미지를 Supabase Storage에 업로드
  const uploadReceiptImage = async (file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("인증이 필요합니다.");

      // 이미지 리사이징 (최대 1920x1920, 품질 85%)
      // 용량을 줄이기 위해 업로드 전에 리사이징
      let fileToUpload = file;
      if (file.type.startsWith("image/")) {
        try {
          console.log("이미지 리사이징 시작...");
          fileToUpload = await resizeImage(file, 1920, 1920, 0.85);
          console.log("이미지 리사이징 완료");
        } catch (resizeError: any) {
          console.warn(
            "이미지 리사이징 실패, 원본 파일 사용:",
            resizeError.message
          );
          // 리사이징 실패 시 원본 파일 사용
        }
      }

      // 파일명 생성 (타임스탬프 + 안전한 파일명)
      // 한글 및 특수문자를 제거하여 URL-safe하게 처리
      const safeFileName = sanitizeFileName(fileToUpload.name);
      const fileName = `${user.id}/${Date.now()}_${safeFileName}`;

      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage
        .from("receipts")
        .upload(fileName, fileToUpload, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Storage 업로드 오류:", {
          error: error.message,
          errorDetails: error,
          fileName,
          userId: user.id,
        });
        throw error;
      }

      // 공개 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("receipts").getPublicUrl(data.path);

      return publicUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  // AI 분석 완료 후 폼 데이터 설정
  const handleAnalysisComplete = async (data: ExpenseFormData, file: File) => {
    console.log("handleAnalysisComplete 호출됨:", { data, file });
    try {
      setFormData(data);
      setReceiptFile(file);
      setShowUpload(false);
      console.log("상태 업데이트 완료");
    } catch (error) {
      console.error("상태 업데이트 오류:", error);
    }
  };

  // 지출결의서 제출
  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      // 영수증 이미지 업로드
      let imageUrl = "";
      if (receiptFile) {
        imageUrl = await uploadReceiptImage(receiptFile);
      }

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receipt_image_url: imageUrl,
          ...data,
          status: "submitted",
        }),
        credentials: "include", // 쿠키를 포함하여 인증 정보 전달
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "제출에 실패했습니다.");
      }

      // 성공 시 목록 새로고침 및 폼 초기화
      await fetchExpenses();
      setFormData(null);
      setReceiptFile(null);
      alert("지출결의서가 제출되었습니다.");
    } catch (error: any) {
      throw error;
    }
  };

  // 통계 계산 (이번 달 지출)
  const thisMonthExpenses = expenses.filter((expense) => {
    try {
      // expense_date가 문자열 형식 (YYYY-MM-DD)인 경우 안전하게 파싱
      const expenseDateStr = expense.expense_date;
      if (!expenseDateStr) return false;

      // YYYY-MM-DD 형식에서 년/월 추출
      const [year, month] = expenseDateStr.split("-").map(Number);
      if (!year || !month) return false;

      // 현재 날짜의 년/월
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1

      // 년/월 비교
      return year === currentYear && month === currentMonth;
    } catch (error) {
      console.error("날짜 파싱 오류:", expense.expense_date, error);
      return false;
    }
  });

  const totalAmount = thisMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // 디버깅용 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("통계 계산:", {
      전체건수: expenses.length,
      이번달건수: thisMonthExpenses.length,
      이번달총액: totalAmount,
      현재날짜: new Date().toISOString().split("T")[0],
      이번달지출: thisMonthExpenses.map((e) => ({
        날짜: e.expense_date,
        금액: e.amount,
      })),
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>이번 달 지출 건수</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {thisMonthExpenses.length}건
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>이번 달 총 지출액</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totalAmount)}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* 영수증 업로드 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>영수증 업로드</CardTitle>
          </CardHeader>
          <CardContent>
            {!showUpload && !formData && (
              <Button onClick={() => setShowUpload(true)}>
                영수증 업로드하기
              </Button>
            )}

            {showUpload && !formData && (
              <div className="space-y-4">
                <ReceiptUploadZone
                  onAnalysisComplete={handleAnalysisComplete}
                />
                <Button variant="outline" onClick={() => setShowUpload(false)}>
                  취소
                </Button>
              </div>
            )}

            {formData && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI가 작성한 지출결의서
                </h3>
                <p className="text-sm text-gray-600">
                  아래 내용을 확인하고 수정한 후 제출해주세요.
                </p>
                <ExpenseForm
                  initialData={formData}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setFormData(null);
                    setReceiptFile(null);
                    setShowUpload(false);
                  }}
                  receiptImageFile={receiptFile || undefined}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 지출결의서 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>지출결의서 목록</CardTitle>
              <div className="flex items-center gap-2">
                {/* 뷰 타입 전환 버튼 */}
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => {
                      setViewType("card");
                      // localStorage에 저장
                      if (typeof window !== "undefined") {
                        localStorage.setItem("expense-view-type", "card");
                      }
                    }}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      viewType === "card"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-label="카드 보기"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setViewType("list");
                      // localStorage에 저장
                      if (typeof window !== "undefined") {
                        localStorage.setItem("expense-view-type", "list");
                      }
                    }}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      viewType === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-label="리스트 보기"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ExpenseListSkeleton count={6} viewType={viewType} />
            ) : expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                아직 제출한 지출결의서가 없습니다.
              </p>
            ) : viewType === "list" ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {expenses.map((expense) => (
                  <ExpenseListItem key={expense.id} expense={expense} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 카드내역 업로드 */}
        <Card>
          <CardHeader>
            <CardTitle>카드내역 업로드</CardTitle>
          </CardHeader>
          <CardContent>
            {!showCardUpload ? (
              <Button onClick={() => setShowCardUpload(true)}>
                카드내역 업로드하기
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  카드 승인내역 Excel 또는 CSV 파일을 업로드하세요. (추후 자동
                  매칭 기능이 추가될 예정입니다)
                </p>

                <FileUpload
                  onFileSelect={handleCardFileSelect}
                  accept={{
                    "application/vnd.ms-excel": [".xls"],
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                      [".xlsx"],
                    "text/csv": [".csv"],
                  }}
                  maxSize={10 * 1024 * 1024} // 10MB
                  disabled={cardUploading}
                  description="Excel (.xls, .xlsx) 또는 CSV 파일 (최대 10MB)"
                />

                {cardUploadError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {cardUploadError}
                  </div>
                )}

                {cardUploading && (
                  <div className="text-sm text-gray-600">업로드 중...</div>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCardUpload(false);
                    setCardUploadError(null);
                  }}
                >
                  취소
                </Button>
              </div>
            )}

            {/* 업로드 히스토리 */}
            {!showCardUpload && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  업로드 히스토리
                </h4>
                {cardUploadLoading ? (
                  <UploadHistorySkeleton count={3} />
                ) : cardUploads.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 text-sm">
                    아직 업로드한 카드내역이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {cardUploads.map((upload) => {
                      const statusColors = {
                        uploaded: "default",
                        processing: "warning",
                        completed: "success",
                      } as const;

                      const statusLabels = {
                        uploaded: "업로드됨",
                        processing: "처리 중",
                        completed: "완료",
                      };

                      return (
                        <div
                          key={upload.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {upload.file_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(upload.upload_date)}
                            </p>
                          </div>
                          <Badge variant={statusColors[upload.status]}>
                            {statusLabels[upload.status]}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
