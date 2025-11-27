// 지출결의서 목록 섹션 컴포넌트

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import ExpenseCard from "@/components/ExpenseCard";
import ExpenseListItem from "@/components/ExpenseListItem";
import ExpenseListSkeleton from "@/components/ExpenseListSkeleton";
import { Expense } from "@/lib/types";
import { useViewType } from "@/hooks/useViewType";

interface ExpenseListSectionProps {
  expenses: Expense[];
  loading: boolean;
}

export default function ExpenseListSection({
  expenses,
  loading,
}: ExpenseListSectionProps) {
  const { viewType, setViewType } = useViewType();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>지출결의서 목록</CardTitle>
          <div className="flex items-center gap-2">
            {/* 뷰 타입 전환 버튼 */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewType("card")}
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
                onClick={() => setViewType("list")}
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
  );
}
