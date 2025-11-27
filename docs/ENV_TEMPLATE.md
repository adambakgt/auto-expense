# 환경 변수 설정 가이드

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 복사하여 실제 값으로 채워주세요.

```env
# Supabase 설정
# Supabase 대시보드 > Settings > API에서 복사
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI API Key
# https://platform.openai.com/api-keys에서 발급
OPENAI_API_KEY=sk-your-openai-api-key-here
```

## Supabase 설정 방법

1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성 (또는 기존 프로젝트 사용)
3. 프로젝트 대시보드에서:
   - 좌측 메뉴 > **Settings** > **API** 클릭
   - **Project URL** 복사 → `NEXT_PUBLIC_SUPABASE_URL`에 붙여넣기
   - **anon public** 키 복사 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 붙여넣기

## OpenAI API Key 발급 방법

1. [OpenAI Platform](https://platform.openai.com)에 로그인
2. 좌측 메뉴 > **API keys** 클릭
3. **Create new secret key** 클릭
4. 키 이름 입력 후 생성
5. 생성된 키를 복사 (한 번만 표시됨!) → `OPENAI_API_KEY`에 붙여넣기

## 중요 사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함됨)
- 프로덕션 배포 시 Vercel 대시보드에서 환경 변수를 설정해야 합니다
- OpenAI API는 사용량에 따라 비용이 발생합니다
