# Setting(설정) Domain — CONTEXT
> 배치 경로: `src/feature/setting/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 설정 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: 근무시간 저장, 와이파이 IP(현재 IP 조회·등록(별칭 포함)·목록·삭제), 구글 계정 연동(상태 조회·연결·재연결·계정 교체·상태 확인·해제)이 실제 API에 연동되어 있다. 급여 지급일·알림 설정은 아직 화면 레이아웃과 더미 데이터만 존재하는 정적 UI 단계다. 근무시간 정책 자체의 조회 API는 없지만, 페이지(`setting/page.tsx`, 서버 컴포넌트)가 진입 시 근태(attendance) 도메인의 `getMyTodayAction`(내 오늘 근태 조회)을 서버에서 미리 호출해 `workStartTime`/`workEndTime`을 `SettingWorkingHours`의 초기 props로 내려준다(클라이언트에서 다시 불러오지 않아 하드코딩 기본값이 잠깐 보였다가 바뀌는 깜빡임이 없다). 아래 기능 목록의 "상태" 열로 항목별 구현 여부를 표시한다.

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
- `src/service/setting.service.ts` — `fetchWithAuth` 기반 API 호출(`getCurrentIp`, `createWifiIp`, `getWifiIpList`, `deleteWifiIp`, `saveWorkingHoursPolicy`, `getGoogleConnection`, `getGoogleAuthorizationUrl`, `checkGoogleConnection`, `disconnectGoogle`). 와이파이 IP·근무시간 정책은 근태(attendance) API 문서(`.docs/api/attendance-management/apiIntegration.md`), 구글 연동은 `.docs/api/google-account/apiIntegration.md`에 정의된 엔드포인트를 그대로 사용한다(엔드포인트는 각각 `/api/attendance/...`, `/api/google/connections...`이며 `setting` 전용 엔드포인트가 아니다).
- `src/feature/setting/actions.ts` — 위 service를 감싼 Server Action(`getCurrentIpAction`, `getWifiIpListAction`, `createWifiIpAction`, `deleteWifiIpAction`, `saveWorkingHoursPolicyAction`, `getGoogleConnectionAction`, `getGoogleAuthorizationUrlAction`, `checkGoogleConnectionAction`, `disconnectGoogleAction`). `SettingWifi`, `SettingWorkingHours`, `SettingGoogleConnection`, `SettingGoogleReplaceModal`, `SettingGoogleDisconnectModal`이 이 액션들을 직접 호출한다 — `DUMMY_CONNECTION` 더미 데이터는 더 이상 쓰이지 않는다.
- 구글 계정 연동/재연결/계정 교체는 모두 `getGoogleAuthorizationUrlAction`으로 받은 `authorizationUrl`을 `window.open`으로 팝업을 띄운다. 팝업(`SettingGoogleConnectionCallback`)은 마운트 시 `window.opener`에 `{ source: "google-oauth-connection", success }`를 `postMessage`로 전달한 뒤 스스로 닫힌다. 부모 창(`SettingGoogleConnection`, `SettingGoogleReplaceModal`)은 `message` 이벤트의 `event.origin`이 `https://ieum.store`인지 검증한 뒤 `getGoogleConnectionAction`으로 최신 상태를 다시 조회한다. 500ms 간격의 `popup.closed` 폴링도 함께 남겨 postMessage가 도달하지 않는 경우(팝업이 스크립트로 열리지 않아 `window.close()`가 막히는 등)의 폴백으로 동작한다.
- `getCurrentIpAction`(`GET /wifi-ips/current`)은 로그인 사용자 전용 API이므로 `fetchWithAuth`로 액세스 토큰을 전달한다.
- `getCurrentIp`/`createWifiIp`는 요청마다 `src/lib/clientIpHeaders.ts`의 `buildSignedClientIpHeaders(method, backendPath)`로 만든 `X-Client-IP`/`X-Client-IP-Timestamp`/`X-Client-IP-Signature` 헤더를 함께 보낸다. Next 서버가 브라우저 대신 Spring을 호출하는 구조라, 서명 없이는 백엔드가 "요청을 보낸 IP"를 Next 서버 자신의 IP로 오인하기 때문이다(자세한 배경과 검증 결과는 `.docs/devops/plans/2026-08-15-client-ip-signing-plan.md`와 `2026-08-15-client-ip-signing-implementation.md` 참고). `getWifiIpList`/`deleteWifiIp`는 서명이 필요 없어 그대로 둔다. 로컬 개발 환경(Caddy 없음)에서는 `x-forwarded-for`가 없어 이 두 API가 항상 에러를 던지는 게 정상이며, 실 검증은 Caddy가 있는 스테이징/운영에서만 한다.
- 구글 OAuth 콜백(`GET /api/google/connections/callback`)은 프론트가 직접 호출하는 API가 아니라, 구글이 사용자를 리다이렉트시키는 백엔드 전용 경로다. 실제 배포된 `GOOGLE_OAUTH_FRONTEND_REDIRECT_URI` 값을 확인한 결과 `/settings/google?googleConnection=success|failed`(복수형 `settings`)였다 — 이 도메인의 실제 라우트는 `/setting/google`(단수형)이라 그대로면 팝업이 404로 끝난다. 백엔드 환경변수를 고치는 대신, 프론트에 `src/app/(user)/settings/google/page.tsx`를 별도로 만들어 그 주소를 그대로 받도록 브리지했다(백엔드 값을 바꿀 수 있는 상황이면 `/setting/google`로 통일하는 편이 더 낫다).
- `SettingGoogleConnectionCallback`(위 브리지 페이지의 본문)은 마운트 즉시 `window.opener`로 `postMessage`를 보내고 `window.close()`를 시도한다(성공/실패 여부와 무관하게 화면에 아무것도 그리지 않음 — 결과 안내는 이미 열려 있는 `/setting/google`이 보여주는 게 맞다고 판단해 팝업 자체에는 안내 문구를 두지 않았다). `window.close()`가 실패했을 때만(스크립트로 열리지 않은 창 등) 300ms 후 성공/실패 문구 + `창 닫기` 버튼을 보여주는 최소한의 폴백만 있다.
- `notificationItems`(알림 항목 4종)는 여전히 `SettingAlarm.tsx` 안에 하드코딩된 더미 배열로 존재한다.
- 설정 도메인 전용 API 문서(`.docs/api/setting/`)는 없다 — 와이파이·근무시간 API는 근태 도메인 문서에, 구글 연동 API는 `.docs/api/google-account/`에 있다.

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
| **OAuth 콜백 브리지** | 구글 인증이 끝난 뒤 팝업이 도착하는 화면(`/settings/google`, 복수형). 성공/실패 안내만 보여주고 0.8초 뒤 스스로 닫힌다. 사용자가 직접 보는 화면인 `/setting/google`(단수형, 상세조회)과는 다른 라우트다 |

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
│  (경고 배너, expiring/expired/failed일 때만) ⚠ 안내문구 [바로가기 →] │
│  (연동됨) 이메일 / 연결됨·갱신 필요·연결 만료·연결 실패 │
│           (failed면 [재연결] 버튼 추가)                │
│           / 연결 일시 / 연결한 관리자 / 권한 범위 / 토큰 확인 │
│           [연결 상태 확인] [계정 교체] [연동 해제]      │
├─────────────────────────────────────────────────────────┤
│ [연동 안내 컨테이너]                                    │
│  안내 문구                                              │
└─────────────────────────────────────────────────────────┘

