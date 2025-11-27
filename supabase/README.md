# Supabase 데이터베이스 설정 가이드

## 초기 설정 (처음 한 번만)

### 1단계: 기존 데이터 삭제 (선택사항)

기존에 테이블이 있다면 먼저 삭제하세요:

**옵션 A: 우리가 만든 테이블만 삭제** (profiles, expenses, card_uploads만)
1. Supabase 대시보드 > **SQL Editor** 열기
2. **New query** 클릭
3. `supabase/reset.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭

**옵션 B: 모든 커스텀 테이블 삭제** (okrs 등 다른 테이블도 모두 삭제)
1. Supabase 대시보드 > **SQL Editor** 열기
2. **New query** 클릭
3. `supabase/reset-all.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭
5. ⚠️ **주의**: 이 스크립트는 public 스키마의 모든 커스텀 테이블을 삭제합니다!

### 2단계: 스키마 생성

1. SQL Editor에서 **New query** 클릭
2. `supabase/schema.sql` 파일의 전체 내용을 복사하여 붙여넣기
3. **Run** 버튼 클릭

### 3단계: Storage 버킷 생성

1. 좌측 메뉴 > **Storage** 클릭
2. **New bucket** 클릭
3. 버킷 설정:
   - **Name**: `receipts`
   - **Public bucket**: ✅ 체크 (활성화)
   - **File size limit**: 5MB (또는 원하는 크기)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
4. **Create bucket** 클릭
5. 동일한 방법으로 `card-uploads` 버킷도 생성:
   - **Name**: `card-uploads`
   - **Public bucket**: ✅ 체크
   - **File size limit**: 10MB
   - **Allowed MIME types**: `application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv`

## 확인 사항

설정이 완료되면 다음을 확인하세요:

- [ ] `profiles` 테이블이 생성되었는지 확인 (Table Editor에서 확인)
- [ ] `expenses` 테이블이 생성되었는지 확인
- [ ] `card_uploads` 테이블이 생성되었는지 확인
- [ ] `receipts` Storage 버킷이 생성되었는지 확인
- [ ] `card-uploads` Storage 버킷이 생성되었는지 확인
- [ ] RLS 정책이 활성화되어 있는지 확인 (Table Editor > 각 테이블 > Policies)

## 문제 해결

### 오류: "relation already exists"
- `reset.sql`을 먼저 실행하여 기존 테이블을 삭제하세요

### 오류: "permission denied"
- Supabase 프로젝트의 소유자인지 확인하세요
- SQL Editor에서 실행 중인지 확인하세요 (API가 아닌 대시보드에서)

### Storage 버킷이 보이지 않음
- Storage 메뉴에서 새로고침하세요
- 버킷 이름에 오타가 없는지 확인하세요

