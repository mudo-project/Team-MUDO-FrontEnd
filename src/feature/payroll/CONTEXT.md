# Payroll(급여명세서) Domain — CONTEXT
> 배치 경로: `src/feature/payroll/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 급여명세서 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: 화면·상태·필터·모달은 클라이언트 기능까지 구현되어 있고, `service`/`actions`/API 연동용 `type`도 준비되어 있다. 다만 화면은 아직 **mock 데이터**(`mockData.ts`, `payrollDetailMock.ts`, `payrollBatchResultMock.ts`, `payrollSettingsMock.ts`)로 동작하며, 컴포넌트가 `actions.ts`를 호출하도록 연결하는 실제 API 연동은 아직 하지 않았다.

---

## 1. 개요

재무(Finance) 페이지의 급여명세서 탭에서, 직원별 월 급여를 계산·검토·확정하고 급여명세서(PDF)를 생성·이메일 발송하는 도메인.

재무 페이지는 법인카드 탭과 급여명세서 탭으로 구성되며([corporate-card CONTEXT](../corporate-card/CONTEXT.md) 참고), 진입 시 기본으로 열리는 탭은 법인카드다. `FinanceTabs`(`src/app/(user)/finance/FinanceTabs.tsx`)에서 두 탭 모두 정상 라우트 링크로 연결되어 있다.

### 핵심 제약

- Mailgun Webhook을 제외한 모든 API는 `PAYROLL:MANAGE` 권한이 필요하다. 직원 본인 여부만으로는 접근할 수 없다(자기 급여명세서 다운로드도 동일).
- 급여(Payroll) 1건은 낙관적 락 `version`을 가지며, 변경 요청은 `expectedVersion`을 함께 보내야 한다. 버전 불일치는 `409 PAYROLL_VERSION_CONFLICT`다.
- Payroll 상태는 `NOT_CREATED`(급여 미생성) → `DRAFT`(초안) → `CALCULATED`(계산됨) → `CONFIRMED`(확정) 순으로 전이한다. 확정 후에는 지급항목·메모 수정, 재계산이 불가능하고 대신 정정본(Revision)을 새로 생성한다.
- 월 급여 목록 조회 API의 `summary`는 `targetEmployeeCount`, `notCreatedCount`, `calculatedCount`, `confirmedCount`, `totalEarnings`, `totalDeductions`, `totalNetPay`만 반환한다. **`DRAFT`(작성중) 건수를 세는 필드가 없다** — 현재 정적 화면(`page.tsx`)은 mock 목록에서 직접 `preparationStatus === "DRAFT"`를 세어 만들고 있고, 실제 연동 시에도 클라이언트에서 계산하거나 백엔드 필드 추가를 확인해야 한다.
- 급여 확정(`confirm`) 성공은 `payroll_statement`를 `PENDING`으로 1회 생성하고 PDF를 비동기 생성한다. PDF 생성/S3 업로드 실패는 확정 자체를 되돌리지 않고 명세서만 `FAILED`가 되며, 이 경우 생성 재시도로 재시도한다.
- 명세서 다운로드는 300초 만료 presigned URL을 발급받아 사용하며, 버킷명·object key는 응답에 노출되지 않는다.
- 이메일 발송은 개별과 월 단위 일괄 두 가지가 있다. 둘 다 발송 "작업 등록 성공"만 의미하며, 실제 수신 여부는 Mailgun Webhook이 비동기로 반영한다.

### 진입점

Sidebar `재무` 클릭 → `/finance` → `/finance/corporate-card`로 redirect(기본 탭) → 상단 탭에서 `급여명세서` 클릭 → `/finance/payroll`.

---

## 2. 라우트

| 경로 | 설명 |
|---|---|
| `/finance/payroll` | 급여명세서 메인 화면. `src/app/(user)/finance/payroll/page.tsx`(서버 컴포넌트) |
| `/finance/payroll/settings` | 급여 정책·직원별 급여 설정 화면. `src/app/(user)/finance/payroll/settings/page.tsx`(서버 컴포넌트) |

`src/app/(user)/finance/layout.tsx`가 재무 공통 헤더(`FinanceTabs`, `FinanceSensitiveNotice`)를 렌더링한다. 두 컴포넌트 모두 `usePathname`으로 현재 경로가 `/finance/payroll/settings`인지 확인해, 설정 화면에서는 탭 네비게이션과 "민감정보 화면입니다" 안내를 표시하지 않는다(설정 화면은 자체 "급여명세서로 돌아가기" 링크로 상위로 돌아간다).

---

## 3. 용어

| 용어 | 정의 |
|---|---|
| **급여(Payroll)** | 직원 1명의 특정 귀속월 급여 1건. `payrollId`로 식별하며 `version`(낙관적 락)을 가진다 |
| **급여 준비 상태(preparationStatus)** | `NOT_CREATED`(미작성) / `DRAFT`(작성중) / `CALCULATED`(검토 필요) / `CONFIRMED`(확정) |
| **지급항목(earnings)** | 기본급·연장근로수당 등. `CONTRACT`/`ATTENDANCE` 출처는 수정 불가, `MANUAL`(수기 추가)만 수정·삭제 가능 |
| **공제항목(deductions)** | 국민연금 등. 전부 수정 불가 |
| **차인지급 예정액(netPay)** | 총 지급액 − 총 공제액 |
| **Snapshot** | 급여 계산 시점의 근태·계약·법정 계산 기준을 그대로 저장한 값 |
| **급여 정정본(Revision)** | 확정된 급여를 수정해야 할 때 원본(`originalPayrollId`)을 참조해 새로 만드는 급여 건. `revisionNo`가 1씩 증가 |
| **급여명세서(Statement)** | 확정된 급여에 대해 생성되는 PDF. 상태는 `PENDING`/`READY`/`FAILED` |
| **급여 정책(Policy)** | 지급일 유형(`FIXED_DAY`/`MONTH_END`)·지급일·지급월 오프셋을 정의하는 학원 단위 설정 |
| **직원 급여 설정(Compensation)** | 직원별 계약·고정수당·통상시급 이력. 적용기간이 겹치지 않게 관리 |
| **이메일 발송 이력(Delivery)** | 명세서 1건을 특정 직원 이메일로 보낸 기록 |
| **일괄 발송 배치(Batch)** | 귀속월 단위(현재 화면은 "선택한 직원" 단위)로 여러 직원에게 한 번에 발송을 시작하는 단위 |

---

## 4. 화면 구성

```
┌─ 급여명세서 탭 ────────────────────────────────────────────┐
│ [이번달 급여 정보] 급여대상 미작성 작성중 검토필요 확정완료(진행바) │
│ [지급액 정보] 총지급액 총공제액 차인지급예정액 확정현황       │
├────────────────────────────────────────────────────────────┤
│ [< 2026년 8월 >] [이번 달]                    [급여 설정 →] │
├────────────────────────────────────────────────────────────┤
│ [검색] 총 N명   [전체 고용형태▾] [전체 준비상태▾]  [선택 N명 발송] │
├────────────────────────────────────────────────────────────┤
│ [테이블] ☐ 직원명 고용형태 지급합계 공제합계 실수령액 차수 준비상태 작업 │
└──────────────────────────────────────────────────────────────┘
```

- **이번달 급여 정보 / 지급액 정보**: `page.tsx`가 `payrollListMock` 전체 기준으로 계산해 항상 필터와 무관하게 표시한다(법인카드와 동일한 패턴).
- **캘린더 + 이번 달 + 급여 설정 링크**: 한 행에 배치. 캘린더는 실제로 월을 이동시키지만 mock 데이터가 2026년 8월치뿐이라, 다른 달로 이동하면 테이블이 "조건에 맞는 직원이 없습니다" 빈 상태를 보여준다.
- **검색·필터·발송 행**: 검색창(직원명 검색) + "총 N명"이 왼쪽 세로로 묶여 있고, 그 옆에 고용형태/준비상태 select, 오른쪽 끝에 발송 버튼이 있다.
- **테이블 체크박스**: 전체선택/개별선택이 실제 상태와 연결되어 있으며, 발송 버튼은 **선택한 직원에게만** 명세서를 보낸다(0건 선택 시 비활성화). 발송 확인 모달 → 결과 패널이 선택된 인원만 반영해서 열린다.
- **작업 열**: `CALCULATED`/`CONFIRMED`는 "미리보기" 버튼(우측 상세 패널), `DRAFT`는 "계산하기" 버튼(확인 모달), `NOT_CREATED`는 빈 칸.

### 급여 상세 패널(`PayrollDetail`)

미리보기 클릭 시 우측에서 열리는 패널. 근태 기준 / 계약 기준 / 계산 기준(접힘 고정) / 지급 항목 / 공제 항목 / 메모 / 합계 / 명세서 작업 순으로 구성된다.

- **`CALCULATED`**: 메모 textarea 편집 가능, 수기 지급항목 추가(이름+금액 입력 후 즉시 목록에 반영, 합계 실시간 재계산)·삭제(`editable: true` 항목만) 가능, 하단에 "확정하기" 버튼(확인 모달, 확인해도 실제 상태 전이는 없음 — mock)
- **`CONFIRMED`**: 지급/공제 항목 읽기 전용. 하단에 "정정 이력 보기"(→ `PayrollRevisionHistory` 패널, `payrollRevisionHistoryMock`에 이력이 등록된 건 한소율뿐), "정정본 생성"(확인 모달) 버튼
- **명세서 작업 섹션**: `statement.status`가 `READY`면 "PDF 다운로드"/"이메일 발송" 버튼, `FAILED`면 실패 사유 + "재시도" 버튼(윤재하로 데모), `null`(statement 없음)이면 "급여 확정 후 명세서가 생성됩니다" 안내

### 급여 설정 화면(`/finance/payroll/settings`)

- **급여 정책**: 지급일 유형(고정일/말일) 토글, 지급일 입력(말일 선택 시 비활성화), 지급월 오프셋 입력, 저장 버튼(확인 모달)
- **직원별 급여 설정**: 직원 목록 테이블(계약 요약) + "편집" 버튼 → 우측 패널에서 계약 이력·고정수당 이력(추가/삭제 가능)·통상시급 이력을 보여주고 저장 버튼(확인 모달)

---

## 5. 컴포넌트 구성

| 컴포넌트 | 책임 |
|---|---|
| **PayrollMonthOverview** | 급여 대상/미작성/작성중/검토필요/확정완료 5열 요약(확정완료에 진행바 포함) |
| **PayrollAmountSummary** | 총지급액/총공제액/차인지급예정액/확정현황 4열 요약 |
| **PayrollManagement** | `'use client'`. 캘린더 월 state, 고용형태·준비상태·검색어 필터 state, 체크박스 선택 state를 소유하고 `PayrollCalendar`/`PayrollListFilter`/`PayrollList`를 조합한다. 선택된 직원만 골라 발송 결과를 만드는 로직(`handleConfirmBatchSend`)도 여기 있다 |
| **PayrollCalendar** | 법인카드 `FinanceCardCalendar`와 동일한 패턴(이전/다음달 버튼 + 연도·월 선택 드롭다운) |
| **PayrollListFilter** | 검색·고용형태·준비상태 select(모두 상위에서 받은 controlled 값) + 발송 버튼 + 발송 확인 모달(`TwoButtonModal`) + `PayrollBatchResultPanel` 오픈 |
| **PayrollList** | 테이블 렌더링, 전체선택 체크박스, 미리보기 패널(`selectedPayrollId`)과 계산 확인 모달(`calculatingItem`) state를 소유 |
| **PayrollListItem** | 행 1개. 체크박스, 배지, 미리보기/계산하기 버튼 |
| **PayrollDetail** | 우측 상세 패널. 메모·수기 지급항목 편집, 확정/정정본 생성 확인 모달, 명세서 재시도, 정정 이력 열기 |
| **PayrollRevisionHistory** | 정정 이력 목록 패널(`PayrollDetail` 위에 한 겹 더 겹쳐서 열림) |
| **PayrollBatchResultPanel** | 발송 결과 패널(대상자별 상태 목록) |
| **PayrollPolicyForm** | 급여 정책 폼 |
| **PayrollCompensationList** / **PayrollCompensationDetail** | 직원별 급여 설정 목록/편집 패널 |

### 데이터 계층

- `src/feature/payroll/type.ts` — export 없는 ambient 전역 타입 파일(프로젝트 전역 컨벤션). 두 섹션으로 나뉜다.
  1. **UI mock 타입**(`PayrollListItemData`, `PayrollMonthSummaryData`, `PayrollDetailData`, `PayrollEmployeeCompensationData` 등) — 현재 화면 컴포넌트가 실제로 참조하는 타입. `PayrollListItemData`·`PayrollPolicyData` 등 일부는 API 응답 구조와 이름·필드가 동일하지만, `PayrollDetailData`(라벨 필드 포함)처럼 화면 표시 편의를 위해 API 구조를 단순화한 것도 있다.
  2. **API 연동 타입**(`PayrollAggregateData`, `PayrollListResponse`, `PayrollCompensationSaveRequest` 등) — `.docs/api/payroll/apiIntegration.md`의 20개 API(Mailgun Webhook 제외) Request/Response를 그대로 옮긴 타입. 아직 어떤 컴포넌트도 이 타입을 참조하지 않는다.
- `src/service/payroll.service.ts` — 20개 API 전부에 대응하는 `fetchWithAuth` 기반 함수(`getPayrolls`, `createPayrollDraft`, `calculatePayroll`, `getPayroll`, `updatePayroll`, `createPayrollEarning`, `deletePayrollEarning`, `confirmPayroll`, `createPayrollRevision`, `getPayrollRevisions`, `getPayrollPreview`, `getPayrollStatementDownloadUrl`, `retryPayrollStatement`, `createPayrollEmailDelivery`, `createPayrollEmailBatch`, `getPayrollEmailBatchResult`, `getPayrollPolicy`, `updatePayrollPolicy`, `getPayrollCompensation`, `savePayrollCompensation`).
- `src/feature/payroll/actions.ts` — 위 service를 감싼 Server Action. 조회 액션은 그대로 pass-through, 변경 액션은 명세서의 비즈니스 규칙(귀속월 1~12, 지급일 유형별 필수값, 월급제/시급제 필수 금액, 주 계약시간 0~168 등)을 검증한 뒤 `{ success, message, data? }`를 반환한다. **아직 어떤 컴포넌트도 이 액션을 호출하지 않는다** — 화면은 여전히 mock 파일을 직접 import해서 쓴다.
- mock 파일: `mockData.ts`(목록 8명), `payrollDetailMock.ts`(상세 5명 + `payrollRevisionHistoryMock`), `payrollBatchResultMock.ts`(발송 결과), `payrollSettingsMock.ts`(정책 + 직원 3명 급여 설정).
- `statusStyles.ts` — 상태별 라벨·배지 클래스(준비상태, 이메일 발송 상태, 고용형태, 급여형태, 고정수당 유형).

---
