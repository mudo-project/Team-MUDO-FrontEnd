# Setting(설정) Domain — CONTEXT
> 배치 경로: `src/feature/setting/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 설정 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: 근무시간 저장과 와이파이 IP(현재 IP 조회·등록·목록·삭제)는 근태(attendance) API에 실제로 연동되어 있다. 급여 지급일·알림 설정·구글 연동은 아직 화면 레이아웃과 더미 데이터만 존재하는 정적 UI 단계다. 근무시간 정책은 저장 API만 있고 조회 API가 없어 페이지 진입 시 서버 값을 불러오지 못한다. 아래 기능 목록의 "상태" 열로 항목별 구현 여부를 표시한다.

---

## 1. 개요

학원 운영에 필요한 설정을 한 화면에 모아두는 도메인. 근무시간, 와이파이 IP, 급여 지급일, 알림, 구글 연동 총 5개 설정 카드로 구성된다.

### 핵심 제약

- 근무시간의 출근/퇴근 시각은 **30분 단위**로 선택한다.
- 지각 유예는 **10분 단위**로, **0분~60분** 범위에서 +/- 조정한다.
- 요일별 예외를 켜면 하단에 요일 목록이 나타나고, 요일마다 on/off(휴무/근무)와 30분 단위 출근시간을 개별 설정할 수 있다.
- 와이파이 IP는 여러 개 등록할 수 있으며, "내 IP 확인" → "이 IP로 등록" 순서로 입력창에 채워 넣는 흐름을 가진다. "이 IP로 등록" 행은 "내 IP 확인" 버튼이 있는 컨테이너 안쪽에 나타난다.
- 급여 지급일은 1일~30일 중 선택한다.
- 구글 연동 상세조회는 설정 화면과 별도의 화면(계정 연동 컨테이너, 연동 안내 컨테이너로 구성)이며, 계정 교체는 동의 → 인증 → 완료 3단계 모달로 진행된다.

### 진입점

Sidebar의 설정 메뉴(`src/components/layout/Sidebar.tsx`, `href: "/setting"`). 라우트는 `src/app/(user)/setting/page.tsx`.

### 데이터 연동 계층

- `src/feature/setting/type.ts` — 요청/응답 인터페이스. `export` 없이 선언되어 프로젝트 전역에서 import 없이 바로 참조된다(다른 도메인 `type.ts`와 동일한 스타일).
- `src/service/setting.service.ts` — `fetchWithAuth`/`fetchWithoutAuth` 기반 API 호출(`getCurrentIp`, `createWifiIp`, `getWifiIpList`, `deleteWifiIp`, `saveWorkingHoursPolicy`). 근태(attendance) API 문서(`.docs/api/attendance-management/apiIntegration.md`)에 정의된 와이파이 IP·근무시간 정책 엔드포인트를 그대로 사용한다(엔드포인트 자체는 `/api/attendance/...`이며 `setting` 전용 엔드포인트가 아니다).
- `src/feature/setting/actions.ts` — 위 service를 감싼 Server Action(`getCurrentIpAction`, `getWifiIpListAction`, `createWifiIpAction`, `deleteWifiIpAction`, `saveWorkingHoursPolicyAction`). `SettingWifi`, `SettingWorkingHours`가 이 액션들을 직접 호출한다.
- 인증되지 않은 브라우저 세션에서 실제 백엔드(로컬 `localhost:8081`)로 확인한 결과, 명세상 인증이 필요 없다고 되어 있는 `getCurrentIpAction`(`GET /wifi-ips/current`)도 현재 서버 구현은 인증을 요구한다(`인증이 필요합니다.` 오류). 이는 백엔드 쪽 구현이 명세와 다른 것으로 보이며, 프론트 코드는 명세(`Authorization: false`) 그대로 `fetchWithoutAuth`를 사용한다.
- `notificationItems`(알림 항목 4종)는 여전히 `SettingAlarm.tsx` 안에 하드코딩된 더미 배열로 존재한다.
- 설정 도메인 전용 API 문서(`.docs/api/setting/`)는 없다 — 와이파이·근무시간 API는 근태 도메인 문서에 있다.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **설정 카드** | 근무시간·와이파이·급여 지급일·알림·구글 연동 각각을 감싸는 카드 단위. `SettingCard` 컴포넌트로 렌더링 |
| **요일별 예외** | 근무시간 카드의 토글. 켜면 요일별로 휴무/근무와 출근시간을 개별 지정할 수 있는 목록이 나타남 |
| **지각 유예** | 출근 시각 이후에도 지각 처리하지 않는 유예 시간(분). +/- 버튼으로 10분 단위 조정 |
| **구글 연동 상세조회** | 설정 화면의 "관리" 버튼을 눌러 이동하는 화면. 계정 연동 상태·연동 안내를 다룸 |
| **계정 교체 모달** | 구글 연동 상세조회에서 "계정 교체" 클릭 시 뜨는 모달. 동의 → 인증 → 완료 3단계로 구성 |
| **연동 해제 모달** | "연동 해제" 클릭 시 뜨는 확인 모달. 입력창에 "해제"를 입력해야 해제 버튼이 활성화됨 |

---

## 3. 화면 구성

설정 도메인은 **설정 화면**(카드 5개)과, 구글 연동 카드에서 진입하는 **구글 연동 상세조회 화면**으로 구성된다.

```
┌─ 설정 화면 ──────────────────────────────────────────────┐
│ ┌─ 근무 시간 ──────────────┐  ┌─ 와이파이 IP 등록 ──────┐ │
│ │ 출근 시각 [09:00 ▾]      │  │ [IP 입력]      [저장]   │ │
│ │ 퇴근 시각 [18:00 ▾]      │  │ [내 IP 확인]            │ │
│ │ 지각 유예 [-] 10 [+]     │  │ 등록된 IP 목록          │ │
│ │ 요일별 예외 [on/off]     │  ├─ 급여 지급일 설정 ──────┤ │
│ │  └ (on 시) 요일 목록     │  │ [1일 ▾] 에 자동 발송    │ │
│ │ [저장]                   │  ├─ 알림 설정 ─────────────┤ │
│ │                          │  │ ☑ 새 결재 알림 …        │ │
│ │                          │  ├─ 구글 연동 ─────────────┤ │
│ │                          │  │ 연결됨/연결되지 않음 [관리 >]│
│ └──────────────────────────┘  └─────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

