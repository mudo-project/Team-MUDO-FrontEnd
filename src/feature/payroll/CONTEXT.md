# Payroll(급여명세서) Domain — CONTEXT
> 배치 경로: `src/feature/payroll/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 급여명세서 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: 화면이 실제 API(`.docs/api/payroll/apiIntegration.md`)에 연동되어 있다. mock 데이터 파일은 모두 제거됐다. 이 환경에는 로그인 세션이 없어 브라우저에서는 인증 실패로 인한 오류 화면(로그인 페이지 리다이렉트)만 확인했고, `/finance/payroll/email-batches/[batchId]` 포함 실제 로그인 상태에서의 종단 동작은 확인하지 못했다.

---

## 1. 개요

재무(Finance) 페이지의 급여명세서 탭에서, 직원별 월 급여를 계산·검토·확정하고 급여명세서(PDF)를 생성·이메일 발송하는 도메인.

재무 페이지는 법인카드 탭과 급여명세서 탭으로 구성되며([corporate-card CONTEXT](../corporate-card/CONTEXT.md) 참고), 진입 시 기본으로 열리는 탭은 법인카드다. `FinanceTabs`(`src/app/(user)/finance/FinanceTabs.tsx`)에서 두 탭 모두 정상 라우트 링크로 연결되어 있다.

### 핵심 제약

- Mailgun Webhook을 제외한 모든 API는 `PAYROLL:MANAGE` 권한이 필요하다. 직원 본인 여부만으로는 접근할 수 없다(자기 급여명세서 다운로드도 동일).
- 급여(Payroll) 1건은 낙관적 락 `version`을 가지며, 변경 요청은 `expectedVersion`을 함께 보내야 한다. 버전 불일치는 `409 PAYROLL_VERSION_CONFLICT`다. 화면은 변경 직전에 `getPayrollAction`으로 최신 상세를 다시 조회해 그 `version`을 실어 보낸다(목록 항목에는 `version`이 없다).
- Payroll 상태는 `NOT_CREATED`(급여 미생성) → `DRAFT`(초안) → `CALCULATED`(계산됨) → `CONFIRMED`(확정) 순으로 전이한다. 확정 후에는 지급항목·메모 수정, 재계산이 불가능하고 대신 정정본(Revision)을 새로 생성한다.
- 월 급여 목록 조회 API의 `summary`는 `targetEmployeeCount`, `notCreatedCount`, `calculatedCount`, `confirmedCount`, `totalEarnings`, `totalDeductions`, `totalNetPay`만 반환한다. **`DRAFT`(작성중) 건수를 세는 필드가 없다** — `PayrollManagement`가 `targetEmployeeCount - notCreatedCount - calculatedCount - confirmedCount`로 클라이언트에서 계산해 만든다.
- 급여 확정(`confirm`) 성공은 `payroll_statement`를 `PENDING`으로 1회 생성하고 PDF를 비동기 생성한다. PDF 생성/S3 업로드 실패는 확정 자체를 되돌리지 않고 명세서만 `FAILED`가 되며, 이 경우 생성 재시도로 재시도한다.
- 명세서 다운로드는 300초 만료 presigned URL을 발급받아 사용하며, 버킷명·object key는 응답에 노출되지 않는다.
- **명세서 발송은 개별 발송과 전체 일괄 발송 두 가지만 지원한다.** 목록 화면에는 직원을 선택하는 체크박스가 없다(`PayrollList`/`PayrollListItem`). 개별 발송은 급여 상세 패널의 "이메일 발송" 버튼(`PayrollDetail.handleSendEmail` → `POST /api/payrolls/{payrollId}/statement/email-deliveries`)만으로 이루어지며, 전체 일괄 발송은 목록 상단의 "전체 일괄 발송" 버튼(`PayrollListFilter` → `createPayrollEmailBatchAction` → `POST /api/payrolls/statement/email-delivery-batches`)으로 귀속월 전체 대상에게 보낸다. 일괄 발송을 시작하면 발급된 `batchId`로 `/finance/payroll/email-batches/[batchId]` 결과 페이지로 이동한다.
- **일괄 발송 배치를 나열해 조회하는 API가 없어, 마지막 배치 결과로 되돌아가는 버튼은 브라우저 `localStorage`에 의존한다(`PayrollManagement`).** 배치 발송 성공 시 `batchId`를 연·월별 키(`payroll:lastEmailBatchId:{year}-{month}`)로 저장하고, 캘린더 행에 "{연월} 발송 결과 보기" 링크를 조건부로 노출한다. 다른 기기·브라우저에서 보낸 배치나 캐시를 지운 뒤에는 이 링크가 보이지 않는다 — 그 경우 배치 발송 시 받은 성공 토스트나 이동된 결과 페이지 URL을 직접 기억해야 한다.
- **명세서 작업 섹션은 `statement.status`가 `PENDING`인 동안 3초 간격으로 폴링한다(`PayrollDetail`).** 확정 직후 PDF는 비동기로 생성되므로, 상태가 `READY`/`FAILED`로 바뀔 때까지 자동으로 다시 조회해 다운로드·발송 버튼을 노출한다. 상세 패널을 나갔다가 재진입할 필요가 없다.
- **직원별 급여 설정을 한 번에 조회하는 API가 없다.** `GET /api/payroll/employees/{employeeId}/compensation`은 직원 1명 단위 조회만 지원한다. 설정 화면은 이번 달 급여 목록(`getPayrollsAction`)으로 직원 목록을 얻은 뒤, 각 직원마다 이 API를 병렬 호출(`Promise.all`)해서 테이블을 구성한다 — 조직 규모가 커지면 N+1 호출 비용이 늘어난다.

### 진입점

Sidebar `재무` 클릭 → `/finance` → `/finance/corporate-card`로 redirect(기본 탭) → 상단 탭에서 `급여명세서` 클릭 → `/finance/payroll`.

---

## 2. 라우트

| 경로 | 설명 |
|---|---|
| `/finance/payroll` | 급여명세서 메인 화면. `src/app/(user)/finance/payroll/page.tsx`(서버 컴포넌트, 이번 달 급여 목록을 `getPayrollsAction`으로 조회) |
| `/finance/payroll/settings` | 급여 정책·직원별 급여 설정 화면. `src/app/(user)/finance/payroll/settings/page.tsx`(서버 컴포넌트, 정책 조회 + 직원별 급여 설정 병렬 조회) |
| `/finance/payroll/email-batches/[batchId]` | 이메일 일괄 발송 결과 화면. `src/app/(user)/finance/payroll/email-batches/[batchId]/page.tsx`(서버 컴포넌트, `getPayrollEmailBatchResultAction`으로 첫 페이지 조회) |

두 페이지 모두 최상위에서 조회 액션을 `try/catch`로 감싸 실패 시 인라인 오류 문구("급여 정보를 불러오지 못했습니다" 등)를 렌더링한다.

`src/app/(user)/finance/layout.tsx`가 재무 공통 헤더(`FinanceTabs`, `FinanceSensitiveNotice`)를 렌더링한다. 두 컴포넌트 모두 `usePathname`으로 현재 경로가 `/finance/payroll/settings`인지 확인해, 설정 화면에서는 탭 네비게이션과 "민감정보 화면입니다" 안내를 표시하지 않는다(설정 화면은 자체 "급여명세서로 돌아가기" 링크로 상위로 돌아간다).

---

## 3. 용어

| 용어 | 정의 |
|---|---|
| **급여(Payroll)** | 직원 1명의 특정 귀속월 급여 1건. `payrollId`로 식별하며 `version`(낙관적 락)을 가진다 |
| **급여 준비 상태(status/preparationStatus)** | `NOT_CREATED`(미작성) / `DRAFT`(작성중) / `CALCULATED`(검토 필요) / `CONFIRMED`(확정) |
| **지급항목(earnings)** | 기본급·연장근로수당 등. `sourceType`이 `CONTRACT`/`ATTENDANCE`면 수정 불가, `editable: true`인 항목(수기 추가분)만 수정·삭제 가능 |
| **공제항목(deductions)** | 국민연금 등. 명세서상 전부 `editable: false` |
| **차인지급 예정액(netPay)** | 총 지급액 − 총 공제액 |
| **Snapshot** | 급여 계산 시점의 근태(`attendance`)·계약(`compensations`)·법정 계산 기준(`rule`)을 그대로 저장한 값. `DRAFT` 상태는 `null` |
| **급여 정정본(Revision)** | 확정된 급여를 수정해야 할 때 원본(`originalPayrollId`)을 참조해 새로 만드는 급여 건. `revisionNo`가 1씩 증가 |
| **급여명세서(Statement)** | 확정된 급여에 대해 생성되는 PDF. 상태는 `PENDING`/`READY`/`FAILED` |
| **급여 정책(Policy)** | 지급일 유형(`FIXED_DAY`/`MONTH_END`)·지급일·지급월 오프셋을 정의하는 학원 단위 설정 |
| **직원 급여 설정(Compensation)** | 직원별 계약·고정수당·통상시급 이력. 적용기간이 겹치지 않게 관리 |
| **이메일 발송 이력(Delivery)** | 명세서 1건을 특정 직원 이메일로 보낸 기록 |
| **일괄 발송 배치(Batch)** | 귀속월 전체 대상 이메일 발송 1회 실행. `batchId`로 결과를 다시 조회할 수 있다 |

---

## 4. 화면 구성

```
┌─ 급여명세서 탭 ────────────────────────────────────────────┐
│ [이번달 급여 정보] 급여대상 미작성 작성중 검토필요 확정완료(진행바) │
│ [지급액 정보] 총지급액 총공제액 차인지급예정액 확정현황       │
├────────────────────────────────────────────────────────────┤
│ [< 2026년 8월 >] [이번 달]                    [급여 설정 →] │
├────────────────────────────────────────────────────────────┤
│ [검색] 총 N명   [전체 고용형태▾] [전체 준비상태▾]     [전체 일괄 발송] │
├────────────────────────────────────────────────────────────┤
│ [테이블] 직원명 고용형태 지급합계 공제합계 실수령액 차수 준비상태 작업 │
└──────────────────────────────────────────────────────────────┘
```

- **이번달 급여 정보 / 지급액 정보**: `PayrollManagement`가 현재 로드된 `PayrollListData.summary` 기준으로 계산해 표시한다. 월 이동·필터 변경으로 목록이 다시 조회되면 함께 갱신된다.
- **캘린더 + 이번 달 + 발송 결과 보기 + 급여 설정 링크**: 캘린더에서 월을 바꾸면 `getPayrollsAction`을 그 연·월로 다시 호출한다(연/월/고용형태/준비상태/검색어가 바뀔 때마다 재조회, 검색어는 300ms debounce). "이번 달" 버튼은 페이지 최초 진입 시 서버에서 계산한 연·월로 되돌린다. "{연월} 발송 결과 보기" 링크는 해당 연·월에 대해 `localStorage`에 저장된 마지막 `batchId`가 있을 때만 나타나며 `/finance/payroll/email-batches/{batchId}`로 이동한다(핵심 제약 참고).
- **검색·필터·발송 행**: 검색·고용형태·준비상태는 모두 서버 API 쿼리 파라미터로 전달되는 실제 필터다(클라이언트 재필터링 없음). "총 N명"은 `PayrollListData.totalElements`. "전체 일괄 발송" 버튼(`PayrollListFilter`)은 선택 없이 항상 노출되며, 확인 모달 → `createPayrollEmailBatchAction(year, month)` 호출 → 성공 시 `/finance/payroll/email-batches/{batchId}`로 이동한다.
- **작업 열**: `CALCULATED`/`CONFIRMED`는 "미리보기" 버튼(클릭 시 `getPayrollAction`으로 상세 조회 후 우측 패널), `DRAFT`는 "계산하기" 버튼(확인 모달 → `getPayrollAction`으로 최신 version 확인 후 `calculatePayrollAction` 호출), `NOT_CREATED`는 빈 칸(초안 생성 화면은 없음).

### 이메일 일괄 발송 결과 화면(`/finance/payroll/email-batches/[batchId]`)

`PayrollEmailBatchResultView`가 배치 요약(전체/발송됨/실패/제외 건수)과 대상자별 발송 상태를 렌더링한다. 서버 컴포넌트(`page.tsx`)가 `getPayrollEmailBatchResultAction(batchId, { page: 0, size: 20 })`로 첫 페이지를 조회해 넘기고, 이후 새로고침·페이지 이동은 클라이언트에서 같은 액션을 다시 호출한다. batchId가 유효하지 않으면 `notFound()`, 조회 자체가 실패하면 인라인 오류 문구를 보여준다.

### 급여 상세 패널(`PayrollDetail`)

`PayrollAggregateData`(급여 Aggregate 공통 응답 구조)를 그대로 받아 렌더링한다. 근태 기준 / 계약 기준 / 계산 기준(접힘 고정) / 지급 항목 / 공제 항목 / 메모 / 합계 / 명세서 작업 순으로 구성된다.

- **`CALCULATED`**: 메모 textarea + "메모 저장"(`updatePayrollAction`), 수기 지급항목 추가(`createPayrollEarningAction`)·삭제(`editable`인 항목만, `deletePayrollEarningAction`), 하단 "확정하기"(`confirmPayrollAction`). 각 변경 성공 시 `getPayrollAction`으로 상세를 다시 조회해 패널과 상위 목록(`onListChanged`)을 함께 갱신한다.
- **`CONFIRMED`**: 지급/공제 항목 읽기 전용. 하단에 "정정 이력 보기"(`getPayrollRevisionsAction` → `PayrollRevisionHistory` 패널), "정정본 생성"(`createPayrollRevisionAction`, 성공 시 패널을 닫고 목록만 새로고침 — 정정본은 `payrollId`가 다른 새 급여라 같은 패널에서 이어보지 않는다) 버튼
- **명세서 작업 섹션**: `statement.status`가 `READY`면 "PDF 다운로드"(`getPayrollStatementDownloadUrlAction` → 새 탭으로 열기)/"이메일 발송"(`createPayrollEmailDeliveryAction`, 성공 시 발송 결과 패널 `PayrollEmailDeliveryResultPanel` 오픈) 버튼, `FAILED`면 실패 사유 + "재시도"(`retryPayrollStatementAction`), `PENDING`이면 생성 중 안내 + 3초 간격 자동 폴링(핵심 제약 참고), `null`(statement 없음)이면 "급여 확정 후 명세서가 생성됩니다" 안내

### 급여 설정 화면(`/finance/payroll/settings`)

- **급여 정책**: 지급일 유형(고정일/말일) 토글, 지급일 입력(말일 선택 시 비활성화), 지급월 오프셋 입력, 저장 버튼(`updatePayrollPolicyAction`)
- **직원별 급여 설정**: 이번 달 급여 대상 직원 목록 + 직원별 `getPayrollCompensationAction` 병렬 조회 결과로 테이블 구성 → "편집" 버튼 → 우측 패널에서 계약 이력·고정수당 이력(추가/삭제 가능, 유형 select 포함)·통상시급 이력을 보여주고 저장 버튼(`savePayrollCompensationAction`, 고정수당만 전송 — 계약·통상시급 편집 UI는 없음)

---

## 5. 컴포넌트 구성

| 컴포넌트 | 책임 |
|---|---|
| **PayrollMonthOverview** | 급여 대상/미작성/작성중/검토필요/확정완료 5열 요약(확정완료에 진행바 포함) |
| **PayrollAmountSummary** | 총지급액/총공제액/차인지급예정액/확정현황 4열 요약 |
| **PayrollManagement** | `'use client'`. 초기 서버 데이터(`initialData`/`initialYear`/`initialMonth`)를 받아, 연·월/고용형태/준비상태/검색어가 바뀔 때마다 `useEffect` + `useTransition`으로 `getPayrollsAction`을 재호출한다. 전체 일괄 발송(`handleConfirmBatchSend` → `createPayrollEmailBatchAction` → `router.push`로 결과 페이지 이동 + `batchId`를 `localStorage`에 저장)과, 연·월이 바뀔 때 저장된 `batchId`를 읽어 "발송 결과 보기" 링크 노출 여부를 정하는 로직도 여기 있다 |
| **PayrollCalendar** | 법인카드 `FinanceCardCalendar`와 동일한 패턴(이전/다음달 버튼 + 연도·월 선택 드롭다운). `month`/`onChangeMonth`를 controlled로 받는다 |
| **PayrollListFilter** | 검색·고용형태·준비상태 select(상위에서 받은 controlled 값, 변경 시 상위가 재조회) + "전체 일괄 발송" 버튼(확인 모달 → `onConfirmBatchSend` await, `TwoButtonModal`의 `isPending`으로 처리 중 표시) |
| **PayrollList** | 테이블 렌더링, 미리보기 클릭 시 `getPayrollAction` 호출(`isDetailLoading`), 계산하기 확인 모달(`getPayrollAction`으로 version 확인 후 `calculatePayrollAction`), 로딩 중 오버레이(`isLoading` prop) |
| **PayrollListItem** | 행 1개. 배지, 미리보기/계산하기 버튼 |
| **PayrollDetail** | 우측 상세 패널. `PayrollAggregateData` 기반. 메모·수기 지급항목 편집, 확정/정정본 생성, 명세서 다운로드·이메일(개별 발송, 성공 시 결과 패널 오픈)·재시도, 정정 이력 열기 — 전부 실제 액션 호출. `statement.status`가 `PENDING`인 동안 3초 간격으로 자동 재조회한다 |
| **PayrollEmailDeliveryResultPanel** | 개별 이메일 발송 직후 결과(상태·요청 시각·신규/재사용 여부)를 보여주는 모달. `createPayrollEmailDeliveryAction` 응답(`PayrollEmailDeliveryCreateData`)을 그대로 렌더링한다 |
| **PayrollRevisionHistory** | `getPayrollRevisionsAction`이 반환한 `PayrollAggregateData[]`를 그대로 렌더링하는 이력 목록 패널(`PayrollDetail` 위에 한 겹 더 겹쳐서 열림) |
| **PayrollEmailBatchResultView** | `/finance/payroll/email-batches/[batchId]` 페이지의 본문. 실제 배치 API(`getPayrollEmailBatchResultAction`) 응답을 그대로 렌더링하며, 새로고침·페이지 이동 시 같은 액션을 다시 호출해 상태를 갱신한다 |
| **PayrollPolicyForm** | 급여 정책 폼, `PayrollPolicyGetData` 기반 |
| **PayrollCompensationList** / **PayrollCompensationDetail** | 직원별 급여 설정 목록/편집 패널, `PayrollCompensationGetData` 기반 |

### 데이터 계층

- `src/feature/payroll/type.ts` — export 없는 ambient 전역 타입 파일(프로젝트 전역 컨벤션). 화면이 실제로 쓰는 타입(`PayrollListItemData`, `PayrollMonthSummaryData` 등)과, `.docs/api/payroll/apiIntegration.md`의 API Request/Response를 그대로 옮긴 타입(`PayrollAggregateData`, `PayrollListResponse`, `PayrollEmailBatchResultDetailData`, `PayrollCompensationSaveRequest` 등)이 한 파일에 섞여 있다. mock 전용으로만 쓰이던 타입(예: 라벨을 미리 붙여둔 구 버전 상세 타입)은 정리해서 제거했다.
- `src/service/payroll.service.ts` — Mailgun Webhook을 제외한 20개 API 전부에 대응하는 `fetchWithAuth` 기반 함수.
- `src/feature/payroll/actions.ts` — 위 service를 감싼 Server Action. 조회 액션은 pass-through, 변경 액션은 명세서의 비즈니스 규칙(귀속월 1~12, 지급일 유형별 필수값, 월급제/시급제 필수 금액, 주 계약시간 0~168 등)을 검증한 뒤 `{ success, message, data? }`를 반환한다. **화면 컴포넌트가 실제로 이 액션들을 호출한다** — mock 데이터 파일은 없다.
- `statusStyles.ts` — 상태별 라벨·배지 클래스(준비상태, 이메일 발송 상태, 고용형태, 급여형태, 고정수당 유형).

---
