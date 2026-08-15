# Alarm(알림) Domain — CONTEXT
> 배치 경로: `src/feature/alarm/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 알림 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: API 연결 준비 완료(type/service/actions) — Sidebar 진입점, `/alarm` 목록 화면, 읽음 처리·개별 삭제·읽은 알림 일괄 삭제 클릭 이벤트는 `AlarmContainer`의 로컬 state로 동작 중이며, `src/feature/alarm/type.ts`·`src/service/alarm.service.ts`·`src/feature/alarm/actions.ts`가 작성되어 실제 API 호출 준비는 끝났지만 아직 컴포넌트에 연결되지 않았다(화면은 여전히 목업 데이터 기준). 무한 스크롤·실제 API 연동·WebSocket 실시간 수신은 아직 미구현. 순차 구현 계획(CONTEXT → UI → 기능 → API 연결 준비 → API 연동)에 따라 각 단계가 끝날 때마다 갱신한다.

---

## 1. 개요

로그인한 사용자 본인에게 온 알림(멘션, 결재 차례 도달 등)을 모아 보여주는 도메인.

알림은 사용자가 직접 만드는 것이 아니라 백엔드에서 특정 이벤트(워크스페이스 멘션, 결재 차례 도달 등)가 발생하면 서버가 자동으로 생성해 저장한다. 프론트는 두 가지 경로로 이 데이터를 다룬다.

1. **알림함 조회(REST)** — 과거 기록을 포함한 전체 알림 목록/안읽은 개수를 조회하고, 읽음 처리·삭제를 수행한다.
2. **실시간 수신(WebSocket)** — 접속 중에 새 알림이 발생하면 즉시 토스트로 알리고 안읽은 개수 뱃지를 갱신한다.

### 핵심 제약

- 알림 "생성" REST API는 없다. 저장은 백엔드 이벤트 발생 시 서버가 직접 수행한다.
- 실시간 WebSocket 수신 페이로드(`TASK_COMMENT_MENTIONED`, `APPROVAL_LINE_ACTIVATED`)는 알림함 REST 응답(`NotificationItemData`)과 필드 구조가 다르다. 실시간 수신은 토스트 표시와 안읽은 개수 증가에만 사용하고, 알림함 목록 자체는 REST 재조회로 갱신한다(실시간 payload를 목록 아이템으로 직접 변환해 끼워 넣지 않는다).
- 결재 승인/반려/취소는 실시간 push가 없다. 알림함 REST 조회로만 확인 가능하다.
- 읽음/안읽음 필터는 없다 — 알림함 목록은 항상 섞어서 반환된다(API 스펙).
- 알림 클릭 시 `targetId` 기반 화면 이동(라우팅)은 이번 구현 범위에 포함하지 않는다. 클릭 시 읽음 처리만 수행한다.
- 일괄 삭제는 `status=READ`만 지원한다. 안읽은 알림은 삭제 대상에서 제외된다.

### 진입점

Sidebar에 신규 추가할 알림 메뉴(`src/components/layout/Sidebar.tsx`, `href: "/alarm"`). 라우트는 `src/app/(user)/alarm/page.tsx`.

`공지사항` 메뉴가 이미 `Bell` 아이콘을 쓰고 있어, 알림 메뉴는 `NavLink`/`Sidebar`의 아이콘 유니언에 `BellRing`을 추가해 구분한다.

### 데이터 연동 계층

- `src/feature/alarm/type.ts` — 요청/응답 인터페이스(`NotificationListParams`, `NotificationItemData`, `NotificationListData`, `NotificationListResponse`, `NotificationUnreadCountData`, `NotificationUnreadCountResponse`). `export` 없이 선언되어 프로젝트 전역에서 import 없이 바로 참조된다(notice 등 다른 도메인 `type.ts`와 같은 스타일) — 구현 완료.
- `src/service/alarm.service.ts` — `fetchWithAuth` 기반 API 호출(`getNotificationList`, `getUnreadNotificationCount`, `readNotification`, `deleteNotification`, `deleteReadNotifications`) — 구현 완료.
- `src/feature/alarm/actions.ts` — 위 service를 감싼 Server Action(`getNotificationListAction`, `getUnreadNotificationCountAction`, `readNotificationAction`, `deleteNotificationAction`, `deleteReadNotificationsAction`). 컴포넌트는 이 액션만 호출하고 service를 직접 부르지 않는다 — 구현 완료. 단, 아직 어떤 컴포넌트도 이 액션들을 호출하지 않는다(다음 단계인 API 연동에서 연결 예정).
- `src/feature/alarm/components/AlarmRealtimeProvider.tsx` — WebSocket 연결/구독 Provider(예정, `src/feature/messenger/components/MessengerRealtimeProvider.tsx`와 유사한 구조로, 알림 도메인 전용 STOMP 클라이언트를 별도로 둔다). 구독 주소는 `/topic/workspaces/users/{userId}`(멘션), `/topic/approvals/users/{userId}`(결재 차례 도달) — 미구현.
- API 응답이 없거나 실패하면 목록은 "알림을 불러오지 못했습니다"를 보여준다(페이지 자체는 죽지 않음) — 이 실패 처리는 아직 화면에 연결되지 않음(목업 데이터라 실패 경로 자체가 없음).

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **알림 목록** | 등록된 알림을 최신순으로 나열하는 화면 |
| **안읽은 개수** | 본인에게 온 알림 중 아직 읽지 않은 개수. Sidebar 메뉴 뱃지에 표시 |
| **읽음 처리** | 알림 항목을 클릭하면 해당 알림을 읽음 상태로 바꾸는 동작 |
| **읽은 알림 일괄 삭제** | 읽음 상태인 알림을 한 번에 삭제하는 동작(안읽은 알림은 대상에서 제외) |
| **실시간 알림** | 접속 중 WebSocket으로 즉시 수신되는 알림(멘션, 결재 차례 도달). 토스트 표시 + 안읽은 개수 즉시 증가 |

---

## 3. 화면 구성

알림 도메인은 **목록 화면** 하나로 구성된다.

```
┌─ 알림 목록 화면 ────────────────────────────────┐
│ [Header]                                        │
│  알림                          [읽은 알림 삭제]  │
├──────────────────────────────────────────────────┤
│ [목록] (무한 스크롤)                             │
│  ○ 메시지                              날짜      │
│  ● 메시지 (안읽음 표시)                날짜  [x] │
│  ...                                             │
└──────────────────────────────────────────────────┘
```

- 알림이 없으면 "알림이 없습니다" 표시.
- 목록 조회 자체가 실패하면 "알림을 불러오지 못했습니다" 표시.
- 목록 하단에 도달하면 다음 페이지를 자동으로 이어서 불러온다(무한 스크롤).

---

## 4. 기능 목록

### 4.1 목록 조회

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 목록 진입 | Sidebar 알림 클릭 | `/alarm` 이동, 알림 목록 표시(현재는 목업 데이터) | UI 구현 완료(정적) |
| 무한 스크롤 | 목록 하단 도달 | 다음 page 조회해 이어붙임(`hasNext`가 참인 동안) | 미구현 |
| 빈 목록 안내 | 조회된 알림 0건 | "알림이 없습니다" 표시 | UI 구현 완료(`AlarmList`) |
| 조회 실패 안내 | 목록 조회 실패 | "알림을 불러오지 못했습니다" 표시 | 미구현 |

### 4.2 안읽은 개수 — 미구현

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 뱃지 표시 | Sidebar 렌더링 | 안읽은 개수 조회 후 알림 메뉴에 뱃지로 표시(0이면 숨김) | 미구현(API 연동 필요) |

### 4.3 읽음 처리

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 읽음/안읽음 표시 | 목록 렌더링 | 안읽은 항목은 초록 도트 + 굵은 텍스트로 구분 | 구현 완료 |
| 알림 읽음 처리 | 목록의 알림 항목 클릭 | `AlarmContainer`의 `handleItemClick`이 해당 알림의 `read`를 로컬 state에서 `true`로 변경 | 구현 완료(로컬 state) — 읽음 처리 API 호출은 미구현 |

### 4.4 개별 삭제

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 알림 삭제 | 항목의 삭제(x) 아이콘 클릭 | `AlarmContainer`의 `handleDelete`가 해당 알림을 로컬 state에서 제거 | 구현 완료(로컬 state) — 삭제 API 호출은 미구현 |

### 4.5 읽은 알림 일괄 삭제

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 일괄 삭제 | Header `읽은 알림 삭제` 클릭 | `AlarmContainer`의 `handleDeleteRead`가 `read`가 `true`인 알림을 로컬 state에서 모두 제거(안읽은 알림은 제외) | 구현 완료(로컬 state) — 일괄 삭제 API 호출은 미구현 |

### 4.6 실시간 알림 수신 — 미구현

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 실시간 수신 구독 | 로그인 후 상시 | `AlarmRealtimeProvider`가 WebSocket으로 멘션/결재 차례 도달 이벤트 구독 | 미구현 |
| 실시간 토스트 | 구독 중 이벤트 수신 | 화면에 토스트로 즉시 안내 | 미구현 |
| 안읽은 개수 즉시 갱신 | 구독 중 이벤트 수신 | Sidebar 뱃지 개수를 즉시 증가 | 미구현 |

---

## 5. 데이터

`src/feature/alarm/type.ts`에 정의할 타입(`.docs/api/alarm/apiIntegration.md` 기준).

### 목록 항목 (`NotificationItemResponse`)

| 항목 | 필드명 | 설명 |
|---|---|---|
| 아이디 | `notificationId` | 읽음 처리·삭제 대상 식별 |
| 타입 | `type` | 알림 종류 코드(문자열). 이번 범위에서는 라우팅에 사용하지 않음 |
| 대상 아이디 | `targetId` | 클릭 시 이동할 대상 ID. 이번 범위에서는 미사용 |
| 메시지 | `message` | 저장 시점에 완성된 알림 문구(최대 250자) |
| 읽음 여부 | `read` | 목록에서 읽음/안읽음 표시 구분 |
| 생성일 | `createdAt` | 목록 정렬·표시 기준 |

### 목록 페이지네이션

| 항목 | 설명 |
|---|---|
| `page` | 요청 페이지 번호(0부터 시작) |
| `size` | 페이지 크기(기본 20, 최대 100) |
| `hasNext` | 다음 페이지 존재 여부. 무한 스크롤 이어 불러오기 조건 |

### 안읽은 개수 (`unreadCount`)

Sidebar 뱃지 표시에 사용.

### 실시간 이벤트 페이로드 (WebSocket, REST 응답과 별개 구조)

| 이벤트 | 필드 |
|---|---|
| `TASK_COMMENT_MENTIONED` | `eventType`, `workspaceId`, `taskId`, `taskTitle`, `commentId`, `actorUserId`, `recipientUserId`, `occurredAt` |
| `APPROVAL_LINE_ACTIVATED` | `eventType`, `documentId`, `documentTitle`, `approverId`, `activatedAt` |

---

## 6. 컴포넌트 구성

기능 단위로 분해했을 때 필요한 컴포넌트 목록과 각자의 책임.

| 컴포넌트 | 책임 | 상태 |
|---|---|---|
| **(page.tsx)** | 목록 화면 셸(서버 컴포넌트). `/alarm`에서 `AlarmContainer`에 목업 데이터를 초기값으로 전달 | 구현 완료(목업 데이터) |
| **AlarmContainer** | 클라이언트 컴포넌트. `alarms` state를 소유하고 `handleItemClick`(읽음 처리)/`handleDelete`(개별 삭제)/`handleDeleteRead`(일괄 삭제)를 `AlarmHeader`/`AlarmList`에 내려줌 | 구현 완료(로컬 state) |
| **AlarmHeader** | 화면 타이틀 + `읽은 알림 삭제` 버튼. `onDeleteRead` prop 호출 | 구현 완료 |
| **AlarmList** | 알림 목록. 항목별 읽음/안읽음 표시, 항목 클릭 시 `onItemClick`, 삭제 버튼 클릭 시 `onDelete` 호출, 빈 상태 표시 | 구현 완료(로컬 state) — 무한 스크롤은 미구현 |
| **AlarmRealtimeProvider** | WebSocket 연결/구독 Provider(예정). `src/app/layout.tsx` 또는 상위 레이아웃에 상시 마운트해 로그인 중에는 항상 구독 유지. 이벤트 수신 시 토스트 표시 + 안읽은 개수 갱신 콜백 호출 | 미구현 |

### 관계

```
alarm/page.tsx                     (목록 화면, /alarm, 목업 데이터 전달)
└── AlarmContainer                 (alarms state, handleItemClick/handleDelete/handleDeleteRead)
    ├── AlarmHeader                (읽은 알림 삭제 버튼 → onDeleteRead)
    └── AlarmList                  (항목 클릭 → onItemClick, 삭제 아이콘 → onDelete. 무한 스크롤은 미구현)

layout.tsx (전역, 예정)
└── AlarmRealtimeProvider          (WebSocket 구독, Sidebar 뱃지와 연결)
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 알림 데이터 | 목록 조회·읽음 처리·삭제 | 미구현(현재 `AlarmContainer`의 로컬 state + 목업 데이터로만 동작, 실제 API 없음) |
| 안읽은 개수 상태 | Sidebar 뱃지에 반영 | 미구현 |
| 무한 스크롤 상태 | 현재 page, 더 불러올 수 있는지(`hasNext`) | 미구현 |
| WebSocket 구독 상태 | 알림 도메인 전용 STOMP 연결/구독 관리 | 미구현 |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 목록 항목 | 읽음 / 안읽음 |
| 목록 로딩 | 정상 / 조회 실패("알림을 불러오지 못했습니다") |
| 무한 스크롤 | 더 불러올 수 있음 / 마지막 페이지 |

---
