// 데이터베이스 타입 정의

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  receipt_image_url: string;
  expense_date: string;
  merchant_name: string;
  amount: number;
  category: string;
  account_code: string | null;
  description: string | null;
  status: 'draft' | 'submitted' | 'approved';
  created_at: string;
  updated_at: string;
}

export interface CardUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  upload_date: string;
  status: 'uploaded' | 'processing' | 'completed';
}

// AI OCR 응답 타입
export interface OCRResult {
  expense_date: string;
  merchant_name: string;
  amount: number;
  category: string;
  account_code?: string;
  description: string;
}

// 폼 데이터 타입
export interface ExpenseFormData {
  expense_date: string;
  merchant_name: string;
  amount: number;
  category: string;
  account_code?: string;
  description?: string;
}

