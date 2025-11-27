-- RLS 정책 재설정 및 확인
-- profiles 테이블에 사용자가 있는지 확인하고, 없으면 생성

-- 1. 기존 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON expenses;

DROP POLICY IF EXISTS "Users can view own card uploads" ON card_uploads;
DROP POLICY IF EXISTS "Users can insert own card uploads" ON card_uploads;
DROP POLICY IF EXISTS "Users can update own card uploads" ON card_uploads;

-- 2. profiles RLS 정책 재생성
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. expenses RLS 정책 재생성
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);

-- 4. card_uploads RLS 정책 재생성
CREATE POLICY "Users can view own card uploads"
  ON card_uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own card uploads"
  ON card_uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own card uploads"
  ON card_uploads FOR UPDATE
  USING (auth.uid() = user_id);

-- 5. 기존 사용자 중 profiles가 없는 경우 자동 생성
INSERT INTO public.profiles (id, email, full_name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '')
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

