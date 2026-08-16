// tests/e2e/roleManagement.spec.ts
//
// 사전 조건:
// - 역할 생성/수정/삭제 권한을 가진 테스트 계정이 필요하다. 아이디/비밀번호는
//   환경 변수(E2E_ADMIN_USERNAME, E2E_ADMIN_PASSWORD)로 주입하며, 값이 없으면
//   로컬 시드 계정 기본값을 사용한다.
// - 권한 카탈로그에 체크박스로 선택 가능한 권한이 최소 1개 이상 등록되어 있다고 가정한다.
// - 이 테스트는 매 실행마다 새 역할을 생성하고 마지막에 직접 삭제해, 시드 데이터에
//   의존하지 않고 테스트 데이터를 정리한다.
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

test.describe('로그인 -> 역할 생성 -> 권한 저장 -> 수정 -> 삭제 E2E 테스트', () => {
    test('역할을 생성하고 권한을 저장한 뒤 이름을 수정하고 삭제할 수 있다', async ({ page }) => {
        // 1. 로그인
        await login(page);

        // 2. 역할 관리 화면 접속
        await page.goto(`${BASE_URL}/role`);
        await expect(page).toHaveURL(/\/role/);

        // 3. 새 역할 생성
        const roleName = `이음테스트역할${Date.now()}`;
        await page.getByRole('button', { name: '역할 추가' }).click();
        await expect(page.getByRole('heading', { name: '새 역할 만들기' })).toBeVisible();
        await page.getByLabel('역할 이름').fill(roleName);
        await page.getByRole('button', { name: '생성' }).click();

        // 4. 생성된 역할의 상세 화면으로 이동했는지 확인
        await expect(page).toHaveURL(/roleId=/);
        await expect(page.getByRole('heading', { name: roleName })).toBeVisible();

        // 5. 권한을 하나 선택하고 저장
        await page.getByRole('checkbox').nth(1).check();
        await page.getByRole('button', { name: '저장하기' }).click();
        await expect(page.getByText('역할 권한을 저장했습니다.')).toBeVisible();

        // 6. 방금 생성한 역할의 메뉴를 열어 이름 수정
        await page.getByRole('button', { name: `${roleName} 역할 메뉴` }).click();
        await page.getByRole('button', { name: '수정' }).click();
        await expect(page.getByRole('heading', { name: '역할 수정' })).toBeVisible();
        const updatedName = `${roleName}-수정`;
        await page.getByLabel('역할 이름').fill(updatedName);
        await page.getByRole('button', { name: '수정', exact: true }).click();

        // 7. 수정된 이름이 반영되었는지 확인
        await expect(page.getByRole('heading', { name: updatedName })).toBeVisible();

        // 8. 테스트로 생성한 역할 삭제(데이터 정리)
        await page.getByRole('button', { name: `${updatedName} 역할 메뉴` }).click();
        await page.getByRole('button', { name: '삭제' }).click();
        await page.getByRole('button', { name: '확인' }).click();

        // 9. 목록에서 삭제된 역할이 더 이상 보이지 않는지 확인
        await expect(
            page.getByRole('button', { name: `${updatedName} 역할 메뉴` }),
        ).toHaveCount(0);
    });
});
