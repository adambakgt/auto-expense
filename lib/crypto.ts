// 비밀번호 암호화 유틸리티
// Web Crypto API를 사용하여 클라이언트 사이드에서 비밀번호 해시화

/**
 * 비밀번호를 SHA-256으로 해시화
 * @param password 평문 비밀번호
 * @returns 해시화된 비밀번호 (hex 문자열)
 */
export async function hashPassword(password: string): Promise<string> {
  // TextEncoder를 사용하여 문자열을 Uint8Array로 변환
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Web Crypto API를 사용하여 SHA-256 해시 생성
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // ArrayBuffer를 hex 문자열로 변환
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * 비밀번호를 Base64로 인코딩하여 전송
 * @param password 평문 비밀번호
 * @returns Base64 인코딩된 비밀번호
 */
export async function encodePassword(password: string): Promise<string> {
  // SHA-256 해시 생성
  const hash = await hashPassword(password);
  
  // Base64 인코딩 (추가 보안 레이어)
  const encoder = new TextEncoder();
  const data = encoder.encode(hash);
  const base64 = btoa(String.fromCharCode(...data));
  
  return base64;
}

