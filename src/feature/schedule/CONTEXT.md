# Schedule(일정) Domain — CONTEXT
> 배치 경로: `src/feature/schedule/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 일정 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: **부분 구현**. 캘린더 탐색, 일정 등록/수정/삭제/상세조회는 실제 백엔드 API(`/api/calendars`)와 연동되어 있다. 목록 조회는 `@tanstack/react-query`의 `useQuery`, 등록/수정/삭제는 `useMutation`으로 서버 액션(`src/feature/schedule/actions.ts`)을 호출하고, 성공/실패는 `sonner` 토스트로 알린다. 작성자 판별(상세조회 모달의 수정 버튼 노출 조건)은 없다.

### 사용 라이브러리

- **`react-day-picker`**(`DayPicker`) — 월간 캘린더 그리드. `components.DayButton`을 `ScheduleDayCell`로 오버라이드해 날짜 칸 안에 일정 목록(색 배경 pill, `+n개`)을 렌더링한다. 캡션(연/월 표시)과 기본 네비게이션은 `classNames`로 숨기고, 그 자리를 직접 만든 헤더(이전/다음 버튼 + `ScheduleDatePicker` + 오늘 버튼)가 대체한다 — `month`/`onMonthChange`, `selected`/`onSelect`를 controlled로 연결해 이 헤더가 `DayPicker`를 제어한다.
- **`@tanstack/react-query`** — 목록 조회(`useQuery`, 쿼리 키 `["schedule", yearMonth]`)와 등록/수정/삭제(`useMutation`)를 담당한다. `(user)/layout.tsx`의 `QueryProvider`가 제공하는 클라이언트를 쓰며, `workspace` 도메인과 동일한 패턴이다. 등록/수정/삭제 성공 시 `queryClient.invalidateQueries`로 목록 쿼리를 무효화해 다시 불러온다.
- **`sonner`** — 등록/수정/삭제 성공·실패를 토스트로 알린다(`toast.success`/`toast.error`). `src/app/layout.tsx`에 붙어 있는 전역 `<Toaster />`를 사용한다.
- **`date-fns`** — `isSameDay`/`isSameMonth`(일정 필터링), `addMonths`/`subMonths`(이전/다음 달 이동), `format`/`startOfDay`(날짜 ↔ `<input type="date">` 문자열 변환, API의 LocalDateTime 문자열 ↔ `Date` 변환), `ko` 로케일(요일 한글 표시).
- **`react-hook-form` + `zod`** — `ScheduleCreateForm`의 제목/날짜/시간 클라이언트 검증(`src/lib/scheduleCreateSchema.ts`). `memo`/`notice`와 동일한 패턴이다. 서버 쪽 검증(제목 200자, `color` 20자 등)은 백엔드가 담당한다.
- **`tailwind-scrollbar-hide`**(프로젝트 전역 플러그인, `globals.css`에서 import) — 캘린더 그리드 내부 스크롤 영역의 `scrollbar-hide` 클래스에 쓰인다. 일정이 많아 6주 그리드가 화면 높이를 넘기면 내부에서 스크롤되고, 스크롤바만 시각적으로 숨겨진다.
- `src/components/ui/calendar.tsx`(shadcn 스타일 `react-day-picker` 래퍼)는 "날짜 하나 선택하는 팝업" 용도로 스타일링되어 있어 재사용하지 않는다 — `ScheduleCalendar`가 `DayPicker`를 직접 사용한다.
- 색상 선택은 `memo` 도메인의 `MemoColorPicker`/`MEMO_COLORS`를 import해서 재사용한다(복제하지 않음). API에는 `MemoColor.code`(예: `"ROSE"`, `"MUSTARD"`)를 문자열로 저장·조회한다.

---

## 1. 개요

학원의 일정을 캘린더 형태로 등록·조회하는 도메인.

한 화면에서 월 단위 캘린더와 선택한 일(日)의 일정 목록을 함께 볼 수 있게 해, 일정을 쉽게 관리하고 한눈에 파악할 수 있게 하는 것이 핵심 목적이다.

### 진입점

Sidebar의 일정 메뉴, `href: "/schedule"`. 라우트는 `src/app/(user)/schedule/page.tsx`.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **날짜 선택** | 캘린더 상단의 년/월 표시 영역. 클릭하면 년/월을 고를 수 있는 컨테이너가 열린다 |
| **오늘 버튼** | 클릭 시 오늘이 포함된 월로 캘린더를 이동시키는 버튼 |
| **일정 추가 모달** | 제목·날짜·시간·종일 여부·색상·내용을 입력해 일정을 등록(또는 수정)하는 모달 |
| **일 컨테이너** | 캘린더에서 하루를 표시하는 셀. 그 날의 일정 제목들이 나열된다 |
| **+n개** | 일 컨테이너에 3개를 초과하는 일정이 있을 때, 4번째부터를 묶어 보여주는 표시 |
| **일정 목록 영역** | 우측 영역. 선택된 월 전체 또는 선택된 하루의 일정을 나열한다 |
| **일정 상세조회 모달** | 우측 일정 목록의 항목을 클릭했을 때 나타나는 단건 상세 모달 |
| **삭제 확인 모달** | 상세조회 모달의 `삭제` 클릭 시 나타나는, 삭제 여부를 다시 확인하는 작은 모달 |

---

## 3. 화면 구성

일정 페이지는 좌측 캘린더 영역과 우측 일정 목록 영역, 좌우 2단으로 구성된다.

```
┌─ 일정 페이지 ────────────────────────────────────────────────┐
│ [좌측: 캘린더 영역]              │ [우측: 일정 목록 영역]      │
│  [n년 n월 ▾]   [오늘]  [일정 추가]│  n월 일정        총 n건    │
│ ────────────────────────────────  │ ──────────────────────── │
│   일 월 화 수 목 금 토             │  일정 제목                │
│  ┌──┬──┬──┬──┬──┬──┬──┐         │   날짜  시간              │
│  │  │일정A       │  │  │  │         │  일정 제목                │
│  │  │일정B       │  │  │  │         │   날짜  시간              │
│  │  │+1개        │  │  │  │         │  ...                     │
│  ├──┼──┼──┼──┼──┼──┼──┤         │                          │
│  │  │  │  │  │  │  │  │         │                          │
│  └──┴──┴──┴──┴──┴──┴──┘         │                          │
└──────────────────────────────────────────────────────────────┘
```

- 날짜 선택을 클릭하면 년/월 선택 컨테이너가 아래로 펼쳐진다. 년도는 좌우 화살표로 한 해씩 이동하는 방식이 아니라 **select(드롭다운)로 원하는 연도를 바로 선택**한다.
- 일 컨테이너 안의 일정 제목은 항상 해당 일정의 색상을 배경으로 한 pill로 표시되며(배경 없는 일정은 없음), 컨테이너 폭을 넘으면 말줄임(`...`) 처리된다.
- 일 컨테이너 하나에는 **최대 3개**의 일정 제목까지 표시되고, 4개 이상이면 나머지는 `+n개`로 묶어 표시한다.
- 캘린더 그리드 영역은 세로로 넘치면(일정이 많은 달 등) 내부에서 스크롤되고, 스크롤바는 시각적으로 숨겨진다(`scrollbar-hide`). 페이지 전체가 아니라 캘린더 영역 자체가 스크롤 컨테이너다.
- 우측 목록은 로딩 중이거나 조회에 실패하면 영역 전체가 안내 문구로 대체된다(4.4 참고). 캘린더 칸은 별도 로딩 표시 없이, 불러온 데이터가 있으면 그대로 그려진다.

### 일정 추가 / 수정 모달

제목, 날짜, 종일 체크박스, 시간(종일이 아닐 때만 시작~종료 select 노출), 색상 선택, 내용, 안내 문구("작성일자는 등록 시 자동으로 기록됩니다", 등록 모드에서만 표시), 취소 버튼, 등록/수정 버튼으로 구성된다. 하나의 `ScheduleCreateForm` 컴포넌트가 `mode="create"`/`mode="edit"` prop으로 두 화면을 겸한다(등록 폼과 수정 폼을 분리하지 않음 — `notice`의 `NoticeCreateForm`/`NoticeEditForm`처럼 파일을 나누는 대신, `memo`의 폼처럼 값 채움 여부만 prop으로 다르게 재사용하는 구조다).

- 색상 선택은 `memo` 도메인에서 쓰이는 12가지 색상 팔레트를 사용한다 — `MemoColorPicker` 컴포넌트를 직접 import해서 재사용(`src/feature/memo/components/MemoColorPicker.tsx`의 `MEMO_COLORS`/`MemoColorPicker`).
- 등록된 일정은 캘린더의 해당 날짜 일 컨테이너에 선택한 색상을 배경/강조색으로 한 제목으로 나타난다.
- 수정 진입 시에는 같은 모달에 기존 제목·날짜·종일 여부·시간·색상·내용이 채워진 상태로 열린다.
- 등록/수정 요청이 진행 중이면 버튼이 비활성화되고 "처리 중..."으로 바뀐다. 요청이 실패하면 모달은 닫히지 않고 토스트로 에러 메시지만 표시된다.

### 일정 목록 영역 (우측)

- 상단에 "n월 일정"과 "총 n건"이 표시된다.
- 아무 날짜도 선택하지 않은 초기 상태(페이지 최초 진입)에는 **선택된 월 전체 일정**이 나열된다.
- 사용자가 캘린더에서 특정 일을 클릭하면, 목록이 **그 날의 일정만** 보여주는 것으로 전환되고 상단의 "총 n건" 문구는 X 표시로 바뀐다(X는 일자 필터를 해제하고 월 전체 보기로 되돌리는 버튼). 날짜 선택은 달을 이동해도 초기화되지 않는다.
- 클릭한 날짜에 등록된 일정이 없으면 "이 날짜에 등록된 일정이 없습니다."를, 날짜 선택 없이 해당 월에 일정이 아예 없으면 "이 달에 등록된 일정이 없습니다."를 표시한다.
- 목록의 일정 항목은 제목, 날짜, 시간을 표시하며 클릭하면 일정 상세조회 모달이 열린다.

### 일정 상세조회 모달

제목(색상 점 표시 포함), 날짜, 시간(종일이면 "종일"), 내용, 작성일, X(닫기), 삭제 버튼, 수정 버튼으로 구성된다. "확인" 버튼은 없고 X가 닫기 역할을 겸한다.

- 작성자 판별 로직이 없어 수정/삭제 버튼이 항상 노출된다.
- 수정 버튼을 클릭하면 상세조회 모달이 닫히고, 같은 일정의 값으로 채워진 `ScheduleCreateForm`(수정 모드)이 열린다.
- 삭제 버튼을 클릭하면 상세조회 모달이 닫히고, `ScheduleDeleteConfirmModal`(삭제 확인 모달: 취소/삭제 버튼)이 열린다. 확인하면 삭제 요청이 진행되고, 진행 중에는 버튼이 비활성화되고 "삭제 중..."으로 바뀐다.

---

## 4. 기능 목록

### 4.1 캘린더 탐색 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 날짜 선택 팝오버 열기/닫기 | 좌측 상단 년/월 표시(`ScheduleDatePicker`) 클릭 | 년도(select)·월(버튼 그리드)을 고를 수 있는 팝오버가 펼쳐짐/닫힘 |
| 연도/월 이동 | 팝오버의 연도 select 변경 또는 월 버튼 클릭 | 선택한 연/월로 `DayPicker`가 재계산되어 이동, 해당 월의 일정을 새로 조회 |
| 이전/다음 달 이동 | 헤더의 `<`/`>` 화살표 클릭 | `date-fns`의 `addMonths`/`subMonths`로 한 달씩 이동, 해당 월의 일정을 새로 조회 |
| 오늘로 이동 | `오늘` 버튼 클릭 | 오늘 날짜가 포함된 월로 이동하고 날짜 선택 해제 |

### 4.2 캘린더 표시 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 일정 표시 | 캘린더 렌더링 시 | `ScheduleDayCell`(`DayPicker`의 `DayButton` 오버라이드)이 해당 날짜의 일정을 표시한다. 종일 여부와 무관하게 모든 일정이 해당 색상의 배경(`color.background`)을 가진 pill로 표시된다 |
| 제목 말줄임 | 일정 제목이 일 컨테이너 폭을 초과 | `truncate`로 말줄임 처리 |
| 초과 일정 묶음 표시 | 하루에 일정이 4개 이상 | 3개까지만 표시하고 나머지는 `+n개`로 표시 |
| 주말 강조 | 토요일/일요일 날짜 숫자 | 토요일은 초록, 일요일은 빨강으로 표시 |
| 이월 날짜 표시 | 이전/다음 달에 속한 날짜 칸(`showOutsideDays`) | 흐린 색으로 표시. 클릭해서 선택할 수는 있지만 해당 월 일정 목록에는 반영되지 않는다(월 필터 기준) |
| 그리드 내부 스크롤 | 캘린더 그리드 세로 길이가 영역을 초과 | 캘린더 그리드를 감싼 영역이 `overflow-y-auto`로 내부 스크롤되고, `scrollbar-hide`로 스크롤바만 숨겨진다. 요일 헤더는 `<table>`/`<thead>` 구조라 고정(sticky)되지 않고 그리드 전체가 함께 스크롤된다 |

### 4.3 일정 등록 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 일정 추가 모달 열기 | 좌측 상단 `일정 추가` 클릭 | `ScheduleCreateForm`(`mode="create"`)이 열린다. 날짜 기본값은 선택된 날짜(`selectedDate`)가 있으면 그 날짜, 없으면 현재 캘린더가 보여주는 달의 1일이다 |
| 종일 설정 | 모달 내 `종일` 체크박스 토글 | 체크하면 시간(시작~종료) select 영역이 사라진다(zod 검증에서도 시간 필수 조건이 해제됨) |
| 색상 선택 | 모달 내 색상 팔레트(`MemoColorPicker`) 클릭 | 12가지 색상 중 하나 선택, 캘린더·목록·상세조회에 표시될 색상으로 지정된다 |
| 필수값 검증 | 모달 `등록` 클릭 | 제목·날짜 미입력, 종일이 아닌데 시간 미선택/종료가 시작보다 빠른 경우 에러가 표시된다(`react-hook-form` + `zod`, `src/lib/scheduleCreateSchema.ts`) |
| 일정 등록 취소 | 모달 `취소`/X 버튼 | 모달이 닫힌다(폼 값은 버려짐) |
| 일정 등록 저장 | 검증 통과 후 모달 `등록` 클릭 | `createScheduleAction`이 `POST /api/calendars`를 호출한다. 성공하면 목록 쿼리가 무효화되어 방금 등록한 일정이 캘린더·목록에 반영되고 성공 토스트가 뜬다. 실패하면 모달은 유지된 채 에러 토스트만 뜬다 |

### 4.4 일정 목록 조회 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 월 전체 목록 표시 | 페이지 최초 진입 / 일자 필터 해제(X 클릭) | `getScheduleListAction({ yearMonth })`로 선택된 월의 모든 일정을 조회해 우측에 나열하고 "n월 일정 총 n건"을 표시한다 |
| 일자별 목록 표시 | 캘린더에서 특정 일 클릭 | 추가 API 호출 없이, 이미 불러온 월 데이터를 클라이언트에서 날짜로 필터링한다. 상단 "총 n건" 문구가 X로 전환된다 |
| 목록 로딩 중 안내 | 새 쿼리가 시작됨(월 이동 등) | 우측 영역 전체가 "일정을 불러오는 중입니다." 문구로 대체된다 |
| 목록 조회 실패 안내 | API 호출이 실패함 | 우측 영역 전체가 "일정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요." 문구로 대체된다. 자동 재시도는 하지 않는다(`retry: false`) |
| 빈 일정 안내(일자) | 날짜 선택 상태에서 그 날 일정이 없음 | "이 날짜에 등록된 일정이 없습니다." 표시 |
| 빈 일정 안내(월) | 날짜 선택 없이 해당 월에 일정이 아예 없음 | "이 달에 등록된 일정이 없습니다." 표시 |

> 목록 쿼리는 `retry: false`다. 서버 액션 호출이 실패했을 때 재시도가 응답을 못 받고 대기 상태에 머무를 수 있어, 재시도 없이 바로 에러 상태로 전환하도록 했다.

### 4.5 일정 상세조회 / 수정 / 삭제 — 구현 완료 (작성자 판별 제외)

| 기능 | 트리거 | 동작 |
|---|---|---|
| 상세조회 모달 열기 | 우측 목록의 일정 클릭 | 제목·날짜·시간·내용·작성일·X·삭제·수정 버튼으로 구성된 `ScheduleDetailModal`이 뜬다. 목록 조회 때 받아온 데이터를 그대로 보여준다(상세조회 API는 호출하지 않음). 캘린더 칸의 일정 자체는 클릭 대상이 아니다(칸 전체가 날짜 선택 버튼이라 안에 별도 버튼을 넣을 수 없어, 상세조회는 우측 목록에서만 진입한다) |
| 수정 버튼 노출 | 상세조회 모달 진입 | 항상 노출된다(작성자 판별 없음) |
| 수정 모드 진입 | 상세조회 모달 `수정` 클릭 | 상세조회 모달이 닫히고, 같은 일정 값으로 채워진 `ScheduleCreateForm`(`mode="edit"`)이 열린다 |
| 수정 저장 | 수정 모달에서 검증 통과 후 `수정` 클릭 | `updateScheduleAction`이 `PATCH /api/calendars/{eventId}`를 호출한다(필드 전체 교체). 성공하면 목록 쿼리 무효화 + 성공 토스트, 실패하면 모달 유지 + 에러 토스트 |
| 삭제 확인 열기 | 상세조회 모달 `삭제` 클릭 | 상세조회 모달이 닫히고 `ScheduleDeleteConfirmModal`(취소/삭제)이 열린다 |
| 삭제 실행 | 삭제 확인 모달의 `삭제` 클릭 | `deleteScheduleAction`이 `DELETE /api/calendars/{eventId}`를 호출한다. 성공하면 목록 쿼리 무효화(캘린더·목록에서 제거) + 성공 토스트, 실패하면 확인 모달 유지 + 에러 토스트 |
| 상세조회 닫기 | 모달 `X` 클릭 | 모달이 닫힌다 |

---

## 5. 데이터

`.docs/api/schedule/apiIntegration.md` 기준 API와 연동되어 있다. 백엔드는 "캘린더"(`Calendar`) 명칭을, 프론트엔드는 "일정"(`Schedule`) 명칭을 쓴다 — 같은 개념이다.

| API | Method | Endpoint | 사용 계층 |
|---|---|---|---|
| 일정 생성 | POST | `/api/calendars` | 원장, 원장이 준 권한 |
| 일정 목록 조회 | GET | `/api/calendars?date={date}` 또는 `?yearMonth={yearMonth}` | 전체 |
| 일정 상세 조회 | GET | `/api/calendars/{eventId}` | 전체 |
| 일정 수정 | PATCH | `/api/calendars/{eventId}` | 원장, 원장이 준 권한 |
| 일정 삭제 | DELETE | `/api/calendars/{eventId}` | 원장, 원장이 준 권한 |

상세 조회 API는 화면에서 쓰지 않는다 — 우측 목록을 불러올 때 이미 전체 필드(`content`, 시간, 색상 등)가 함께 내려오므로, 상세조회 모달은 목록 데이터를 그대로 보여준다.

일정 데이터는 **API 계약 타입**과 **화면용 모델**로 나뉘어 있고, `scheduleFormat.ts`의 변환 함수가 그 사이를 잇는다. API 연동은 `src/feature/schedule/actions.ts`(서버 액션) → `src/service/schedule.service.ts`(fetch) 순서로 이어진다.

### API 계약 (`src/feature/schedule/type.ts`)

`.docs/api/schedule/apiIntegration.md`와 1:1 대응한다. `import`/`export`가 없는 전역 스크립트 파일이라(`notice/type.ts`와 동일한 방식) 다른 파일에서 import 없이 바로 쓴다.

| 타입 | 용도 |
|---|---|
| `ScheduleCreateRequest` / `ScheduleUpdateRequest` | 생성/수정 요청 바디. `title`(필수), `content`/`eventEndAt`/`color`(선택), `eventStartAt`(필수), `allDay`(선택, 기본 `false`) |
| `ScheduleCreateResponse` | 생성 응답. `data.eventId`만 사용한다 |
| `ScheduleListParams` | 목록조회 쿼리 파라미터. `date`/`yearMonth` 중 하나만 채워서 전달한다 |
| `ScheduleEventData` | 목록·상세조회 공용 응답 항목(백엔드의 `CalendarEventResponse`와 동일). `eventId`, `title`, `content`, `eventStartAt`, `eventEndAt`, `allDay`, `color`, `createdBy`, `createdAt`, `updatedAt`. `content`/`eventEndAt`/`color`는 생성 시 선택값이라 `string \| null`로 정의되어 있다 |
| `ScheduleListResponse` / `ScheduleDetailResponse` | `ScheduleEventData`를 배열/단건으로 감싼 응답 |

### 화면용 모델 (`src/feature/schedule/scheduleTypes.ts`)

| 항목 | 필드명 | 설명 |
|---|---|---|
| 아이디 | `id` | 목록 렌더링 key, 수정/삭제 대상 판별 기준(API의 `eventId`) |
| 제목 | `title` | 캘린더 일 컨테이너, 우측 목록, 상세조회 모달에 표시 |
| 날짜 | `date`(`Date` 객체) | 캘린더 배치·월 필터·일자 필터 기준값. API의 `eventStartAt`에서 시각을 제외한 날짜만 담는다(`startOfDay`) |
| 종일 여부 | `allDay`(boolean) | 참이면 시간 정보 없이 "종일"로 표기, 거짓이면 시작~종료 시간 범위로 표기. 캘린더 칸의 표시 방식(배경 pill)에는 영향을 주지 않는다 — 모든 일정이 동일하게 배경색을 가진다 |
| 시작/종료 시간 | `startTime`/`endTime`(선택, `"HH:mm"` 24시간 문자열) | `allDay`가 거짓일 때만 존재. `scheduleFormat.ts`의 `formatTimeLabel`이 "오전/오후" 표기로 변환한다 |
| 색상 | `color`(`MemoColor` = `{ code, accent, background }`) | `memo` 도메인의 `MEMO_COLORS`에서 선택한다. API에는 `color.code`(문자열)만 저장·조회되고, 조회 시 `MEMO_COLORS`에서 `code`가 일치하는 항목을 찾아 복원한다(일치하는 게 없으면 `MEMO_COLORS[0]`) |
| 내용 | `content` | 상세조회 모달 본문에 표시 |
| 작성일 | `createdAt`(`"yyyy.MM.dd"` 문자열) | 상세조회 모달에 표시. API의 `createdAt`을 포맷 변환한 값 |
| 작성자 | — | 화면 모델에는 없다. API 응답의 `createdBy`(사용자 번호)를 작성자 판별에 쓰려면 추가해야 한다 |

### 변환 (`src/feature/schedule/scheduleFormat.ts`)

- `toScheduleEvent(data: ScheduleEventData): ScheduleEvent` — API 응답을 화면 모델로 변환한다. 목록 조회 직후 매핑에 쓰인다.
- `toScheduleRequestPayload(values): ScheduleCreateRequest` — `ScheduleCreateForm`의 제출값을 API 요청 바디로 변환한다. 종일이면 `eventStartAt`을 그 날 `00:00:00`으로 만들고 `eventEndAt`은 생략한다. 종일이 아니면 `날짜+시작시간`/`날짜+종료시간`을 각각 `eventStartAt`/`eventEndAt`으로 조립한다. 생성/수정 요청 바디 구조가 같아서 두 액션이 이 함수를 공유한다.

### API 연동 (`src/feature/schedule/actions.ts`, `src/service/schedule.service.ts`)

- `actions.ts`는 `'use server'` 액션 5개(`getScheduleListAction`, `getScheduleDetailAction`, `createScheduleAction`, `updateScheduleAction`, `deleteScheduleAction`)를 담는다. 생성/수정 액션은 제목·시작일시 필수값과 "종료가 시작보다 빠르면 안 된다"는 검증 후 service를 호출하고 `{ success, message }` 형태로 반환한다. 조회 액션은 검증 없이 service 결과를 그대로 반환한다(실패 시 예외를 던지고, `useQuery`가 그 예외를 처리한다).
- `schedule.service.ts`는 실제 fetch 5개를 담는다. 전부 `fetchWithAuth`를 쓴다(인증 필요). 내부 `requestSchedule` 헬퍼가 `fetch` 자체가 실패하는 경우(네트워크 오류)를 잡아 단순한 메시지의 `Error`로 정리해서 던진다 — 원본 예외의 `cause` 체인을 그대로 서버 액션 경계 밖으로 넘기면 Next.js 응답 직렬화가 깨질 수 있기 때문이다.

---

## 6. 컴포넌트 구성

`src/feature/schedule/components/`에 실제로 존재하는 컴포넌트 기준. 캘린더 그리드 자체는 `react-day-picker`가 담당하고, 우리 컴포넌트는 그 위에 헤더·날짜 칸 내용·목록을 얹는다. API 연동은 `actions.ts` → `src/service/schedule.service.ts` 계층을 거친다(컴포넌트는 fetch를 직접 호출하지 않는다).

| 컴포넌트 | 책임 |
|---|---|
| **(page.tsx)** | 일정 페이지 셸. `src/app/(user)/schedule/page.tsx`. Next.js 설계 원칙상 페이지는 기본적으로 서버 컴포넌트여야 하므로 상태를 직접 갖지 않는다 — `<main>` 레이아웃과 우측 하단 고정 FAB 버튼(정적, 클릭 동작 없음)만 그리고, 실제 화면은 `ScheduleBoard` 하나에 위임한다 |
| **ScheduleBoard** | 일정 화면의 상태·데이터 허브(client). `month`(Date), `selectedDate`(Date \| undefined), `formState`(모달 열림 상태: `null` \| `{mode:"create"}` \| `{mode:"edit", event}`), `detailEvent`, `deleteTarget` state를 소유한다. 일정 데이터는 `useQuery(["schedule", yearMonth])`로 서버에서 가져오고, 등록/수정/삭제는 각각 `useMutation`으로 감싸 성공 시 `invalidateQueries` + `toast.success`, 실패 시 `toast.error`로 처리한다. 하위 컴포넌트가 서로 상태를 공유해야 해서(캘린더 ↔ 목록, 목록 ↔ 상세조회 ↔ 수정/삭제) `page.tsx`를 서버 컴포넌트로 유지한 채 상태가 필요한 부분만 이 클라이언트 컴포넌트로 분리했다 |
| **ScheduleCalendar** | 좌측 캘린더 영역 전체(client). 이전/다음 달 버튼, `ScheduleDatePicker`, 오늘 버튼, 일정 추가 버튼(`onAddClick`으로 상위에 `formState` 설정을 요청)을 헤더로 직접 그리고, `DayPicker`(`react-day-picker`)를 `month`/`selected`를 controlled로 연결해 렌더링한다. `DayPicker`의 기본 캡션·네비게이션은 `classNames`로 숨기고 이 헤더가 대체한다. `events`를 props로 받아 `DayButton`에 클로저로 전달한다. 그리드를 감싸는 영역은 `min-h-0 flex-1 overflow-y-auto scrollbar-hide`로 내부 스크롤을 처리한다 |
| **ScheduleDatePicker** | 날짜 선택 팝오버(년도 select + 월 버튼 그리드, client). `ScheduleCalendar`의 트리거 클릭 시 펼쳐진다. `DayPicker`와 무관하게 독립적으로 동작하며 `onChange(year, month)`로 상위에 알린다 |
| **ScheduleDayCell** | `DayPicker`의 `components.DayButton`으로 오버라이드되는 날짜 칸 1개. `events` prop을 받아 해당 날짜의 일정을 최대 3개까지 색 배경 pill로 표시하고 초과분은 `+n개`로 표시한다. 클릭은 `DayPicker`의 `mode="single"` 선택 로직을 그대로 쓴다(날짜 선택만 하며, 캘린더 칸 안의 개별 일정은 클릭 대상이 아니다 — 칸 전체가 이미 `<button>`이라 내부에 또 다른 버튼을 넣을 수 없다) |
| **ScheduleCreateForm** | 일정 추가/수정 모달(client). `mode`/`schedule`(수정 시 기존 값)/`isSubmitting` prop으로 등록·수정 화면을 겸한다. `react-hook-form` + `zod`(`scheduleCreateSchema`)로 제목·날짜·시간을 검증하고, 색상은 `memo`의 `MemoColorPicker`를 가져와 별도 `useState`로 관리한다(`memo`/`notice` 폼과 동일한 패턴). `isSubmitting`이 참이면 취소/등록 버튼이 비활성화되고 "처리 중..."으로 표시된다 |
| **ScheduleList** | 우측 일정 목록 영역(client). `month`로 해당 월 일정만 걸러내고, `selectedDate`가 있으면 그 날짜로 한 번 더 필터링한다. 헤더는 `selectedDate`가 있으면 "M월 d일 (요일)" + X, 없으면 "n월 일정" + "총 n건"이다 |
| **ScheduleListItem** | 일정 목록 항목 1건(버튼). 제목·날짜/시간(`scheduleFormat.ts`의 포맷 함수로 조합)을 표시한다. 클릭 시 `onClick` prop으로 상위에 상세조회를 요청한다 |
| **ScheduleDetailModal** | 일정 상세조회 모달(client). 제목(색상 점)·날짜·시간·내용·작성일과 X·삭제·수정 버튼을 표시한다. 수정/삭제 클릭은 각각 상위의 `onEdit`/`onDelete`로 위임한다(모달 자신은 API를 호출하지 않고 알리기만 한다) |
| **ScheduleDeleteConfirmModal** | 삭제 확인 모달(client). `isDeleting` prop이 참이면 버튼이 비활성화되고 "삭제 중..."으로 표시된다. 대상 일정 제목을 문구에 포함해 보여주고, 취소/삭제 버튼으로 상위에 결과를 알린다 |

> `src/components/ui/calendar.tsx`(shadcn 스타일 `react-day-picker` 래퍼)는 날짜 하나를 고르는 팝업 용도로 스타일링되어 있어 재사용하지 않는다 — `ScheduleCalendar`가 `DayPicker`를 직접 사용한다.
> 데이터·API 계층 파일(`type.ts`, `scheduleTypes.ts`, `scheduleFormat.ts`, `actions.ts`, `src/service/schedule.service.ts`)의 책임은 5. 데이터 참고.

### 관계

```
schedule/page.tsx                  (서버 컴포넌트, 상태 없음)
└── ScheduleBoard                  (month, selectedDate, formState, detailEvent, deleteTarget state)
    │
    ├── useQuery(["schedule", yearMonth])
    │     → getScheduleListAction → schedule.service.getScheduleList → GET /api/calendars
    │     → toScheduleEvent로 매핑 → events
    │
    ├── useMutation × 3 (create/update/delete)
    │     → ScheduleCreateForm 제출값 → toScheduleRequestPayload
    │     → createScheduleAction/updateScheduleAction/deleteScheduleAction
    │     → schedule.service.ts → POST/PATCH/DELETE /api/calendars
    │     → 성공 시 invalidateQueries(["schedule", yearMonth]) + toast.success
    │     → 실패 시 toast.error (모달 유지)
    │
    ├── ScheduleCalendar               (month/selectedDate/events를 props로 받음)
    │   ├── ScheduleDatePicker         (헤더의 날짜 표시 클릭 시)
    │   └── DayPicker (react-day-picker)
    │       └── ScheduleDayCell[]      (components.DayButton, 클릭 시 selected → 상위 selectedDate로 전파)
    │   └── (일정 추가 버튼 → onAddClick → formState={mode:"create"})
    ├── ScheduleList                   (month/selectedDate/events를 props로 받음)
    │   └── ScheduleListItem[]         (클릭 → onSelectEvent → detailEvent 설정)
    ├── ScheduleCreateForm             (formState가 null이 아닐 때만 렌더)
    ├── ScheduleDetailModal            (detailEvent가 있을 때만 렌더)
    │   ├── 수정 클릭 → detailEvent 닫고 formState={mode:"edit", event}
    │   └── 삭제 클릭 → detailEvent 닫고 deleteTarget 설정
    └── ScheduleDeleteConfirmModal     (deleteTarget이 있을 때만 렌더)
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 선택된 월 상태 | `ScheduleBoard`의 `month`(Date) state. `ScheduleCalendar`/`ScheduleList`가 공유하고, `useQuery`의 쿼리 키(`yearMonth`)로도 쓰인다 | 구현 완료 |
| 선택된 날짜 상태 | `ScheduleBoard`의 `selectedDate`(Date \| undefined) state. 캘린더 클릭으로 우측 목록을 필터링하고(없으면 월 전체 표시), 달을 이동해도 초기화되지 않는다 | 구현 완료 |
| 일정 데이터 | `["schedule", yearMonth]` 쿼리 캐시(react-query)에 있다. 등록/수정/삭제 성공 시 `invalidateQueries`로 다시 조회한다 | 구현 완료 |
| 모달 열림 상태 | `ScheduleBoard`의 `formState`/`detailEvent`/`deleteTarget`. 세 모달이 동시에 하나만 열리도록 서로 배타적으로 제어된다 | 구현 완료 |
| 작성자 판별 | 상세조회 모달의 수정 버튼 노출 여부를 결정한다. API 응답에 `createdBy`는 있지만 화면 로직에는 연결되어 있지 않다 | 미구현 |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 날짜 선택 팝오버 | 열림 / 닫힘 |
| 캘린더 표시 월 | `Date`(연/월), 이전/다음/오늘/날짜 선택 팝오버로 변경 |
| 일정 목록 쿼리 | `pending`(로딩 중) / `error`(조회 실패) / `success`(정상, `events`로 사용) |
| 우측 목록 필터 | 월 전체 / 특정 날짜 (`selectedDate`) |
| 일정 추가/수정 모달 | 닫힘 / 추가 모드 / 수정 모드 (`formState`), 각 모드 내 제출 중 여부(`isSubmitting`) |
| 일정 상세조회 모달 | 열림 / 닫힘 (`detailEvent`) |
| 삭제 확인 모달 | 열림 / 닫힘 (`deleteTarget`), 삭제 중 여부(`isDeleting`) |
| 종일 여부 | 종일 / 시간 지정 (`allDay`) |

---
</content>
