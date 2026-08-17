# Workspace Domain — CONTEXT

> 배치 경로: `src/feature/workspace/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 워크스페이스 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: 워크스페이스 관리(4.1), 참여자 관리(4.2), 업무 관리(4.3), 업무 댓글(4.4), 반복 업무 템플릿(4.5), 내 업무 모아보기(4.6) 모두 실제 API(`src/feature/workspace/type.ts`·`actions.ts`, `src/service/workspace.service.ts`)에 연결되어 있다. 다만 아래 항목들은 코드에 존재하지만 실제로는 동작하지 않거나 사용되지 않는다 — `modals/EditTaskDueModal.tsx`(미사용, 라벨과 실제 동작 불일치), `components/WorkDelayItem.tsx`(미사용, 지연 카드는 `WorkItem`으로 대체됨), `MyWorkHeader.tsx`의 상태 필터(정의되지 않은 변수 참조로 렌더링 오류 가능성), `/workspace`·`/workspace/[id]` 두 라우트(빈 자리표시자). 자세한 내용은 6장 참고.

---

## 1. 개요

워크스페이스(팀/프로젝트 단위 협업 공간) 안에서 업무를 등록하고, 상태(대기/진행중/완료/지연)를 관리하며, 업무별로 댓글을 주고받는 도메인. approval처럼 독립된 라우트(`/workspace/*`)로 구성된 페이지형 도메인이며, memo처럼 다른 화면 위에 겹쳐 뜨는 컨테이너가 아니다.

### 핵심 제약

- 업무는 반드시 하나의 워크스페이스에 속하며, 워크스페이스 밖에서 단독으로 조회·생성될 수 없다.
- 업무 상태는 대기(`WAITING`) / 진행중(`IN_PROGRESS`) / 완료(`COMPLETED`) / 지연(`DELAYED`) 4가지다. 일별 보드에서 대기·진행중·완료는 3개 컬럼으로 나란히, 지연은 화면 하단에 별도 섹션으로 모아 표시된다.
- 컴포넌트 이름에 `Task`와 `Work` 두 접두어가 섞여 있지만(`TaskCreateButton`/`TaskAddButton` vs `WorkItem`/`WorkList`) 가리키는 데이터는 동일한 `WorkspaceTaskData`다 — 서로 다른 두 개념이 아니라 이름 규칙이 일관되지 않게 적용된 것뿐이다.
- 댓글에는 `@이름`으로 멘션을 입력할 수 있고, 멘션 대상 검색은 해당 워크스페이스의 참여자로만 범위가 제한된다.
- 워크스페이스 삭제에 대응하는 `recoverWorkspaceAction`(복구)이 정의되어 있어 삭제가 소프트 삭제일 가능성이 있지만, 이 도메인 어디에도 복구를 트리거하는 UI는 없다.

### 진입점

`src/app/(user)/workspace/layout.tsx`가 모든 `/workspace/*` 라우트에 `WorkspaceSidebar`를 공통으로 붙인다. 실질적인 진입 경로는 사이드바의 "내 업무 모아보기" 링크(`/workspace/my-works`)와, 워크스페이스별 `WorkspaceNavLink` 클릭(→ `recordWorkspaceRecentAccessAction` 기록 후 `/workspace/{id}/daily`로 이동) 두 가지다. bare 라우트인 `/workspace`와 `/workspace/[id]`는 빈 자리표시자만 렌더링해 직접 방문 시 아무 내용도 보이지 않는다(6장 참고).

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **워크스페이스** | 팀/프로젝트 단위 협업 공간. 이름과 참여자 목록을 가짐 |
| **업무** | 워크스페이스 안에서 관리되는 개별 할 일. 제목 · 등록자 · 마감일 · 상태를 가짐 (코드에서는 "Task"/"Work" 두 접두어로 혼용해 부름, 동일 개념) |
| **일별 보드** | 워크스페이스 상세의 기본 화면(`/workspace/[id]/daily`). 특정 날짜의 업무를 대기/진행중/완료/지연 4개 그룹으로 보여줌 |
| **반복 업무 템플릿** | 매주 특정 요일 또는 매월 1일에 상태 "대기"인 업무를 자동 생성하도록 미리 등록하는 설정(`/workspace/[id]/repeat`) |
| **참여자** | 워크스페이스에 소속된 구성원. 댓글 멘션 대상이자 추가/제거 관리 대상 |
| **진행 코멘트** | 업무 상세 패널에서 작성하는 댓글. 완료 체크·멘션·수정·삭제가 가능 |
| **내 업무 모아보기** | 특정 워크스페이스에 국한되지 않고, 워크스페이스 전체를 가로질러 업무를 모아 보는 화면(`/workspace/my-works`). 완료된 업무는 제외 |

---

## 3. 화면 구성

```
┌─ /workspace/* ──────────────────────────────────────────────────────┐
│ [WorkspaceSidebar]     │ [WorkspaceHeader] (워크스페이스별)              │
│  워크스페이스   [+]      │  이름 ✎   참여자: A,B,C 외 N명 (M명)            │
│  ───────────────       │  [참여자 관리][삭제][업무 등록][템플릿 등록]      │
│  내 업무 모아보기         │  [일별] [반복 템플릿]                          │
│  ───────────────       ├──────────────────────────────────────────┤
│  워크스페이스 A          │ (daily) [WorkspaceDailyHeader: ◀ 날짜 ▶]      │
│  워크스페이스 B          │  대기 | 진행중 | 완료   (3컬럼 보드)             │
│  ...                   │  ── 지연 (하단 별도 섹션) ──                    │
│                        │ (repeat) 반복 템플릿 목록                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 사이드바 (WorkspaceSidebar)

| 요소 | 설명 |
|---|---|
| 제목 "워크스페이스" | 접기/펼치기 가능(펼침 기본값) |
| "+" 버튼 | 권한 `WORKSPACE:CREATE` 보유 시에만 노출, `CreateWorkspaceModal` 오픈 |
| 내 업무 모아보기 | `/workspace/my-works`로 이동하는 고정 링크 |
| 워크스페이스 목록 | `WorkspaceNavLink` 반복. 권한 `WORKSPACE:READ_ALL` 보유 시 전체(`ALL`) 목록, 없으면 내가 속한(`MINE`) 목록만 조회 |

### 워크스페이스 헤더 (WorkspaceHeader)

| 요소 | 설명 |
|---|---|
| 이름 + 연필 아이콘 | `WorkspaceEditButton` → `EditWorkspaceModal` |
| 참여자 요약 | `Attend`. 5명 초과 시 "이름, 이름, ... 외 N명" 형태로 요약 |
| 툴바 | 참여자 관리(`WorkspaceAttendAddButton`) · 삭제(`WorkspaceDeleteButton`) · 업무 등록(`TaskCreateButton`) · 템플릿 등록(`TaskTemplateCreateButton`) |
| 탭 | "일별"(`/workspace/{id}/daily`) / "반복 템플릿"(`/workspace/{id}/repeat`), `TaskNavLink` |

### 일별 보드 (WorkspaceCt)

| 요소 | 설명 |
|---|---|
| 날짜 내비게이션 | `WorkspaceDailyHeader` — 이전/다음 날 이동 버튼, 날짜 클릭 시 `WorkCalendarModal` |
| 3컬럼 보드 | 대기/진행중/완료, `WorkList` + `WorkItem`. 각 컬럼 하단에 "업무 추가"(`TaskAddButton`) |
| 지연 섹션 | 화면 하단에 별도로 표시, "기한이 지난 업무입니다. 상태를 업데이트하거나 완료 처리해주세요." 안내 |
| 업무 상세 패널 | 업무 카드 클릭 시 우측에서 열리는 `ViewTask` |

### 반복 템플릿 (WorkspaceRepeatCt)

| 요소 | 설명 |
|---|---|
| 안내 문구 | 반복 주기 도래 시 "대기" 상태로 자동 생성됨을 설명 |
| 템플릿 목록 | `WorkTemplateItem` 반복 — 수정하기/삭제 |

### 내 업무 모아보기 (MyWorkHeader / MyWorkList)

| 요소 | 설명 |
|---|---|
| 상태 필터 | 전체/대기/진행중/지연 (완료 제외) |
| 워크스페이스 필터 | 전체 또는 특정 워크스페이스 |
| 목록 | 업무 제목/워크스페이스/기한/상태 컬럼, 무한 스크롤(`MyWorkItem`) |

---

## 4. 기능 목록

### 4.1 워크스페이스 관리 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 워크스페이스 목록 조회 | 사이드바 진입 | `getWorkspaceListAction`(권한에 따라 `MINE`/`ALL`) → `WorkspaceNavLink` 목록 |
| 워크스페이스 생성 | 사이드바 "+" (권한 `WORKSPACE:CREATE`) | `CreateWorkspaceModal`: 이름 + `@`검색으로 참여자 선택 후 제출 → `createWorkspaceAction`. 성공 시 목록 재조회 + 토스트 + 모달 닫힘 |
| 워크스페이스 이름 수정 | `WorkspaceHeader`의 연필 아이콘(`WorkspaceEditButton`) | `EditWorkspaceModal`: 현재 이름을 조회해 프리필 → `changeWorkspaceNameAction` 제출. 성공 시 상세·목록 쿼리 무효화 + 토스트 + 모달 닫힘, 실패 시 인라인 오류를 보여주고 모달 유지 |
| 워크스페이스 삭제 | `WorkspaceHeader`의 "삭제" 버튼 | `TwoButtonModal` 확인 후 `deleteWorkspaceAction`. 성공 시 해당 워크스페이스 쿼리 제거 + 목록 무효화 + `/workspace/my-works`로 이동 |
| 최근 접속 기록 | 사이드바에서 워크스페이스 클릭(`WorkspaceNavLink`) | `recordWorkspaceRecentAccessAction` 호출 후 `/workspace/{id}/daily`로 이동. 이 기록을 화면에 직접 노출하는 UI는 없음 |

### 4.2 참여자 관리 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 참여자 모달 열기 | `WorkspaceHeader`의 참여자 아이콘(`WorkspaceAttendAddButton`) | `AddWorkspaceAttendModal` 오픈 |
| 참여자 추가 | 모달 내 `@`검색 → 선택 → "참여자 추가" 제출 | `addWorkspaceMembersAction`. 성공 시 토스트 + 모달 닫힘 + `router.refresh()` |
| 참여자 제거 | 현재 참여자 칩의 "×"(`WorkspaceAttendItem`) | `removeWorkspaceMemberAction`을 즉시 호출(별도 확인 다이얼로그 없음) |

### 4.3 업무 관리 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 업무 등록 | `WorkspaceHeader`의 "업무 등록"(`TaskCreateButton`) 또는 각 컬럼 하단 "업무 추가"(`TaskAddButton`) — 둘 다 동일한 모달을 여는 별도 진입점 | `CreateTaskModal`: 제목 + 마감일 입력 → `createWorkspaceTaskAction`(초기 상태는 항상 대기). 성공 시 워크스페이스 쿼리 무효화 + 토스트 + 모달 닫힘, 실패 시 모달 내 인라인 오류만 표시(토스트 없음) |
| 업무 상세 열기 | 보드의 업무 카드 클릭(`WorkItem`) | `ViewTask` 우측 슬라이드 패널 오픈. `getWorkspaceTaskDetailAction`(상세)과 `getWorkspaceTaskCommentListAction`(댓글) 조회 |
| 업무 상태 변경 | `ViewTask`의 상태 select | `changeWorkspaceTaskAction({status})` — select 값이 바뀌는 즉시 반영, 별도 저장 버튼 없음 |
| 업무 마감일 변경 | `ViewTask`의 달력 아이콘(숨겨진 date input) | `changeWorkspaceTaskAction({dueAt})` — 날짜 선택 즉시 반영 |
| 업무 삭제 | `ViewTask` 헤더의 삭제 버튼(`TaskDeleteButton`) | `TwoButtonModal` 확인 후 `deleteWorkspaceTaskAction`. 성공 시 상세 패널 닫힘(`setSelectedTask(undefined)`) + 워크스페이스 쿼리 무효화 |

### 4.4 업무 댓글 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 댓글 작성 | `ViewTask` 하단의 `CommentBar` | `@`로 워크스페이스 참여자를 검색해 멘션 추가 후 제출 → `createWorkspaceTaskCommentAction`. 성공 시 토스트 + 입력창 초기화 |
| 댓글 완료 체크 | 댓글 왼쪽 체크 아이콘(`TaskComment`) | `toggleWorkspaceTaskCommentCompleteAction` — 체크 시 텍스트에 취소선 적용 |
| 댓글 수정 진입 | 댓글의 "⋮" 메뉴 → "수정"(`TaskCommentMenu`) | 편집 대상을 전역 스토어(`useTaskCommentEditStore`)에 저장하면, `CommentBar`가 그 값을 읽어 같은 입력창을 편집 모드로 전환 |
| 댓글 수정 저장 | 편집 모드의 `CommentBar` 제출 | `changeWorkspaceTaskCommentAction`. 성공 시 편집 상태 해제(`clearEditingComment`) + 토스트 |
| 댓글 삭제 | "⋮" 메뉴의 "삭제"(`TaskCommentMenu`) | `deleteWorkspaceTaskCommentAction`. 성공 시 토스트, 확인 다이얼로그 없이 즉시 삭제 |

### 4.5 반복 업무 템플릿 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 템플릿 등록 | `WorkspaceHeader`의 "템플릿 등록"(`TaskTemplateCreateButton`) | `CreateTaskTemplateModal`: 제목 + 반복 주기(매주 요일 중 하나 또는 매월 1일) → `createWorkspaceRecurringTemplateAction` |
| 템플릿 수정 | `WorkTemplateItem`의 "수정하기" 버튼 | `EditTaskTemplateModal`(제목·주기 프리필) → `changeWorkspaceRecurringTemplateAction` |
| 템플릿 삭제 | `WorkTemplateItem`의 "×" 버튼 | `TwoButtonModal` 확인 후 `deleteWorkspaceRecurringTemplateAction` |

### 4.6 내 업무 모아보기 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 내 업무 목록 조회 | `/workspace/my-works` 진입 | `getMyWorkspaceTaskListAction({status?, workspaceId?})`, `IntersectionObserver` 기반 무한 스크롤 |
| 상태/워크스페이스 필터 | `MyWorkHeader`의 select 2개 | URL 쿼리스트링(`status`/`workspaceId`)을 갱신해 목록을 다시 조회. 단, 상태 필터 select 자체에 알려진 버그가 있어(6장 참고) 현재 선택값이 화면에 정확히 반영되지 않을 수 있음 |

---

## 5. 데이터

워크스페이스 상세(`WorkspaceDetailData`) 기준.

| 항목 | 설명 |
|---|---|
| 이름 / 참여자 수 | `name`, `memberCount` |
| 참여자 목록 | `members: WorkspaceMemberData[]` (`userId`, `name`) |
| 업무 수 / 업무 목록 | `taskCount`, `tasks: WorkspaceTaskData[]` |

업무(`WorkspaceTaskData` / 상세 `WorkspaceTaskDetailData`) 기준.

| 항목 | 설명 |
|---|---|
| 제목 | `title` |
| 등록자 | `creator: WorkspaceMemberData` |
| 상태 | `status`: 대기(`WAITING`) / 진행중(`IN_PROGRESS`) / 완료(`COMPLETED`) / 지연(`DELAYED`) |
| 마감일 | `dueAt` (string \| null) |
| 등록일 / 상태 변경 이력 | `createdAt`, `lastStatusChangedAt`(상세에만 존재) |
| 댓글 진행률 | `completedCommentCount`, `commentCount` (목록 카드에 "완료/전체" 형태로 표시) |

댓글(`WorkspaceTaskCommentListItemData`) 기준.

| 항목 | 설명 |
|---|---|
| 내용 | `content` (`@이름` 멘션 텍스트 포함) |
| 작성자 | `author: WorkspaceMemberData` |
| 완료 여부 | `completed` |
| 멘션 대상 | `mentionedUserIds?: number[]` |
| 작성일 | `createdAt` |

반복 업무 템플릿(`WorkspaceRecurringTemplateData`) 기준.

| 항목 | 설명 |
|---|---|
| 제목 | `title` |
| 반복 유형 | `recurrenceType`: `WEEKLY`(매주) / `MONTHLY`(매월) |
| 반복 규칙 | `recurrenceRule`: `{daysOfWeek: number[]}` 또는 `{dayOfMonth: 1}` |
| 생성자 | `createdBy` |

---

## 6. 컴포넌트 구성

기능 단위로 분해했을 때 필요한 컴포넌트 목록과 각자의 책임.

| 컴포넌트 | 책임 |
|---|---|
| **WorkspaceSidebar** | 전체 `/workspace/*` 공통 좌측 내비게이션(구현 완료, Client Component). 접기/펼치기 state(`open`), 워크스페이스 목록 조회, "+" 버튼(권한 `WORKSPACE:CREATE`)으로 `CreateWorkspaceModal` 오픈 |
| **WorkspaceNavLink** | 사이드바의 워크스페이스 행 하나(구현 완료). 클릭 시 `recordWorkspaceRecentAccessAction` 호출 후 해당 워크스페이스의 일별 화면으로 이동 |
| **WorkspaceHeader** | 워크스페이스 상세 공통 헤더(구현 완료, Client Component, `[id]/layout.tsx`에서 렌더링). 이름·참여자 요약·툴바 버튼·탭 내비게이션을 모두 조합 |
| **WorkspaceEditButton / EditWorkspaceModal** | 이름 수정(구현 완료). 버튼은 아이콘만 담당하고, 모달이 현재 이름 조회(`getWorkspaceDetailAction`)와 `changeWorkspaceNameAction` 제출을 모두 담당 |
| **WorkspaceDeleteButton** | 삭제 확인 + 실행(구현 완료). `TwoButtonModal`을 직접 렌더링하며, 성공 시 목록 화면으로 리다이렉트까지 담당 |
| **WorkspaceAttendAddButton / AddWorkspaceAttendModal** | 참여자 관리(구현 완료). 버튼은 모달 오픈만, 모달이 현재 참여자 표시·제거(`removeWorkspaceMemberAction`)·검색 후 추가(`addWorkspaceMembersAction`)를 모두 담당 |
| **Attend** | 참여자 요약 텍스트(구현 완료, 순수 표시, props 없이 상태 없음). `WorkspaceAttends`/`WorkspaceAttendItem`과 이름이 비슷하지만 별개 컴포넌트 — 5명 초과 시 "외 N명" 요약 |
| **WorkspaceAttends** | 참여자 검색 결과 행 하나(구현 완료, 순수 표시). `CreateWorkspaceModal`/`AddWorkspaceAttendModal` 양쪽에서 재사용 |
| **WorkspaceAttendItem** | 제거 가능한 참여자 칩(구현 완료, 순수 표시). "현재 참여자"와 "추가 예정 참여자" 양쪽에 재사용되며, 숨겨진 `<input name="memberIds">`를 겸해 `CreateWorkspaceModal`의 폼 필드 역할도 함 |
| **TaskCreateButton / TaskAddButton** | 업무 등록 진입점 2곳(구현 완료). 배치 위치만 다를 뿐(헤더 툴바 vs 컬럼 하단) 동일한 `CreateTaskModal`을 연다 |
| **CreateTaskModal** | 업무 등록 폼(구현 완료). 제목·마감일 입력, `createWorkspaceTaskAction` 제출, 등록자/등록일시/초기 상태를 자동 안내 문구로 표시 |
| **TaskTemplateCreateButton / CreateTaskTemplateModal** | 반복 템플릿 등록(구현 완료). 일반 업무 등록과는 별개 흐름(`createWorkspaceRecurringTemplateAction`) |
| **TaskNavLink** | 워크스페이스 상세 내 "일별"/"반복 템플릿" 탭 링크(구현 완료). `usePathname` 기반 활성 표시 |
| **WorkspaceCt** | 일별 보드 콘텐츠(구현 완료). 업무를 상태별로 그룹화(`useMemo`)해 `WorkList` 3개와 지연 섹션(`WorkItem` 재사용)을 렌더링, `selectedTask` state로 `ViewTask` 표시 여부 결정 |
| **WorkspaceDailyHeader** | 날짜 내비게이션(구현 완료). 이전/다음 날 이동, 날짜 클릭 시 `WorkCalendarModal`, 날짜가 바뀌면 URL(`?date=`)을 갱신 |
| **WorkCalendarModal** | 달력 팝오버(구현 완료). 날짜를 고르는 즉시 자기 자신을 닫음(별도 확인 버튼 없음) |
| **WorkList** | 보드의 컬럼 하나(대기/진행중/완료)(구현 완료). 업무 카드(`WorkItem`) 목록 + 하단 "업무 추가" 버튼 |
| **WorkItem** | 업무 카드 하나(구현 완료). 4가지 상태(`WAITING`/`IN_PROGRESS`/`COMPLETED`/`DELAYED`) 스타일을 모두 지원하며, 클릭 시 `setSelectedTask`로 `ViewTask`를 연다. 대기/진행중/완료는 `WorkList`를 통해, 지연은 `WorkspaceCt`가 직접 이 컴포넌트를 사용 |
| **ViewTask** | 업무 상세 우측 슬라이드 패널(구현 완료). 상태 변경·마감일 변경(둘 다 select/입력 즉시 반영)·삭제(`TaskDeleteButton`)·댓글 목록(`TaskComment`)·댓글 입력(`CommentBar`)을 한 화면에서 담당하는, 이 도메인에서 가장 책임이 큰 컴포넌트 |
| **TaskDeleteButton** | 업무 삭제(구현 완료). `TwoButtonModal` 확인 후 `deleteWorkspaceTaskAction`, 성공 시 `ViewTask`를 닫음 |
| **CommentBar** | 댓글 작성/수정 통합 입력창(구현 완료). `@` 입력 시 워크스페이스 멤버로 범위를 제한한 디바운스 검색, 전역 스토어(`useTaskCommentEditStore`)의 `editingComment` 유무로 작성/수정 모드를 전환 |
| **TaskComment** | 댓글 한 줄(구현 완료). 완료 체크(`toggleWorkspaceTaskCommentCompleteAction`), `@멘션` 하이라이트, "⋮" 메뉴(`TaskCommentMenu`) |
| **TaskCommentMenu** | 댓글 수정/삭제 팝오버(구현 완료). "수정"은 `useTaskCommentEditStore`에 값을 저장해 `CommentBar`로 편집을 넘기고, "삭제"는 `deleteWorkspaceTaskCommentAction`을 직접 호출 |
| **WorkspaceRepeatCt** | 반복 템플릿 탭 콘텐츠(구현 완료). 템플릿 목록을 `WorkTemplateItem`으로 렌더링 |
| **WorkTemplateItem** | 템플릿 한 줄(구현 완료). 수정(`EditTaskTemplateModal`)·삭제(`TwoButtonModal` → `deleteWorkspaceRecurringTemplateAction`) |
| **MyWorkHeader / MyWorkList / MyWorkItem** | 내 업무 모아보기 화면(구현 완료, 단 `MyWorkHeader`에 6장에서 설명하는 버그 있음). 필터 UI(`MyWorkHeader`) + 무한 스크롤 목록 셸(`MyWorkList`) + 행 하나(`MyWorkItem`)로 역할이 나뉨 |

> **죽은 코드 / 미사용 컴포넌트**: `modals/EditTaskDueModal.tsx`는 이 도메인 어디에서도 import되지 않는다. 제목은 "업무 기한 재설정", 제출 버튼은 "업무 상태 변경"이라고 되어 있지만 실제로 호출하는 액션은 `createWorkspaceTaskAction`(새 업무 생성)이며 폼에 `title` 필드조차 없어, 제출하면 서버 검증(제목 필수)에 항상 걸리도록 되어 있다 — 라벨과 실제 동작이 서로 다른, 미완성인 채로 남은 초안으로 보인다. 실제 마감일 변경 기능은 `ViewTask`가 자체적으로 구현한 인라인 date input이 담당한다. (approval 도메인의 `UpdateApprovalModal.tsx`와 같은 패턴의 죽은 코드다.)
> `components/WorkDelayItem.tsx`도 이 도메인 어디에서도 import되지 않는다. `WorkspaceCt`는 지연 업무를 표시할 때 이 컴포넌트 대신 클릭 가능한 `WorkItem`(`type='DELAYED'`)을 재사용한다.
> `WorkTemplateItem`의 맨 앞 "⟋" 아이콘 버튼(`aria-label="수정"`)에는 `onClick`이 연결되어 있지 않아 클릭해도 아무 동작이 없다. 실제 수정 기능은 바로 옆의 "수정하기" 텍스트 버튼이 담당한다.
> `recoverWorkspaceAction`(및 대응 서비스 함수)이 정의되어 있지만, 이 도메인의 어떤 화면에서도 호출되지 않는다. 삭제된 워크스페이스를 복구하는 UI(관리자 화면 등)가 아직 만들어지지 않은 것으로 보인다.

> **알려진 버그**: `MyWorkHeader.tsx`는 상태 필터 select의 `value`로 `status`라는 변수를 참조하지만, 이 컴포넌트 안에 `status`라는 이름의 prop이나 state가 존재하지 않는다. 또한 `my-works/page.tsx`도 URL의 `status` 검색 파라미터를 이 컴포넌트에 전달하지 않고 `workspaceId`만 넘긴다 — 상태 필터가 현재 선택값을 화면에 정확히 반영하지 못하는 상태다.
> `WorkspaceCt.tsx`/`WorkspaceHeader.tsx`의 오류 메시지는 `{message}다시 시도해주세요.`처럼 문자열을 그대로 붙여, 문구 사이에 공백이 없다(예: "실패했습니다다시 시도해주세요.").
> `WorkspaceRepeatCt.tsx`의 안내 문구는 "아래 '지금 생성' 버튼으로 즉시 테스트할 수 있습니다."라고 안내하지만, 이 화면과 `WorkTemplateItem` 어디에도 '지금 생성' 버튼은 없다 — 안내 문구와 실제 구현이 어긋난 사례.
> `TaskDeleteButton.tsx` 최상단 지시어가 `'use client'`가 아니라 `'use query'`로 되어 있다. 유효한 Next.js 지시어가 아니라 오타로 보이며, 부모(`ViewTask`)가 이미 클라이언트 컴포넌트라 실제 동작에는 문제가 없다. 같은 파일이 `WorkspaceSidebar`를 import하지만 사용하지 않는 죽은 import도 갖고 있다.
> `/workspace`(bare)와 `/workspace/[id]`(bare) 페이지는 `<div></div>`만 반환하는 빈 자리표시자다. 실제 콘텐츠는 각각 `/workspace/my-works`와 `/workspace/[id]/daily`에 있으며, 리다이렉트가 구현되어 있지 않아 두 경로를 직접 방문하면 빈 화면만 보인다.

### 관계

```
/workspace  (layout.tsx: WorkspaceSidebar + children)
├── WorkspaceSidebar
│     ├── WorkspaceNavLink × N
│     └── (버튼 "+") CreateWorkspaceModal
│           ├── WorkspaceAttendItem (선택된 참여자 칩)
│           └── WorkspaceAttends (검색 결과)
│
├── /workspace  (page.tsx)                          → <div></div> (빈 자리표시자)
│
├── /workspace/my-works  (layout: <section>)
│     └── page.tsx
│           ├── MyWorkHeader                          [알려진 버그: 미정의 변수 참조]
│           └── MyWorkList
│                 └── MyWorkItem × N (무한 스크롤)
│
└── /workspace/[id]  (layout.tsx: WorkspaceHeader + children)
      │
      ├── WorkspaceHeader
      │     ├── Attend × members (요약 텍스트)
      │     ├── WorkspaceEditButton → EditWorkspaceModal
      │     ├── WorkspaceAttendAddButton → AddWorkspaceAttendModal
      │     │       ├── WorkspaceAttendItem (현재 + 선택된 참여자)
      │     │       └── WorkspaceAttends (검색 결과)
      │     ├── WorkspaceDeleteButton → TwoButtonModal
      │     ├── TaskCreateButton → CreateTaskModal
      │     ├── TaskTemplateCreateButton → CreateTaskTemplateModal
      │     └── TaskNavLink × 2 ("일별" / "반복 템플릿")
      │
      ├── /workspace/[id]  (page.tsx)                 → <div></div> (빈 자리표시자)
      │
      ├── /workspace/[id]/daily
      │     └── WorkspaceCt
      │           ├── WorkspaceDailyHeader
      │           │       └── WorkCalendarModal
      │           ├── WorkList (대기) ─┐
      │           ├── WorkList (진행중) ├─ 각각: WorkItem × N + TaskAddButton → CreateTaskModal
      │           ├── WorkList (완료) ─┘
      │           ├── WorkItem × N (type=DELAYED, WorkList 없이 직접 렌더)
      │           │       [WorkDelayItem 존재하지만 미사용]
      │           └── ViewTask (selectedTask 설정 시)
      │                 ├── TaskDeleteButton → TwoButtonModal
      │                 ├── TaskComment × N
      │                 │       └── TaskCommentMenu → useTaskCommentEditStore
      │                 └── CommentBar → useTaskCommentEditStore
      │                 [EditTaskDueModal 존재하지만 미사용]
      │
      └── /workspace/[id]/repeat
            └── WorkspaceRepeatCt
                  └── WorkTemplateItem × N
                        ├── EditTaskTemplateModal (버튼 "수정하기")
                        └── TwoButtonModal (버튼 "×", 삭제)
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 권한 체크 | `useUserStore`의 `permissions` 배열로 `WORKSPACE:CREATE`(생성 버튼)/`WORKSPACE:READ_ALL`(전체 워크스페이스 조회 범위) 결정 | 구현 완료 |
| 댓글 편집 상태 공유 | `src/store/useTaskCommentEditStore.ts`(Zustand). `TaskCommentMenu`가 "수정"을 누르면 편집 대상을 저장하고, 같은 값을 `CommentBar`가 구독해 작성/수정 모드를 전환 — 두 컴포넌트가 부모-자식 관계가 아니라 이 스토어로만 연결됨 | 구현 완료 |
| 멘션 검색 | `@` 입력 시 `getUserListAction`을 디바운스(500ms, 최초 1회는 즉시) 호출하고, 결과를 워크스페이스 참여자 집합으로 필터링하는 로직이 `CommentBar`와 `CreateWorkspaceModal`/`AddWorkspaceAttendModal`에 유사한 형태로 각각 구현되어 있음(공유 훅 없음) | 구현 완료(중복 존재) |
| 날짜 URL 동기화 | `WorkspaceDailyHeader`의 `calendarDate` state가 바뀌면 `router.replace`로 `?date=yyyy-MM-dd`를 갱신 → 서버 컴포넌트(`daily/page.tsx`)가 이를 읽어 `WorkspaceCt`에 전달 | 구현 완료 |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 업무 상태 | 대기(`WAITING`) / 진행중(`IN_PROGRESS`) / 완료(`COMPLETED`) / 지연(`DELAYED`) |
| 사이드바 접힘 여부 | `WorkspaceSidebar`의 `open` state |
| 일별 보드 선택 날짜 | `WorkspaceDailyHeader`의 `calendarDate` state, URL의 `date` 쿼리와 동기화 |
| 선택된 업무 | `WorkspaceCt`의 `selectedTask` state — 값이 있으면 `ViewTask` 패널 표시 |
| 댓글 편집 대상 | 전역 `useTaskCommentEditStore`의 `editingComment` — 존재 여부로 `CommentBar`가 작성/수정 모드를 전환 |
| 멘션 입력 상태 | `CommentBar`/`CreateWorkspaceModal`/`AddWorkspaceAttendModal` 각각의 `mentionStart`/검색어 state — `@` 입력 위치를 기준으로 멘션 후보 목록 노출 여부 결정 |
| 내 업무 모아보기 필터 | URL 쿼리 `status`/`workspaceId` (단, `status`는 6장에서 설명한 버그로 화면에 온전히 반영되지 않음) |

---
