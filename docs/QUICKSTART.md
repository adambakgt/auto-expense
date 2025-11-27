# 빠른 시작 가이드

이 가이드는 경비 처리 자동화 MVP를 최대한 빠르게 실행하는 방법을 안내합니다.

## 1단계: 환경 변수 설정 (5분)

1. 프로젝트 루트에 `.env.local` 파일 생성
2. `docs/ENV_TEMPLATE.md` 파일을 참고하여 환경 변수 입력
3. Supabase와 OpenAI API 키가 필요합니다

## 2단계: Supabase 설정 (10분)

### 데이터베이스 스키마 실행

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. 좌측 메뉴 > **SQL Editor** 클릭
3. **New query** 클릭
4. `supabase/schema.sql` 파일의 전체 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭 (또는 Cmd/Ctrl + Enter)

### Storage 버킷 생성

1. 좌측 메뉴 > **Storage** 클릭
2. **New bucket** 클릭
3. 버킷 이름: `receipts`
4. **Public bucket** 체크박스 활성화
5. **Create bucket** 클릭
6. 동일한 방법으로 `card-uploads` 버킷도 생성

### API 키 복사

1. Settings > **API** 메뉴로 이동
2. **Project URL** 복사 → `.env.local`의 `NEXT_PUBLIC_SUPABASE_URL`에 붙여넣기
3. **anon public** 키 복사 → `.env.local`의 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 붙여넣기

## 3단계: 개발 서버 실행 (1분)

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 4단계: 테스트 (5분)

1. **회원가입**
   - 랜딩 페이지에서 "회원가입" 클릭
   - 이름, 이메일, 비밀번호 입력
   - 회원가입 완료

2. **영수증 업로드 테스트**
   - 대시보드에서 "영수증 업로드하기" 클릭
   - 영수증 이미지 파일 선택 (JPEG, PNG, WebP)
   - AI 분석 완료 대기 (약 5-10초)
   - 자동으로 작성된 지출결의서 확인
   - "제출" 클릭

3. **지출결의서 확인**
   - 대시보드 하단에서 제출한 결의서 확인
   - 카드 클릭하여 상세 페이지 확인

## 문제 해결

### Node.js 버전 경고
현재 Node.js 16을 사용 중이시라면, Node.js 18 이상으로 업그레이드를 권장합니다:
- [nvm](https://github.com/nvm-sh/nvm) 사용: `nvm install 18 && nvm use 18`
- 또는 [Node.js 공식 사이트](https://nodejs.org/)에서 다운로드

### Supabase 연결 오류
- `.env.local` 파일의 Supabase URL과 Key가 올바른지 확인
- Supabase 프로젝트가 활성 상태인지 확인
- SQL 스키마가 정상적으로 실행되었는지 확인

### OpenAI API 오류
- API Key가 올바른지 확인
- OpenAI 계정에 충분한 크레딧이 있는지 확인
- API 할당량을 초과하지 않았는지 확인

### 이미지 업로드 실패
- Supabase Storage 버킷이 Public으로 설정되어 있는지 확인
- 버킷 이름이 정확히 `receipts`, `card-uploads`인지 확인

## 다음 단계

- `docs/QA_CHECKLIST.md`를 참고하여 전체 기능 테스트
- `docs/DEPLOYMENT.md`를 참고하여 프로덕션 배포

