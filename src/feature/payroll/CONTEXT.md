# Payroll(급여명세서) Domain — CONTEXT
> 배치 경로: `src/feature/payroll/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 급여명세서 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, API 명세상 어떤 데이터로 구성되는지** 파악할 수 있게 한다.
> 구현 상태: **미착수**. `src/feature/payroll/`, `src/app/(user)/finance/payroll/`는 빈 디렉터리만 존재하고 화면·컴포넌트·데이터 연동 코드는 없다. 화면 디자인도 확정되지 않았다. 아래 화면 구성은 사용자가 구두로 설명한 배치를 근거로 하며, API 규격은 `.docs/api/payroll/apiIntegration.md`(2026-08-13 기준, Controller·DTO·Service·ErrorCode와 동기화된 문서)에 확정되어 있다.

---

## 1. 개요

재무(Finance) 페이지의 급여명세서 탭에서, 직원별 월 급여를 계산·검토·확정하고 급여명세서(PDF)를 생성·이메일 발송하는 도메인.

재무 페이지는 법인카드 탭과 급여명세서 탭으로 구성되며([corporate-card CONTEXT](../corporate-card/CONTEXT.md) 참고), 진입 시 기본으로 열리는 탭은 법인카드다. 이 도메인은 급여명세서 탭을 다룬다. 현재 `FinanceTabs`(`src/app/(user)/finance/FinanceTabs.tsx`)에서 급여명세서는 라우트가 없어 클릭 불가능한 비활성 텍스트로만 노출되어 있다.

### 핵심 제약

- Mailgun Webhook을 제외한 모든 API는 `PAYROLL:MANAGE` 권한이 필요하다. 직원 본인 여부만으로는 접근할 수 없다(자기 급여명세서 다운로드도 동일).
- 급여(Payroll) 1건은 낙관적 락 `version`을 가지며, 변경 요청은 `expectedVersion`을 함께 보내야 한다. 버전 불일치는 `409 PAYROLL_VERSION_CONFLICT`다.
- Payroll 상태는 `NOT_CREATED`(급여 미생성, 목록 조회 시에만 나타나는 상태) → `DRAFT`(초안) → `CALCULATED`(계산됨) → `CONFIRMED`(확정) 순으로 전이한다. 확정 후에는 지급항목·메모 수정, 재계산이 불가능하고 대신 정정본(Revision)을 새로 생성한다.
- 월 급여 목록 조회 API(`GET /api/payrolls`)의 `summary`는 `targetEmployeeCount`, `notCreatedCount`, `calculatedCount`, `confirmedCount`, `totalEarnings`, `totalDeductions`, `totalNetPay`만 반환한다. **`DRAFT`(작성중) 건수를 세는 필드가 없다** — 사용자가 요구한 "작성중" 상태 집계는 `targetEmployeeCount - notCreatedCount - calculatedCount - confirmedCount`로 프론트에서 계산하거나, 필드 추가를 백엔드에 확인해야 한다.
- 급여 정정본 생성은 확정된 최신 Payroll에서만 가능하며, 정정본도 처음엔 `version: 0`, `status: CALCULATED`로 시작해 다시 확정 절차를 거친다. 정정 이력 조회(`GET /api/payrolls/{payrollId}/revisions`)로 같은 직원·귀속월의 모든 Revision을 확인할 수 있다.
- 급여 확정(`PATCH /api/payrolls/{payrollId}/confirm`) 성공은 `payroll_statement`를 `PENDING`으로 1회 생성하고 PDF를 비동기 생성한다. PDF 생성/S3 업로드 실패는 확정 자체를 되돌리지 않고 명세서만 `FAILED`가 되며, 이 경우 생성 재시도(`PATCH /api/payrolls/{payrollId}/statement/retry`) API로 재시도한다.
- 명세서 다운로드는 `GET /api/payrolls/{payrollId}/statement/download-url`로 300초 만료 presigned URL을 발급받아 사용한다. 버킷명·object key는 응답에 노출되지 않는다.
- 이메일 발송은 개별(`POST /api/payrolls/{payrollId}/statement/email-deliveries`)과 월 단위 일괄(`POST /api/payrolls/statement/email-delivery-batches`) 두 가지가 있다. 둘 다 발송 "작업 등록 성공"만 의미하며, 실제 수신 여부는 Mailgun Webhook(`POST /api/webhooks/mailgun`)이 비동기로 반영한다. 동일 명세서에 이미 활성 발송 이력이 있으면 새로 만들지 않고 기존 이력을 `reused: true`로 재사용한다.
- 급여 계산은 급여 정책(지급일 유형·지급일·지급월 오프셋, `GET/PATCH /api/payroll/policies`)과 직원별 급여 설정(계약·고정수당·통상시급 이력, `GET/PATCH /api/payroll/employees/{employeeId}/compensation`)을 기준 데이터로 사용한다. 이 두 설정 화면은 사용자가 설명한 급여명세서 탭 배치(캘린더·정보 컨테이너·지급액·목록)에는 포함되어 있지 않다 — 별도 화면(직원 상세 등)에서 다룰 가능성이 있으며 현재 미정이다.

### 진입점

Sidebar `재무` 클릭 → `/finance` → `/finance/corporate-card`로 redirect(기본 탭) → 급여명세서 탭 클릭 시 `/finance/payroll`로 이동할 예정이나, 현재 라우트가 없어 이동할 수 없다.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **급여(Payroll)** | 직원 1명의 특정 귀속월 급여 1건. `payrollId`로 식별하며 `version`(낙관적 락)을 가진다 |
| **급여 준비 상태(preparationStatus / status)** | `NOT_CREATED`(미작성) / `DRAFT`(작성중) / `CALCULATED`(검토 필요) / `CONFIRMED`(확정 완료) |
| **급여 대상** | 해당 귀속월에 급여 계산 대상인 활성 직원 전체 수(`summary.targetEmployeeCount`). 급여가 아직 없는 직원도 `NOT_CREATED`로 포함된다 |
| **지급항목(earnings)** | 기본급·연장근로수당 등 급여에 더해지는 항목. `sourceType`이 `CONTRACT`/`ATTENDANCE`(자동 계산, 대부분 `editable: false`)와 `MANUAL`(수기 추가, `editable: true`)로 나뉜다 |
| **공제항목(deductions)** | 국민연금 등 급여에서 빼는 항목. 현재 명세서상 전부 `editable: false`(수정 불가) |
| **차인지급 예정액(netPay)** | 총 지급액(`totalEarnings`) − 총 공제액(`totalDeductions`) |
| **Snapshot** | 급여 계산 시점의 근태(`attendance`)·계약(`compensations`)·법정 계산 기준(`rule`)을 그대로 저장한 값. 계산 이후 원본 데이터가 바뀌어도 Snapshot은 변하지 않는다 |
| **급여 정정본(Revision)** | 확정된 급여를 수정해야 할 때, 원본(`originalPayrollId`)을 참조해 새로 만드는 급여 건. `revisionNo`가 1씩 증가한다 |
| **급여명세서(Statement)** | 확정된 급여에 대해 생성되는 PDF 문서. `status`는 `PENDING`/`READY`/`FAILED` |
| **급여 정책(Policy)** | 지급일 유형(`FIXED_DAY`/`MONTH_END`)·지급일·지급월 오프셋을 정의하는 학원 단위 설정 |
| **직원 급여 설정(Compensation)** | 직원별 계약(급여형태·기본급/시급·주 계약시간)·고정수당·통상시급 이력. 적용기간(`effectiveFrom`~`effectiveTo`)이 겹치지 않게 관리된다 |
| **이메일 발송 이력(Delivery)** | 명세서 1건을 특정 직원 이메일로 보낸 기록. 상태는 `PENDING`/`SENDING`/`RETRY_WAIT`/`SENT`/`DELIVERED`/`FAILED`/`SKIPPED`/`UNKNOWN` |
| **일괄 발송 배치(Batch)** | 귀속월 단위로 여러 직원에게 한 번에 이메일 발송을 시작하는 단위. 배치 상태는 `PENDING`/`PROCESSING`/`AWAITING_DELIVERY`/`COMPLETED` |

---

## 3. 화면 구성 (사용자 설명 기반, 디자인 미확정)

```
┌─ 급여명세서 탭 ────────────────────────────────────────────┐
│ [날짜 선택 캘린더]                          [이번달]        │
├────────────────────────────────────────────────────────────┤
│ [이번달 급여 정보 컨테이너]                                 │
│  급여 대상   미작성   작성중   검토 필요   확정 완료         │
├────────────────────────────────────────────────────────────┤
│ [지급액 관련 컴포넌트]                                      │
│  총 지급액   총 공제액   차인지급 예정액   확정 현황         │
├────────────────────────────────────────────────────────────┤
│ [검색]  [필터]                                  [발송]      │
├────────────────────────────────────────────────────────────┤
│ [사용자 정보 테이블]                                        │
│  직원명 | 고용형태 | 준비상태 | 총지급액 | 총공제액 | 차인지급액 │
└──────────────────────────────────────────────────────────────┘
```

- **날짜 선택 캘린더 + 이번달 버튼**: 조회할 급여 귀속월(`year`, `month`)을 선택한다. 목록 조회 API의 필수 Query와 대응한다.
- **이번달 급여 정보 컨테이너**: 급여 대상·미작성·작성중·검토 필요·확정 완료 5개 항목. API `summary`는 대상/미작성/계산됨/확정됨 4개 수치만 제공하므로, "작성중"은 별도 계산이 필요하다(핵심 제약 참고).
- **지급액 관련 컴포넌트**: 해당 월 기준 총 지급액(`summary.totalEarnings`)·총 공제액(`summary.totalDeductions`)·차인지급 예정액(`summary.totalNetPay`)·확정 현황(`confirmedCount` / `targetEmployeeCount`).
- **검색·필터·발송 버튼**: 검색·필터는 목록 조회 Query(`employeeName`, `employmentType`, `status`)와 대응한다. 발송 버튼은 이메일 일괄 발송(`POST /api/payrolls/statement/email-delivery-batches`)과 대응할 것으로 보이나, 확정되지 않은 급여가 섞여 있을 때의 동작(부분 발송/막힘)은 미정이다.
- **사용자 정보 테이블**: 목록 조회 응답의 `content` 배열(직원명·고용형태·준비상태·총지급액·총공제액·차인지급액 등)을 행 단위로 표시한다. 행별 클릭 동작(상세 진입/계산/확정 등)은 아직 정해지지 않았다.

이 배치 이후의 화면(급여 상세, 계산 결과 검토, 지급항목 수정, 확정, 정정본 생성, 명세서 미리보기/다운로드, 정책·직원별 급여 설정)은 API가 모두 준비되어 있지만 사용자가 화면 흐름을 아직 설명하지 않아 미정이다.

---

## 4. API 목록

전체 규격: `.docs/api/payroll/apiIntegration.md`. Notion 원본도 같은 문서에 API별로 링크되어 있다.

| # | 기능 | Method·URI |
|---|---|---|
| 1 | 월 급여 목록 조회 | `GET /api/payrolls` |
| 2 | 월 급여 초안 생성 | `POST /api/payrolls/employees/{employeeId}` |
| 3 | 급여 계산 및 재계산 | `PATCH /api/payrolls/{payrollId}/calculate` |
| 4 | 급여 상세 조회 | `GET /api/payrolls/{payrollId}` |
| 5 | 급여 지급항목 및 메모 수정 | `PATCH /api/payrolls/{payrollId}` |
| 6 | 수기 지급항목 추가 | `POST /api/payrolls/{payrollId}/earnings` |
| 7 | 수기 지급항목 삭제 | `DELETE /api/payrolls/{payrollId}/earnings/{itemId}` |
| 8 | 급여 확정 및 명세서 생성 | `PATCH /api/payrolls/{payrollId}/confirm` |
| 9 | 급여 정정본 생성 | `POST /api/payrolls/{payrollId}/revisions` |
| 10 | 급여 정정 이력 조회 | `GET /api/payrolls/{payrollId}/revisions` |
| 11 | 급여명세서 미리보기 | `GET /api/payrolls/{payrollId}/preview` |
| 12 | 급여명세서 다운로드 URL 발급 | `GET /api/payrolls/{payrollId}/statement/download-url` |
| 13 | 급여명세서 생성 재시도 | `PATCH /api/payrolls/{payrollId}/statement/retry` |
| 14 | 급여명세서 개별 이메일 발송 | `POST /api/payrolls/{payrollId}/statement/email-deliveries` |
| 15 | 급여명세서 이메일 일괄 발송 | `POST /api/payrolls/statement/email-delivery-batches` |
| 16 | 급여명세서 이메일 일괄 발송 결과 조회 | `GET /api/payrolls/statement/email-delivery-batches/{batchId}` |
| 17 | 급여 정책 조회 | `GET /api/payroll/policies` |
| 18 | 급여 정책 수정 | `PATCH /api/payroll/policies` |
| 19 | 직원 급여 설정 조회 | `GET /api/payroll/employees/{employeeId}/compensation` |
| 20 | 직원 급여 설정 저장 | `PATCH /api/payroll/employees/{employeeId}/compensation` |
| 21 | Mailgun 급여명세서 이메일 상태 Webhook | `POST /api/webhooks/mailgun` |

이 중 위 화면 구성(3장)과 직접 대응하는 API는 1(목록·요약)과 15(발송)이며, 나머지는 상세·계산·확정·정정·정책·설정 화면에서 쓰일 것으로 예상되나 해당 화면이 아직 설계되지 않았다.

---

## 5. 데이터

### 급여 목록 항목 (`GET /api/payrolls` → `data.content[]`)

| 필드 | 설명 |
|---|---|
| `employeeId`, `employeeName` | 직원 식별자, 이름 |
| `employmentType` | 고용형태(예: `REGULAR`, `PART_TIME`) |
| `payrollId` | 급여 식별자. 급여가 없으면 `null` |
| `preparationStatus` | `NOT_CREATED` / `DRAFT` / `CALCULATED` / `CONFIRMED` |
| `totalEarnings`, `totalDeductions`, `netPay` | 지급/공제 합계, 차인지급액. 급여가 없으면 `null` |
| `revisionNo` | 정정 차수. 급여가 없으면 `0` |

### 급여 상세 (`GET /api/payrolls/{payrollId}` 등 대부분의 급여 API 공통 응답 구조)

| 필드 | 설명 |
|---|---|
| `payrollId`, `employee`(`employeeId`/`name`/`employmentType`) | 급여·직원 식별 정보 |
| `yearMonth`, `scheduledPayDate` | 귀속월, 지급 예정일 |
| `status`, `revisionNo`, `originalPayrollId` | 준비 상태, 정정 차수, 원본 급여 식별자(정정본일 때만) |
| `snapshots.attendance` | 근무일수·근무시간·연장/야간/휴일근로시간·유급휴가시간 |
| `snapshots.compensations[]` | 계산에 적용된 계약 이력(적용기간·고용형태·급여형태·기본급/시급·통상시급·주 계약시간) |
| `snapshots.rule` | 계산에 적용된 법정 기준(가산율 등) |
| `earnings[]`, `deductions[]` | 항목별 `itemId`/`type`/`name`/`sourceType`/`amount`/`adjusted`/`adjustmentReason`/`calculationFormula`/`calculationBasis`/`editable` |
| `totalEarnings`, `totalDeductions`, `netPay` | 합계 |
| `memo` | 검토 메모(자유 텍스트) |
| `statement` | 명세서 정보(`statementId`/`status`/`fileSize`/`generatedAt`/`failureReason`), 미확정이면 `null` |
| `version` | 낙관적 락 버전 |

### 이메일 발송 결과 조회 요약 (`GET /api/payrolls/statement/email-delivery-batches/{batchId}` → `data.summary`)

`totalCount`, `pendingCount`, `sendingCount`, `sentCount`, `retryWaitCount`, `unknownCount`, `deliveredCount`, `failedCount`, `skippedCount`.

---

## 6. 컴포넌트 구성

미정. 화면 디자인이 확정되지 않아 컴포넌트 분해를 진행하지 않았다.

---

## 7. 상태 정리

화면 디자인과 무관하게 API 명세에서 확정된 값이다.

| 상태 그룹 | 값 |
|---|---|
| 급여 준비 상태(`preparationStatus` / `status`) | `NOT_CREATED`(미작성) / `DRAFT`(작성중) / `CALCULATED`(검토 필요) / `CONFIRMED`(확정 완료) |
| 급여명세서 상태(`statement.status`) | `PENDING`(생성 중) / `READY`(다운로드 가능) / `FAILED`(생성 실패, 재시도 가능) |
| 이메일 발송 상태(`delivery.status`) | `PENDING` / `SENDING` / `RETRY_WAIT` / `SENT` / `DELIVERED` / `FAILED` / `SKIPPED` / `UNKNOWN` |
| 일괄 발송 배치 상태(`batch.status`) | `PENDING`(전체 대기) / `PROCESSING`(처리 중) / `AWAITING_DELIVERY`(Webhook·대사 대기) / `COMPLETED`(전건 종결 또는 대상 없음) |
| 급여 지급일 유형(`payDayType`) | `FIXED_DAY`(매월 고정일) / `MONTH_END`(월말) |
| 급여형태(`salaryType`) | `MONTHLY`(월급, `baseSalary` 필수) / `HOURLY`(시급, `hourlyWage` 필수) |
| 고정수당 유형(`allowanceType`) | `MEAL` / `POSITION` / `DUTY` / `TRANSPORTATION` / `OTHER` |
| 지급항목 출처(`earnings[].sourceType`) | `CONTRACT`(계약 기반, 수정 불가) / `ATTENDANCE`(근태 기반, 수정 불가) / `MANUAL`(수기 추가, 수정·삭제 가능) |
| 공제항목 출처(`deductions[].sourceType`) | 명세서에는 `MOCK_INSURANCE`(임시 보험 계산)만 예시로 등장하며 전부 `editable: false`. 세금 등 다른 출처 타입은 명세서에서 확인되지 않음 |
| 지급항목 유형(`earnings[].type`) | 명세서 예시에 `BASE_SALARY`(기본급), `OVERTIME_PAY`(연장근로수당), `OTHER_ALLOWANCE`(수기 수당)만 등장 — 전체 enum 목록은 명세서에서 확인되지 않음 |
| 공제항목 유형(`deductions[].type`) | 명세서 예시에 `NATIONAL_PENSION`(국민연금)만 등장 — 전체 enum 목록은 명세서에서 확인되지 않음 |
| 고용형태(`employmentType`) | 명세서 예시에 `REGULAR`, `PART_TIME`만 등장 — 전체 enum 목록은 명세서에서 확인되지 않음 |

---
