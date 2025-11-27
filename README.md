# 경비 처리 자동화 MVP

AI 기반 지출결의서 자동 생성 및 누락 탐지 도우미

## 프로젝트 소개

영수증만 업로드하면 AI가 지출결의서를 자동으로 작성하고, 카드내역과 비교해 누락된 결제건을 자동으로 찾아주는 경비 처리 자동화 솔루션입니다.

## 주요 기능

- 📸 영수증 이미지 업로드 (드래그앤드롭)
- 🤖 AI 기반 영수증 OCR 및 지출결의서 자동 생성
- 📋 지출결의서 목록 조회 및 상세 보기
- 📊 카드내역 Excel 업로드 (추후 매칭 기능 추가 예정)
- 🔐 Supabase 인증 (로그인/회원가입)

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **데이터베이스**: Supabase
- **인증**: Supabase Auth
- **AI**: OpenAI GPT-4 Vision API

## 시작하기

### 빠른 시작

**처음 사용하시나요?** → [`QUICKSTART.md`](QUICKSTART.md)를 먼저 읽어보세요!

### 사전 요구사항

- Node.js 18.17.0 이상 (권장: Node.js 20.x)
- npm 9.0.0 이상
- Supabase 계정
- OpenAI API 계정

### 단계별 설정

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   - [`ENV_TEMPLATE.md`](ENV_TEMPLATE.md)를 참고하여 `.env.local` 파일 생성
   - Supabase와 OpenAI API 키가 필요합니다

3. **Supabase 설정**
   - [`QUICKSTART.md`](QUICKSTART.md)의 "2단계: Supabase 설정" 참고
   - SQL 스키마 실행 및 Storage 버킷 생성 필요

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 설정 체크리스트

모든 설정이 올바른지 확인하려면 [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md)를 참고하세요.

## 프로젝트 구조

```
/auto-expense
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 랜딩 페이지
│   ├── login/             # 로그인
│   ├── signup/            # 회원가입
│   ├── dashboard/         # 대시보드
│   └── api/               # API Routes
├── components/            # React 컴포넌트
│   ├── ui/               # UI 컴포넌트
│   └── layout/           # 레이아웃 컴포넌트
├── lib/                  # 유틸리티 및 설정
│   ├── supabase/        # Supabase 클라이언트
│   └── types.ts         # TypeScript 타입
└── public/              # 정적 파일
```

## 문서

- **[docs/QUICKSTART.md](docs/QUICKSTART.md)**: 빠른 시작 가이드 (처음 사용자 추천)
- **[docs/SETUP_CHECKLIST.md](docs/SETUP_CHECKLIST.md)**: 설정 체크리스트
- **[docs/ENV_TEMPLATE.md](docs/ENV_TEMPLATE.md)**: 환경 변수 설정 가이드
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**: Vercel 배포 가이드
- **[docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md)**: QA 테스트 체크리스트

## 배포

Vercel을 사용한 배포를 권장합니다. 자세한 내용은 [`DEPLOYMENT.md`](DEPLOYMENT.md)를 참고하세요.

## 라이선스

MIT

