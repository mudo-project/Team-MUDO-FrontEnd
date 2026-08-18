# Attendance(근태) Domain — CONTEXT
> 배치 경로: `src/feature/attendance/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 근태 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: **API 연동 완료(주요 플로우)**. `.docs/api/attendance-management/apiIntegration.md` 기준으로 실제 백엔드에 연동되어 있다. 더미 데이터 파일과 데모 상태바(`AttendanceDemoBar`)는 전부 제거했다. 등록/수정/반려 계열 입력 폼은 `react-hook-form` + `zod`로 통일했다. 탭 접근 권한 판별, 목록 페이지네이션(전직원 현황·수정 요청관리)은 아직 없다.

---

## 1. 개요

사용자가 출근·퇴근·초과근무를 기록해 자신의 근태를 확인하고, 잔여 연가·근속일수 등을 조회하며, 기록된 근태에 이상이 있으면 수정 요청을 보낼 수 있는 도메인. 관리자(권한 보유자)는 전직원의 근태 현황을 파악하고 수정 요청을 승인/반려한다.

### 핵심 제약

- 전직원 현황, 수정 요청관리 탭은 기획상 **설정된 권한을 가진 사용자만** 볼 수 있어야 하지만, 권한 판별은 아직 없다 — 현재는 누구나 4개 탭에 모두 진입할 수 있다.
- 캘린더는 `schedule`의 `ScheduleCalendar`와 동일하게 `react-day-picker`(`DayPicker` + `components.DayButton` 오버라이드)로 만든다. `mode="single"`을 주지만 실제 날짜 선택 상태(`selected`)는 항상 `undefined`로 비워 둔다 — `mode`가 없으면 `DayPicker`가 각 날짜를 상호작용 없는 텍스트로만 렌더링해 커스텀 `DayButton`이 무시되는 문제가 있어, 이를 우회하기 위한 값일 뿐이다.
- "현재 시각"은 클라이언트 시스템 시각이 아니라 **서버 시각 기준**이다. 대시보드 조회 응답의 `today.serverTime`과 클라이언트 `Date.now()`의 차이를 오프셋으로 저장해두고, 그 오프셋을 매초 더해 화면에 tick한다. 서버 렌더링 시각과 하이드레이션 시각이 달라 하이드레이션 불일치가 나는 것을 막기 위해, 마운트 전에는 이 값이 `null`이라 페이지가 아무것도 렌더링하지 않는다.
- 출근하기 버튼 클릭 시점이 기준 근무 시작 시간 이전/이후인지에 따라 정상 출근과 지각 처리(비고 작성 모달)가 분기된다 — 다만 이 분기는 **클라이언트 쪽 예측**이다(사전에 지각 여부를 확정해주는 API가 없다). 실제 지각 확정은 체크인 API 응답의 `status` 값을 따른다.
- "초과근무"는 별도의 시작 이벤트가 아니다. 퇴근 체크아웃 API의 `clockOutType`이 `NORMAL`이냐 `OVERTIME`이냐로만 구분되며, 초과근무 전용 시작 시각 필드는 없다.
- 근태 수정 요청의 `type` 값은 명세에 `CLOCK_IN_TIME`만 예시로 확인되어 있다. 나머지 3종(퇴근 시각/누락 기록 추가/비고 수정)에 쓰는 `CLOCK_OUT_TIME`/`MISSING_RECORD`/`NOTE_CORRECTION`과, 등록 요청의 `requestedClockOutTime`/`requestedClockInNote`/`requestedClockOutNote` 필드는 같은 명명 규칙·응답 DTO 필드 존재로 추정한 값이라 백엔드 enum·필드 확인이 필요하다.
- 전 직원 주간 출결 현황 API(`AttendanceStatus`: `NORMAL`/`LATE`/`ABSENT`/`UNRECORDED`)에는 연가(`LEAVE`) 상태가 없다 — 오늘 팀 근태 현황(`AttendanceTeamTodayStatus`: `PRESENT`/`LEAVE`/`ABSENT`/`OFF`)과는 서로 다른 상태 값 체계를 쓴다. 또한 전 직원 주간 목록에는 직원 직급과 퇴근 시각이 없다(특정 직원 상세조회 API에는 있음).

### 진입점

Sidebar의 근태 메뉴(`href: "/attendance"`). 라우트는 `src/app/(user)/attendance/page.tsx`(서버 컴포넌트, `AttendanceBoard`만 렌더링) 하나뿐이며, 탭 4개는 별도 라우트가 아니라 `AttendanceBoard`의 클라이언트 state로 전환된다.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **금일 근태 현황** | 근태 페이지 상단 영역. 오늘 날짜, 상태별 인원 수, 직원 카드로 구성. 오늘 팀 근태 현황 API로 채워진다 |
| **직원 카드** | 금일 근태 현황에 나열되는 직원 1인의 이름·상태·출근시간(출근 상태일 때만) |
| **근태 관리 컴포넌트** | 페이지 하단 영역. 상단 네비게이션 탭과 그 아래 탭별 화면으로 구성 |
| **내 근태 탭** | 좌측 캘린더 + 우측 근태 관련 컴포넌트(출석/잔여 연가/내 수정 요청)로 구성된 개인 근태 화면 |
| **전직원 현황 탭** | 권한 보유자만 접근 가능한, 전직원의 주간 근태를 표로 보는 화면 |
| **수정 요청관리 탭** | 권한 보유자만 접근 가능한, 전직원의 근태 수정 요청을 승인/반려하는 화면 |
| **내 근태수정 탭** | 내가 보낸 근태 수정 요청 전체 목록 화면 |
| **근태 상세조회 모달** | 캘린더에서 출근 기록이 있는 날을 클릭하면 나타나는, 해당 일의 근태 상세 모달(`AttendanceDetailModal`) |
| **근태 수정 요청 모달** | 근태 상세조회 모달의 `수정` 클릭 시 나타나는, 요청 구분에 따라 수정 요청을 작성하는 모달(`AttendanceCreateEditRequestModal`) |
| **지각 사유 모달** | 기준 출근 시간이 지난 후 `출근하기`를 클릭했을 때 나타나는, 비고(지각 사유)를 입력하는 모달(`AttendanceLateModal`) |
| **퇴근 기록 모달** | `퇴근하기` 클릭 시 나타나는, 근무 요약과 비고(선택)를 확인하는 모달(`AttendanceLeaveWorkModal`) |
| **초과 근무 기록 모달** | 기준 근무 시간을 넘긴 뒤 `초과 근무` 클릭 시 나타나는, 사유를 입력하는 모달(`AttendanceOvertimeWork`) |
| **내 근태 수정 상세조회 모달** | 내가 보낸 수정 요청을 조회하는 모달(`AttendanceEditRequestModal`, 조회 전용) |
| **근태 수정 요청 처리 모달** | 관리자가 반려 사유를 입력하거나 요청 상세를 보는 모달(`AttendanceEditRequestManageModal`) |

---

## 3. 화면 구성

```
┌─ 근태 페이지 ───────────────────────────────────────────────┐
│ [금일 근태 현황]                                             │
│  오늘 날짜                              정규 근무시간         │
│  출근 n  연가 n  결근 n  휴무 n                               │
│  [직원 카드] [직원 카드] [직원 카드] ...                      │
├───────────────────────────────────────────────────────────┤
│ [근태 관리 컴포넌트]                                          │
│  [내 근태] [전직원 현황]* [수정 요청관리]* [내 근태수정]       │
│  ─────────────────────────────────────────────────────────  │
│  (탭별 화면 컴포넌트)                                         │
│  * 권한 보유자에게만 노출                                      │
└───────────────────────────────────────────────────────────┘
```

### 금일 근태 현황

| 요소 | 설명 |
|---|---|
| 오늘 날짜/요일 | `team.date`, `team.dayOfWeek` |
| 정규 근무시간 | `team.regularWorkStartTime` ~ `team.regularWorkEndTime` |
| 상태별 현황 | 출근(`presentCount`) / 연가(`leaveCount`) / 결근(`absentCount`) / 휴무(`offCount`) |
| 직원 카드 | 이름, 상태(출근/연가/결근/휴무), 출근시간(`PRESENT`일 때만 `checkInTime` 표시) |

### 내 근태 탭

```
┌─ 내 근태 탭 ──────────────────────────────────┬─ 근태 관련 컴포넌트 ─┐
│ [캘린더]                                       │ [출석 관련 컨테이너]  │
│  n년 n월                  상태별 색상 안내      │  경과 근무시간         │
│  일정(schedule)과 같은 react-day-picker 그리드  │  현재 시간/날짜        │
│  출근 기록이 있는 날 클릭                       │  기준 근무시간         │
│  → 근태 상세조회 모달                          │  출근시간/퇴근시간     │
│                                                │  [출근하기]/[퇴근하기] │
│                                                │  [초과근무] (조건부)   │
│                                                ├───────────────────────┤
│                                                │ [잔여 연가 컨테이너]   │
│                                                │  잔여 연가/총 연가     │
│                                                │  사용 연가/갱신 날짜   │
│                                                │  근속일수/입사일       │
│                                                ├───────────────────────┤
│                                                │ [내 수정 요청 컨테이너]│
│                                                │  전체보기              │
│                                                │  최신 수정 요청 카드×3  │
└────────────────────────────────────────────────┴───────────────────────┘
```

#### 캘린더

- `AttendanceBoard`가 들고 있는 `month`를 `AttendanceCalendar`가 controlled prop으로 받는다. 이전/다음 달 버튼(`date-fns`의 `addMonths`/`subMonths`)을 누르면 `month`가 바뀌고, `AttendanceBoard`가 그 달의 대시보드를 다시 조회한다.
- 상단 좌측에 `{연}년 {월}월`, 우측에 상태별 색상 범례(출근/지각/결근/미기록 — 연가는 이 API에 없어 범례에서 뺐다)가 위치한다.
- 그 달의 모든 날짜에 대해 출근/퇴근 시각과 상태 dot이 표시된다(대시보드 응답의 `calendar.days`).
- **출근 기록이 있는 날은 어떤 날짜든 클릭할 수 있다** — "오늘"로 제한되어 있던 데모 단계와 달리, 클릭 시 그 날짜로 `getMyDayDetailAction`을 호출해 근태 상세조회 모달을 연다.
- 내가 보낸 수정 요청 중 `PENDING` 상태인 날짜에는 "수정 요청" 라벨이 함께 표시된다.

#### 근태 상세조회 모달 (`AttendanceDetailModal`)

날짜, 출근시간, 퇴근시간, 출근 비고사유(존재할 때만), 퇴근 비고사유(존재할 때만), 상태(수정 요청 처리사항 유무), 수정 버튼으로 구성된다. 특정 날짜 내 근태 상세 조회 API(`getMyDayDetailAction`) 응답을 그대로 보여준다.

- 수정 버튼을 클릭하면 근태 수정 요청 모달이 열린다(같은 날짜 대상).

#### 근태 수정 요청 모달 (`AttendanceCreateEditRequestModal`)

날짜, 현재기록(출근·퇴근시간), 요청 구분(출근 시각 / 퇴근 시각 / 누락 기록 추가 / 비고 수정), 요청 구분에 따라 달라지는 선택바, 사유로 구성된다. `react-hook-form` + `zod`(`attendanceEditRequestCreateSchema`)로 검증한다.

- 요청 구분이 `출근 시각`/`퇴근 시각`이면, 대응하는 시각 select가 나타난다(5분 단위, `attendanceFormat.ts`의 `generateTimeOptions`).
- 요청 구분이 `누락 기록 추가`면, 출근 시간·퇴근 시간 select 두 개가 나타난다.
- 요청 구분이 `비고 수정`이면, 현재 비고 내용이 나타나고 그 아래에 수정할 비고 내용을 입력한다(비어 있으면 스키마의 `superRefine`이 막는다).
- 제출하면 `createCorrectionRequestAction`을 호출해 실제로 수정 요청을 등록한다.

#### 출석 관련 컨테이너 (`AttendanceCommuteInformation`)

경과한 근무 시간, 현재 시간, 현재 날짜, 기준 근무시간, 출근시간, 퇴근시간, 출근하기/퇴근하기/초과근무 버튼으로 구성된다. 데이터는 오늘 근태(대시보드의 `today`)에서 온다.

- 경과한 근무 시간은 출근시간으로부터 지난 시간을 표시한다(서버 시각 기준 `now`).
- 출근이 되지 않은 상태에서는 `출근하기` 버튼이 나타난다.
  - 기준 출근 시간 **이전**으로 예측되면 `checkInAction()`을 바로 호출해 출근 처리한다.
  - 기준 출근 시간이 **지난 것으로 예측**되면 지각 사유 모달이 나타나고, 비고 입력 후 제출하면 `checkInAction({ clockInNote })`을 호출한다.
- 출근이 기록되면 버튼이 `퇴근하기` 버튼으로 바뀐다.
- `퇴근하기` 클릭 시 퇴근 기록 모달이 나타나고, 제출하면 `checkOutAction({ clockOutType: "NORMAL", clockOutNote })`을 호출한다.
- 기준 근무 시간이 지나고 아직 퇴근 전이면 `퇴근하기` 버튼 옆에 `초과 근무` 버튼이 추가로 나타난다.
- `초과 근무` 클릭 시 초과 근무 기록 모달이 나타나고, 제출하면 `checkOutAction({ clockOutType: "OVERTIME", clockOutNote: reason })`을 호출한다.
- 출근/퇴근 처리가 성공하면 `AttendanceBoard`가 그 달의 대시보드를 다시 조회해 캘린더·경과시간·연가 카드를 모두 갱신한다.

#### 잔여 연가 컨테이너 (`AttendanceAnnualLeave`)

잔여 연가, 총 연가, 사용 연가, 갱신 날짜, 근속일수, 입사일로 구성된다. 대시보드 응답의 `leave`/`employment`를 그대로 표시한다(연가 사용률 바는 `usedDays/totalDays`로 계산).

#### 내 수정 요청 컨테이너 (`AttendanceMyEditRequest`)

전체보기, 요청한 근태 수정 카드로 구성된다.

- `전체보기` 클릭 시 내 근태수정 탭으로 이동한다.
- `AttendanceBoard`가 들고 있는 `myRequests`(`getMyCorrectionRequestListAction` 조회 결과) 중 `requestedAt` 기준 최신 3건만 카드로 표시된다.
- 카드에는 대상일자, 상태, 사유가 표시된다.
- 카드 클릭 시 내 근태 수정 상세조회 모달이 열린다.

#### 내 근태 수정 상세조회 모달 (`AttendanceEditRequestModal`)

요청 상태, 대상일자, 요청 구분, 변경 내용(`formatCorrectionChangeSummary`로 원본값→요청값을 조합), 사유, 요청일시로 구성된 조회 전용 모달이다. 반려/승인 버튼은 없다 — 승인·반려 처리는 수정 요청관리 탭에서 관리자가 직접 하고, 이 모달은 본인이 보낸 요청을 확인하는 용도로만 쓰인다. `REJECTED` 상태면 반려 사유도 함께 보여준다.

### 전직원 현황 탭 (권한)

```
┌─ 전직원 현황 탭 ──────────────────────────────────────────┐
│ [주간 날짜 조정] [검색바] [필터: 전체/지각/결근]              │
│ [상태 안내: 출근/지각/결근/미기록]                            │
├───────────────────────────────────────────────────────────┤
│ [직원 테이블]                                                │
│  직원  | 월 | 화 | 수 | 목 | 금 | 토 | 일 | 주간요약           │
│  이름   | 출근시간 또는 상태값 ...                          | n/m │
└───────────────────────────────────────────────────────────┘
```

- 주간은 **월요일 시작**이다(전 직원 주간 출결 현황 API의 처리흐름이 "월요일·일요일을 계산"한다고 명시). 날짜 input으로 기준일을 바꾸면 그 날짜가 속한 주로 이동하고, 이전/다음 주 버튼은 7일씩 이동한다. 주 범위·요일 헤더는 서버 응답의 `week.startDate`/`week.endDate`로 계산한다.
- 검색바(`keyword`)와 상태 필터(`status`: `LATE`/`ABSENT`)는 **서버 쿼리 파라미터로 전달**된다(클라이언트 필터링이 아니다).
- 필터는 전체/지각/결근 — **연가(`LEAVE`) 필터는 없다**(API의 `AttendanceStatus`에 연가가 없어서). 상태값이 없는 날은 "미기록"으로 표시된다.
- 직원 테이블 최상위 행은 직원 열, 그 주 7개 날짜 열, 주간 요약 열로 구성된다.
- **직원 열에는 이름만 표시된다** — 이 API 응답에는 직급 필드가 없다(특정 직원 상세조회 API에는 있음).
- 날짜 열에는 상태별 색 dot + (출근/지각이면 출근 시각, 아니면 상태 라벨)이 표시된다. **퇴근 시각은 이 목록에 없다**(특정 직원 상세조회에는 있음).
- 주간 요약 열에는 서버가 계산한 `attendedDays`/`scheduledWorkDays`가 `n/m` 형태로 표시된다.
- 직원을 클릭하면 같은 탭 화면이 특정 직원 상세조회로 바뀐다(별도 라우트 이동이 아니라 `AttendanceAllEmployees`의 클라이언트 state 전환, 현재 선택한 날짜를 그대로 넘긴다).

#### 특정 직원 상세조회 화면 (`AttendanceEmployeesDetail`)

"전직원 현황으로 돌아가기" 버튼, 직원 이름·직급, 그 주 요일별 카드 목록으로 구성된다. `getEmployeeWeeklyAction(userId, { date })`로 별도 조회하며, 이 응답에는 직급과 퇴근 시각이 포함되어 있어 전직원 목록보다 더 상세하다. 카드는 요일·날짜, 상태(출근/지각/결근/미기록), 출근·퇴근 시각(정상/지각일 때만)을 보여준다.

### 수정 요청관리 탭 (권한)

```
┌─ 수정 요청관리 탭 ─────────────────────────────────────────┐
│ [필터: 대기(건수)/전체/승인/반려]                             │
├───────────────────────────────────────────────────────────┤
│ [요청 관리 테이블]                                           │
│  요청자 | 대상일자 | 요청 구분 | 변경 내용 | 사유 | 요청일시 | 상태 | 처리 │
└───────────────────────────────────────────────────────────┘
```

- 관리자 근태 수정 요청 목록 조회 API(`getAdminCorrectionRequestListAction`)를 상태 필터 없이 한 번에(`size: 100`) 불러온 뒤, 화면에서는 클라이언트로 필터링한다(대기/전체/승인/반려).
- 요청자 열에는 요청자 이름·직급이 표시된다(이 API 응답에는 있다).
- 변경 내용 열은 `formatCorrectionChangeSummary`로 원본값→요청값을 조합해 보여준다(예: `출근 09:35 → 09:05`).
- 처리 열은 상태가 `대기(PENDING)`일 때만 반려/승인 버튼을 보여준다.
  - **승인**은 테이블에서 바로 클릭해 `approveCorrectionRequestAction`을 호출한다(별도 확인 없음).
  - **반려**는 사유가 필수라 테이블에서 즉시 처리하지 않고, 클릭하면 상세 모달(`AttendanceEditRequestManageModal`)이 열려 반려 사유 입력 폼(`react-hook-form` + `attendanceEditRequestRejectSchema`)을 보여준다.
- 처리 완료된 행은 버튼 자리에 처리 날짜가 표시된다. 승인/반려가 성공하면 목록을 다시 조회한다.
- 요청자를 클릭해도 같은 상세 모달이 열린다(승인/반려가 가능한 관리자 뷰).

### 내 근태수정 탭

```
┌─ 내 근태수정 탭 ───────────────────────────────────────────┐
│ [필터: 전체/대기/승인/반려]                                  │
├───────────────────────────────────────────────────────────┤
│ [근태 목록 테이블]                                           │
│  대상 일자 | 요청 구분 | 변경 내용 | 사유 | 요청일시 | 상태     │
└───────────────────────────────────────────────────────────┘
```

- `AttendanceBoard`의 `myRequests`(내가 보낸 수정 요청 목록)를 그대로 받아 클라이언트에서 상태별로 필터링한다. 요청자 열은 없다(본인 요청만 나열되므로).
- 대상일자 셀만 버튼이고, 클릭하면 내 근태 수정 상세조회 모달(`AttendanceEditRequestModal`)이 열린다. 이 모달은 조회 전용이라 승인/반려 버튼이 없다 — "내 수정 요청" 컨테이너의 카드 클릭과 동일한 모달을 공유한다.

---

## 4. 기능 목록

### 4.1 금일 근태 현황

| 기능 | 트리거 | 동작 |
|---|---|---|
| 금일 현황 조회 | 근태 페이지 진입 | `getTeamTodayAction` 호출, 오늘 날짜·정규 근무시간·상태별 인원 수·직원 카드 목록 표시 |
| 조회 실패 처리 | API 실패 | 로딩 화면 대신 오류 메시지 + "다시 시도" 버튼 표시 |

### 4.2 출근/퇴근/초과근무 기록

| 기능 | 트리거 | 동작 |
|---|---|---|
| 정상 출근 처리 | 기준 출근 시간 이전으로 예측된 시점에 `출근하기` 클릭 | `checkInAction()` 호출, 성공 시 대시보드 재조회 |
| 지각 처리 | 기준 출근 시간 이후로 예측된 시점에 `출근하기` 클릭 | 지각 사유 모달 노출(비고 필수), 제출 시 `checkInAction({ clockInNote })` 호출 |
| 퇴근 기록 | `퇴근하기` 클릭 | 퇴근 기록 모달 노출(비고 선택), 제출 시 `checkOutAction({ clockOutType: "NORMAL", clockOutNote })` 호출 |
| 초과근무 버튼 노출 | 기준 근무 시간 초과 && 퇴근 전 | `퇴근하기` 옆에 `초과 근무` 버튼 추가 노출 |
| 초과근무 기록 | `초과 근무` 클릭 | 초과 근무 기록 모달 노출(사유 필수), 제출 시 `checkOutAction({ clockOutType: "OVERTIME", clockOutNote: reason })` 호출 |
| 대시보드 반영 | 출근/퇴근 API 성공 | `AttendanceBoard`가 해당 월 대시보드를 다시 조회해 캘린더·경과시간을 갱신 |
| 처리 실패 안내 | API 실패 | 토스트로 실패 메시지 표시, 모달 유지(로딩 오버레이는 해제) |

### 4.3 내 근태 조회

| 기능 | 트리거 | 동작 |
|---|---|---|
| 캘린더 월 이동 | 이전/다음 달 버튼 | `month` state 변경 → 해당 월 대시보드 재조회 |
| 근태 상세조회 | 출근 기록이 있는 날 클릭 | `getMyDayDetailAction(date)` 호출, 근태 상세조회 모달 노출 |
| 수정 요청 작성 진입 | 상세조회 모달 `수정` 클릭 | 같은 날짜 대상으로 근태 수정 요청 모달 노출 |
| 요청 구분별 입력 전환 | 수정 요청 모달의 요청 구분 라디오 선택(`useWatch`) | 출근 시각/퇴근 시각/누락 기록 추가/비고 수정에 따라 입력 UI 전환 |
| 수정 요청 등록 | 요청 모달 제출(zod 검증 통과 시) | `createCorrectionRequestAction` 호출, 성공 시 내 수정 요청 목록·대시보드 재조회 |

### 4.4 잔여 연가 조회

| 기능 | 트리거 | 동작 |
|---|---|---|
| 잔여 연가 조회 | 내 근태 탭 진입(대시보드 조회에 포함) | 잔여 연가, 총 연가, 사용 연가, 갱신 날짜, 근속일수, 입사일 표시 |

### 4.5 내 수정 요청

| 기능 | 트리거 | 동작 |
|---|---|---|
| 목록 조회 | 페이지 진입 | `getMyCorrectionRequestListAction` 호출 |
| 최신 요청 3건 표시 | 내 근태 탭 진입 | `requestedAt` 기준 최신 3건을 카드(대상일자, 상태, 사유)로 표시 |
| 전체보기 이동 | `전체보기` 클릭 | 내 근태수정 탭으로 전환 |
| 요청 상세조회 | 요청 카드 클릭 | 내 근태 수정 상세조회 모달(조회 전용) 노출 |
| 필터링 | 내 근태수정 탭 필터(전체/대기/승인/반려) | 필터에 해당하는 요청만 목록에 표시(클라이언트 필터) |

### 4.6 전직원 현황 (권한)

| 기능 | 트리거 | 동작 |
|---|---|---|
| 탭 접근 제어 | 전직원 현황 탭 클릭 | 누구나 진입 가능(권한 판별 미구현) |
| 주간 이동 | 이전/다음 주 버튼, 날짜 input | `selectedDate` 변경 → `getEmployeesWeeklyAction` 재조회(월요일 시작 주) |
| 직원 검색 | 검색바 입력 | `keyword` 쿼리 파라미터로 서버에 전달 |
| 상태 필터 | 필터(전체/지각/결근) 선택 | `status` 쿼리 파라미터로 서버에 전달(연가 필터 없음) |
| 직원 상세조회 전환 | 테이블에서 직원 클릭 | 같은 탭 화면이 특정 직원 상세조회로 전환(`selectedEmployee` state) |
| 상세조회에서 목록 복귀 | "전직원 현황으로 돌아가기" 클릭 | 목록 화면으로 복귀 |

### 4.7 수정 요청관리 (권한)

| 기능 | 트리거 | 동작 |
|---|---|---|
| 탭 접근 제어 | 수정 요청관리 탭 클릭 | 누구나 진입 가능(권한 판별 미구현) |
| 목록 조회 | 탭 진입 | `getAdminCorrectionRequestListAction({ size: 100 })` 호출 후 클라이언트에서 상태별 필터 |
| 승인 처리 | 대기 행의 `승인` 클릭, 또는 상세 모달의 `승인` | `approveCorrectionRequestAction` 호출, 성공 시 목록 재조회 |
| 반려 처리 | 대기 행의 `반려` 클릭 → 상세 모달에서 사유 입력 후 제출 | `rejectCorrectionRequestAction({ reason })` 호출(zod로 사유 필수 검증), 성공 시 목록 재조회 |

---

## 5. 데이터

`.docs/api/attendance-management/apiIntegration.md` 기준으로 실제 백엔드에 연동되어 있다. 와이파이 IP·근무시간 정책 관련 API는 `setting` 도메인이 이미 다루고 있어 이 도메인의 타입/서비스/액션에는 포함하지 않았다.

| 파일 | 내용 |
|---|---|
| `type.ts` | API 요청/응답 타입 전체. notice/schedule과 동일하게 `export` 없는 전역 스크립트 스타일 |
| `attendanceFormat.ts` | 시각·날짜 포맷 헬퍼(`formatClockTime`/`formatDateLabel`/`formatDateTimeLabel`/`formatElapsed`/`formatDuration`), 상태·요청유형 라벨/배지 클래스 맵, `generateTimeOptions`, `formatCorrectionChangeSummary` |
| `actions.ts` | `'use server'`. 조회 액션은 데이터를 바로 반환(실패 시 예외 throw), 등록/승인/반려 등 변경 액션은 `{ success, message, data? }` 반환(notice와 동일 패턴) |
| `src/service/attendance.service.ts` | `fetchWithAuth` + `getErrorMessage` 기반 API 호출. 다른 도메인처럼 `src/service/`에 위치(도메인 안이 아니라 프로젝트 공통 위치). `checkIn`/`checkOut`은 `buildSignedClientIpHeaders`(`src/lib/clientIpHeaders.ts`)로 각자의 경로(`/api/attendance/check-ins`, `/api/attendance/check-outs`) 기준 IP 서명 헤더(`X-Client-IP*`)를 만들어 요청에 붙인다 |

### 상태값 (백엔드가 준 이름을 그대로 씀)

| 타입 | 값 | 쓰이는 곳 |
|---|---|---|
| `AttendanceStatus` | `NORMAL`/`LATE`/`ABSENT`/`UNRECORDED` | 체크인/체크아웃 응답, 대시보드 캘린더, 오늘 근태, 월별 근태, 전직원/특정직원 주간 출결 |
| `AttendanceTeamTodayStatus` | `PRESENT`/`LEAVE`/`ABSENT`/`OFF` | 오늘 팀 근태 현황만. 위 `AttendanceStatus`와 별개 체계다 |
| `AttendanceCorrectionStatus` | `PENDING`/`APPROVED`/`REJECTED` | 근태 수정 요청(내 것/관리자용 공통). `PENDING`만 명세에 확정, 나머지는 승인/반려 API 존재로 추론 |
| `AttendanceClockOutType` | `NORMAL`/`OVERTIME` | 퇴근 체크아웃 요청의 퇴근 유형(명세에 타입명까지 명시됨) |
| `CorrectionRequestType`(`attendanceFormat.ts`) | `CLOCK_IN_TIME`/`CLOCK_OUT_TIME`/`MISSING_RECORD`/`NOTE_CORRECTION` | 수정 요청 등록 폼의 요청 구분. `CLOCK_IN_TIME`만 명세 확정, 나머지는 추정(핵심 제약 참고) |

### 내 근태 대시보드 (`AttendanceDashboardData`, `getMyDashboardAction`)

연/월 하나로 캘린더·오늘·연가·재직 정보를 한 번에 받는다. `AttendanceBoard`가 유일하게 쓰는 조합 조회다.

| 필드 | 내용 |
|---|---|
| `calendar` | `{ year, month, days: AttendanceMonthlyDayData[] }` — 캘린더가 그대로 씀 |
| `today` | `AttendanceTodayData`(`date`, `workStartTime`, `workEndTime`, `clockInAt`, `clockOutAt`, `status`, `serverTime`) — 출석 컨테이너 + 서버시각 오프셋 계산에 씀 |
| `leave` | `AttendanceLeaveSummaryData`(`totalDays`, `usedDays`, `pendingDays`, `remainingDays`, `nextGrantDate`) |
| `employment` | `AttendanceEmploymentSummaryData`(`hireDate`, `tenureDays`) |

### 특정 날짜 내 근태 상세 (`AttendanceDayDetailData`, `getMyDayDetailAction(date)`)

`date`, `clockInAt`/`clockOutAt`(시각만, 날짜 없는 문자열), `clockInNote`/`clockOutNote`, `correctionRequestPending`. 캘린더에서 날짜를 클릭했을 때 조회해 상세조회 모달에 그대로 쓴다.

### 내가 보낸 / 관리자가 보는 수정 요청

`AttendanceMyCorrectionRequestData`(내 것)와 `AttendanceAdminCorrectionRequestData`(관리자용, `requester`/`workDate`/`processedBy` 추가)는 필드 구조가 거의 같다 — 둘 다 `type`, `original*`/`requested*`(ClockInAt/ClockOutAt/ClockInNote/ClockOutNote), `reason`, `requestedAt`, `processedAt`, `rejectionReason`, `status`를 갖는다. `formatCorrectionChangeSummary`가 이 공통 필드로 변경 내용 문자열을 만들어 두 화면에서 재사용된다.

### 전직원 주간 출결 (`AttendanceEmployeesWeeklyData`, `getEmployeesWeeklyAction`)

`week`(월~일 범위), `scheduledWorkDays`, `employees.content[]`(각 항목은 `userId`, `name`, `attendedDays`, `scheduledWorkDays`, `days[]`: `date`/`status`/`clockInAt`만). **직급·퇴근시각 없음.**

### 특정 직원 주간 출결 (`AttendanceEmployeeWeeklyData`, `getEmployeeWeeklyAction`)

`employee`(`userId`/`name`/`position`), `week`, `days[]`(`date`/`status`/`clockInAt`/`clockOutAt`), `weeklySummary`. 전직원 목록보다 필드가 많다(직급·퇴근시각 포함).

---

## 6. 컴포넌트 구성

`src/feature/attendance/components/`에 실제로 존재하는 컴포넌트 기준. 페이지 라우트는 `src/app/(user)/attendance/page.tsx`(서버 컴포넌트) 하나뿐이고, 이 페이지는 `AttendanceBoard`만 렌더링한다.

| 컴포넌트 | 책임 |
|---|---|
| **AttendanceBoard** | 페이지 전체 상태·데이터 허브(client). 마운트 시 `getTeamTodayAction`/`getMyCorrectionRequestListAction`을 부르고, `month`가 정해지면 `getMyDashboardAction`을 호출한다. `now`(서버시각 오프셋을 매초 더한 tick), `dashboard`/`team`/`myRequests`, `modal`(열린 모달 종류), `selectedDayDetail`, `tab`을 소유한다. 출근/퇴근/수정요청 제출 핸들러가 모두 여기 있고, 성공 시 관련 조회를 다시 호출(refetch)해 화면을 갱신한다. 조회 실패 시 무한 로딩 대신 오류 메시지 + 재시도 버튼을 보여준다 |
| **AttendanceCard** | 우측 사이드바 카드 3개(`AttendanceCommuteInformation`/`AttendanceAnnualLeave`/`AttendanceMyEditRequest`)가 공유하는 카드 셸 |
| **AttendanceTodaySituation** | 금일 근태 현황. `team`(`AttendanceTeamTodayData`) prop을 받아 그대로 그린다 |
| **AttendanceCalendar** | 내 근태 탭 좌측 캘린더. `month`/`days`/`pendingCorrectionDates`를 props로 받는 controlled 컴포넌트(`react-day-picker`). `components.DayButton`을 `AttendanceDayCell`로 오버라이드한다 |
| **AttendanceDayCell** | `DayPicker`의 `DayButton` 오버라이드. `daysByDate`(날짜별 맵)에서 그 날의 상태·출퇴근 시각을 찾아 표시하고, 출근 기록이 있는 날만 클릭 가능(`onSelectDay`) |
| **AttendanceCommuteInformation** | 출석 관련 컨테이너. `today`(`AttendanceTodayData`)와 `now`를 받아 경과시간·상태 뱃지를 계산하고, 클릭 콜백만 props로 받는다(모달 오픈은 `AttendanceBoard`가 담당). 마운트 시 설정(setting) 도메인의 `getCurrentIpAction`/`getWifiIpListAction`을 호출해 현재 접속 IP가 등록된 와이파이 IP 목록에 포함되는지로 `isWifiConnected`를 계산하고, 하단에 "학원 와이파이 연결됨"/"학원 와이파이 연결되지 않음"을 표시한다(조회 실패 시 연결되지 않음으로 처리) |
| **AttendanceLateModal** | 지각 사유 모달. `react-hook-form` + `attendanceCheckInSchema`(`src/lib/`)로 비고 필수 검증 |
| **AttendanceLeaveWorkModal** | 퇴근 기록 모달. `react-hook-form` + `attendanceCheckOutSchema`(비고는 선택이라 검증 없음) |
| **AttendanceOvertimeWork** | 초과 근무 기록 모달. `react-hook-form` + `attendanceOvertimeSchema`로 사유 필수 검증 |
| **AttendanceAnnualLeave** | 잔여 연가 컨테이너. `leave`/`employment` props를 그대로 표시 |
| **AttendanceMyEditRequest** | 내 수정 요청 컨테이너. `requests`(`myRequests`) 중 최신 3건을 카드로 보여주고, 카드 클릭 시 자체 state로 `AttendanceEditRequestModal`을 연다. `onViewAll`로 상위 탭 전환 |
| **AttendanceDetailModal** | 근태 상세조회 모달. `dayDetail`(`AttendanceDayDetailData`)을 그대로 표시하고, 수정 클릭 시 `AttendanceBoard`가 모달을 `editRequest`로 전환 |
| **AttendanceCreateEditRequestModal** | 근태 수정 요청 작성 모달. `react-hook-form` + `attendanceEditRequestCreateSchema`. `useWatch`로 요청 구분 라디오값을 관찰해 입력 UI를 전환하고, 제출 시 구분별로 다른 필드 조합을 `onSubmit`으로 넘긴다 |
| **AttendanceAllEmployees** | 전직원 현황 탭. `selectedDate`/`search`/`statusFilter` state로 `getEmployeesWeeklyAction`을 호출하고, `selectedEmployee`가 있으면 `AttendanceEmployeesDetail`을 대신 렌더링한다 |
| **AttendanceAllEmployeesItem** | 전직원 현황 테이블 1행. 이름 클릭 시 `onSelect`로 상위의 `selectedEmployee`를 설정 |
| **AttendanceEmployeesDetail** | 특정 직원 상세조회 화면. `getEmployeeWeeklyAction(userId, { date })`을 자체적으로 호출한다 |
| **AttendanceEditRequestManage** | 수정 요청관리 탭. `getAdminCorrectionRequestListAction({ size: 100 })`으로 전체를 불러와 클라이언트에서 필터링하고, 승인/반려 액션 호출과 재조회를 담당 |
| **AttendanceEditRequestManageItem** | 수정 요청관리 테이블 1행. `승인`은 즉시 호출, `반려`는 사유가 필요해 `onSelect`로 상세 모달을 연다 |
| **AttendanceEditRequestManageModal** | 관리자용 상세 모달. 승인/반려 버튼을 갖고 있고, 반려 시 `react-hook-form` + `attendanceEditRequestRejectSchema`로 사유를 입력받는 서브폼을 보여준다 |
| **AttendanceEditRequestModal** | 내 근태 수정 상세조회 모달(조회 전용, 승인/반려 없음). "내 수정 요청" 컨테이너와 내 근태수정 탭(`AttendanceMyEditRequestList`)이 공유한다 |
| **AttendanceMyEditRequestList** | 내 근태수정 탭의 요청 목록(전체/대기/승인/반려 필터, 테이블). 대상일자 셀 클릭 시 `AttendanceEditRequestModal`을 연다 |
| **AttendanceMyEditRequestItem** | 내 근태수정 탭 목록 1행 |

### 폼 스키마 (`src/lib/`)

등록/수정/반려 계열 입력 폼은 전부 `react-hook-form` + `zod`(`@hookform/resolvers/zod`)로 통일했다(`schedule`의 `ScheduleCreateForm` 패턴과 동일). 스키마 이름은 `Correction`이 아니라 컴포넌트 네이밍과 맞춰 **`EditRequest`**로 통일했다(백엔드 API 타입명인 `AttendanceCorrectionCreateRequest` 등과는 다르니 헷갈리지 않게 구분).

| 파일 | 검증 대상 | 필수 여부 |
|---|---|---|
| `attendanceCheckInSchema.ts` | 지각 사유(`note`) | 필수 |
| `attendanceCheckOutSchema.ts` | 퇴근 비고(`note`) | 선택 |
| `attendanceOvertimeSchema.ts` | 초과근무 사유(`reason`) | 필수 |
| `attendanceEditRequestCreateSchema.ts` | 근태 수정 요청 등록 폼 전체(`type` + 시각/비고 필드 + `reason`). `superRefine`으로 `NOTE_CORRECTION` 선택 시 비고 내용 필수 처리 | 사유 필수, 비고수정 시 내용도 필수 |
| `attendanceEditRequestRejectSchema.ts` | 반려 사유(`reason`) | 필수 |

### 관계

```
(user)/attendance/page.tsx          (서버 컴포넌트, AttendanceBoard만 렌더링)
└── AttendanceBoard                 (now, month, dashboard, team, myRequests, modal, selectedDayDetail, tab)
    ├── AttendanceTodaySituation     (team)
    ├── (네비게이션: 내 근태 / 전직원 현황 / 수정 요청관리 / 내 근태수정 — tab state로 전환)
    │
    ├── tab === "mine"
    │   ├── AttendanceCalendar                    (month, days=dashboard.calendar.days, pendingCorrectionDates)
    │   │   └── AttendanceDayCell[]                (DayPicker의 DayButton 오버라이드, onSelectDay)
    │   └── AttendanceCard 셸을 쓰는 사이드바
    │       ├── AttendanceCommuteInformation       (now, today=dashboard.today → onClockIn/onClockOut/onOvertime)
    │       ├── AttendanceAnnualLeave               (leave, employment)
    │       └── AttendanceMyEditRequest             (myRequests, onViewAll → setTab("myEdits"))
    │           └── AttendanceEditRequestModal      (카드 클릭 시, 자체 state)
    │
    ├── tab === "all"
    │   └── AttendanceAllEmployees                 (selectedDate/search/statusFilter/selectedEmployee 자체 state)
    │       ├── AttendanceAllEmployeesItem[]        (selectedEmployee 없을 때)
    │       └── AttendanceEmployeesDetail           (selectedEmployee 있을 때, 자체로 getEmployeeWeeklyAction 호출)
    │
    ├── tab === "manage"
    │   └── AttendanceEditRequestManage             (requests/filter/selectedRequest 자체 state)
    │       ├── AttendanceEditRequestManageItem[]   (승인 즉시 호출, 반려는 onSelect)
    │       └── AttendanceEditRequestManageModal    (선택된 요청, 반려 사유 입력 서브폼)
    │
    ├── tab === "myEdits"
    │   └── AttendanceMyEditRequestList             (filter/selectedRequest 자체 state, myRequests props)
    │       ├── AttendanceMyEditRequestItem[]
    │       └── AttendanceEditRequestModal          (행 클릭 시)
    │
    ├── modal === "late" → AttendanceLateModal            (checkInAction)
    ├── modal === "leave" → AttendanceLeaveWorkModal      (checkOutAction NORMAL)
    ├── modal === "overtime" → AttendanceOvertimeWork     (checkOutAction OVERTIME)
    ├── modal === "detail" → AttendanceDetailModal        (getMyDayDetailAction 결과)
    │     └── 수정 클릭 → modal="editRequest"
    └── modal === "editRequest" → AttendanceCreateEditRequestModal  (createCorrectionRequestAction)
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 탭 접근 권한 판별 | 전직원 현황 / 수정 요청관리 탭의 노출·접근 제어 | 미구현 — 현재는 누구나 4개 탭에 진입 가능 |
| 목록 페이지네이션 | 전직원 현황·수정 요청관리 목록이 첫 페이지(각 20/100건)만 조회됨 | 미구현 |
| 전직원 현황 주간 이동 UX | 날짜 input + 전/후 7일 이동은 되지만, 로딩 중 스켈레톤 등은 없음 | 부분 구현 |
| 근태 수정 요청 `type` enum 확정 | `CLOCK_OUT_TIME`/`MISSING_RECORD`/`NOTE_CORRECTION` 및 관련 요청 필드가 실제 백엔드와 일치하는지 확인 | 확인 필요(핵심 제약 참고) |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 근태 페이지 탭(`AttendanceBoard`의 `tab`) | `mine`(내 근태) / `all`(전직원 현황) / `manage`(수정 요청관리) / `myEdits`(내 근태수정) |
| 현재 시각(`now`) | 마운트 전 `null`(렌더 안 함) / 마운트 후 서버시각 오프셋을 매초 더해 tick하는 `Date` |
| 대시보드 로딩/오류 | 로딩 중 / 정상 / 오류(재시도 버튼 노출) — `dashboardError`/`teamError`로 구분 |
| 오늘 출근 상태(`today.status`) | `UNRECORDED`(미출근) / `NORMAL`(정상 출근) / `LATE`(지각) / `ABSENT`(결근) |
| 퇴근 상태 | `today.clockOutAt`이 `null`인지 여부 |
| 초과근무 버튼 노출 | 출근했고 퇴근 전이며 `now >= workEndTime`일 때 |
| `AttendanceBoard`의 `modal` | `null` / `late` / `leave` / `overtime` / `detail` / `editRequest` |
| 내 근태 수정 상세조회 모달(`AttendanceEditRequestModal`) | 열림 / 닫힘(호출한 컴포넌트가 각자 로컬 state로 관리) |
| 내 근태수정 탭 필터 | 전체 / `PENDING` / `APPROVED` / `REJECTED` |
| 전직원 현황 검색/필터/주 | 검색어·상태 필터(전체/지각/결근)는 서버 쿼리 파라미터, 기준일(`selectedDate`)로 주 결정 |
| 전직원 현황 화면 | 목록 / 특정 직원 상세조회(`selectedEmployee`) |
| 수정 요청관리 필터 | 전체 / `PENDING` / `APPROVED` / `REJECTED`(클라이언트 필터) |
| 수정 요청관리 상세 모달의 반려 서브폼 | 닫힘 / 열림(반려 사유 입력 중) |

---
