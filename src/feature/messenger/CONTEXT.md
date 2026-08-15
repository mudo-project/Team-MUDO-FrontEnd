# Messenger(메신저) Domain — CONTEXT
> 배치 경로: `src/feature/messenger/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 메신저 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.

---

## 1. 개요

사용자 간 1:1 또는 그룹 채팅과, 채팅방을 매개로 한 업무지시를 다루는 도메인.

채팅으로 대화하는 것과 별개로, 채팅방 안에서 담당자·마감일을 지정해 업무를 지시하고, 지시한/받은 업무의 진행 현황을 추적할 수 있는 것이 이 도메인의 핵심 기능이다.

### 핵심 제약

- 메시지와 업무지시 카드는 백엔드에서 완전히 별개의 리소스다(별도 API, 별도 페이지네이션 커서). 채팅방 화면의 "하나로 이어진 대화 흐름"은 프론트가 둘을 조회해 `createdAt` 기준으로 합친 결과이며, 방마다 첫 페이지(기본 20건)만 가져와 합치므로 그 이상 오래된 항목은 빠질 수 있다.
- 받은/전달 업무 목록도 같은 이유로 실제 집계 API가 없다. 내가 속한 모든 채팅방을 순회 조회해 프론트에서 합친 결과다.
- 업무지시 수정/삭제, 완료 처리 버튼은 각각 등록자 본인·미완료 담당자 본인에게만 노출되어야 한다 — 실제로 그렇게 구현되어 있다(노출 조건은 로그인 사용자 id와 `assignerId`/`assignees[].userId` 비교).
- 로그인 사용자 id는 `accessToken`의 JWT payload를 디코딩해 얻는다(`getCurrentUserIdAction`). payload의 사용자 id claim명(`userId`/`sub`/`id` 순으로 시도)은 백엔드에 공식 확인받지 않은 상태다 — 실제 로그인 계정 기준으로는 정상 동작을 확인했다.
- 사진·파일 첨부는 전송 로직이 없다. 첨부 업로드에 필요한 presigned URL 발급 계약이 아직 없다.

### 진입점 및 라우팅

- Sidebar의 메신저 메뉴(`src/components/layout/Sidebar.tsx`, `href: "/messenger"`). 메뉴 뱃지는 `useMessengerUnreadStore`(`src/store/useMessengerUnreadStore.ts`)의 `unreadCount`를 표시한다.
- `src/app/(user)/messenger/layout.tsx`가 `MessengerRealtimeProvider`로 감싼 좌측 사이드바(`MessengerSidebar`)를 상시 렌더링하고, 우측 `{children}`에 선택된 채팅방을 렌더링한다. 좌측 사이드바는 라우트 이동과 무관하게 리마운트되지 않는다.
- `src/app/(user)/messenger/page.tsx`: 서버 컴포넌트로 `getChatRoomsAction()`을 호출해 참여 중인 채팅방 목록을 가져오고, 첫 번째 채팅방으로 `redirect`한다. 참여 중인 채팅방이 없으면 안내 문구만 표시한다.
- `src/app/(user)/messenger/[chatId]/page.tsx`: `chatId`(백엔드 `roomId`, number)를 숫자로 변환해 `ChatRoom roomId={...}`를 렌더링한다.

### 데이터 연동 계층

- `src/feature/messenger/type.ts` — API 요청/응답 인터페이스. `export` 없이 선언되어 프로젝트 전역에서 import 없이 바로 참조된다(다른 도메인 `type.ts`와 같은 스타일).
- `src/service/messenger.service.ts` — `fetchWithAuth` 기반 API 호출(채팅방 생성/목록/참여자, 메시지 조회/전송/수정/삭제, 업무지시 카드 조회/등록/수정/삭제/완료, 사용자 검색).
- `src/feature/messenger/actions.ts` — 위 service를 감싼 Server Action. 컴포넌트는 이 액션만 호출하고 service를 직접 부르지 않는다. `getCurrentUserIdAction`(JWT 디코딩)도 여기 있다.
- `src/feature/messenger/utils.ts` — API 실데이터와 무관하게 프론트가 화면 표시를 위해 만든 타입(`FeedItem`, `RoomTaskCard` 등)과 가공 헬퍼(`getInitials`, `formatChatTime`, `formatTimeOnly`, `formatFeedDateDivider`, `isSameDay`, `getFeedSearchText`).
- `src/feature/messenger/components/MessengerRealtimeProvider.tsx` — STOMP 연결과 구독을 관리하는 Provider. 자세한 내용은 4.9.

### 화면 레이아웃

메신저 화면은 좌우 2단으로 나뉜다.

- **좌측**: 채팅/업무 사이드바. 상단에 채팅·업무·채팅방 추가 버튼이 있고, 하단 목록 영역은 선택된 탭(채팅/업무)에 따라 내용이 교체된다.
- **우측**: 선택된 채팅방의 대화 화면.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **좌측 사이드바** | 채팅 목록 또는 업무 목록을 보여주는 영역. 상단 탭(채팅/업무)에 따라 내용이 바뀐다 |
| **채팅 탭** | 좌측 사이드바 상단 버튼. 선택 시 하단이 채팅방 목록으로 전환 |
| **업무 탭** | 좌측 사이드바 상단 버튼. 클릭 시 바로 아래에 받은 업무/전달한 업무를 고르는 드롭다운이 뜬다 |
| **새 채팅 모달** | 채팅방 추가 버튼 클릭 시 나타나는, 인원을 선택해 채팅방을 만드는 모달 |
| **받은 업무** | 다른 사람이 나에게 지시한 업무 목록(내가 담당자로 포함된 업무지시) |
| **전달한 업무** | 내가 다른 사람에게 지시한 업무 목록(내가 등록자인 업무지시) |
| **업무지시** | 채팅방 내에서 `/` 입력 또는 `+` 버튼으로 진입해 작성하는, 담당자·마감일이 지정된 업무 |
| **업무지시 상세조회 모달** | 받은/전달한 업무 목록, 채팅방 업무지시 카드 세 곳에서 공통으로 열리는 업무지시 상세 모달 |
| **마감 초과** | 받은 업무의 마감일이 지났는데 완료 처리되지 않은 상태 |
| **통합 피드** | 채팅방 화면에 보이는, 메시지와 업무지시 카드를 시간순으로 합친 화면 표시용 목록(`FeedItem[]`) |

---

## 3. 화면 구성

```
┌─ 메신저 화면 ────────────────────────────────────────────────┐
│ [좌측 사이드바]              │ [우측 채팅방]                  │
│  [채팅] [업무] [채팅방 추가]  │  채팅방 제목  참여자 수  검색  참여자목록 │
│ ──────────────────────────  │ ──────────────────────────────  │
│  (채팅 탭인 경우)             │  상대방: 이름 · 내용 · 시간 · 안읽음 수 │
│   검색바                     │  나: 내용 · 시간 (우클릭 시 수정/삭제) │
│   채팅 목록                  │  [업무지시 카드]                │
│                              │ ──────────────────────────────  │
│  (업무 탭 클릭 시)            │  [+] [입력창] "/" 입력 또는 + 클릭 시 │
│   업무 버튼 바로 아래에        │       업무지시/사진/파일 메뉴 노출     │
│   [받은 업무][전달한 업무]     │                                  │
│   드롭다운(가로 배치)          │                                  │
└──────────────────────────────────────────────────────────────┘
```

### 좌측 사이드바 — 공통

`MessengerSidebar`가 상단 탭 행(채팅 / 업무 / 채팅방 추가, 높이 51px)을 소유하며, 우측 `ChatRoomHeader`와 같은 높이라 하단 경계선이 나란히 맞는다.

### 좌측 사이드바 — 채팅 탭

검색바, 채팅 목록으로 구성. `getChatRoomsAction()`으로 조회한 참여 중인 채팅방 목록(`MessengerRoomListItemData[]`)을 렌더링하며, 각 항목은 채팅방 이름(`name`, DM은 상대방 이름·그룹은 방 이름)·마지막 메시지 미리보기(`lastMessagePreview`)·마지막 메시지 시각(`lastMessageAt`)·안읽은 메시지 수(`unreadCount`)를 표시한다. 검색바는 이름 기준 클라이언트 사이드 필터링이다. 클릭하면 `next/link`로 해당 채팅방 라우트(`/messenger/[chatId]`)로 이동하며, 현재 라우트와 일치하는 항목은 강조 배경으로 표시된다.

### 좌측 사이드바 — 업무 탭

"업무" 버튼을 클릭하면 그 버튼 바로 아래에 **absolute로 뜨는 드롭다운**이 나타난다. 드롭다운은 "받은 업무"/"전달한 업무" 두 항목을 **가로로** 나열하며, 하나를 선택하면 드롭다운이 닫히고 좌측 사이드바 하단이 해당 업무 목록으로 바뀐다. 다시 다른 목록으로 바꾸려면 "업무" 버튼을 한 번 더 눌러 드롭다운을 다시 띄운다.

두 목록 모두 `TaskSidebar`가 내가 속한 모든 채팅방을 순회해 각 방의 업무지시 카드를 조회(`getChatRoomsAction` + 방마다 `getTaskCardsAction`)한 뒤 하나로 합친 `RoomTaskCard[]`를 기반으로 한다.

#### 받은 업무 사이드바

검색바, 받은 업무 카드 목록(`ReceivedTaskList`, 로그인 사용자가 담당자로 포함된 카드만 필터링)으로 구성. 카드는 상단에 체크 아이콘 + "채팅방 이름 · 지시한 인원", 본문에 지시 내용, 하단 좌측에 마감일(로그인 사용자 본인이 미완료 상태이고 마감일이 지났으면 빨간색 "마감초과 날짜"), 하단 우측에 상태를 표시한다.

- 완료(본인 담당 완료): 초록 체크 아이콘 + `완료함`
- 미완료: `완료했습니다` 버튼 → `completeTaskCardAction(roomId, cardId)` 호출
- 카드의 제목·본문 영역 클릭 시 업무지시 상세조회 모달 노출 (`완료했습니다` 버튼은 별도 클릭 영역이라 상세조회를 열지 않는다)

#### 전달한 업무 사이드바

검색바, 전달한 업무 카드 목록(`SentTaskList`, 로그인 사용자가 등록자인 카드만 필터링)으로 구성. 카드는 상단에 체크 아이콘 + 채팅방 이름, 본문에 전달한 업무 내용, 하단에 "완료 N/M" 텍스트 + 진행바를 표시한다.

- 카드의 제목·본문 영역 클릭 시 업무지시 상세조회 모달 노출

### 새 채팅 모달

검색바, "소속 인원" 목록, 채팅방 제목(선택) 입력으로 구성.

- 검색바 입력마다 `searchUsersAction(keyword)`(`/api/users` 조회)를 호출해 일치하는 소속 인원을 실시간으로 가져온다
- 일치하는 인원이 없으면 "일치하는 인원이 없습니다" 표시
- 인원 클릭 시 체크박스로 선택 상태 표시(다중 선택)
- 담당자를 1명 이상 선택하기 전에는 `만들기` 버튼이 비활성(회색) 상태
- `만들기` 클릭 시 `createChatRoomAction(participantIds, name?)`으로 채팅방을 생성하고, 성공 토스트 후 생성된(또는 기존 DM이 재사용된) `chatRoomId`로 이동한다

### 우측 채팅방

상단(채팅방 제목·참여자 수·검색·참여자 목록), 대화 영역, 하단 입력 영역으로 구성.

- **검색**: 헤더의 검색 아이콘을 클릭하면 제목 영역이 검색 입력창으로 바뀐다. 입력한 검색어로 현재 채팅방의 통합 피드(텍스트 메시지 + 업무지시 카드 내용)를 실시간 필터링하고, 결과가 없으면 "검색 결과가 없습니다"를 표시한다. X 버튼을 누르면 검색어를 지우고 원래 헤더로 돌아온다.
- **참여자 목록**: 헤더의 참여자 아이콘(사람 그룹 아이콘)을 클릭하면 `getChatRoomMembersAction(roomId)`으로 조회한 참여자 목록이 채팅방 우측 사이드바(전체 높이, `w-72`)로 열린다. 참여자 수(헤더에 표시되는 "참여자 N명")도 같은 조회 결과를 사용한다.
- **메시지 표시**: 상대방 메시지는 이름·내용·시간·안읽은 인원 수, 내 메시지는 내용·시간만 표시. "내 메시지" 여부는 메시지의 `senderId`를 로그인 사용자 id와 비교해 판단한다. 시간은 날짜 없이 시:분만 표시하며(`formatTimeOnly`), 통합 피드에서 날짜가 바뀌는 지점마다 그 앞에 중앙 정렬된 날짜 구분선("YYYY년 M월 D일 (요일)", `formatFeedDateDivider`)이 표시된다.
- **자동 스크롤**: `MessageList`는 피드 목록 맨 아래에 sentinel을 두고, `feed`가 바뀔 때마다(메시지 전송·수신, 업무지시 등록 등) 그 위치로 스크롤을 이동시켜 항상 최신 항목이 보이게 한다.
- **내 메시지 수정/삭제**: 내 메시지를 **우클릭**하면 그 자리에 수정/삭제 메뉴가 뜨고, 메뉴 바깥을 클릭하면 자동으로 닫힌다(호버로는 뜨지 않는다). `수정`은 말풍선을 인라인 textarea로 바꿔 `updateMessageAction`으로 저장하고, 수정된 메시지는 "(수정됨)" 표시가 붙는다. `삭제`는 `deleteMessageAction`(소프트 삭제)을 호출하며, 삭제된 메시지는 "삭제된 채팅입니다"로 대체 표시된다.
- **업무지시 카드**: 채팅방 내 업무지시는 본인이 등록한 경우 다른 내 메시지와 같은 오른쪽 정렬선에 맞춰 표시되고, 다른 사람이 등록한 경우 아바타·이름과 함께 좌측 정렬로 표시된다. 클릭하면 업무지시 상세조회 모달이 뜬다.
- **입력창 첨부 메뉴**: 입력창에 `/`를 입력하거나 좌측 `+` 버튼을 클릭하면 입력창 바로 위, 입력창과 같은 너비로 업무지시/사진/파일 메뉴가 뜬다.
  - `업무지시` 클릭 → 업무지시 작성 모달
  - `사진`/`파일` 클릭 → 네이티브 파일 선택 창만 노출된다(핵심 제약 참고).

### 업무지시 작성/수정 모달

내용(textarea), 담당자(+ 추가), 마감일(선택, date input)로 구성. 현재 채팅방(`roomId`)을 기준으로 동작하며, `editingCard` prop 유무로 작성/수정 모드를 겸한다.

- `+ 추가` 버튼을 클릭하면 바로 아래에 담당자 선택 드롭다운이 뜬다. 드롭다운은 이름 검색창 + "이 채팅방 참여자만 지정할 수 있습니다" 안내 + `getChatRoomMembersAction(roomId)`로 조회한 채팅방 참여자 목록으로 구성되며, 검색 결과가 없으면 "일치하는 인원이 없습니다"를 표시한다. 후보 목록은 로그인 사용자 본인과 이미 담당자로 선택된 인원을 제외하고 보여준다.
- 참여자를 클릭하면 담당자로 선택되어 `담당자` 영역에 칩(이름 + 제거 버튼)으로 추가되고, 드롭다운은 자동으로 닫힌다. 드롭다운이 열려 있는 동안 바깥 영역을 클릭해도 닫힌다.
- 마감일 입력은 `onKeyDown`으로 Tab을 제외한 키 입력을 막아, 키보드로 직접 타이핑하지 못하고 네이티브 달력 피커로만 선택할 수 있다.
- 작성 모드에서 `등록` 클릭 시 `createTaskCardAction`, 수정 모드에서 `수정 완료` 클릭 시 `updateTaskCardAction`을 호출한다. 성공하면 토스트를 띄우고 모달을 닫은 뒤 목록을 다시 불러온다.

### 업무지시 상세조회 모달

채팅방 업무지시 카드, 받은 업무 목록, 전달한 업무 목록 세 진입점이 모두 이미 조회되어 있는 `MessengerTaskCardItemData`(`card` prop)를 그대로 `TaskDetailModal`에 넘겨 렌더링한다.

표시 항목: 최상단(체크 아이콘 + "업무지시" + 채팅방 이름(전달된 경우)·지시자 이름, X 버튼), 본문(지시 내용), 담당자 칩 목록, 마감일, 등록일시, 완료 현황("N/M명 완료" + 진행바 + 담당자별 완료 여부 칩).

- 로그인 사용자가 등록자(`card.assignerId`)면 헤더에 테두리로 구분되는 `수정`/`삭제` 버튼이 나타난다. `수정`은 모달이 `TaskCreateModal`의 수정 모드로 전환되고, `삭제`는 `TwoButtonModal` 확인 후 `deleteTaskCardAction`을 호출하고 성공/실패 토스트를 띄운다.
- 로그인 사용자가 아직 완료하지 않은 담당자 본인이면 하단에 `완료 처리` 버튼이 나타나 `completeTaskCardAction(roomId, cardId)`을 호출한다.

---

## 4. 기능 목록

### 4.1 사이드바 탭 전환

| 기능 | 트리거 | 동작 |
|---|---|---|
| 채팅 탭 전환 | 좌측 상단 `채팅` 클릭 | 하단 사이드바가 검색바 + 채팅 목록으로 전환 |
| 업무 드롭다운 열기/닫기 | 좌측 상단 `업무` 클릭 | 업무 버튼 바로 아래에 받은 업무/전달한 업무 드롭다운(가로 배치) 노출. 다시 클릭 시 토글 |
| 받은 업무 전환 | 드롭다운에서 `받은 업무` 클릭 | 드롭다운 닫힘 + 좌측 사이드바 하단이 받은 업무 목록으로 전환 |
| 전달한 업무 전환 | 드롭다운에서 `전달한 업무` 클릭 | 드롭다운 닫힘 + 좌측 사이드바 하단이 전달한 업무 목록으로 전환 |

### 4.2 채팅방 생성

| 기능 | 트리거 | 동작 |
|---|---|---|
| 새 채팅 모달 열기 | 좌측 상단 `채팅방 추가` 클릭 | 검색바·소속 인원·채팅방 제목(선택) 입력 모달 노출 |
| 인원 검색 | 모달 내 검색바 입력 | `searchUsersAction(keyword)`으로 이름이 일치하는 소속 인원 조회 |
| 검색 결과 없음 안내 | 검색 결과 0건 | "일치하는 인원이 없습니다" 표시 |
| 인원 선택 | 소속 인원 클릭 | 체크박스로 선택 상태 표시(다중 선택 가능) |
| 만들기 버튼 활성화 | 담당자 1명 이상 선택 | `만들기` 버튼이 활성(진한 배경) 상태로 전환 |
| 채팅방 생성 | `만들기` 클릭 | `createChatRoomAction` 호출, 성공 토스트 후 생성된 채팅방으로 이동, 실패 시 에러 토스트 |

### 4.3 채팅 목록

| 기능 | 트리거 | 동작 |
|---|---|---|
| 채팅 목록 검색 | 좌측 검색바 입력 | 채팅방 이름 기준 클라이언트 사이드 필터링 |
| 채팅방 진입 | 채팅 목록 항목 클릭 | `/messenger/[chatId]`로 이동, 우측 채팅방 화면 전환, 목록에서 현재 항목 강조 |

### 4.4 받은 업무

| 기능 | 트리거 | 동작 |
|---|---|---|
| 업무 검색 | 받은 업무 사이드바 검색바 입력 | 업무지시 내용 기준 클라이언트 사이드 필터링 |
| 업무 완료 처리 | 목록 항목 `완료했습니다` 클릭 | `completeTaskCardAction(roomId, cardId)` 호출 후 목록을 다시 불러온다 |
| 업무지시 상세조회 | 카드의 제목·본문 클릭 | 업무지시 상세조회 모달 노출 |

### 4.5 전달한 업무

| 기능 | 트리거 | 동작 |
|---|---|---|
| 업무 검색 | 전달한 업무 사이드바 검색바 입력 | 업무지시 내용 기준 클라이언트 사이드 필터링 |
| 업무지시 상세조회 | 카드의 제목·본문 클릭 | 업무지시 상세조회 모달 노출 |
| 모달 닫기 | 모달 최상단 X 클릭 | 모달 닫힘 |

### 4.6 채팅방 대화

| 기능 | 트리거 | 동작 |
|---|---|---|
| 채팅방 내 메시지 검색 | 헤더 검색 아이콘 클릭 → 검색어 입력 | 헤더가 검색창으로 전환되고 통합 피드가 실시간 필터링됨. 결과 없으면 "검색 결과가 없습니다" |
| 검색 닫기 | 검색창의 X 클릭 | 검색어 초기화, 원래 헤더로 복귀 |
| 참여자 목록 확인 | 헤더 참여자 아이콘 클릭 | `getChatRoomMembersAction(roomId)` 조회 결과를 우측 참여자 목록 사이드바(전체 높이)로 노출, 다시 클릭 또는 패널의 X로 닫힘 |
| 메시지 전송 | 입력창에 입력 후 전송 버튼 | `sendMessageAction(roomId, content)` 호출 후 피드를 다시 불러오고, 피드 맨 아래로 자동 스크롤된다 |
| 메시지 우클릭 메뉴 | 내 메시지 우클릭 | 수정/삭제 메뉴 노출, 메뉴 바깥 클릭 시 자동으로 닫힘 |
| 메시지 수정 | 메뉴에서 `수정` 클릭 | 말풍선이 인라인 textarea로 전환, 저장 시 `updateMessageAction`으로 반영 |
| 메시지 삭제 | 메뉴에서 `삭제` 클릭 | `deleteMessageAction`으로 소프트 삭제, 피드가 "삭제된 채팅입니다"로 갱신 |

> 상대방이 보낸 메시지·수정·삭제·업무지시 등록/수정/삭제/완료는 실시간(WebSocket/STOMP)으로 자동 반영된다. 자세한 구독 방식은 4.9 참고.

### 4.7 업무지시

| 기능 | 트리거 | 동작 |
|---|---|---|
| 첨부 메뉴 열기 | 입력창에 `/` 입력, 또는 `+` 버튼 클릭 | 입력창과 같은 너비로 업무지시/사진/파일 메뉴 노출(입력창 바로 위) |
| 업무지시 작성 모달 열기 | 첨부 메뉴에서 `업무지시` 클릭 | 내용·담당자·마감일 입력 모달 노출 |
| 담당자 추가 드롭다운 | 작성 모달의 `+ 추가` 클릭 | 이름 검색 + `getChatRoomMembersAction(roomId)` 조회 결과(채팅방 참여자, 로그인 사용자 본인·이미 선택된 담당자 제외) 드롭다운 노출 |
| 담당자 선택 | 드롭다운에서 참여자 클릭 | 담당자 칩으로 추가, 드롭다운 자동으로 닫힘, 칩의 X로 제거 |
| 담당자 드롭다운 닫기 | 드롭다운 바깥 영역 클릭 | 드롭다운 닫힘 |
| 업무지시 등록 | 모달에서 `등록` 클릭 | `createTaskCardAction` 호출, 성공 토스트 후 모달을 닫고 피드를 다시 불러온다 |
| 업무지시 상세조회 | 채팅방 업무지시 카드, 받은/전달 업무 카드 클릭 | 업무지시 상세조회 모달 노출 |
| 업무지시 수정 | 상세조회 모달에서 `수정` 클릭(로그인 사용자가 등록자인 경우만 노출) | `TaskCreateModal`의 수정 모드로 전환(내용·담당자·마감일 프리필), 저장 시 `updateTaskCardAction` 호출 후 성공 토스트 |
| 업무지시 삭제 | 상세조회 모달에서 `삭제` 클릭(로그인 사용자가 등록자인 경우만 노출) | `TwoButtonModal`로 확인 후 `deleteTaskCardAction`(소프트 삭제) 호출, 성공/실패 토스트 |
| 업무지시 완료 처리 | 상세조회 모달에서 `완료 처리` 클릭(로그인 사용자가 미완료 담당자 본인인 경우만 노출) | `completeTaskCardAction(roomId, cardId)` 호출, 성공 시 모달을 닫고 목록을 다시 불러온다 |

### 4.8 파일·사진 전송

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 전송 옵션 열기 | 입력창 좌측 `+` 버튼 클릭, 또는 `/` 입력 | 업무지시/사진/파일 선택 옵션 노출 | 구현 완료 |
| 사진 선택 | 첨부 메뉴에서 `사진` 클릭 | `accept="image/*"` 파일 선택 창(OS 네이티브 다이얼로그) 노출 | 구현 완료 |
| 파일 선택 | 첨부 메뉴에서 `파일` 클릭 | 파일 선택 창(OS 네이티브 다이얼로그) 노출 | 구현 완료 |
| 파일 전송 | 파일 선택 후 | 선택한 파일을 채팅방에 전송 | 미구현 — presigned URL 발급 계약이 없음 |

### 4.9 실시간 반영

`MessengerRealtimeProvider`(`src/feature/messenger/components/MessengerRealtimeProvider.tsx`)가 `(user)/messenger/layout.tsx`에서 사이드바·채팅방을 함께 감싸며, 메신저 화면에 머무는 동안 STOMP 연결 하나를 유지한다.

- **연결**: `@stomp/stompjs` + `sockjs-client`로 `${NEXT_PUBLIC_API_BASE_URL}/ws`에 연결한다. 인증은 SockJS의 초기 핸드셰이크 HTTP 요청에 브라우저가 자동으로 실어 보내는 `accessToken` httpOnly 쿠키를 백엔드 `JwtHandshakeInterceptor`가 읽는 방식이라, 프론트가 토큰 값을 따로 다루지 않는다.
- **구독 범위**: 내가 속한 모든 채팅방(`getChatRoomsAction` 결과)의 `/topic/messenger/rooms/{roomId}`를 동시에 구독한다. `ChatSidebar`가 목록을 조회할 때마다, `TaskSidebar`가 방을 순회할 때마다, `ChatRoom`이 현재 보고 있는 방마다 각각 `ensureSubscribed(roomId)`를 호출해 구독을 보장한다(이미 구독된 방은 다시 구독하지 않는다).
- **이벤트 처리 방식**: 이벤트 payload가 화면을 그대로 그리기엔 정보가 부족해서(예: `MESSAGE_SENT`에 발신자 이름 없음), 이벤트를 "무언가 바뀌었다"는 신호로만 쓰고 실제 화면 갱신은 해당 화면이 다시 조회하는 방식으로 처리한다.
  - `ChatRoom`: 현재 방의 `MESSAGE_SENT`/`MESSAGE_EDITED`/`MESSAGE_DELETED`는 메시지 목록을, `TASK_CARD_*`는 업무지시 카드 목록을 다시 조회한다.
  - `ChatSidebar`: 모든 이벤트(`MESSAGE_READ` 포함)에 채팅방 목록을 다시 조회한다(마지막 메시지 미리보기·안읽음 수 갱신). `getChatRoomsAction`만 호출하고 메시지 목록을 조회하지 않아 무한 루프 위험이 없다.
  - `TaskSidebar`: `TASK_CARD_*` 이벤트에 집계 목록을 다시 조회한다.
- **`MESSAGE_READ` 예외 처리**: 커서 없는 메시지 목록 조회(`getMessagesAction`, 첫 페이지) 자체가 읽음 처리를 유발해 `MESSAGE_READ` 이벤트를 다시 브로드캐스트한다. `ChatRoom`이 이 이벤트로도 재조회하면 무한 루프가 되므로, `ChatRoom`은 `MESSAGE_READ`를 의도적으로 무시한다.
- **한계**: 연결 상태(연결됨/끊김)를 컴포넌트 바깥으로 노출하지 않아, 소켓이 끊겨도 화면에는 아무 표시가 없다. 재연결 시도 횟수 제한도 없어 무한정 재시도한다(`reconnectDelay: 5000`).

#### 사이드바 메신저 뱃지용 별도 연결

`MessengerUnreadRealtimeProvider`(`src/feature/messenger/components/MessengerUnreadRealtimeProvider.tsx`)는 위 `MessengerRealtimeProvider`와 별개의 STOMP 연결을 열어 `(user)/layout.tsx`(메신저 화면 밖 포함, 앱 전체 루트 레이아웃)에 상시 마운트된다. `AlarmRealtimeProvider`와 같은 위치·같은 패턴이다.

- 마운트 시 및 STOMP 연결 시마다 `getChatRoomsAction()`으로 전체 채팅방의 `unreadCount` 합계를 구해 `useMessengerUnreadStore`에 반영하고, 조회된 각 방의 `/topic/messenger/rooms/{roomId}`를 구독한다.
- 구독 중인 방에서 이벤트가 오면 다시 `getChatRoomsAction()`으로 합계를 재계산한다(백엔드에 유저 단위 안읽음 합계 API가 없어 방 목록을 순회 재조회하는 방식).
- 새로 생성된 채팅방은 다음 이벤트(또는 재연결) 시 재조회 결과에 포함되어 자동으로 구독된다.
- Sidebar는 이 store의 `unreadCount`를 메신저 메뉴 뱃지로 그대로 표시한다.

---

## 5. 데이터

### 채팅방 목록 (`MessengerRoomListItemData`, `type.ts`)

`getChatRoomsAction()`으로 조회한다. `id`(number, 라우트 `/messenger/[chatId]`에 사용), `name`, `type`(`DM`/`GROUP`), `unreadCount`, `lastMessagePreview`, `lastMessageAt`, `createdAt`을 담는다.

### 채팅방 참여자 (`MessengerRoomMemberData`, `type.ts`)

`getChatRoomMembersAction(roomId)`으로 조회한다. `userId`, `name`, `lastReadAt`을 담으며 참여자 목록 사이드바·업무지시 담당자 후보로 쓰인다. 채팅방 단건 조회 API가 없어 채팅방 이름은 이 응답이 아니라 채팅방 목록 조회 결과에서 가져온다.

### 통합 피드 (`FeedItem` = `FeedTextItem` \| `FeedTaskItem`, `utils.ts`)

채팅방 화면은 메시지(`getMessagesAction`)와 업무지시 카드(`getTaskCardsAction`)를 각각 조회한 뒤 `createdAt` 기준으로 정렬해 하나의 배열로 합친 `FeedItem[]`을 렌더링한다. `FeedTextItem`은 `MessengerMessageItemData`를 그대로 담고 `own`(로그인 사용자가 발신자인지)을 추가한 형태이고, `FeedTaskItem`은 `MessengerTaskCardItemData`(`card` 필드)와 `own`(로그인 사용자가 등록자인지)을 담는다. `getFeedSearchText(item)` 헬퍼가 채팅방 내 검색에 쓰일 문자열을 반환한다.

`formatChatTime(iso)`는 백엔드가 주는 ISO 시각을 "오전/오후 h:mm" 또는 "M.d 오전/오후 h:mm" 형태로 변환하며, 채팅방 대화 피드가 아닌 채팅 목록·업무 목록 등에서 쓰인다. `formatTimeOnly(iso)`는 날짜 없이 "오전/오후 h:mm"만 반환하며 채팅방 대화 피드(메시지·업무지시 카드)에서 쓰인다. `formatFeedDateDivider(iso)`는 대화 피드의 날짜 구분선 문구를, `isSameDay(isoA, isoB)`는 두 시각이 같은 날짜인지를 반환한다. `getInitials(name)`은 이름 앞 2글자를 아바타 이니셜로 변환한다.

### 방별 업무지시 집계 항목 (`RoomTaskCard`, `utils.ts`)

받은 업무 목록·전달한 업무 목록에서 쓰인다. `roomId`·`roomName`·`card`(`MessengerTaskCardItemData`)를 담는 얇은 래퍼로, `TaskSidebar`가 내가 속한 채팅방을 순회 조회한 뒤 어느 방에서 온 카드인지 알 수 있도록 방 정보를 붙인 것이다. `ReceivedTaskList`는 `card.assignees`에 로그인 사용자가 포함된 항목만, `SentTaskList`는 `card.assignerId`가 로그인 사용자인 항목만 걸러서 보여준다.

### 사용자 검색 (`MessengerUserSearchItemData`, `type.ts`)

`searchUsersAction(keyword?)`으로 `/api/users`를 조회한다. `userId`, `name`, `username`을 담으며 새 채팅 모달의 소속 인원 검색에 쓰인다.

---

## 6. 컴포넌트 구성

`src/feature/messenger/components/`에 실제로 존재하는 컴포넌트 기준.

| 컴포넌트 | 책임 |
|---|---|
| **MessengerSidebar** | 좌측 사이드바 셸(client). 채팅/업무 탭 상태, 업무 드롭다운 열림 상태, 새 채팅 모달 열림 상태를 소유. 탭에 따라 `ChatSidebar` 또는 `TaskSidebar` 렌더링 |
| **ChatSidebar** | 채팅 탭 하단 영역(client). `getChatRoomsAction()`으로 채팅방 목록을 불러와 상태로 소유하고, 검색어로 필터링해 `ChatList`에 전달. 실시간 이벤트 수신 시 목록을 다시 불러온다 |
| **ChatList** | 전달받은 `rooms`를 매핑해 `ChatListItem` 렌더링 |
| **ChatListItem** | 채팅방 목록 항목 1건(client, `next/link`). `MessengerRoomListItemData`를 받아 이름·미리보기·시각·안읽음 수를 표시하고, 현재 라우트와 비교해 활성 표시 |
| **ChatCreateModal** | 새 채팅 모달(client). `searchUsersAction`으로 소속 인원 검색, 다중 선택, `createChatRoomAction`으로 생성 후 성공 토스트 + 이동 |
| **TaskSidebar** | 업무 탭 하단 영역(client). 내가 속한 모든 채팅방을 순회해 업무지시 카드를 조회·병합(`RoomTaskCard[]`)하고, 검색어로 필터링해 `view` prop에 따라 `ReceivedTaskList`/`SentTaskList`에 전달 |
| **ReceivedTaskList** | 받은 업무 카드 목록(client). 전달받은 항목 중 로그인 사용자가 담당자인 것만 필터링해 렌더링, `완료했습니다` 클릭 시 `completeTaskCardAction` 호출, 카드 클릭 시 `TaskDetailModal` 오픈 |
| **SentTaskList** | 전달한 업무 카드 목록(client). 전달받은 항목 중 로그인 사용자가 등록자인 것만 필터링해 렌더링, 카드 클릭 시 `TaskDetailModal` 오픈 |
| **ChatRoom** | 우측 채팅방 셸(client). `roomId`를 받아 채팅방 정보(목록 조회 결과에서 찾음)·로그인 사용자 id·메시지·업무지시 카드를 불러오고, 이를 병합한 `FeedItem[]`과 검색어 상태를 소유해 Header/MessageList/MessageInput에 전달. 실시간 이벤트 수신 시 대응하는 목록을 다시 불러온다 |
| **ChatRoomHeader** | 채팅방 헤더(client). `roomId`로 참여자 목록을 조회해 참여자 수를 표시하고, 평시엔 제목·검색/참여자 아이콘, 검색 모드일 땐 검색 입력창으로 전환. 참여자 아이콘으로 `ChatMemberList` 토글 |
| **ChatMemberList** | 전달받은 참여자 목록을 렌더링하는 우측 사이드바(전체 높이, `w-72`) |
| **MessageList** | 전달받은 `feed`를 매핑해 `MessageItem` 렌더링, `roomId`·`currentUserId`·변경 콜백을 그대로 전달. 이전 항목과 날짜가 다른 지점마다 날짜 구분선을 함께 렌더링하고, `feed` 변경 시 맨 아래로 자동 스크롤 |
| **MessageItem** | 피드 항목 1건(client). `kind`가 `task`면 `TaskMessageCard`로 위임하고, 그 외엔 삭제됨/본인/상대방 상태를 렌더링. 본인 메시지는 우클릭(`onContextMenu`)으로 `MessageMenu`를 열어 인라인 수정(`updateMessageAction`) 또는 삭제(`deleteMessageAction`)를 수행 |
| **MessageMenu** | 내 메시지 메뉴. `onEdit`/`onDelete` 콜백을 받아 수정/삭제를 트리거 |
| **TaskMessageCard** | 채팅방 내 업무지시 카드(client). `card`·`own`·`currentUserId`·`roomId`를 받아 좌/우 정렬을 결정하고, 클릭 시 `TaskDetailModal` 오픈 |
| **TaskCompletionCard** | 완료 알림 카드(중앙 정렬). 실시간 이벤트를 화면 갱신 신호로만 쓰는 현재 구조상 생성되지 않으나 컴포넌트는 남아 있다 |
| **MessageInput** | 하단 입력 영역(client). `roomId`를 받아 `sendMessageAction`으로 전송, `/` 입력 감지 및 `+` 버튼으로 첨부 메뉴 토글, 숨겨진 `input[type=file]` 2개(사진/파일, 전송 로직 없음), `업무지시` 선택 시 `TaskCreateModal` 오픈 |
| **TaskCreateModal** | 업무지시 작성/수정 모달(client). `roomId`로 채팅방 참여자를 조회해 담당자 후보로 쓴다. `editingCard` prop이 없으면 작성 모드(`createTaskCardAction`), 있으면 그 값으로 입력값을 미리 채운 수정 모드(`updateTaskCardAction`)로 동작. 성공/실패 토스트 표시 |
| **TaskDetailModal** | 업무지시 상세조회 모달(client). 채팅방 업무지시 카드·받은 업무 목록·전달한 업무 목록 세 진입점이 공유하며, 로그인 사용자가 등록자면 수정/삭제, 미완료 담당자 본인이면 완료 처리 버튼을 보여준다. `수정` 선택 시 `TaskCreateModal`(수정 모드)로 전환, `삭제`는 `TwoButtonModal`로 확인 |
| **Avatar** | 아바타 이니셜 공용 컴포넌트 |
| **MessengerRealtimeProvider** | 메신저 레이아웃 전체를 감싸는 실시간 연동 Provider(client). STOMP 연결 하나를 유지하며, 내가 속한 모든 채팅방 구독과 이벤트 리스너 등록(`useMessengerRealtime`, `useMessengerRealtimeSubscription`, `useMessengerRealtimeRoomList`)을 제공 |
| **MessengerUnreadRealtimeProvider** | 사이드바 메신저 뱃지용 별도 Provider(client). `(user)/layout.tsx`에 상시 마운트되어 자체 STOMP 연결로 전체 채팅방 안읽음 합계를 `useMessengerUnreadStore`에 반영 |

> `TaskDetailModal`은 받은/전달 업무별로 분리하지 않고 세 진입점이 하나의 컴포넌트를 공유한다.
> 삭제 확인 모달(`TwoButtonModal`, `src/components/ui/TwoButtonModal.tsx`)은 다른 도메인과 공유하는 컴포넌트다. `TaskDetailModal`에서 쓸 때는 자체 z-index(999)가 상세조회 모달의 콘텐츠(z-1000)보다 낮아 뒤에 깔리는 문제가 있어, 감싸는 wrapper에 `z-[1100]`을 줘서 항상 위에 뜨도록 한다.

### 관계

```
(user)/messenger/layout.tsx
└── MessengerRealtimeProvider         (STOMP 연결 하나를 유지, 아래 전체를 감쌈)
    ├── MessengerSidebar
    │   ├── ChatSidebar                  (채팅 탭)
    │   │   └── ChatList
    │   │       └── ChatListItem[]       (→ /messenger/[chatId] 이동)
    │   ├── TaskSidebar                  (업무 탭 선택 시)
    │   │   ├── ReceivedTaskList         (받은 업무 선택 시)
    │   │   │   └── TaskDetailModal      (카드 클릭 시)
    │   │   └── SentTaskList             (전달한 업무 선택 시)
    │   │       └── TaskDetailModal      (카드 클릭 시)
    │   ├── (업무 드롭다운: 받은 업무 / 전달한 업무 — absolute, "업무" 버튼 아래)
    │   └── ChatCreateModal              (채팅방 추가 클릭 시)
    └── {children} = ChatRoom            (page.tsx 또는 [chatId]/page.tsx)
        ├── ChatRoomHeader
        │   └── ChatMemberList           (참여자 아이콘 클릭 시)
        ├── MessageList
        │   ├── MessageItem[]
        │   │   └── MessageMenu          (내 메시지 우클릭 시)
        │   ├── TaskMessageCard[]
        │   │   └── TaskDetailModal      (카드 클릭 시)
        │   └── TaskCompletionCard[]     (현재 생성되지 않음)
        └── MessageInput
            ├── input[type=file] × 2     (사진 accept=image/*, 파일 — 전송 로직 없음)
            └── TaskCreateModal          ("/" 또는 + → 업무지시 선택 시)
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 채팅방 라우팅 | `/messenger`(첫 채팅방으로 redirect), `/messenger/[chatId]` + 공용 `layout.tsx` | 구현 완료 |
| 채팅방 데이터 | 채팅방 목록·참여자 조회, 생성 | 구현 완료 |
| 메시지 데이터 | 채팅방별 메시지 조회, 전송/수정/삭제 | 구현 완료 |
| 업무지시 데이터 | 채팅방별 업무지시 카드 조회, 등록/수정/삭제/완료 처리 | 구현 완료 |
| 받은/전달 업무 집계 | 여러 채팅방을 가로지르는 업무지시 목록 | 구현 완료(핵심 제약 참고 — 프론트 순회 방식) |
| 소속 인원 검색 | 새 채팅 모달의 검색 대상 인원 목록 | 구현 완료 |
| 실시간 반영 | 상대방의 메시지/업무지시 변경을 즉시 반영 | 구현 완료(4.9 참고, 연결 끊김 UI 피드백은 없음) |
| 사진·파일 전송 | 첨부 업로드 후 메시지로 전송 | 미구현 — presigned URL 발급 계약 없음 |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 좌측 사이드바 탭 | 채팅 / 업무 |
| 업무 드롭다운 | 열림 / 닫힘 |
| 업무 탭 하위 뷰 | 받은 업무 / 전달한 업무 |
| 새 채팅 모달 | 열림 / 닫힘 |
| 받은 업무 카드 상태 | 완료 / 미완료 / 마감 초과 |
| 채팅방 내 검색 | 닫힘 / 열림(검색어 있음·없음) |
| 참여자 목록 사이드바 | 열림 / 닫힘 |
| 메시지 | 정상 / 수정됨 / 삭제됨 |
| 내 메시지 우클릭 메뉴 | 닫힘 / 열림(우클릭 시 열림, 바깥 클릭 시 닫힘) |
| 내 메시지 인라인 수정 | 닫힘 / 열림(메뉴의 `수정` 클릭 시 말풍선이 textarea로 전환) |
| 입력창 첨부 메뉴 | 닫힘 / 열림(`/` 입력 또는 `+` 클릭) |
| 업무지시 작성/수정 모달 | 열림 / 닫힘 |
| 업무지시 작성/수정 모달의 담당자 드롭다운 | 열림 / 닫힘 |
| 업무지시 상세조회 모달 | 열림 / 닫힘 |
| 업무지시 삭제 확인 모달 | 열림 / 닫힘 |

---