[계정 교체 클릭] → 동의/인증/완료 3단계 모달(SettingGoogleReplaceModal)
[연동 해제 클릭] → 해제 확인 모달(SettingGoogleDisconnectModal, "해제" 입력 시 버튼 활성화)
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
| 출근/퇴근 시각 초기값 표시 | 설정 페이지 진입(서버 렌더링 시점) | 저장된 근무시간 정책 값으로 출근/퇴근 시각 select를 채움 | 구현 완료 — `setting/page.tsx`(서버 컴포넌트)가 렌더링 전에 근태 도메인의 `getMyTodayAction`(`GET /api/attendance/me/today`)을 호출해 `today.workStartTime`/`today.workEndTime`(`"HH:mm:ss"`)의 앞 5자리를 `initialStartTime`/`initialEndTime` props로 `SettingWorkingHours`에 내려준다. 조회 실패 시 `null`을 내려 기본값(09:00~18:00)을 그대로 쓴다 |

### 4.2 와이파이 IP 등록

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 내 IP 확인 | `내 IP 확인` 버튼 클릭 | 현재 IP를 조회해 표시하고 `이 IP로 등록` 버튼 노출 | 구현 완료 — `getCurrentIpAction` 호출(`GET /api/attendance/wifi-ips/current`) 결과를 `checkedIp` state에 저장. 조회 중에는 버튼이 "확인 중..."으로 바뀌고 비활성화됨 |
| IP 입력창에 채우기 | `이 IP로 등록` 클릭 | 확인된 IP를 입력창에 채움 | 구현 완료 — `checkedIp`를 `ipInput` state에 반영 |
| 와이파이 IP 저장 | `저장` 클릭 | 입력한 IP와 별칭을 등록 | 구현 완료 — `createWifiIpAction` 호출(`POST /api/attendance/wifi-ips`). IP 입력창 옆의 별칭 입력창(`noteInput`, 선택 입력)이 `note`로 함께 전송된다. 성공 시 목록을 다시 조회해 갱신하고 별칭 입력창을 비우며 토스트로 안내. 이미 등록된 IP면 버튼이 "등록됨"으로 바뀌고 비활성화됨 |
| 등록된 IP 목록 표시 | IP 등록 후 | `내 IP 확인` 영역 아래에 등록된 IP와 별칭(있으면)을 목록으로 표시(복수 등록 가능) | 구현 완료 — `getWifiIpListAction`(`GET /api/attendance/wifi-ips`)으로 마운트 시 조회하고 등록/삭제 후 재조회. `wifiIp.note`가 있으면 IP 옆에 함께 표시 |
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
| 연동 상태 표시 | 설정 화면 진입 | 관리 버튼 좌측에 실제 연동 상태 배지("연결됨"/"갱신 필요"/"연결 만료"/"연결 실패"/"연결되지 않음") 표시 | 구현 완료 — `SettingGoogle`이 마운트 시 `getGoogleConnectionAction`을 호출해 `status`를 조회하고 `getGoogleConnectionBadge()`(`utils.ts`)로 레이블·색상을 정한다 |
| 상세조회 이동 | `관리` 버튼 클릭 | 구글 연동 상세조회 화면(`/setting/google`)으로 이동 | 구현 완료 — `SettingGoogle`의 `관리`가 `next/link`의 `Link href="/setting/google"`. `page.tsx`는 헤더만 갖는 서버 컴포넌트 셸이고, 본문은 `SettingGoogleConnection`이 담당한다 |
| 연동 상태 조회 | 상세조회 화면 진입 | 서버에 저장된 실제 연동 상태를 불러와 화면 초기화 | 구현 완료 — 마운트 시 `getGoogleConnectionAction`(`GET /api/google/connections`)을 호출해 `connection` state를 채운다. 조회 완료 전에는 스피너만 표시. `data`가 `null`이면 미연동 화면 |
| 구글 계정 연결 | 미연동 화면의 `구글 계정 연결` 클릭 | 구글 인가 URL을 팝업으로 열어 연동 진행 | 구현 완료 — `getGoogleAuthorizationUrlAction(false)`로 `authorizationUrl`을 받아 팝업으로 열고, 팝업이 보낸 `postMessage`(원본 검증 후) 또는 500ms 간격 `popup.closed` 폴링으로 팝업 종료를 감지하면 `getGoogleConnectionAction`을 다시 호출해 최신 상태로 갱신한다 |
| 연동 상세 정보 표시 | 연동됨 상태일 때 | 이메일, 연결됨 여부, 연결 일시, 연결한 관리자, 권한 범위, 토큰 확인 표시 | 구현 완료 — `connection`의 실제 값을 표시. `연결 일시`/`토큰 확인`은 `formatGoogleDateTime()`으로 포맷, `권한 범위`는 서버가 내려주는 raw OAuth scope 문자열을 그대로 표시, `연결한 관리자`는 `connectedByUserName`이 있으면 그 이름을, 없으면 "사용자 #{connectedByUserId}"로 표시 |
| 연결 상태 확인 | `연결 상태 확인` 클릭 | "연결됨" 자리에 스피너 + "확인중, 잠시 기다려주세요..." 표시 | 구현 완료 — `checkGoogleConnectionAction`(`POST /api/google/connections/check`) 호출 중 배지 자리를 스피너로 교체하고 `연결 상태 확인`/`연동 해제` 버튼을 비활성화한다. 응답 후 `getGoogleConnectionAction`으로 재조회해 `lastCheckedAt`·`status`를 갱신한다 |
| 계정 교체 | `계정 교체` 클릭 | 동의 → 인증 → 완료 3단계 모달 진행 | 구현 완료 — `SettingGoogleReplaceModal`이 열리고 내부 `step`(1~3) state로 단계를 관리한다 |
| 계정 교체 - 동의 | 모달 1단계 | 기존 계정 정보 폐기, 권한 요청 안내 표시, `동의하고 계속하기` 클릭 시 인증 단계로 이동 | 구현 완료 — 경고 배너(현재 연결된 실제 이메일 포함)와 권한 3종(드라이브·문서·스프레드시트, 화면 표시용 안내일 뿐 서버 scope와 별개) 목록을 보여준다. `동의하고 계속하기` 클릭 시 `getGoogleAuthorizationUrlAction(true)`(`switchAccount=true`)로 URL을 받아 2단계로 이동하며 팝업을 연다 |
| 계정 교체 - 인증 | 모달 2단계 | 스피너, "구글 로그인 창에서 계속 진행해주세요" 안내, "창이 열리지 않았나요? 다시 열기" 버튼 표시. 다시 열기 클릭 시 구글 로그인 창 재오픈 | 구현 완료 — 발급받은 `authorizationUrl`로 팝업을 열고, 팝업의 `postMessage`(원본 검증 후) 또는 500ms 간격 `popup.closed` 폴링으로 종료를 감지한다. "다시 열기"는 같은 URL로 팝업을 다시 연다. 종료가 감지되면 `getGoogleConnectionAction`을 호출해 3단계로 이동 |
| 계정 교체 - 완료 | 인증 완료 시 | "{이메일} 계정이 연결되었습니다" 표시, `확인` 클릭 시 모달 종료 | 구현 완료 — 팝업이 닫힌 뒤 조회한 연동 데이터가 있으면 그 이메일로 성공 문구를, 없으면(`data: null`, 즉 여전히 미연동) 실패 안내를 보여준다. `확인`/오버레이/X 클릭 시 모두 `onClose`가 호출되고, 부모(`SettingGoogleConnection`)가 다시 `getGoogleConnectionAction`으로 최신 상태를 반영한다 |
| 토큰 만료 임박 안내 | 서버 `status`가 `EXPIRING`(만료 3일 전부터) | 상세정보 박스 위에 경고 배너 표시("n일 뒤 토큰이 만료됩니다" / "계정 재연결을 진행해주세요" + 우측 `재연결 →` 바로가기), 박스 안 배지는 "갱신 필요"(주황) | 구현 완료 — `n`은 `connection.refreshTokenExpiresAt`과 현재 시각의 차이를 일 단위로 계산한 실제 값. `refreshTokenExpiresAt`이 `null`이면(마이그레이션 직후 등) "곧 토큰이 만료됩니다"로 대체 표시한다. 배너/박스 안 바로가기 모두 미연동 화면과 동일한 `handleConnect`(재연결, `switchAccount=false`)를 호출한다 |
| 토큰 만료 안내 | 서버 `status`가 `EXPIRED` | 경고 배너("토큰이 만료되었습니다" / "계정을 다시 연결해주세요" + `재연결 →`), 배지는 "연결 만료"(빨강) | 구현 완료 |
| 연결 실패 안내 | 서버 `status`가 `FAILED`(`/check` 실패 또는 현재 요구 scope 미충족) | 경고 배너(빨강, "연결에 실패했습니다" / "권한이 취소되었거나 필요한 권한이 부족합니다" + `재연결 →`), 이메일 앞 아이콘이 금지 아이콘으로 바뀌고 배지는 "연결 실패"(빨강), 이메일 아래 `재연결` 버튼 추가 표시 | 구현 완료 — 배너의 `재연결 →`와 박스 안 `재연결` 버튼 모두 `handleConnect`(`switchAccount=false`)를 호출한다 |
| 연동 해제 | `연동 해제` 클릭 | "연동을 해제할까요?" 확인 모달 표시(이메일 + 안내 문구, 입력창에 "해제" 입력 시 해제 버튼 활성화) | 구현 완료 — `SettingGoogleDisconnectModal`이 열리고, 입력값이 정확히 "해제"일 때만 버튼이 활성화된다. 확인 시 `disconnectGoogleAction`(`DELETE /api/google/connections`)을 호출하고 성공하면 `connection`을 `null`로 비워 미연동 화면으로 복귀한다 |

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
| `GoogleConnectionStatus` | `"CONNECTED" \| "EXPIRING" \| "EXPIRED" \| "FAILED"` — 서버가 내려주는 구글 연동 상태값(대문자). `EXPIRING`은 만료 3일 전부터, `FAILED`는 `/check` 실패뿐 아니라 현재 요구 scope를 다 포함하지 못하는 경우에도 내려온다 |
| `GoogleConnectionData` / `GoogleConnectionResponse` | 구글 연동 상태 조회(`GET /api/google/connections`) 응답 — `googleEmail`, `connectedByUserId`, `connectedByUserName`(연결한 관리자의 현재 이름, 사용자가 없으면 `null`), `scope`, `connectedAt`, `refreshTokenExpiresAt`(리프레시 토큰 만료 일시, 실제 만료 정보가 없으면 `null`), `lastCheckedAt`, `status`. 연동된 계정이 없으면 `data`가 `null`(404가 아님) |
| `GoogleAuthorizationUrlData` / `GoogleAuthorizationUrlResponse` | 구글 계정 연동 시작(`POST /api/google/connections/authorize-url?switchAccount={bool}`) 응답 — `data.authorizationUrl`을 팝업/새 창으로 열어 구글 동의 화면을 진행시켜야 한다. "재연결"과 "계정 교체" 모두 이 엔드포인트 하나를 쓰고 `switchAccount`로만 구분한다 |

