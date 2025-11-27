-- Supabase 완전 초기화 스크립트
-- 모든 커스텀 테이블, 함수, 트리거를 삭제합니다
-- 주의: 이 스크립트는 public 스키마의 모든 커스텀 객체를 삭제합니다!

-- 1. 모든 커스텀 테이블 삭제 (public 스키마의 모든 테이블)
DO $$
DECLARE
    r RECORD;
BEGIN
    -- 모든 테이블 목록 가져오기
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        RAISE NOTICE 'Dropped table: %', r.tablename;
    END LOOP;
END $$;

-- 2. 모든 커스텀 함수 삭제 (public 스키마)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT proname, oidvectortypes(proargtypes) as argtypes
        FROM pg_proc
        WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        AND proname NOT LIKE 'pg_%'
    ) 
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.argtypes || ') CASCADE';
        RAISE NOTICE 'Dropped function: %', r.proname;
    END LOOP;
END $$;

-- 3. auth.users 트리거 삭제
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '모든 커스텀 테이블과 함수가 삭제되었습니다. 이제 schema.sql을 실행하세요.';
END $$;

