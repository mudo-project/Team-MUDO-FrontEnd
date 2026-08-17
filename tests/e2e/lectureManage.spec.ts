// tests/e2e/lectureManage.spec.ts
//
// 사전 조건:
// - LECTURE:MANAGE 권한을 가진 계정이 필요하다. 아이디/비밀번호는 환경 변수
//   (E2E_ADMIN_USERNAME, E2E_ADMIN_PASSWORD)로 주입하며, 값이 없으면 로컬 시드
//   계정 기본값(superadmin/test1234)을 사용한다. superadmin 계정에 해당 권한이
//   있다고 가정한다.
// - 강의실 코드는 자유 입력 텍스트이지만, 최소 1개의 강의실이 이미 등록되어 있어야
//   한다(강의 등록 모달의 강의실 코드 자동완성 목록에서 첫 번째 값을 그대로 사용한다).
//   등록된 강의실이 하나도 없으면 이 테스트는 명확한 에러 메시지와 함께 실패한다.
// - 현재 강의 관리 화면에는 data-testid가 부여되어 있지 않아, 접근성 role/label
//   기반 셀렉터를 사용한다.
// - 개발 서버 접속 주소는 기본값 http://localhost:3000이며, 다르다면 E2E_BASE_URL
//   환경 변수로 지정한다.

import { test, expect, Page } from '@playwright/test';

const ADMIN_USERNAME = process.env.E2E_ADMIN_USERNAME ?? 'superadmin';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'test1234';
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

const login = async (page: Page) => {
    // 1. 로그인 페이지 접속
    await page.goto(`${BASE_URL}/auth`);

    // 2. 아이디, 비밀번호 입력 후 로그인
    await page.getByPlaceholder('아이디를 입력하세요').fill(ADMIN_USERNAME);
    await page.getByPlaceholder('비밀번호를 입력하세요').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: '로그인' }).click();

    // 3. 로그인 완료 후 인증 화면을 벗어났는지 확인
    await expect(page).not.toHaveURL(/\/auth/);
};

test.describe('로그인 -> 강의 등록 -> 상세 조회 -> 수정 -> 삭제 E2E 테스트', () => {
    test('강의를 등록하고 상세를 조회한 뒤 수정 및 삭제할 수 있다', async ({ page }) => {
        // 1. 로그인
        await login(page);

        // 2. 강의 관리 페이지 접속
        await page.goto(`${BASE_URL}/lecture`);

        // 3. 강의 등록 모달 열기
        await page.getByRole('button', { name: '강의 등록' }).click();

        // 4. 강의 등록에 필요한 값 입력 (강의실 코드는 이미 등록된 강의실 코드를 재사용한다)
        const lectureName = `테스트강의${Date.now()}`;
        await page.getByLabel('강의명 *').fill(lectureName);

        const classroomCode = await page.locator('#lecture-room-options option').first().getAttribute('value');
        if (!classroomCode) {
            throw new Error(
                '강의실 코드가 하나도 없습니다. 이 테스트를 실행하려면 강의실이 최소 1개 이상 등록되어 있어야 합니다.',
            );
        }
        await page.getByLabel('강의실 코드 *').fill(classroomCode);
        await page.getByLabel('수업 요일').selectOption('MONDAY');
        await page.getByLabel('수업 시작 시간').fill('09:00');
        await page.getByLabel('수업 종료 시간').fill('10:00');

        // 5. 등록
        await page.locator('form').getByRole('button', { name: '강의 등록', exact: true }).click();

        // 6. 등록한 강의가 목록에 표시되는지 확인
        await expect(page.getByText(lectureName)).toBeVisible();

        // 7. 등록한 강의 항목을 클릭해 상세 모달 열기
        await page.getByText(lectureName).click();
        await expect(page.getByRole('heading', { name: lectureName })).toBeVisible();

        // 8. 상세 모달에서 수정 버튼 클릭
        await page.getByRole('button', { name: '강의 수정' }).click();

        // 9. 강의명을 수정하고 저장
        const updatedName = `${lectureName}-수정`;
        await page.getByLabel('강의명 *').fill(updatedName);
        await page.locator('form').getByRole('button', { name: '수정 완료' }).click();

        // 10. 수정된 이름이 상세 모달에 반영되었는지 확인
        await expect(page.getByRole('heading', { name: updatedName })).toBeVisible();

        // 11. 삭제 버튼 클릭 후 확인 모달에서 삭제 확정
        await page.getByRole('button', { name: '강의 삭제' }).click();
        await page.getByRole('button', { name: '확인' }).click();

        // 12. 삭제 후 목록에서 사라졌는지 확인
        await expect(page.getByText(updatedName)).toHaveCount(0);
    });
});
