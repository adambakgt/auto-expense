# 배포 가이드

이 문서는 경비 처리 자동화 MVP를 Vercel에 배포하는 방법을 안내합니다.

## 사전 준비

### 1. GitHub 저장소 생성

1. GitHub에서 새 저장소 생성
2. 로컬 프로젝트를 GitHub에 푸시:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/auto-expense.git
git push -u origin main
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
3. 프로젝트 설정에서 다음 정보 확인:
   - Project URL
   - Anon Key

#### 데이터베이스 스키마 설정

1. Supabase 대시보드 > SQL Editor 열기
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행
3. Storage 버킷 생성:
   - Storage > Buckets > New Bucket
   - 버킷 이름: `receipts` (Public)
   - 버킷 이름: `card-uploads` (Public)

#### RLS 정책 확인

- 모든 테이블의 RLS가 활성화되어 있는지 확인
- `supabase/schema.sql`의 정책이 모두 적용되었는지 확인

### 3. OpenAI API Key 발급

1. [OpenAI Platform](https://platform.openai.com)에 로그인
2. API Keys 메뉴에서 새 키 생성
3. 키를 안전하게 보관 (한 번만 표시됨)

## Vercel 배포

### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2. 환경 변수 설정

Vercel 대시보드 > Settings > Environment Variables에서 다음 변수 추가:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

**중요**: 
- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에서 접근 가능합니다
- `OPENAI_API_KEY`는 서버 사이드에서만 사용되므로 `NEXT_PUBLIC_` 접두사가 없습니다

### 3. 배포 실행

1. "Deploy" 버튼 클릭
2. 배포 완료까지 대기 (약 2-3분)
3. 배포 완료 후 제공되는 URL로 접속하여 테스트

## 배포 후 체크리스트

### 필수 확인 사항

- [ ] 랜딩 페이지가 정상적으로 로드됨
- [ ] 회원가입 기능이 작동함
- [ ] 로그인 기능이 작동함
- [ ] 대시보드에 접근 가능함
- [ ] 영수증 업로드 기능이 작동함
- [ ] AI 분석이 정상적으로 작동함
- [ ] 지출결의서가 저장되고 조회됨
- [ ] 카드내역 업로드 기능이 작동함

### Supabase 설정 확인

- [ ] Storage 버킷이 Public으로 설정되어 있음
- [ ] RLS 정책이 올바르게 적용되어 있음
- [ ] 프로필 자동 생성 트리거가 작동함

### 환경 변수 확인

- [ ] 모든 환경 변수가 올바르게 설정되어 있음
- [ ] OpenAI API Key가 유효함
- [ ] Supabase URL과 Key가 올바름

## 도메인 연결 (선택사항)

### 커스텀 도메인 설정

1. Vercel 대시보드 > Settings > Domains
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 도메인 제공업체에서 설정
4. SSL 인증서 자동 발급 (약 1-2분 소요)

## 트러블슈팅

### 문제 1: 환경 변수가 적용되지 않음

**해결 방법**:
- Vercel에서 환경 변수 설정 후 재배포 필요
- 환경 변수 이름에 오타가 없는지 확인
- `NEXT_PUBLIC_` 접두사 확인

### 문제 2: Supabase 연결 오류

**해결 방법**:
- Supabase 프로젝트 URL과 Anon Key 확인
- Supabase 프로젝트가 활성 상태인지 확인
- RLS 정책이 올바르게 설정되어 있는지 확인

### 문제 3: OpenAI API 오류

**해결 방법**:
- OpenAI API Key가 유효한지 확인
- API 할당량이 남아있는지 확인
- API 키에 올바른 권한이 있는지 확인

### 문제 4: 이미지 업로드 실패

**해결 방법**:
- Supabase Storage 버킷이 Public으로 설정되어 있는지 확인
- 버킷 이름이 `receipts`, `card-uploads`인지 확인
- Storage 정책이 올바르게 설정되어 있는지 확인

### 문제 5: 빌드 오류

**해결 방법**:
- 로컬에서 `npm run build` 실행하여 오류 확인
- TypeScript 오류 수정
- 의존성 설치 확인 (`npm install`)

## 프로덕션 모니터링

### Vercel Analytics (선택사항)

1. Vercel 대시보드 > Analytics
2. Analytics 활성화
3. 트래픽 및 성능 모니터링

### 에러 로그 확인

1. Vercel 대시보드 > Logs
2. 실시간 로그 확인
3. 에러 발생 시 알림 설정 가능

## 보안 체크리스트

- [ ] 환경 변수가 GitHub에 커밋되지 않음 (`.env.local`이 `.gitignore`에 포함됨)
- [ ] Supabase RLS가 활성화되어 있음
- [ ] OpenAI API Key가 안전하게 관리됨
- [ ] 프로덕션 환경에서 디버그 모드가 비활성화됨

## 성능 최적화

### 이미지 최적화

- Next.js Image 컴포넌트 사용 권장
- Supabase Storage에서 이미지 CDN 활용

### API 응답 최적화

- 필요한 데이터만 조회 (SELECT *)
- 인덱스 활용 확인
- 페이지네이션 구현 (대량 데이터의 경우)

## 업데이트 배포

코드 변경 후 자동 배포:

1. GitHub에 변경사항 푸시
2. Vercel이 자동으로 감지하여 재배포
3. 배포 완료 후 자동으로 새 버전 적용

수동 배포:

1. Vercel 대시보드 > Deployments
2. "Redeploy" 클릭

---

**배포 완료 후**: `docs/QA_CHECKLIST.md`의 항목들을 모두 테스트하여 정상 작동을 확인하세요.

