-- Supabase 초기화 스크립트
-- 기존 테이블과 데이터를 모두 삭제하고 깨끗한 상태로 만듭니다
-- 주의: 이 스크립트는 모든 데이터를 삭제합니다!

-- 1. 기존 트리거 삭제 (테이블이 존재할 때만)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'expenses') THEN
    DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
  END IF;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. 기존 함수 삭제
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 3. 기존 정책 삭제 (테이블이 존재할 때만)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'expenses') THEN
    DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
    DROP POLICY IF EXISTS "Users can insert own expenses" ON expenses;
    DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
    DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'card_uploads') THEN
    DROP POLICY IF EXISTS "Users can view own card uploads" ON card_uploads;
    DROP POLICY IF EXISTS "Users can insert own card uploads" ON card_uploads;
    DROP POLICY IF EXISTS "Users can update own card uploads" ON card_uploads;
  END IF;
END $$;

-- 4. 기존 테이블 삭제 (외래 키 제약조건 때문에 순서 중요)
-- CASCADE를 사용하여 관련된 모든 객체도 함께 삭제
DROP TABLE IF EXISTS card_uploads CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 5. 인덱스 삭제 (혹시 남아있을 수 있음)
DROP INDEX IF EXISTS idx_expenses_user_id;
DROP INDEX IF EXISTS idx_expenses_expense_date;
DROP INDEX IF EXISTS idx_card_uploads_user_id;

-- 6. 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '기존 테이블과 데이터가 모두 삭제되었습니다. 이제 schema.sql을 실행하세요.';
END $$;

