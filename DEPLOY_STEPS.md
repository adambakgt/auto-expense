# 배포 단계별 가이드

## 1단계: Git 저장소 초기화 및 GitHub 푸시

### 로컬에서 실행할 명령어:

```bash
# 1. Git 저장소 초기화
git init

# 2. 모든 파일 추가 (단, .env.local은 제외됨 - .gitignore에 포함)
git add .

# 3. 첫 커밋
git commit -m "Initial commit: 경비 처리 자동화 MVP"

# 4. main 브랜치로 설정
git branch -M main
```

### GitHub에서:

1. [GitHub](https://github.com)에 로그인
2. 우측 상단 **+** 버튼 > **New repository** 클릭
3. 저장소 이름: `auto-expense` (또는 원하는 이름)
4. **Public** 또는 **Private** 선택
5. **Initialize this repository with a README** 체크 해제 (이미 README가 있음)
6. **Create repository** 클릭

### 다시 로컬에서:

```bash
# 5. GitHub 저장소 연결 (your-username을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/your-username/auto-expense.git

# 6. GitHub에 푸시
git push -u origin main
```

## 2단계: Vercel 배포

### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인 (GitHub 계정으로 로그인 권장)
2. 대시보드에서 **Add New Project** 클릭
3. **Import Git Repository**에서 방금 만든 GitHub 저장소 선택
4. **Import** 클릭

### 2. 프로젝트 설정

- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

### 3. 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수 추가:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

**중요**:
- `.env.local` 파일에서 값을 복사하세요
- 각 변수를 **Production**, **Preview**, **Development** 모두에 추가하세요
- `OPENAI_API_KEY`는 `NEXT_PUBLIC_` 접두사가 **없습니다**

### 4. 배포 실행

1. **Deploy** 버튼 클릭
2. 배포 진행 상황 확인 (약 2-3분 소요)
3. 배포 완료 후 제공되는 URL 확인

## 3단계: 배포 후 확인

### 필수 확인 사항

1. **랜딩 페이지 확인**
   - 배포된 URL 접속
   - 페이지가 정상적으로 로드되는지 확인

2. **회원가입/로그인 테스트**
   - 새 계정 생성
   - 로그인 확인

3. **기능 테스트**
   - 영수증 업로드
   - AI 분석 확인
   - 지출결의서 제출
   - 목록 조회

### 문제 발생 시

- Vercel 대시보드 > **Logs** 탭에서 에러 확인
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성 상태인지 확인

## 4단계: 자동 배포 설정 (완료)

GitHub에 코드를 푸시하면 Vercel이 자동으로 재배포합니다:

```bash
git add .
git commit -m "변경사항 설명"
git push
```

---

**다음 단계**: 위의 명령어들을 순서대로 실행하세요!