- 좌측 컬럼에 근무 시간 카드 1개, 우측 컬럼에 와이파이·급여 지급일·알림·구글 연동 카드 4개를 세로로 배치(2컬럼 그리드).

```
┌─ 구글 연동 상세조회 화면 ─────────────────────────────┐
│ [구글 계정 연동 컨테이너]                              │
│  (미연동) [구글 계정 연결]                             │
│  (연동됨) 이메일 / 연결됨·갱신 필요 / 연결 일시 / 연결한 관리자 │
│           / 권한 범위 / 토큰 확인                      │
│           [연결 상태 확인] [계정 교체] [연동 해제]      │
├─────────────────────────────────────────────────────────┤
│ [연동 안내 컨테이너]                                    │
│  안내 문구                                              │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 기능 목록

### 4.1 근무 시간

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 출근 시각 선택 | 출근 시각 select 클릭 | 30분 단위로 24시간 옵션 표시 | 구현 완료 — `SettingTimeSelect`가 `generateHalfHourOptions()`(00:00~23:30, 48개)로 옵션을 만들어 렌더링 |
| 퇴근 시각 선택 | 퇴근 시각 select 클릭 | 30분 단위로 24시간 옵션 표시 | 구현 완료 — 출근 시각과 동일한 `SettingTimeSelect` 사용 |
| 지각 유예 조정 | +/- 버튼 클릭 | 10분 단위로 0~60분 범위에서 값 증감 | 구현 완료 — `lateGraceMinutes` state를 10 단위로 증감하며 0/60에서 해당 버튼이 비활성화됨 |
| 요일별 예외 토글 | 토글 스위치 클릭 | 하단에 요일 목록(요일별 on/off + 30분 단위 출근시간) 표시 | 구현 완료 — `SettingToggle`로 `hasWeekdayException` state를 켜면 7일 목록이 나타남 |
| 요일별 on/off | 요일 목록의 요일별 토글 클릭 | 해당 요일을 근무/휴무로 전환, 휴무면 시간 select 숨김 | 구현 완료 — `weekdayExceptions` state의 `enabled`를 요일 단위로 갱신 |
| 요일별 시간 설정 | 근무로 켜진 요일의 시작/종료 select | 해당 요일만 30분 단위로 출근/퇴근 시각 개별 설정 | 구현 완료 — `weekdayExceptions` state의 `startTime`/`endTime`을 요일 단위로 갱신 |
| 근무시간 저장 | 카드 하단 `저장` 클릭 | 근무시간 설정 저장 | 구현 완료 — `saveWorkingHoursPolicyAction` 호출(`PUT /api/attendance/policies`). 저장 중에는 버튼이 비활성화되고 "저장 중..."으로 표시되며, 성공/실패를 토스트로 안내한다. 요일별 예외 토글이 꺼져 있어도 `weekdays` 배열은 항상 전체 7일을 전송한다(휴무 요일은 `startTime`/`endTime`이 `null`) |

### 4.2 와이파이 IP 등록

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 내 IP 확인 | `내 IP 확인` 버튼 클릭 | 현재 IP를 조회해 표시하고 `이 IP로 등록` 버튼 노출 | 구현 완료 — `getCurrentIpAction` 호출(`GET /api/attendance/wifi-ips/current`) 결과를 `checkedIp` state에 저장. 조회 중에는 버튼이 "확인 중..."으로 바뀌고 비활성화됨 |
| IP 입력창에 채우기 | `이 IP로 등록` 클릭 | 확인된 IP를 입력창에 채움 | 구현 완료 — `checkedIp`를 `ipInput` state에 반영 |
| 와이파이 IP 저장 | `저장` 클릭 | 입력한 IP를 등록 | 구현 완료 — `createWifiIpAction` 호출(`POST /api/attendance/wifi-ips`, `note`는 입력 UI가 없어 빈 문자열로 전송). 성공 시 목록을 다시 조회해 갱신하고 토스트로 안내. 이미 등록된 IP면 버튼이 "등록됨"으로 바뀌고 비활성화됨 |
| 등록된 IP 목록 표시 | IP 등록 후 | `내 IP 확인` 영역 아래에 등록된 IP를 목록으로 표시(복수 등록 가능) | 구현 완료 — `getWifiIpListAction`(`GET /api/attendance/wifi-ips`)으로 마운트 시 조회하고 등록/삭제 후 재조회 |
| 등록된 IP 삭제 | 목록 항목의 휴지통 아이콘 클릭 | 해당 와이파이 IP 삭제 | 구현 완료 — `deleteWifiIpAction`(`DELETE /api/attendance/wifi-ips/{wifiIpId}`) 호출 후 목록 재조회. 명세에 없던 UI지만 삭제 액션을 실제로 쓰기 위해 추가함 |

`이 IP로 등록` 행(`checkedIp` 배너)은 `내 IP 확인` 버튼이 속한 배경 컨테이너 **안쪽**에 중첩되어 렌더링된다(별도 컨테이너가 아님).

### 4.3 급여 지급일 설정

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 지급일 선택 | select 클릭 | 1일~30일 중 선택 | 구현 완료 — `generatePaydayOptions()`로 1~30일 옵션을 생성. 선택값을 저장하는 핸들러는 없음(uncontrolled select) |

### 4.4 알림 설정

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 알림 on/off | 알림 항목 체크박스 클릭 | 체크 여부에 따라 해당 알림 on/off | 미구현 — 체크박스는 `defaultChecked`로 항상 켜진 상태, 변경 핸들러 없음. 항목은 `notificationItems` 더미 배열(새 결재 알림/공지사항 알림/업무 마감 알림/급여 발송 알림) |

### 4.5 구글 연동

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 연동 상태 표시 | 설정 화면 진입 | 관리 버튼 좌측에 "연결됨"/"연결되지 않음" 문구 표시 | 미구현 — "연결됨" 배지가 고정 표시됨(실제 연동 상태 반영 안 됨) |
| 상세조회 이동 | `관리` 버튼 클릭 | 구글 연동 상세조회 화면(`/setting/google`)으로 이동 | 구현 완료 — `SettingGoogle`의 `관리`가 `next/link`의 `Link href="/setting/google"`. `src/app/(user)/setting/google/page.tsx`가 정적으로 존재(연동 안 된 상태의 화면만 그려져 있음) |
| 구글 계정 연결 | 상세조회의 `구글 계정 연결` 클릭 | 구글 계정 연동 진행 | 미구현 — 버튼은 있으나 클릭 핸들러 없음 |
| 연동 상세 정보 표시 | 연동 성공 시 | 이메일, 연결됨 여부, 연결 일시, 연결한 관리자, 권한 범위, 토큰 확인 표시 | 미구현 |
| 연결 상태 확인 | `연결 상태 확인` 클릭 | "연결됨" 자리에 스피너 + "확인중, 잠시 기다려주세요..." 표시 | 미구현 |
| 계정 교체 | `계정 교체` 클릭 | 동의 → 인증 → 완료 3단계 모달 진행 | 미구현 |
| 계정 교체 - 동의 | 모달 1단계 | 기존 계정 정보 폐기, 권한 요청 안내 표시, `동의하고 계속하기` 클릭 시 인증 단계로 이동 | 미구현 |
| 계정 교체 - 인증 | 모달 2단계 | 스피너, "구글 로그인 창에서 계속 진행해주세요" 안내, "창이 열리지 않았나요? 다시 열기" 버튼 표시. 다시 열기 클릭 시 구글 로그인 창 재오픈 | 미구현 |
| 계정 교체 - 완료 | 인증 완료 시 | "{이메일} 계정이 연결되었습니다" 표시, `확인` 클릭 시 모달 종료 | 미구현 |
| 토큰 만료 임박 안내 | 토큰 만료 기한이 다가옴 | "연결됨" 자리가 "갱신 필요"로 바뀌고 "n일 뒤 토큰이 만료됩니다. 계정 재연결을 진행해주세요" 문구 + 계정 교체 버튼 표시 | 미구현 |
| 연동 해제 | `연동 해제` 클릭 | "연동을 해제할까요?" 확인 모달 표시(이메일 + 안내 문구, 입력창에 "해제" 입력 시 해제 버튼 활성화) | 미구현 |

---

## 5. 데이터

### 서버 응답 타입 (`src/feature/setting/type.ts`)

| 타입 | 설명 |
|---|---|
| `CurrentIpData` / `CurrentIpResponse` | 현재 접속 IP 조회(`GET /api/attendance/wifi-ips/current`) 응답. `data.ipAddress` |
| `WifiIpCreateRequest` | 와이파이 IP 등록(`POST /api/attendance/wifi-ips`) 요청 — `confirmedIpAddress`, `note` |
| `WifiIpCreateData` / `WifiIpCreateResponse` | 와이파이 IP 등록 응답 — `wifiIpId`, `ipAddress`, `note` |
| `WifiIpListItemData` / `WifiIpListResponse` | 와이파이 IP 목록조회(`GET /api/attendance/wifi-ips`) 응답 항목 — `wifiIpId`, `ipAddress`, `note`, `createdAt`. 페이지네이션 없이 배열 그대로 내려옴 |
| `WorkingHoursWeekday` | 근무시간 정책의 요일별 설정 — `dayOfWeek`(1~7, `java.time.DayOfWeek` 기준 월요일 1~일요일 7), `isWorkday`, `startTime`, `endTime`(휴무면 `null`) |
| `WorkingHoursPolicySaveRequest` / `WorkingHoursSaveData` / `WorkingHoursSaveResponse` | 근무시간 정책 저장(`PUT /api/attendance/policies`) 요청/응답 — `defaultStartTime`, `defaultEndTime`, `lateGraceMinutes`, `weekdayExceptionEnabled`, `weekdays` |

와이파이 IP 삭제(`DELETE /api/attendance/wifi-ips/{wifiIpId}`)는 응답 `data`가 항상 `null`이라 별도 타입 없이 `Promise<void>`로 처리한다.

### 클라이언트 전용 값 (`src/feature/setting/utils.ts`, `page.tsx`)

| 항목 | 설명 |
|---|---|
| `generateHalfHourOptions()` | 00:00~23:30을 30분 간격으로 생성하는 함수(48개). `SettingTimeSelect`의 옵션으로 쓰임 |
| `generatePaydayOptions()` | "1일"~"30일" 문자열 배열을 생성하는 함수(30개). `SettingPayday`의 select 옵션으로 쓰임 |
| `Weekday` | `"일" \| "월" \| "화" \| "수" \| "목" \| "금" \| "토"` |
| `WeekdayException` | 요일별 예외 1건의 타입 — `{ day: Weekday; enabled: boolean; startTime: string; endTime: string }` |
| `DEFAULT_WEEKDAY_EXCEPTIONS` | 요일별 예외의 초기값(더미) — 월~금은 `enabled: true`(09:00~18:00), 토·일은 `enabled: false` |
| `WEEKDAY_TO_DAY_OF_WEEK` | 한글 요일(`Weekday`)을 서버의 `dayOfWeek`(월=1~일=7)로 매핑하는 상수 |
| `toWorkingHoursPolicyWeekdays()` | `WeekdayException[]`을 `saveWorkingHoursPolicyAction` 요청의 `weekdays: WorkingHoursWeekday[]`로 변환하는 함수. 휴무 요일은 `startTime`/`endTime`을 `null`로 보낸다 |
| `notificationItems` | 알림 설정 카드에 렌더링되는 알림 항목 이름 배열(문자열 4개, `SettingAlarm` 내부 상수) |

---

## 6. 컴포넌트 구성

`src/feature/setting/components/`에 아래 컴포넌트 파일이 있다. 각 카드는 자기 자신을 `SettingCard`로 감싸는 구조다(카드별 커스텀 스타일을 각 컴포넌트가 책임짐).

| 컴포넌트 | 책임 |
|---|---|
| **SettingCard** | 설정 카드 공통 wrapper(구현 완료). `children`, `className`(선택)만 받는 상태 없는 프레젠테이셔널 컴포넌트로, 카드 테두리·배경·그림자 스타일만 담당 |
| **SectionHeading** | 카드 제목·설명 표시(구현 완료). `title`, `description` props만 받는 상태 없는 컴포넌트. 5개 카드 컴포넌트가 모두 공유 |
| **SettingToggle** | on/off 토글 스위치(구현 완료). `checked`, `onChange`, `ariaLabel` props를 받는 controlled 컴포넌트. 근무시간 카드의 "요일별 예외" 토글과 요일별 근무/휴무 토글에서 재사용 |
| **SettingTimeSelect** | 30분 단위 시각 select(구현 완료). `generateHalfHourOptions()`로 옵션을 만들고 `value`/`onChange` props로 controlled 동작. 출근/퇴근 시각, 요일별 예외의 시작/종료 시각에서 재사용 |
| **SettingWorkingHours** | 근무 시간 카드(client component). `startTime`/`endTime`(select 값), `lateGraceMinutes`(0~60, 10 단위), `hasWeekdayException`(토글), `weekdayExceptions`(`WeekdayException[]`, 요일별 근무여부·시간), `isSaving` state를 갖는다. `updateWeekdayException`으로 요일 단위 부분 갱신. `저장` 클릭 시 `toWorkingHoursPolicyWeekdays()`로 변환한 뒤 `saveWorkingHoursPolicyAction`을 호출하고 결과를 토스트로 안내한다. 근무시간 정책 **조회** API가 없어 페이지 진입 시 서버 값을 불러오지는 못하고 항상 기본값에서 시작한다 |
| **SettingWifi** | 와이파이 IP 등록 카드(client component). `ipInput`(입력값), `checkedIp`(내 IP 확인 결과), `wifiIps`(`WifiIpListItemData[]`, 서버 목록), `isChecking`/`isSaving` state를 가진다. 마운트 시 `getWifiIpListAction`으로 목록을 조회한다. `내 IP 확인` → `getCurrentIpAction` 호출 → `이 IP로 등록`으로 `ipInput`에 반영 → `저장`으로 `createWifiIpAction` 호출 후 목록 재조회, 목록 항목의 휴지통 아이콘으로 `deleteWifiIpAction` 호출 후 재조회하는 흐름. `이 IP로 등록` 배너는 `내 IP 확인` 버튼이 속한 배경 컨테이너 안에 중첩 렌더링된다. `checkedIp`가 없거나 `wifiIps`가 비어 있으면 각각의 안내 영역·목록이 렌더링되지 않아 기본 화면은 입력창과 "내 IP 확인" 버튼줄만 보인다. 모든 액션 실패는 `sonner`의 `toast.error`로 안내(다른 도메인과 동일한 패턴) |
| **SettingPayday** | 급여 지급일 카드(구현 완료 — 정적). `generatePaydayOptions()`로 1~30일 select 옵션을 렌더링하지만 선택값을 저장하는 핸들러는 없음(uncontrolled) |
| **SettingAlarm** | 알림 설정 카드(구현 완료 — 정적). `notificationItems` 더미 배열을 체크박스 목록으로 렌더링, 상호작용 없음 |
| **SettingGoogle** | 구글 연동 카드(구현 완료 — 정적 + 이동만 연결). "연결됨" 배지는 고정 표시(정적)이고, "관리"는 `next/link`로 `/setting/google`로 이동한다 |

구글 연동 상세조회 화면은 `src/app/(user)/setting/google/page.tsx`로 존재하지만, 미연동 상태의 정적 화면(연동 안내 컨테이너 포함)만 그려져 있고 상호작용(구글 계정 연결, 연동 후 상세 정보, 연결 상태 확인, 계정 교체 모달, 연동 해제 모달)은 아직 없다.

### 관계

```
setting/page.tsx                   (설정 화면, /setting, 5개 카드 컴포넌트를 2컬럼 그리드로 배치)
├── SettingWorkingHours            (좌측 컬럼)
│   ├── SectionHeading
│   ├── SettingTimeSelect × 2      (출근/퇴근 시각)
│   ├── SettingToggle              (요일별 예외 on/off)
│   └── [요일별 예외 on 시] × 7     (SettingToggle + SettingTimeSelect × 2)
├── SettingWifi                    (우측 컬럼)
│   └── SectionHeading
├── SettingPayday                  (우측 컬럼)
│   └── SectionHeading
├── SettingAlarm                   (우측 컬럼)
│   └── SectionHeading
└── SettingGoogle                  (우측 컬럼)
    └── SectionHeading
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 근무시간 데이터 | 출근/퇴근 시각, 지각 유예, 요일별 예외 조회·저장 | 저장만 구현 완료 — `SettingWorkingHours`가 `saveWorkingHoursPolicyAction`(`PUT /api/attendance/policies`)을 호출한다. 조회 API가 명세에 없어 페이지 진입 시 서버 값을 불러오지 못하고, 새로고침하면 항상 기본값(`DEFAULT_WEEKDAY_EXCEPTIONS` 등)에서 시작한다 |
| 와이파이 IP 데이터 | 등록된 IP 목록 조회·등록·삭제 | 구현 완료 — `SettingWifi`가 `getWifiIpListAction`/`createWifiIpAction`/`deleteWifiIpAction`을 실제로 호출하고 목록을 서버 상태와 동기화한다 |
| 급여 지급일 데이터 | 지급일 조회·저장 | 미구현 — API/service 없음 |
| 알림 설정 데이터 | 알림 항목별 on/off 조회·저장 | 미구현 — API/service 없음, 항목 자체도 더미 |
| 구글 연동 데이터 | 연동 상태, 계정 정보, 토큰 상태 조회 및 연결/교체/해제 | 미구현 — `.docs/api/google-account/apiIntegration.md`에 항목만 정의되고 계약은 비어 있음 |
| 내 IP 조회 | 클라이언트 또는 서버에서 현재 접속 IP를 가져오는 절차 | 구현 완료 — `SettingWifi`가 `getCurrentIpAction`(`GET /api/attendance/wifi-ips/current`)을 호출한다. 명세는 인증 불필요라고 되어 있으나 실제 로컬 백엔드는 인증을 요구했다(백엔드 쪽 확인 필요) |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 요일별 예외 | 켜짐 / 꺼짐 |
| 구글 연동 | 연결되지 않음 / 연결됨 / 갱신 필요 / 확인중 |
| 계정 교체 모달 | 닫힘 / 동의 / 인증 / 완료 |
| 연동 해제 모달 | 닫힘 / 열림(해제 입력 전) / 열림(해제 버튼 활성화) |

---
