# 🤖 MVP 개발 Agent 정의

이 문서는 CursorAI의 Plan Mode와 Agent Mode에서 사용할 Agent들을 정의합니다.
각 Agent는 명확한 역할과 책임을 가지며, 순차적으로 실행됩니다.

---

## 📋 Agent 실행 순서

```
Phase 0: 프로젝트 초기화
├─ Agent 1: File Structure Organizer
└─ Agent 2: Environment Setup

Phase 1: 분석 & 설계
├─ Agent 3: Product Analyzer
├─ Agent 4: System Architect
├─ Agent 5: Database Designer
└─ Agent 6: UI/UX Designer

Phase 2: 개발 준비
├─ Agent 7: Component Library Setup
├─ Agent 8: Auth Specialist
└─ Agent 5: Database Designer (테이블 생성 가이드)

Phase 3: 기능 개발
├─ Agent 9: Frontend Developer
├─ Agent 10: API Route Builder
├─ Agent 11: Backend Developer
└─ Agent 12: Admin Builder

Phase 4: 통합 & 배포
├─ Agent 13: Integration Specialist
├─ Agent 14: QA Tester
└─ Agent 15: Deployment Guide
```

---

## 🔧 Phase 0: 프로젝트 초기화

### Agent 1: File Structure Organizer
**역할**: 프로젝트 폴더 구조 생성 및 기본 파일 세팅

**입력**:
- IDEA.md의 product 정보

**작업**:
1. Next.js 프로젝트 기본 구조 생성
2. 필요한 디렉토리 생성 (app, components, lib, etc.)
3. 기본 설정 파일 생성 (tsconfig.json, tailwind.config.js)
4. README.md 작성 (프로젝트 설명, 실행 방법)

**출력**:
```
/project-root
├── app/
│   └── page.tsx (기본 홈페이지)
├── components/
│   └── ui/
├── lib/
├── public/
├── .gitignore
├── package.json (의존성 목록)
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

**비개발자 가이드**:
- 프로젝트의 뼈대를 만드는 단계입니다
- 각 폴더의 역할을 README.md에 설명합니다

---

### Agent 2: Environment Setup
**역할**: 개발 환경 구성 및 의존성 설치

**입력**:
- 프로젝트 구조

**작업**:
1. package.json에 필요한 의존성 추가
   - Next.js, React, TypeScript
   - Tailwind CSS
   - Supabase 클라이언트
   - 기타 필수 라이브러리
2. .env.local 템플릿 생성
3. 설치 가이드 작성

**출력**:
```bash
# .env.local (템플릿)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**비개발자 가이드**:
```
1. 터미널에서 `npm install` 실행
2. Supabase 웹사이트에서 프로젝트 생성
3. API 키 복사해서 .env.local에 붙여넣기
4. `npm run dev` 실행하면 개발 서버 시작
```

---

## 🎯 Phase 1: 분석 & 설계

### Agent 3: Product Analyzer
**역할**: IDEA.md를 분석하고 MVP 범위 정의

**입력**:
- IDEA.md 전체 내용

**작업**:
1. 아이디어의 핵심 가치 추출
2. 타겟 사용자 분석
3. 문제 해결 방식 정의
4. MVP에 포함할 기능 vs 제외할 기능 구분
5. 유사 서비스 참고 (있다면)

**출력**:
```markdown
# 제품 분석 결과

## 핵심 가치
[IDEA.md의 goal을 기반으로 정리]

## 타겟 사용자
- 주요 사용자: [target]
- 해결하려는 문제: [problem]
- 원하는 감정: [desired_emotion]

## MVP 기능 범위
### ✅ 필수 기능 (Phase 1)
1. 로그인/회원가입
2. [아이디어 기반 핵심 기능 3-5개]

### ⭐ 추가 기능 (Phase 2)
[나중에 추가할 기능들]

### ❌ 제외 기능
[MVP에는 불필요한 기능들]
```

---

### Agent 4: System Architect
**역할**: 기술 스택 및 시스템 구조 설계

**입력**:
- Product Analyzer의 기능 목록

**작업**:
1. 페이지/라우트 구조 설계
2. 컴포넌트 계층 구조 설계
3. API 엔드포인트 설계 (필요시)
4. 데이터 흐름 정의

**출력**:
```markdown
# 시스템 아키텍처

## 페이지 구조
/                    → 홈/랜딩 페이지
/login               → 로그인
/signup              → 회원가입
/dashboard           → 사용자 대시보드
/admin               → 관리자 페이지
/[아이디어별 페이지들]

## 컴포넌트 구조
- Layout 컴포넌트 (Header, Footer, Sidebar)
- UI 컴포넌트 (Button, Input, Card, Modal)
- Form 컴포넌트 (LoginForm, SignupForm, [커스텀 폼들])
- Feature 컴포넌트 ([아이디어별 주요 기능])

## API Routes (필요시)
/api/[엔드포인트 목록]

## 데이터 흐름
[사용자 → 프론트엔드 → Supabase → 데이터베이스]
```

