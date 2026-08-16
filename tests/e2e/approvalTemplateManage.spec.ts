// tests/e2e/approvalTemplateManage.spec.ts
//
// 실행 전 준비사항:
// - 개발 서버(`npm run dev`)가 실행 중이어야 한다. (기본 접속 주소는 http://localhost:3000)
//   포트나 배포 주소가 다르면 E2E_BASE_URL 환경 변수로 지정한다.
// - 템플릿 관리 권한(`APPROVAL:TEMPLATE_MANAGE`)이 있는 계정을 E2E_USERNAME / E2E_PASSWORD
//   환경 변수로 전달하며, 값이 없으면 로컬 시드 계정(superadmin/test1234) 기본값을 사용한다.
// - 최소 1명 이상의 다른 구성원이 등록되어 있어야 결재자를 선택할 수 있다.

import { test, expect } from "@playwright/test";

const E2E_USERNAME = process.env.E2E_USERNAME ?? "superadmin";
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? "test1234";
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

test.describe("로그인 -> 결재 템플릿 생성 -> 템플릿 목록 확인 -> 템플릿 삭제 E2E 테스트", () => {
    test.beforeEach(async ({ page }) => {
        // 1. 로그인 페이지 접속
        await page.goto(`${BASE_URL}/auth`);

        // 2. 아이디, 비밀번호 입력
        await page.getByLabel("아이디").fill(E2E_USERNAME);
        await page.getByPlaceholder("비밀번호를 입력하세요").fill(E2E_PASSWORD);

        // 3. 로그인 버튼 클릭
        await page.getByRole("button", { name: "로그인" }).click();

        // 4. 로그인 완료 후 최초 진입 화면으로 이동 확인
        await expect(page).not.toHaveURL(/\/auth/);
    });

    test("템플릿을 생성하면 템플릿 관리 목록에서 확인할 수 있고, 삭제하면 목록에서 사라진다", async ({ page }) => {
        const templateName = `E2E 테스트 템플릿 ${Date.now()}`;

        // 1. 결재 템플릿 관리 페이지 접속
        await page.goto(`${BASE_URL}/approval/templates`);

        // 2. 템플릿 생성 버튼 클릭
        await page.getByRole("button", { name: "템플릿 생성" }).click();

        // 3. 템플릿 생성 모달이 열렸는지 확인
        await expect(page.getByRole("heading", { name: "결재 템플릿 생성" })).toBeVisible();

        // 4. 템플릿 이름 입력
        await page.getByLabel(/템플릿 이름/).fill(templateName);

        // 5. 결재자 선택
        await page.getByLabel("1차 결재자", { exact: true }).selectOption({ index: 1 });

        // 6. 템플릿 저장 버튼 클릭
        await page.getByRole("button", { name: "템플릿 저장" }).click();

        // 7. 생성한 템플릿이 목록에 노출되는지 확인
        await expect(page.getByText(templateName)).toBeVisible();

        // 8. 생성한 템플릿을 클릭해 상세 모달 열기
        await page.getByRole("button", { name: new RegExp(templateName) }).click();

        // 9. 템플릿 상세 모달이 열렸는지 확인
        await expect(page.getByRole("heading", { name: templateName })).toBeVisible();

        // 10. 삭제 버튼 클릭
        await page.getByRole("button", { name: "삭제" }).click();

        // 11. 삭제 확인 모달이 열렸는지 확인 후 확인 클릭
        await expect(page.getByText("삭제하시겠습니까?")).toBeVisible();
        await page.getByRole("button", { name: "확인" }).click();

        // 12. 목록에서 템플릿이 사라졌는지 확인
        await expect(page.getByText(templateName)).not.toBeVisible();
    });
});
