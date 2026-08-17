// tests/e2e/messageTemplateManagement.spec.ts
//
// 사전 조건:
// - 문자 템플릿 등록/수정/삭제 권한을 가진 테스트 계정이 필요하다. 아이디/비밀번호는
//   환경 변수(E2E_USERNAME, E2E_PASSWORD)로 주입하며, 값이 없으면 로컬 시드 계정
//   기본값(superadmin/test1234)을 사용한다.
// - 이 테스트는 매 실행마다 새 템플릿을 생성하고 마지막에 직접 삭제해, 시드 데이터에
//   의존하지 않고 테스트 데이터를 정리한다.
// - 개발 서버 접속 주소는 기본값 http://localhost:3000이며, 다르다면 E2E_BASE_URL
//   환경 변수로 지정한다.

import { test, expect } from '@playwright/test';

const E2E_USERNAME = process.env.E2E_USERNAME ?? 'superadmin';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'test1234';
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

const login = async (page: import('@playwright/test').Page) => {
    // 1. 로그인 페이지 접속
    await page.goto(`${BASE_URL}/auth`);

    // 2. 아이디, 비밀번호 입력 후 로그인
    await page.getByPlaceholder('아이디를 입력하세요').fill(E2E_USERNAME);
    await page.getByPlaceholder('비밀번호를 입력하세요').fill(E2E_PASSWORD);
    await page.getByRole('button', { name: '로그인' }).click();

    // 3. 로그인 완료(쿠키 설정 + 리다이렉트) 후 인증 화면을 벗어났는지 확인
    await expect(page).not.toHaveURL(/\/auth/);
};

test.describe('로그인 -> 문자 템플릿 생성 -> 수정 -> 삭제 E2E 테스트', () => {
    test('문자 템플릿을 생성하고 이름을 수정한 뒤 삭제할 수 있다', async ({ page }) => {
        // 1. 로그인
        await login(page);

        // 2. 메시지 템플릿 화면 접속
        await page.goto(`${BASE_URL}/message`);
        await expect(page).toHaveURL(/\/message/);

        // 3. 새 템플릿 생성
        const templateName = `이음테스트템플릿${Date.now()}`;
        await page.getByRole('button', { name: '템플릿 등록' }).click();
        await expect(page.getByRole('heading', { name: '템플릿 등록' })).toBeVisible();
        await page.getByLabel('템플릿 이름').fill(templateName);
        await page.getByLabel('출결 상태').selectOption({ label: '결석' });
        await page.getByLabel('내용').fill('오늘 결석하셨습니다.');
        await page.getByRole('button', { name: '등록', exact: true }).click();

        // 4. 생성된 템플릿이 목록에 표시되는지 확인
        await expect(page.getByRole('heading', { name: templateName })).toBeVisible();

        // 5. 방금 생성한 템플릿의 이름 수정
        await page.getByRole('button', { name: `${templateName} 수정` }).click();
        await expect(page.getByRole('heading', { name: '템플릿 수정' })).toBeVisible();
        const updatedName = `${templateName}-수정`;
        await page.getByLabel('템플릿 이름').fill(updatedName);
        await page.getByRole('button', { name: '저장' }).click();

        // 6. 수정된 이름이 반영되었는지 확인
        await expect(page.getByRole('heading', { name: updatedName })).toBeVisible();

        // 7. 테스트로 생성한 템플릿 삭제(데이터 정리)
        await page.getByRole('button', { name: `${updatedName} 삭제` }).click();
        await expect(page.getByRole('heading', { name: '템플릿 삭제' })).toBeVisible();
        await page.getByRole('button', { name: '확인' }).click();

        // 8. 목록에서 삭제된 템플릿이 더 이상 보이지 않는지 확인
        await expect(page.getByRole('heading', { name: updatedName })).toHaveCount(0);
    });
});
