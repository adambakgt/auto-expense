// 지출결의서 통계 계산 유틸리티 함수

import { Expense } from "@/lib/types";

/**
 * 이번 달 지출결의서 필터링
 * @param expenses 전체 지출결의서 목록
 * @returns 이번 달 지출결의서 목록
 */
export function calculateThisMonthExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter((expense) => {
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
}

/**
 * 지출결의서 목록의 총 금액 계산
 * @param expenses 지출결의서 목록
 * @returns 총 금액
 */
export function calculateTotalAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}
