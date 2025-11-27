// 지출결의서 통계 계산 커스텀 훅

import { useMemo } from "react";
import { Expense } from "@/lib/types";
import {
  calculateThisMonthExpenses,
  calculateTotalAmount,
} from "@/lib/utils/expenseStats";

/**
 * 지출결의서 통계 계산 훅
 * @param expenses 전체 지출결의서 목록
 * @returns 이번 달 지출결의서 목록, 총액, 건수
 */
export function useExpenseStats(expenses: Expense[]) {
  const thisMonthExpenses = useMemo(
    () => calculateThisMonthExpenses(expenses),
    [expenses]
  );

  const totalAmount = useMemo(
    () => calculateTotalAmount(thisMonthExpenses),
    [thisMonthExpenses]
  );

  const count = thisMonthExpenses.length;

  // 디버깅용 로그 (개발 환경에서만)
  useMemo(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("통계 계산:", {
        전체건수: expenses.length,
        이번달건수: count,
        이번달총액: totalAmount,
        현재날짜: new Date().toISOString().split("T")[0],
        이번달지출: thisMonthExpenses.map((e) => ({
          날짜: e.expense_date,
          금액: e.amount,
        })),
      });
    }
  }, [expenses.length, count, totalAmount, thisMonthExpenses]);

  return {
    thisMonthExpenses,
    totalAmount,
    count,
  };
}
