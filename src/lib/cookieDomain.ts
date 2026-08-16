import "server-only";

// 서브도메인 간 accessToken/refreshToken 쿠키 공유를 위한 Domain 속성.
// 로컬 개발 환경처럼 값이 없으면 undefined를 반환해 기존처럼 host-only 쿠키로 동작한다.
export function getCookieDomain(): string | undefined {
    return process.env.COOKIE_DOMAIN?.trim() || undefined;
}
