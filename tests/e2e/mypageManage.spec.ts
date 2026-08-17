// tests/e2e/mypageManage.spec.ts
//
// 사전 조건:
// - 로그인 계정 정보는 E2E_USERNAME / E2E_PASSWORD 환경 변수로 지정하며, 값이 없으면
//   로컬 시드 계정 기본값(superadmin/test1234)을 사용한다.
// - 이 테스트는 로그인 계정의 연락처·이메일·비밀번호를 임시로 변경했다가 테스트 종료 전에
//   원래 값으로 복원한다. 다른 e2e 스펙(예: lectureManage.spec.ts)도 같은 계정으로 로그인하므로,
//   비밀번호를 임시 값으로 바꾼 뒤에는 반드시 원래 비밀번호로 되돌린다. 테스트 도중 실패해서
//   복원 단계까지 도달하지 못하면, afterEach에서 임시 비밀번호로 재로그인해 복원을 한 번 더 시도한다.
// - 현재 마이페이지 화면에는 data-testid가 부여되어 있지 않아, 접근성 role/label/placeholder
//   기반 셀렉터를 사용한다. 내 정보 폼과 비밀번호 변경 폼 모두 "저장" 버튼을 갖고 있어 이름만으로는
//   구분되지 않으므로, 폼을 감싸는 <form> 요소를 각 폼에 고유한 placeholder로 필터링해 범위를 좁힌다.
// - 개발 서버 접속 주소는 기본값 http://localhost:3000이며, 다르면 E2E_BASE_URL 환경 변수로 지정한다.
// - 내 정보 폼의 연락처/이메일은 myInfoUpdateSchema(zod)가 항상 값이 있고 형식이 올바를 것을
//   요구한다(빈 값 저장 불가). 로그인 계정에 연락처/이메일이 등록되어 있지 않으면(빈 값) "원래
//   값으로 복원"이 빈 값 저장 시도가 되어 검증에 막히므로, 이 경우에는 원래 값 대신 아래 기본값으로
//   복원한다.

import { test, expect, Page } from '@playwright/test';

const E2E_USERNAME = process.env.E2E_USERNAME ?? 'superadmin';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'test1234';
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const TEMPORARY_PASSWORD = 'temp-pass-1234';
const FALLBACK_PHONE = '010-0000-0000';
const FALLBACK_EMAIL = 'placeholder@example.com';

const login = async (page: Page, password: string) => {
    await test.step(`로그인 (password: ${password})`, async () => {
        // 1. 로그인 페이지 접속
        await page.goto(`${BASE_URL}/auth`);

        // 2. 아이디, 비밀번호 입력 후 로그인
        await page.getByPlaceholder('아이디를 입력하세요').fill(E2E_USERNAME);
        await page.getByPlaceholder('비밀번호를 입력하세요').fill(password);
        await page.getByRole('button', { name: '로그인' }).click();

        // 3. 로그인 완료(쿠키 설정 + router.push) 후 인증 화면을 벗어났는지 확인.
        await page.waitForURL((url) => !url.pathname.startsWith('/auth'), { timeout: 15_000 });
    });
};

const getMyPasswordForm = (page: Page) =>
    page.locator('form', { has: page.getByPlaceholder('현재 비밀번호를 입력해주세요') });

const fillField = async (locator: ReturnType<Page['getByPlaceholder']>, value: string) => {
    await locator.clear();
    await locator.fill(value);
};

const changePassword = async (page: Page, currentPassword: string, newPassword: string) => {
    const form = getMyPasswordForm(page);
    await fillField(form.getByPlaceholder('현재 비밀번호를 입력해주세요'), currentPassword);
    await fillField(form.getByPlaceholder('새 비밀번호를 입력해주세요'), newPassword);
    await fillField(form.getByPlaceholder('새 비밀번호를 다시 입력해주세요'), newPassword);
    await form.getByRole('button', { name: '저장' }).click();
    await expect(page.getByText('비밀번호를 변경했습니다.')).toBeVisible();
};

test.describe('로그인 -> 마이페이지 이동 -> 내 정보 수정 -> 비밀번호 변경 E2E 테스트', () => {
    let passwordChanged = false;

    test.afterEach(async ({ page }) => {
        if (passwordChanged) {
            await login(page, TEMPORARY_PASSWORD);
            await page.goto(`${BASE_URL}/mypage`);
            await changePassword(page, TEMPORARY_PASSWORD, E2E_PASSWORD);
            passwordChanged = false;
        }
    });

    test('내 정보를 수정하고 비밀번호를 변경한 뒤 원래 값으로 되돌릴 수 있다', async ({ page }) => {
        // 1. 로그인
        await login(page, E2E_PASSWORD);

        // 2. 마이페이지 접속
        await page.goto(`${BASE_URL}/mypage`);

        const myInfoForm = page.locator('form', { has: page.getByPlaceholder('전화번호를 입력해주세요') });

        // 3. 기존 연락처/이메일 값을 저장해둔다 (테스트 종료 후 복원용).
        const originalPhone =
            (await myInfoForm.getByPlaceholder('전화번호를 입력해주세요').inputValue()) || FALLBACK_PHONE;
        const originalEmail =
            (await myInfoForm.getByPlaceholder('이메일을 입력해주세요').inputValue()) || FALLBACK_EMAIL;

        // 4. 연락처/이메일을 새 값으로 수정하고 저장
        const updatedPhone = '010-9999-8888';
        const updatedEmail = 'e2e-test@example.com';
        await fillField(myInfoForm.getByPlaceholder('전화번호를 입력해주세요'), updatedPhone);
        await fillField(myInfoForm.getByPlaceholder('이메일을 입력해주세요'), updatedEmail);
        await myInfoForm.getByRole('button', { name: '저장' }).click();

        // 5. 저장 성공 토스트 확인
        await expect(page.getByText('내 정보를 수정했습니다.')).toBeVisible();

        // 6. 새로고침 후 수정된 값이 반영되었는지 확인
        await page.reload();
        await expect(myInfoForm.getByPlaceholder('전화번호를 입력해주세요')).toHaveValue(updatedPhone);
        await expect(myInfoForm.getByPlaceholder('이메일을 입력해주세요')).toHaveValue(updatedEmail);

        // 7. 연락처/이메일을 원래 값으로 복원
        await fillField(myInfoForm.getByPlaceholder('전화번호를 입력해주세요'), originalPhone);
        await fillField(myInfoForm.getByPlaceholder('이메일을 입력해주세요'), originalEmail);
        await myInfoForm.getByRole('button', { name: '저장' }).click();
        await expect(page.getByText('내 정보를 수정했습니다.')).toBeVisible();

        // 8. 비밀번호를 임시 값으로 변경
        await changePassword(page, E2E_PASSWORD, TEMPORARY_PASSWORD);
        passwordChanged = true;

        // 9. 임시 비밀번호로 재로그인되는지 확인 (실제로 비밀번호가 바뀌었는지 검증)
        await page.context().clearCookies();
        await login(page, TEMPORARY_PASSWORD);

        // 10. 비밀번호를 원래 값으로 복원
        await page.goto(`${BASE_URL}/mypage`);
        await changePassword(page, TEMPORARY_PASSWORD, E2E_PASSWORD);
        passwordChanged = false;

        // 11. 원래 비밀번호로 다시 로그인되는지 최종 확인
        await page.context().clearCookies();
        await login(page, E2E_PASSWORD);
    });
});
