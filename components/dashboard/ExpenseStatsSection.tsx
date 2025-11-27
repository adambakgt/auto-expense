// 통계 카드 섹션 컴포넌트

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import StatCardSkeleton from "@/components/StatCardSkeleton";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ExpenseStatsSectionProps {
  expenses: Expense[];
  loading: boolean;
}

export default function ExpenseStatsSection({
  expenses,
  loading,
}: ExpenseStatsSectionProps) {
  const { count, totalAmount } = useExpenseStats(expenses);

  return (
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
              <p className="text-3xl font-bold text-gray-900">{count}건</p>
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
  );
}