---

### Agent 5: Database Designer
**역할**: Supabase 데이터베이스 스키마 상세 설계

**입력**:
- System Architect의 시스템 구조
- Product Analyzer의 기능 요구사항

**작업**:
1. 필요한 테이블 정의
2. 각 테이블의 컬럼 (필드명, 타입, 제약조건)
3. 테이블 간 관계 (Foreign Key)
4. RLS(Row Level Security) 정책 설계
5. 인덱스 설계

**출력**: SQL 스크립트 및 테이블 설명 문서

**비개발자 가이드**:
```
Supabase 대시보드에서 할 일:
1. Table Editor 열기
2. "New Table" 클릭
3. 위의 SQL을 "SQL Editor"에 복사해서 실행
4. Authentication > Policies에서 RLS 정책 확인
```

---

### Agent 6: UI/UX Designer
**역할**: 화면 구조 및 사용자 플로우 설계

**입력**:
- IDEA.md (desired_emotion 중요)
- System Architect의 페이지 구조

**작업**:
1. 주요 페이지별 와이어프레임 설명
2. 사용자 플로우 다이어그램
3. UI 컴포넌트 목록
4. 색상/폰트 가이드 (Tailwind 기반)
5. 반응형 디자인 고려사항

**출력**: 와이어프레임 설명 및 디자인 가이드 문서

---

## 🚀 Phase 2: 개발 준비

### Agent 7: Component Library Setup
**역할**: 재사용 가능한 UI 컴포넌트 라이브러리 구축

**입력**:
- UI/UX Designer의 컴포넌트 목록

**작업**:
1. shadcn/ui 설치 및 설정 (선택사항)
2. 기본 UI 컴포넌트 생성
   - Button, Input, Card, Modal 등
3. Tailwind CSS 커스텀 설정
4. 컴포넌트 Storybook/예제 작성

**출력**: components/ui/ 디렉토리의 기본 컴포넌트들

**비개발자 가이드**:
- 이 컴포넌트들은 앱 전체에서 재사용됩니다
- 일관된 디자인을 유지하기 위한 기본 빌딩 블록입니다

---

### Agent 8: Auth Specialist
**역할**: Supabase 인증 구현 (로그인/회원가입)

**입력**:
- .env.local의 Supabase 설정
- Database Designer의 RLS 정책

**작업**:
1. Supabase 클라이언트 설정 (lib/supabase.ts)
2. 회원가입 기능 구현
3. 로그인 기능 구현
4. 로그아웃 기능 구현
5. 보호된 라우트 설정 (Middleware)
6. 사용자 세션 관리

**출력**: 
- lib/supabase.ts
- lib/auth.ts
- app/login/page.tsx
- app/signup/page.tsx
- middleware.ts

**비개발자 가이드**:
```
Supabase 설정:
1. Supabase 대시보드 > Authentication 확인
2. Email 인증 활성화 (기본적으로 켜져있음)
3. 테스트 계정 만들어보기
```

---

## 💻 Phase 3: 기능 개발

### Agent 9: Frontend Developer
**역할**: 주요 페이지 및 사용자 기능 구현

**입력**:
- UI/UX Designer의 와이어프레임
- Component Library의 UI 컴포넌트
- Database Designer의 테이블 구조

**작업**:
1. 홈/랜딩 페이지 구현
2. 사용자 대시보드 구현
3. [아이디어별 주요 기능 페이지] 구현
4. 폼 validation
5. 로딩 상태 처리
6. 에러 처리 UI

**출력**: app/ 디렉토리의 주요 페이지 컴포넌트들

---

### Agent 10: API Route Builder
**역할**: Next.js API Routes 생성 (필요시)

**입력**:
- System Architect의 API 명세
- Database Designer의 테이블 구조

**작업**:
1. /app/api/ 엔드포인트 생성
2. Supabase 서버 사이드 호출
3. 요청 validation
4. 에러 처리
5. 응답 형식 표준화

**출력**: app/api/ 디렉토리의 API 라우트들

**비개발자 가이드**:
- API Routes는 서버에서 실행되는 백엔드 코드입니다
- 민감한 작업(관리자 기능 등)은 여기서 처리합니다
- 프론트엔드에서 fetch로 호출합니다

---

### Agent 11: Backend Developer
**역할**: 비즈니스 로직 및 데이터 처리 함수 구현

**입력**:
- Database Designer의 테이블 구조
- Product Analyzer의 기능 요구사항

**작업**:
1. CRUD 함수 작성 (lib/database.ts)
2. 비즈니스 로직 구현
3. 데이터 검증 함수
4. 유틸리티 함수
5. 에러 핸들링