와이파이 IP 삭제(`DELETE /api/attendance/wifi-ips/{wifiIpId}`), 구글 연동 상태 확인(`POST /api/google/connections/check`), 구글 연동 해제(`DELETE /api/google/connections`)는 응답 본문이 없거나(`204 No Content`) `data`가 항상 `null`이라 별도 타입 없이 `Promise<void>`로 처리한다.

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
| `formatGoogleDateTime()` | 구글 연동 응답의 ISO 시각(`connectedAt`/`refreshTokenExpiresAt`/`lastCheckedAt`)을 `"YYYY.MM.DD HH:mm"`로 변환하는 함수. `SettingGoogleConnection`에서 사용 |
| `getGoogleConnectionBadge()` | `GoogleConnectionStatus \| null`을 받아 설정 화면 구글 연동 카드의 배지 레이블·색상을 반환하는 함수. `SettingGoogle`에서 사용 |
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
| **SettingWorkingHours** | 근무 시간 카드(client component). `initialStartTime`/`initialEndTime`(`string \| null`, 부모 서버 컴포넌트가 내려주는 초기값) props를 받아 `startTime`/`endTime` state의 초기값으로 쓴다(`null`이면 09:00/18:00). `lateGraceMinutes`(0~60, 10 단위), `hasWeekdayException`(토글), `weekdayExceptions`(`WeekdayException[]`, 요일별 근무여부·시간), `isSaving` state도 갖는다. `updateWeekdayException`으로 요일 단위 부분 갱신. `저장` 클릭 시 `toWorkingHoursPolicyWeekdays()`로 변환한 뒤 `saveWorkingHoursPolicyAction`을 호출하고 결과를 토스트로 안내한다. 근무시간 정책 자체의 **조회** API는 없어 지각 유예·요일별 예외는 여전히 항상 기본값에서 시작한다 |
| **SettingWifi** | 와이파이 IP 등록 카드(client component). `ipInput`(입력값), `noteInput`(별칭 입력값, 선택), `checkedIp`(내 IP 확인 결과), `wifiIps`(`WifiIpListItemData[]`, 서버 목록), `isChecking`/`isSaving` state를 가진다. 마운트 시 `getWifiIpListAction`으로 목록을 조회한다. `내 IP 확인` → `getCurrentIpAction` 호출 → `이 IP로 등록`으로 `ipInput`에 반영 → `저장`으로 `createWifiIpAction(ip, note)` 호출 후 목록 재조회 및 `noteInput` 초기화, 목록 항목의 휴지통 아이콘으로 `deleteWifiIpAction` 호출 후 재조회하는 흐름. `이 IP로 등록` 배너는 `내 IP 확인` 버튼이 속한 배경 컨테이너 안에 중첩 렌더링된다. `checkedIp`가 없거나 `wifiIps`가 비어 있으면 각각의 안내 영역·목록이 렌더링되지 않아 기본 화면은 입력창과 "내 IP 확인" 버튼줄만 보인다. 모든 액션 실패는 `sonner`의 `toast.error`로 안내(다른 도메인과 동일한 패턴) |
| **SettingPayday** | 급여 지급일 카드(구현 완료 — 정적). `generatePaydayOptions()`로 1~30일 select 옵션을 렌더링하지만 선택값을 저장하는 핸들러는 없음(uncontrolled) |
| **SettingAlarm** | 알림 설정 카드(구현 완료 — 정적). `notificationItems` 더미 배열을 체크박스 목록으로 렌더링, 상호작용 없음 |
| **SettingGoogle** | 구글 연동 카드(client component). 마운트 시 `getGoogleConnectionAction`을 호출해 `status`(`GoogleConnectionStatus \| null`) state를 채우고, `getGoogleConnectionBadge()`로 배지 레이블·색상을 정한다. "관리"는 `next/link`로 `/setting/google`로 이동한다 |
| **SettingGoogleConnection** | 구글 연동 상세조회 화면 본문(client component). `src/app/(user)/setting/google/page.tsx`에서 렌더링. `connection`(`GoogleConnectionData \| null`, 서버 실데이터), `isLoadingConnection`, `isConnecting`, `isCheckingConnection`, `isReplaceModalOpen`, `isDisconnectModalOpen` state를 갖는다. `status`(화면용 소문자 `"not-connected"/"connected"/"expiring"/"expired"/"failed"`)는 `connection.status`(서버의 대문자 `GoogleConnectionStatus`)를 `STATUS_TO_CONNECTION_STATUS`로 매핑해 파생시킨다. 마운트 시 `getGoogleConnectionAction`으로 초기 상태를 조회한다(로딩 중엔 스피너만 표시). `handleConnect`(구글 계정 연결/재연결 공용, `switchAccount=false`)는 `getGoogleAuthorizationUrlAction` → 팝업 오픈 → `popup.closed` 폴링 → `fetchConnection()` 재조회 순으로 동작하며, 미연동 화면의 `구글 계정 연결` 버튼과 `expiring`/`expired`/`failed` 배너·박스의 `재연결` 버튼이 모두 이 함수를 공유한다. `연결 상태 확인`은 `checkGoogleConnectionAction` 호출 후 `fetchConnection()`으로 재조회. `계정 교체`/`연동 해제` 클릭은 각각 `SettingGoogleReplaceModal`/`SettingGoogleDisconnectModal`을 띄우고, 두 모달 모두 닫힐 때 최신 상태를 반영하도록 부모가 재조회하거나(`계정 교체`는 `onClose`에서 `fetchConnection()`) 직접 `connection`을 갱신한다(`연동 해제`는 성공 시 `connection`을 `null`로). `연동 안내` 섹션도 이 컴포넌트 안에 함께 있다 |
| **SettingGoogleReplaceModal** | 계정 교체 모달(client component). `email`(현재 연결된 실제 이메일), `onClose` props를 받고, 내부 `step`(1~3), `isRequestingAuth`, `resultEmail`(string 또는 null) state와 `authorizationUrlRef`/`popupRef`/`pollIntervalRef`를 갖는다. 1단계 `동의하고 계속하기` → `getGoogleAuthorizationUrlAction(true)`(`switchAccount=true`)로 URL을 받아 2단계로 이동하며 팝업을 연다. 2단계는 `popup.closed`를 500ms 간격으로 폴링하다가 닫히면 `getGoogleConnectionAction`을 호출해 결과(`resultEmail`)를 정하고 3단계로 이동한다. `창이 열리지 않았나요? 다시 열기`는 저장해둔 URL로 팝업을 다시 연다. 3단계는 `resultEmail`이 있으면 성공, 없으면(여전히 미연동) 실패 문구를 보여준다. `확인`/오버레이/X 클릭은 모두 폴링을 정리하고 `onClose`를 호출한다 |
| **SettingGoogleDisconnectModal** | 연동 해제 확인 모달(client component). `email`, `onClose`, `onConfirm` props를 받고 내부 `confirmInput`(string) state를 갖는다. 입력값이 정확히 `"해제"`와 일치할 때만 `연동 해제` 버튼이 활성화되며, 클릭 시 `onConfirm`(부모의 `handleDisconnect` — `disconnectGoogleAction` 호출 후 `connection`을 `null`로)을 호출한다. 오버레이 클릭/X 버튼은 `onClose`로 그냥 닫는다 |
| **SettingGoogleConnectionCallback** | 구글 OAuth 팝업이 최종적으로 도착하는 브리지 화면 본문(client component). `src/app/(user)/settings/google/page.tsx`(주의: `setting`이 아니라 복수형 `settings` — 백엔드 `GOOGLE_OAUTH_FRONTEND_REDIRECT_URI` 값과 맞춘 것)에서 렌더링. `success`(boolean) prop과 내부 `closeFailed`(boolean) state를 갖는다. 마운트 즉시 `window.close()`를 시도하고 `closeFailed`가 `false`인 동안은 아무것도 렌더링하지 않는다(성공/실패 안내는 팝업이 아니라 이미 열려 있는 `/setting/google`에서 보여주는 게 UX상 맞다고 판단). 300ms 안에 창이 안 닫히면(스크립트로 열리지 않은 창 등) 그때만 `closeFailed`를 켜서 안내 문구 + `창 닫기` 버튼을 보여주는 최소 폴백. 메인 창의 팝업 폴링 로직은 이 닫힘에 의존한다 |

