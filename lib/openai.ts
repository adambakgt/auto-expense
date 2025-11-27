// OpenAI 클라이언트 설정
// 이 파일은 서버 사이드에서만 사용됩니다 (API Routes)

import OpenAI from "openai";

// 클라이언트를 지연 초기화하여 빌드 시 환경 변수가 없어도 오류가 발생하지 않도록 함
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({
    apiKey,
  });
}

// 영수증 이미지를 분석하여 지출결의서 정보 추출
export async function analyzeReceipt(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<{
  expense_date: string;
  merchant_name: string;
  amount: number;
  category: string;
  account_code?: string;
  description: string;
}> {
  const openai = getOpenAIClient();

  // MIME 타입이 지원되는 형식인지 확인 (PNG, JPEG, GIF, WebP)
  const supportedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  const finalMimeType = supportedMimeTypes.includes(mimeType)
    ? mimeType
    : "image/png";

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `당신은 영수증을 분석하여 지출결의서 정보를 추출하는 전문가입니다.
다음 정보를 JSON 형식으로 정확하게 추출해주세요:
- expense_date: 지출 날짜 (YYYY-MM-DD 형식)
- merchant_name: 가맹점명
- amount: 금액 (숫자만, 소수점 포함 가능)
- category: 지출 항목 (식비, 교통비, 사무용품, 통신비, 기타 중 하나)
- account_code: 계정과목 (선택사항, 없으면 null)
- description: 적요 (간단한 설명)

반드시 유효한 JSON 형식으로만 응답하세요.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "이 영수증에서 지출결의서 정보를 추출해주세요.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${finalMimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI API 응답이 비어있습니다.");
  }

  try {
    const result = JSON.parse(content);
    return {
      expense_date: result.expense_date,
      merchant_name: result.merchant_name,
      amount: parseFloat(result.amount),
      category: result.category,
      account_code: result.account_code || null,
      description: result.description || "",
    };
  } catch (error) {
    console.error("JSON 파싱 오류:", error);
    console.error("응답 내용:", content);
    throw new Error("AI 응답을 파싱하는 중 오류가 발생했습니다.");
  }
}
