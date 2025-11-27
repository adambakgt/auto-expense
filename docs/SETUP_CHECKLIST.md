# 설정 체크리스트

프로젝트를 실행하기 전에 다음 항목들을 확인하세요.

## ✅ 환경 확인

- [ ] Node.js 버전 확인
  ```bash
  node --version  # 18.17.0 이상이어야 함
  ```
  - Node.js 16을 사용 중이라면 업그레이드 필요
  - [nvm](https://github.com/nvm-sh/nvm) 사용: `nvm install 20 && nvm use 20`

- [ ] npm 버전 확인
  ```bash
  npm --version  # 9.0.0 이상 권장
  ```

- [ ] 의존성 설치 완료
  ```bash
  npm install
  ```

## ✅ 환경 변수 설정

- [ ] `.env.local` 파일 생성
- [ ] Supabase URL 설정 (`NEXT_PUBLIC_SUPABASE_URL`)
- [ ] Supabase Anon Key 설정 (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] OpenAI API Key 설정 (`OPENAI_API_KEY`)

자세한 내용은 `docs/ENV_TEMPLATE.md` 참고

## ✅ Supabase 설정

- [ ] Supabase 프로젝트 생성
- [ ] SQL 스키마 실행 (`supabase/schema.sql`)
- [ ] Storage 버킷 생성
  - [ ] `receipts` 버킷 (Public)
  - [ ] `card-uploads` 버킷 (Public)
- [ ] API 키 복사하여 `.env.local`에 설정

## ✅ 프로젝트 빌드 확인

- [ ] TypeScript 컴파일 확인
  ```bash
  npm run build
  ```
  - Node.js 버전이 낮으면 빌드 실패할 수 있음
  - 환경 변수가 없어도 빌드는 가능 (런타임 오류는 발생)

## ✅ 개발 서버 실행

- [ ] 개발 서버 시작
  ```bash
  npm run dev
  ```
- [ ] 브라우저에서 http://localhost:3000 접속
- [ ] 랜딩 페이지가 정상적으로 표시됨

## ✅ 기능 테스트

- [ ] 회원가입 가능
- [ ] 로그인 가능
- [ ] 대시보드 접근 가능
- [ ] 영수증 업로드 가능 (OpenAI API Key 필요)
- [ ] 지출결의서 제출 가능

## 문제 해결

### Node.js 버전 문제
```bash
# nvm 사용 시
nvm install 20
nvm use 20

# 또는 직접 설치
# https://nodejs.org/ 에서 다운로드
```

### 환경 변수 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일명이 정확히 `.env.local`인지 확인 (`.env.local.txt` 아님)
- 환경 변수 값에 따옴표가 없는지 확인

### Supabase 연결 오류
- Supabase 프로젝트가 활성 상태인지 확인
- SQL 스키마가 정상적으로 실행되었는지 확인
- Storage 버킷이 Public으로 설정되어 있는지 확인

### 빌드 오류
- TypeScript 오류 확인: `npm run lint`
- 의존성 재설치: `rm -rf node_modules package-lock.json && npm install`

---

**모든 체크리스트를 완료했다면** `docs/QUICKSTART.md`를 참고하여 실제 기능을 테스트해보세요!