구글 연동 상세조회 화면(`/setting/google`)은 `SettingGoogleConnection`(+ `계정 교체` 클릭 시 `SettingGoogleReplaceModal`, `연동 해제` 클릭 시 `SettingGoogleDisconnectModal`)으로 구성된다. OAuth 팝업이 최종적으로 열람하는 `/settings/google`(브리지 화면)은 별도의 `SettingGoogleConnectionCallback`으로 구성되며, 이 두 라우트는 서로 다른 화면이다.

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

setting/google/page.tsx            (구글 연동 상세조회 화면, /setting/google, 헤더만 그리는 서버 컴포넌트 셸)
└── SettingGoogleConnection        (본문 전체, client component)
    ├── SettingGoogleReplaceModal  (계정 교체 클릭 시)
    └── SettingGoogleDisconnectModal (연동 해제 클릭 시)

settings/google/page.tsx           (OAuth 팝업 콜백 브리지, /settings/google, 위와 다른 라우트)
└── SettingGoogleConnectionCallback (성공/실패 안내 후 0.8초 뒤 window.close())
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 근무시간 데이터 | 출근/퇴근 시각, 지각 유예, 요일별 예외 조회·저장 | 부분 구현 — `SettingWorkingHours`가 `saveWorkingHoursPolicyAction`(`PUT /api/attendance/policies`)으로 저장하고, 출근/퇴근 시각만 `setting/page.tsx`가 서버에서 `getMyTodayAction`으로 미리 불러와 초기 props로 전달한다. 근무시간 정책 자체의 조회 API가 없어 지각 유예·요일별 예외는 새로고침하면 항상 기본값(`DEFAULT_WEEKDAY_EXCEPTIONS` 등)에서 시작한다 |
| 와이파이 IP 데이터 | 등록된 IP 목록 조회·등록·삭제 | 구현 완료 — `SettingWifi`가 `getWifiIpListAction`/`createWifiIpAction`/`deleteWifiIpAction`을 실제로 호출하고 목록을 서버 상태와 동기화한다 |
| 급여 지급일 데이터 | 지급일 조회·저장 | 미구현 — API/service 없음 |
| 알림 설정 데이터 | 알림 항목별 on/off 조회·저장 | 미구현 — API/service 없음, 항목 자체도 더미 |
| 구글 연동 데이터 | 연동 상태, 계정 정보, 토큰 상태 조회 및 연결/교체/해제 | 구현 완료 — `getGoogleConnectionAction`(`GET /connections`), `getGoogleAuthorizationUrlAction`(`POST /connections/authorize-url`, 연결·재연결·계정교체 공용), `checkGoogleConnectionAction`(`POST /connections/check`), `disconnectGoogleAction`(`DELETE /connections`)을 `SettingGoogleConnection`/`SettingGoogleReplaceModal`/`SettingGoogleDisconnectModal`이 실제로 호출한다. OAuth 콜백 자체(구글→백엔드 리다이렉트)는 프론트가 관여하지 않고, 팝업이 닫힌 뒤 상태를 재조회하는 방식으로 결과를 반영한다 |
| 내 IP 조회 | 클라이언트 또는 서버에서 현재 접속 IP를 가져오는 절차 | 구현 완료 — `SettingWifi`가 로그인 사용자 전용 `getCurrentIpAction`(`GET /api/attendance/wifi-ips/current`)을 호출한다. |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 요일별 예외 | 켜짐 / 꺼짐 |
| 구글 연동(`SettingGoogleConnection`의 `status`, `connection.status`에서 파생) | not-connected / connected / expiring / expired / failed — 서버가 내려주는 실제 상태를 그대로 반영한다 |
| 연결 상태 확인(`isCheckingConnection`) | 확인 전(배지 표시) / 확인 중(스피너 표시, `checkGoogleConnectionAction` 응답까지) |
| 계정 교체 모달 | 닫힘 / 동의 / 인증 / 완료 |
| 연동 해제 모달 | 닫힘 / 열림(해제 입력 전) / 열림(해제 버튼 활성화) |

---