**출력**:
- lib/database.ts
- lib/validation.ts
- lib/utils.ts

---

### Agent 12: Admin Builder
**역할**: 관리자 페이지 및 기능 구현

**입력**:
- Product Analyzer의 관리 요구사항
- Backend Developer의 CRUD 함수

**작업**:
1. 관리자 대시보드 페이지
2. 데이터 관리 인터페이스 (테이블/그리드)
3. CRUD 기능 (생성/수정/삭제)
4. 상태 업데이트 기능
5. 권한 체크 로직

**출력**:
- app/admin/page.tsx
- app/admin/[feature]/page.tsx

**비개발자 가이드**:
```
관리자 권한 설정:
1. Supabase > Table Editor > profiles 테이블
2. 자신의 계정에 role = 'admin' 추가
3. 또는 특정 이메일을 코드에 하드코딩 (간단한 방법)
```

---

## 🔗 Phase 4: 통합 & 배포

### Agent 13: Integration Specialist
**역할**: 모든 컴포넌트 통합 및 연결

**입력**:
- 모든 개발된 컴포넌트와 페이지

**작업**:
1. 라우팅 연결 확인
2. 컴포넌트 간 데이터 전달 확인
3. 전역 상태 관리 (필요시 Context API)
4. API 호출 통합
5. 에러 바운더리 설정
6. 로딩 상태 통합

**출력**:
- app/layout.tsx (루트 레이아웃)
- components/layout/Navbar.tsx
- components/layout/Footer.tsx
- lib/context/AuthContext.tsx (선택사항)

---

### Agent 14: QA Tester
**역할**: 기본 테스트 및 버그 체크

**입력**:
- 통합된 전체 애플리케이션

**작업**:
1. 주요 기능 테스트 체크리스트 작성
2. 사용자 시나리오별 테스트
3. 반응형 디자인 확인
4. 에러 케이스 테스트
5. 발견된 이슈 문서화

**출력**: QA_CHECKLIST.md (테스트 체크리스트 및 발견된 이슈 목록)

**비개발자 가이드**:
```
테스트 방법:
1. 위 체크리스트를 하나씩 따라해보세요
2. 문제가 있으면 메모해두세요
3. 친구나 가족에게 부탁해서 써보게 하세요
4. 실제 사용자 관점에서 불편한 점을 찾아보세요
```

---

### Agent 15: Deployment Guide
**역할**: 배포 준비 및 가이드 작성

**입력**:
- 테스트 완료된 애플리케이션

**작업**:
1. 환경 변수 정리
2. Vercel 배포 가이드
3. Supabase 프로덕션 설정
4. 도메인 연결 가이드 (선택사항)
5. 배포 후 체크리스트

**출력**: DEPLOYMENT.md (배포 가이드)

**비개발자 가이드**:
```
가장 중요한 것:
1. GitHub에 코드 올리기
2. Vercel에 연결하기
3. 환경 변수 설정하기

이 3가지만 하면 배포 완료!
나머지는 선택사항입니다.
```

---

## 📝 Agent 사용 가이드

### Plan Mode에서 사용하기
```
1. IDEA.md 작성
2. Cursor Plan Mode 실행
3. "AGENTS.md의 Agent 순서대로 MVP를 개발해줘" 입력
4. Plan Mode가 자동으로 작업 계획 수립
```

### Agent Mode에서 사용하기
```
1. 특정 Agent 선택
2. "Agent [번호]의 작업을 수행해줘" 입력
3. Agent가 해당 역할 수행
4. 다음 Agent로 이동
```

### 팁
- 각 Agent는 순차적으로 실행하는 것이 좋습니다
- 이전 Agent의 산출물을 다음 Agent가 사용합니다
- 문제가 생기면 해당 Agent를 다시 실행하세요
- Phase별로 나누어 진행하면 관리가 쉽습니다

---

## 🎓 비개발자를 위한 전체 워크플로우

```
1. IDEA.md 작성 (5분)
   ↓
2. Phase 0: 프로젝트 초기화 (10분)
   - Agent 1, 2 실행
   - npm install
   - Supabase 계정 생성
   ↓
3. Phase 1: 분석 & 설계 (20분)
   - Agent 3, 4, 5, 6 실행
   - 설계 문서 검토
   ↓
4. Phase 2: 개발 준비 (30분)
   - Agent 7, 8 실행
   - Supabase 테이블 생성
   - 로그인 테스트
   ↓
5. Phase 3: 기능 개발 (1-2시간)
   - Agent 9, 10, 11, 12 실행
   - 각 기능 테스트
   ↓
6. Phase 4: 통합 & 배포 (30분)
   - Agent 13, 14, 15 실행
   - Vercel 배포
   ↓
7. 완료! 🎉
```

---

이 문서를 따라하면 누구나 MVP를 만들 수 있습니다! 🚀
