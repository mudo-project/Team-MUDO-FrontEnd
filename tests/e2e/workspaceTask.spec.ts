// tests/e2e/workspaceTask.spec.ts
//
// 사전 조건:
// - WORKSPACE:CREATE 권한을 가진 테스트 계정이 필요하다. 아이디/비밀번호는
//   환경 변수(E2E_ADMIN_USERNAME, E2E_ADMIN_PASSWORD)로 주입하며, 값이 없으면
//   로컬 시드 계정 기본값을 사용한다.
// - 현재 로그인 폼과 워크스페이스 화면에는 data-testid가 부여되어 있지 않아,
//   접근성 role/placeholder/label 기반 셀렉터를 사용한다.
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

test.describe('로그인 -> 워크스페이스 생성 -> 업무 등록 -> 상태 변경 E2E 테스트', () => {
    test('워크스페이스를 생성하고 업무를 등록한 뒤 상태를 변경할 수 있다', async ({ page }) => {
        // 1. 로그인
        await login(page);

        // 2. 워크스페이스 목록 화면 접속
        await page.goto(`${BASE_URL}/workspace/my-works`);

        // 3. 워크스페이스 생성
        const workspaceName = `테스트워크스페이스${Date.now()}`;
        await page.getByRole('button', { name: '워크스페이스 추가' }).click();
        await page.getByLabel('워크스페이스 이름').fill(workspaceName);
        await page.getByRole('button', { name: '워크스페이스 생성' }).click();

        // 4. 생성된 워크스페이스로 이동
        await page.getByRole('button', { name: workspaceName }).click();
        await expect(page).toHaveURL(/\/workspace\/\d+\/daily/);

        // 5. 업무 등록
        const taskTitle = `테스트업무${Date.now()}`;
        await page.getByRole('button', { name: '업무 추가' }).first().click();
        await page.getByLabel('업무 제목').fill(taskTitle);
        await page.getByLabel('기한').fill('2026-12-31');
        await page.getByRole('button', { name: '업무 등록', exact: true }).click();

        // 6. 등록한 업무가 목록에 표시되는지 확인
        await expect(page.getByText(taskTitle)).toBeVisible();

        // 7. 업무 상세 열기
        await page.getByText(taskTitle).click();
        await expect(page.getByRole('heading', { name: taskTitle })).toBeVisible();

        // 8. 상태를 '진행중'으로 변경
        const statusSelect = page.getByRole('combobox');
        await statusSelect.selectOption('IN_PROGRESS');

        // 9. 변경된 상태가 반영되었는지 확인
        await expect(statusSelect).toHaveValue('IN_PROGRESS');
    });
});
