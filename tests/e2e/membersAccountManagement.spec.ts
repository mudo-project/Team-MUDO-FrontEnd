// tests/e2e/membersAccountManagement.spec.ts
//
// 사전 조건:
// - ACCOUNT:CREATE 권한을 가진 테스트 계정이 필요하다. 아이디/비밀번호는
//   환경 변수(E2E_ADMIN_USERNAME, E2E_ADMIN_PASSWORD)로 주입하며, 값이 없으면
//   로컬 시드 계정 기본값을 사용한다.
// - 구성원 상세/재직 상태 변경 시나리오는 이름이 "테스트 구성원"으로 시드된
//   구성원이 최소 1명 존재한다고 가정한다.
// - 현재 로그인 폼과 구성원 화면에는 data-testid가 부여되어 있지 않아,
//   접근성 role/placeholder 기반 셀렉터를 사용한다.
// - 개발 서버 접속 주소는 기본값 http://localhost:3000이며, 다르다면 E2E_BASE_URL
//   환경 변수로 지정한다.

import { test, expect } from '@playwright/test';

const ADMIN_USERNAME = process.env.E2E_ADMIN_USERNAME ?? 'superadmin';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'test1234';
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

const login = async (page: import('@playwright/test').Page) => {
    // 1. 로그인 페이지 접속
    await page.goto(`${BASE_URL}/auth`);

    // 2. 아이디, 비밀번호 입력 후 로그인
    await page.getByPlaceholder('아이디를 입력하세요').fill(ADMIN_USERNAME);
    await page.getByPlaceholder('비밀번호를 입력하세요').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: '로그인' }).click();

    // 3. 로그인 완료 후 인증 화면을 벗어났는지 확인
    await expect(page).not.toHaveURL(/\/auth/);
};

test.describe('로그인 -> 구성원 목록 조회 -> 계정 생성 E2E 테스트', () => {
    test('구성원 목록에서 계정을 생성하면 임시 비밀번호가 발급된다', async ({ page }) => {
        // 1. 로그인
        await login(page);

        // 2. 구성원 관리 화면 접속
        await page.goto(`${BASE_URL}/members`);
        await expect(page).toHaveURL(/\/members/);

        // 3. 계정 생성 모달 열기
        await page.getByRole('button', { name: '계정 생성' }).click();
        await expect(page.getByRole('heading', { name: '계정 생성' })).toBeVisible();

        // 4. 이름, 아이디 입력 후 역할 선택
        const timestamp = Date.now();
        const username = `e2e${timestamp}`;
        await page.getByPlaceholder('이름을 입력해주세요').fill(`이음테스트${timestamp}`);
        await page.getByPlaceholder('아이디를 입력해주세요').fill(username);
        await page.locator('select').selectOption({ index: 1 });

        // 5. 저장 버튼 클릭
        await page.getByRole('button', { name: '저장' }).click();

        // 6. 임시 비밀번호 발급 결과 확인
        await expect(page.getByText(`아이디: ${username}`)).toBeVisible();
    });
});

test.describe('로그인 -> 구성원 검색 E2E 테스트', () => {
    test('구성원을 검색하면 검색어가 주소에 반영된다', async ({ page }) => {
        // 1. 로그인
        await login(page);

        // 2. 구성원 관리 화면 접속
        await page.goto(`${BASE_URL}/members`);
        await expect(page).toHaveURL(/\/members/);

        // 3. 검색어 입력
        await page.getByPlaceholder('이름·역할 검색').fill('테스트 구성원');

        // 4. 검색어가 주소(쿼리스트링)에 반영되는지 확인
        await expect(page).toHaveURL(/keyword=/);
    });
});

test.describe('로그인 -> 구성원 상세 조회 -> 재직 상태 변경 E2E 테스트', () => {
    test('구성원 상세 모달에서 재직 상태를 변경할 수 있다', async ({ page }) => {
        // 1. 로그인
        await login(page);

        // 2. 구성원 관리 화면 접속
        await page.goto(`${BASE_URL}/members`);
        await expect(page).toHaveURL(/\/members/);

        // 3. 사전에 시드된 구성원(이름: 테스트 구성원) 항목 클릭
        await page.getByRole('button', { name: /테스트 구성원/ }).click();

        // 4. 상세 모달이 열렸는지 확인
        await expect(
            page.getByRole('button', { name: '구성원 정보 모달 닫기' }),
        ).toBeVisible();

        // 5. 휴직 처리 버튼 클릭
        await page.getByRole('button', { name: '휴직 처리' }).click();

        // 6. 확인 버튼을 클릭해 재직 상태 변경을 확정
        await page.getByRole('button', { name: '확인' }).click();

        // 7. 상세 모달의 재직 상태 안내 문구가 갱신되는지 확인
        await expect(page.getByText('휴직 계정')).toBeVisible();
    });
});
