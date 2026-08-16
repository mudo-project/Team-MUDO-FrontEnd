# Alarm(알림) Domain — CONTEXT
> 배치 경로: `src/feature/alarm/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 알림 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: API 연동 완료 — REST 5개 엔드포인트(목록 조회/안읽은 개수/읽음 처리/개별 삭제/일괄 삭제)와 WebSocket 실시간 수신(멘션, 결재 차례 도달)까지 모두 실제로 연결되어 있다. 이 환경에는 로그인 세션이 없어 성공 경로(정상 로그인 후 데이터 표시)는 직접 확인하지 못했고, 인증 실패(401) 시 에러 문구가 표시되는 경로만 확인했다.

---

## 1. 개요

로그인한 사용자 본인에게 온 알림(멘션, 결재 차례 도달 등)을 모아 보여주는 도메인.

알림은 사용자가 직접 만드는 것이 아니라 백엔드에서 특정 이벤트(워크스페이스 멘션, 결재 차례 도달 등)가 발생하면 서버가 자동으로 생성해 저장한다. 프론트는 두 가지 경로로 이 데이터를 다룬다.

1. **알림함 조회(REST)** — 과거 기록을 포함한 전체 알림 목록/안읽은 개수를 조회하고, 읽음 처리·삭제를 수행한다.
2. **실시간 수신(WebSocket)** — 접속 중에 새 알림이 발생하면 즉시 토스트로 알리고 안읽은 개수 뱃지를 갱신한다.

### 핵심 제약

- 알림 "생성" REST API는 없다. 저장은 백엔드 이벤트 발생 시 서버가 직접 수행한다.
- 실시간 WebSocket 수신 페이로드(`TASK_COMMENT_MENTIONED`, `APPROVAL_LINE_ACTIVATED`)는 알림함 REST 응답(`NotificationItemData`)과 필드 구조가 다르다. 실시간 수신은 토스트 표시와 안읽은 개수 증가에만 사용하고, 알림함 목록 자체는 REST 재조회로만 갱신한다(실시간 payload를 목록 아이템으로 직접 변환해 끼워 넣지 않는다 — 실제로도 페이지를 새로고침해야 새 알림이 목록에 보인다).
- 결재 승인/반려/취소는 실시간 push가 없다. 알림함 REST 조회로만 확인 가능하다.
- 읽음/안읽음 필터는 없다 — 알림함 목록은 항상 섞어서 반환된다(API 스펙).
- 알림 클릭 시 `targetId` 기반 화면 이동(라우팅)은 이번 구현 범위에 포함하지 않는다. 클릭 시 읽음 처리만 수행한다.
- 일괄 삭제는 `status=READ`만 지원한다. 안읽은 알림은 삭제 대상에서 제외된다.
- Sidebar 뱃지의 안읽은 개수는 최초 진입 시 1회 조회한 값을 `useAlarmStore`(Zustand)로 들고 있다가, `/alarm`에서 읽음 처리·개별 삭제(안읽은 항목인 경우만) 시 클라이언트에서 즉시 1씩 감소시키고, WebSocket으로 새 알림을 수신하면 1씩 증가시킨다. 서버에서 최신 개수를 다시 조회하는 것이 아니라 클라이언트 계산으로 유지되므로, 여러 탭/기기에서 동시에 조작하면 실제 값과 어긋날 수 있다.

### 진입점

Sidebar의 알림 메뉴(`src/components/layout/Sidebar.tsx`, `href: "/alarm"`, `BellRing` 아이콘). 라우트는 `src/app/(user)/alarm/page.tsx`.

`공지사항` 메뉴가 이미 `Bell` 아이콘을 쓰고 있어, 알림 메뉴는 `NavLink`/`Sidebar`의 아이콘 유니언에 `BellRing`을 추가해 구분한다.

### 데이터 연동 계층

- `src/feature/alarm/type.ts` — 요청/응답 인터페이스(`NotificationListParams`, `NotificationItemData`, `NotificationListData`, `NotificationListResponse`, `NotificationUnreadCountData`, `NotificationUnreadCountResponse`). `export` 없이 선언되어 프로젝트 전역에서 import 없이 바로 참조된다(notice 등 다른 도메인 `type.ts`와 같은 스타일).
- `src/service/alarm.service.ts` — `fetchWithAuth` 기반 API 호출(`getNotificationList`, `getUnreadNotificationCount`, `readNotification`, `deleteNotification`, `deleteReadNotifications`).
- `src/feature/alarm/actions.ts` — 위 service를 감싼 Server Action(`getNotificationListAction`, `getUnreadNotificationCountAction`, `readNotificationAction`, `deleteNotificationAction`, `deleteReadNotificationsAction`). 컴포넌트는 이 액션만 호출하고 service를 직접 부르지 않는다.
- `src/feature/alarm/components/AlarmRealtimeProvider.tsx` — WebSocket 연결/구독 Provider. `src/app/(user)/layout.tsx`에 `<MemoContainer />`와 형제로 상시 마운트되어 로그인 중에는 항상 구독을 유지한다. Server Layout이 현재 요청 Host로 테넌트 API Base URL을 결정해 `apiBaseUrl` prop으로 전달하며, Provider는 `${apiBaseUrl}/ws`에 연결한다. `src/feature/messenger/components/MessengerRealtimeProvider.tsx`와 별개의 자체 STOMP 클라이언트를 사용하며, 사용자 id는 `src/feature/messenger/actions.ts`의 `getCurrentUserIdAction`(JWT 디코딩)으로 얻어 재사용한다. 구독 주소는 `/topic/workspaces/users/{userId}`(멘션), `/topic/approvals/users/{userId}`(결재 차례 도달).
- `src/store/useAlarmStore.ts` — Zustand 스토어. 안읽은 개수(`unreadCount`)를 Sidebar와 `AlarmRealtimeProvider`가 공유한다(부모-자식 관계가 아니므로 메모 도메인의 `useMemoStore`와 동일하게 스토어로 연결).
- API 응답이 없거나 실패하면(예: 인증 실패) 목록은 "알림을 불러오지 못했습니다"를 보여준다(페이지 자체는 죽지 않음). 이 경로는 실제로 401 상황에서 확인했다.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **알림 목록** | 등록된 알림을 최신순으로 나열하는 화면 |
| **안읽은 개수** | 본인에게 온 알림 중 아직 읽지 않은 개수. Sidebar 메뉴 뱃지에 표시 |
| **읽음 처리** | 알림 항목을 클릭하면 해당 알림을 읽음 상태로 바꾸는 동작 |
| **읽은 알림 일괄 삭제** | 읽음 상태인 알림을 한 번에 삭제하는 동작(안읽은 알림은 대상에서 제외) |
| **실시간 알림** | 접속 중 WebSocket으로 즉시 수신되는 알림(멘션, 결재 차례 도달). 토스트 표시 + 안읽은 개수 즉시 증가. 알림함 목록 자체에는 새로고침 전까지 반영되지 않는다 |

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
- 목록 하단에 도달하면(`IntersectionObserver`) 다음 페이지를 자동으로 이어서 불러온다(무한 스크롤).

---

## 4. 기능 목록

### 4.1 목록 조회

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 목록 진입 | Sidebar 알림 클릭 | `/alarm` 이동, `getNotificationListAction()`으로 첫 페이지 조회 | 구현 완료 |
| 무한 스크롤 | 목록 하단 sentinel이 뷰포트에 들어옴 | `getNotificationListAction({ page: page + 1 })` 호출해 이어붙임(`hasNext`가 참인 동안만 관찰) | 구현 완료 |
| 빈 목록 안내 | 조회된 알림 0건 | "알림이 없습니다" 표시 | 구현 완료 |
| 조회 실패 안내 | 목록 조회 실패(예: 401) | "알림을 불러오지 못했습니다" 표시 | 구현 완료(401로 확인) |

### 4.2 안읽은 개수

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 뱃지 표시 | Sidebar 렌더링 | `getUnreadNotificationCountAction()` 조회 후 `useAlarmStore`에 저장, 알림 메뉴 뱃지로 표시 | 구현 완료(조회 실패 시 뱃지는 0 유지) |
| 뱃지 감소 | `/alarm`에서 안읽은 알림 읽음 처리·삭제 | `useAlarmStore.decrementUnreadCount()` 호출 | 구현 완료 |
| 뱃지 증가 | WebSocket으로 새 알림 수신 | `useAlarmStore.incrementUnreadCount()` 호출 | 구현 완료 |

### 4.3 읽음 처리

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 읽음/안읽음 표시 | 목록 렌더링 | 안읽은 항목은 초록 도트 + 굵은 텍스트로 구분 | 구현 완료 |
| 알림 읽음 처리 | 목록의 알림 항목 클릭(안읽은 항목만) | `readNotificationAction` 호출, 성공 시 로컬 state의 `read`를 `true`로 변경 + 안읽은 개수 1 감소. 실패 시 toast로 에러 안내 | 구현 완료 |

### 4.4 개별 삭제

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 알림 삭제 | 항목의 삭제(x) 아이콘 클릭 | `deleteNotificationAction` 호출, 성공 시 목록에서 제거(안읽은 항목이었다면 안읽은 개수도 1 감소). 실패 시 toast로 에러 안내 | 구현 완료 |

### 4.5 읽은 알림 일괄 삭제

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 일괄 삭제 | Header `읽은 알림 삭제` 클릭 | `deleteReadNotificationsAction` 호출(`status=READ`), 성공 시 로컬 state에서 읽음 항목을 모두 제거. 실패 시 toast로 에러 안내 | 구현 완료 |

### 4.6 실시간 알림 수신

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 실시간 수신 구독 | 로그인 후 상시(`AlarmRealtimeProvider`가 `(user)/layout.tsx`에 항상 마운트) | STOMP로 `/topic/workspaces/users/{userId}`, `/topic/approvals/users/{userId}` 구독 | 구현 완료 |
| 실시간 토스트 | 구독 중 이벤트 수신 | 멘션은 `[taskTitle] 업무에 회원님을 멘션했습니다`, 결재는 `결재 문서 [documentTitle] 결재 차례가 되었습니다` 문구로 토스트 표시 | 구현 완료 |
| 안읽은 개수 즉시 갱신 | 구독 중 이벤트 수신 | `useAlarmStore.incrementUnreadCount()` 호출로 Sidebar 뱃지 즉시 증가 | 구현 완료 |

---

## 5. 데이터

`src/feature/alarm/type.ts`에 정의된 타입(`.docs/api/alarm/apiIntegration.md` 기준).

### 목록 항목 (`NotificationItemData`)

| 항목 | 필드명 | 설명 |
|---|---|---|
| 아이디 | `notificationId` | 읽음 처리·삭제 대상 식별 |
| 타입 | `type` | 알림 종류 코드(문자열). 이번 범위에서는 라우팅에 사용하지 않음 |
| 대상 아이디 | `targetId` | 클릭 시 이동할 대상 ID. 이번 범위에서는 미사용 |
| 메시지 | `message` | 저장 시점에 완성된 알림 문구(최대 250자) |
| 읽음 여부 | `read` | 목록에서 읽음/안읽음 표시 구분 |
| 생성일 | `createdAt` | 목록 정렬·표시 기준 |

### 목록 페이지네이션 (`NotificationListData`)

| 항목 | 설명 |
|---|---|
| `page` | 요청 페이지 번호(0부터 시작) |
| `size` | 페이지 크기(기본 20, 최대 100) |
| `hasNext` | 다음 페이지 존재 여부. 무한 스크롤 이어 불러오기 조건 |

### 안읽은 개수 (`NotificationUnreadCountData.unreadCount`)

Sidebar 뱃지 표시에 사용. 최초 조회 이후에는 `useAlarmStore`에서 클라이언트 계산으로 증감된다(4.2 참고).

### 실시간 이벤트 페이로드 (WebSocket, REST 응답과 별개 구조)

| 이벤트 | 필드 |
|---|---|
| `TASK_COMMENT_MENTIONED` | `eventType`, `workspaceId`, `taskId`, `taskTitle`, `commentId`, `actorUserId`, `recipientUserId`, `occurredAt` |
| `APPROVAL_LINE_ACTIVATED` | `eventType`, `documentId`, `documentTitle`, `approverId`, `activatedAt` |

`AlarmRealtimeProvider`는 이 중 토스트 문구 생성에 필요한 `taskTitle`/`documentTitle`만 사용한다.

---

## 6. 컴포넌트 구성

기능 단위로 분해했을 때 필요한 컴포넌트 목록과 각자의 책임.

| 컴포넌트 | 책임 |
|---|---|
| **(page.tsx)** | 목록 화면 셸(서버 컴포넌트). `getNotificationListAction()`으로 첫 페이지를 조회해 `AlarmContainer`에 초기값(`initialAlarms`, `initialHasNext`, `loadError`)으로 전달 |
| **AlarmContainer** | 클라이언트 컴포넌트. `alarms`/`page`/`hasNext`/`isLoadingMore` state를 소유하고 `handleItemClick`(읽음 처리)/`handleDelete`(개별 삭제)/`handleDeleteRead`(일괄 삭제)/`handleLoadMore`(다음 페이지 조회)를 각 action과 연결. 성공 시 로컬 state 갱신 + 필요 시 `useAlarmStore.decrementUnreadCount()`, 실패 시 `toast.error` |
| **AlarmHeader** | 화면 타이틀 + `읽은 알림 삭제` 버튼. `onDeleteRead` prop 호출 |
| **AlarmList** | 알림 목록(클라이언트 컴포넌트). 항목별 읽음/안읽음 표시, 항목 클릭 시 `onItemClick`, 삭제 버튼 클릭 시 `onDelete` 호출, 빈 상태 표시. `hasNext`가 참이면 목록 끝에 sentinel을 두고 `IntersectionObserver`로 `onLoadMore` 호출 |
| **AlarmRealtimeProvider** | Server Layout에서 런타임 API 주소를 전달받는 WebSocket 연결/구독 Provider. `getCurrentUserIdAction`으로 사용자 id를 얻어 STOMP 연결·구독하고, 이벤트 수신 시 toast 표시 + `useAlarmStore.incrementUnreadCount()` 호출. 화면에 아무것도 렌더링하지 않는다(`return null`) |

### 관계

```
(user)/layout.tsx
├── Sidebar                         (unreadNotificationCount ← useAlarmStore, 최초 1회 getUnreadNotificationCountAction)
├── {children}
│   └── alarm/page.tsx              (목록 화면, /alarm, getNotificationListAction으로 초기 데이터 조회)
│       └── AlarmContainer          (alarms/page/hasNext state, action 호출 + useAlarmStore 갱신)
│           ├── AlarmHeader         (읽은 알림 삭제 버튼 → onDeleteRead)
│           └── AlarmList           (항목 클릭 → onItemClick, 삭제 아이콘 → onDelete, sentinel → onLoadMore)
├── MemoContainer
└── AlarmRealtimeProvider           (WebSocket 구독, useAlarmStore.incrementUnreadCount)
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 알림 데이터 | 목록 조회·읽음 처리·삭제 | 구현 완료(`getNotificationListAction` 등 5개 action) |
| 안읽은 개수 상태 | `src/store/useAlarmStore.ts`(Zustand). Sidebar와 `AlarmRealtimeProvider`가 공유 | 구현 완료 |
| 무한 스크롤 상태 | `AlarmContainer`의 `page`/`hasNext`/`isLoadingMore` state | 구현 완료 |
| WebSocket 구독 상태 | `AlarmRealtimeProvider` 내부의 STOMP `Client` 인스턴스(컴포넌트 언마운트 시 `deactivate`) | 구현 완료 |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 목록 항목 | 읽음 / 안읽음 |
| 목록 로딩 | 정상 / 조회 실패("알림을 불러오지 못했습니다") |
| 무한 스크롤 | 더 불러올 수 있음(`hasNext: true`) / 마지막 페이지(`hasNext: false`) |
| WebSocket 연결 | 로그인 사용자 id 확인 후 연결 / 사용자 id 없음(비로그인) 시 연결하지 않음 |

---
