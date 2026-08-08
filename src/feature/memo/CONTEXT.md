# Memo Domain — CONTEXT
> 배치 경로: `src/feature/memo/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 메모 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: **부분 구현**. 컨테이너 열림/닫힘·영속성(4.1), 정렬(4.3), 케밥 메뉴 열기/닫기와 수정 모드 진입(4.4)까지는 화면 동작으로 구현되어 있다. 다만 전부 `MemoContainer`의 `INITIAL_MEMOS` 더미 배열을 다룰 뿐이고, 새 메모 저장·수정 저장·색상 변경·삭제는 어떤 화면 흐름도 이 배열이나 실제 API에 반영하지 않는다(버튼/폼은 뜨지만 결과가 사라짐). 실제 메모 데이터 연동(API)은 아직 시작하지 않았다.

---

## 1. 개요

사용자 개인이 사용하는 메모 도메인.

다른 도메인에서 작업하는 도중에도 메모를 작성·조회할 수 있어야 한다는 것이 이 도메인의 핵심 목적이다. 따라서 메모는 독립된 페이지가 아니라 **화면 우측에 떠 있는 컨테이너** 형태로 제공된다.

### 핵심 제약

- 메모 컨테이너는 한 번 열리면 **사용자가 다른 페이지로 이동해도 계속 유지된다.**
- 컨테이너가 닫히는 경우는 두 가지뿐이다.
  1. 컨테이너 우상단의 X 버튼 클릭
  2. Sidebar의 메모 메뉴 재클릭
- 즉 라우트 이동은 컨테이너의 열림/닫힘 상태에 영향을 주지 않는다.

### 진입점

`src/components/layout/Sidebar.tsx` 의 메모 메뉴(`OpenMemo` 컴포넌트). 이 메뉴 클릭이 컨테이너를 여는 유일한 진입점이다.

### 상태 관리

컨테이너 열림/닫힘 상태는 `src/store/useMemoStore.ts`의 Zustand 스토어(`isOpen`, `toggleMemo`)로 관리한다. Sidebar와 `MemoContainer`는 부모-자식 관계가 아니라 `src/app/layout.tsx`에 형제로 마운트되므로, 이 스토어가 둘을 잇는 유일한 연결고리다.

- 여는 쪽: `OpenMemo`(Sidebar 메모 메뉴)가 `toggleMemo` 호출
- 구독하는 쪽: `MemoContainer`가 `isOpen`을 구독해 `false`면 `null` 반환
- 닫는 쪽: `MemoContainer` 내부 X 버튼도 동일한 `toggleMemo`를 호출

`MemoContainer`는 `layout.tsx`에서 `Sidebar` / `children`과 같은 레벨에 `position: fixed`로 상시 마운트된다. 라우트(`children`)가 바뀌어도 리마운트되지 않으며, `fixed`라 일반 레이아웃 흐름에서 빠져 있어 다른 도메인 화면의 너비를 줄이지 않고 그 위에 겹쳐서 뜬다.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **메모 컨테이너** | Sidebar 메모 클릭 시 화면 우측에 나타나는 영역 전체 |
| **메모 카드** | 메모 1건을 표시하는 단위. 컨테이너 main 영역에 그리드로 배치된다 |
| **케밥 메뉴** | 메모 카드 안의 `⋮` 버튼과 그 하위 메뉴 (수정 / 색상 변경 / 삭제) |
| **표시 모드** | 메모 카드가 내용을 보여주기만 하는 상태 |
| **편집 모드** | 메모 카드에서 제목·내용·색상을 입력/수정할 수 있는 상태 |
| **정렬 필터** | Nav 바의 최신순 / 오래된순 선택 |

---

## 3. 화면 구성

메모 컨테이너는 Header / Nav / Main 3단 구조다.

```
┌─ 메모 컨테이너 ─────────────────────────────┐
│ [Header]                                    │
│  메모   (메모 갯수)      [새 메모]   [X]     │
├─────────────────────────────────────────────┤
│ [Nav]                                       │
│  [최신순] [오래된순]        현재 필터 상태    │
├─────────────────────────────────────────────┤
│ [Main]                                      │
│  ┌─ 메모 카드 ─┐  ┌─ 메모 카드 ─┐            │
│  │ 제목        │  │ 제목        │            │
│  │ 내용        │  │ 내용        │            │
│  │ 날짜     ⋮  │  │ 날짜     ⋮  │            │
│  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────┘
```

### Header

| 요소 | 설명 |
|---|---|
| 메모 | 컨테이너 제목 |
| 메모 갯수 | 현재 메모 개수 표시 |
| 새 메모 버튼 | 새 메모 카드 생성 |
| X 버튼 | 컨테이너 닫기 |

### Nav

| 요소 | 설명 |
|---|---|
| 최신순 / 오래된순 | 메모 카드 정렬 필터 |
| 현재 필터 상태 | Nav 우측에서 현재 어떤 정렬이 적용 중인지 안내 |

### Main

- 메모 카드 그리드.
- 기본 **한 라인에 2개**씩 배치.
- **768px 이하에서는 한 라인에 1개**씩 배치.

### 메모 카드 구성 요소

- 메모 제목
- 메모 내용
- 날짜
- 케밥 메뉴

---

## 4. 기능 목록

### 4.1 컨테이너 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 컨테이너 열기 | Sidebar 메모 클릭 (`OpenMemo` → `toggleMemo`) | 화면 우측에 메모 컨테이너 표시 |
| 컨테이너 닫기 | X 버튼 클릭 (`toggleMemo`) | 컨테이너 숨김 |
| 컨테이너 닫기 | Sidebar 메모 재클릭 (`toggleMemo`) | 컨테이너 숨김 |
| 컨테이너 유지 | 페이지 이동 | `layout.tsx`에 상시 마운트되어 있어 리마운트되지 않고 그대로 유지 |

### 4.2 메모 CRUD — 부분 구현 (화면 흐름은 있지만 저장이 없음)

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 새 메모 생성 폼 열기 | Header `새 메모` 클릭 | `MemoContainer`의 `isCreating` state가 `true`가 되어 카드 그리드 맨 앞에 `MemoCreateForm`(제목·내용 입력 + `MemoColorPicker`)이 나타남 | 구현 완료 |
| 새 메모 저장 | `MemoCreateForm` 저장 버튼 (`react-hook-form` + `memoCreateSchema`(zod) 검증) | 폼이 닫히기만 함. 입력한 제목·내용·색상이 실제 메모 목록(`INITIAL_MEMOS`)에 추가되지 않음 | **미구현** (저장 로직 없음) |
| 새 메모 생성 취소 | `MemoCreateForm` 취소 버튼 | 입력값 초기화 후 폼 닫힘 | 구현 완료 |
| 메모 수정 모드 진입 | 케밥 메뉴 → `수정` | 메뉴가 닫히고 `MemoCard`의 `editedMemoId`가 해당 카드 id로 설정되어, 그 카드 자리가 `MemoEditForm`(제목·내용·색상 수정)으로 바뀜 | 구현 완료 |
| 메모 수정 저장 | `MemoEditForm` 저장 버튼 (`react-hook-form` + `memoCreateSchema`(zod) 검증) | 편집 모드가 종료되고 표시 모드로 돌아가기만 함. 수정한 제목·내용·색상이 `INITIAL_MEMOS`에 반영되지 않음 | **미구현** (저장 로직 없음) |
| 메모 수정 취소 | `MemoEditForm` 취소 버튼 | 입력값 초기화 후 표시 모드로 복귀 | 구현 완료 |
| 색상 변경 UI 열기 | 케밥 메뉴 → `색상 변경` | 케밥 메뉴 자리가 `MemoColorPicker`(인라인)로 바뀜 | 구현 완료 |
| 색상 변경 적용 | `MemoColorPicker`에서 색상 클릭 | 팔레트 안에서 선택 표시(체크 아이콘)만 바뀜. 카드의 실제 배경/강조색이 바뀌지 않고, 창을 닫아도 반영되지 않음 | **미구현** |
| 삭제 확인 다이얼로그 열기 | 케밥 메뉴 → `삭제` | 카드 위에 "삭제할까요?" 확인 UI가 덮어씌워짐 | 구현 완료 |
| 삭제 실행 | 확인 다이얼로그의 `삭제` 버튼 | 다이얼로그만 닫힘. 해당 메모가 목록에서 실제로 제거되지 않음 | **미구현** (삭제 로직 없음) |

### 4.3 정렬 — 구현 완료 (더미 데이터 기준)

| 기능 | 트리거 | 동작 |
|---|---|---|
| 최신순 정렬 | Nav `최신순` 클릭 | `MemoContainer`의 `sortOrder` state가 `"latest"`가 되어, `time`(`MM.DD` 문자열을 숫자로 변환) 기준 내림차순으로 정렬된 `sortedMemos`를 `MemoCard`에 전달 |
| 오래된순 정렬 | Nav `오래된순` 클릭 | `sortOrder`가 `"oldest"`가 되어 오름차순 정렬 |

> 실제 서버 데이터로 붙일 때는 `GET /api/memos?sort=NEWEST\|OLDEST` 쿼리로 서버가 정렬해서 내려주므로, 이 클라이언트 정렬 로직은 그때 API 재조회로 대체될 가능성이 높다.

### 4.4 케밥 메뉴 — 부분 구현

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 메뉴 열기 | 카드 내 `⋮` 클릭 (`MemoCard`의 `openedMenuId` state) | 해당 카드에 `MemoCardMenu`(수정 / 색상 변경 / 삭제 항목) 표시. 이때 `menuMode`는 `"menu"`로 초기화됨 | 구현 완료 |
| 메뉴 닫기 | 다른 카드의 `⋮` 재클릭, 메뉴 바깥 클릭 (`pointerdown` + `data-memo-menu`/`data-memo-menu-trigger`) | 메뉴 숨김, `menuMode`/`selectedColor` 초기화 | 구현 완료 |
| `수정` 클릭 | `MemoCardMenu`의 `onEdit` | 메뉴가 닫히고 4.2의 "메모 수정 모드 진입"으로 이어짐 | 구현 완료 (저장은 4.2 참고 — 미구현) |
| `색상 변경` 클릭 | `MemoCardMenu`의 `onChangeColor` | `menuMode`가 `"color"`가 되어 메뉴 자리에 `MemoColorPicker` 표시 | 구현 완료 (적용은 4.2 참고 — 미구현) |
| `삭제` 클릭 | `MemoCardMenu`의 `onDelete` | `menuMode`가 `"delete"`가 되어 삭제 확인 UI 표시 | 구현 완료 (실행은 4.2 참고 — 미구현) |

---

## 5. 데이터

메모 1건이 가지는 정보.

| 항목 | 설명 |
|---|---|
| 제목 | 메모 카드 상단에 표시 |
| 내용 | 메모 본문 |
| 색상 | 메모 카드의 색상. 생성·수정·색상 변경에서 지정 |
| 날짜 | 메모 카드 하단에 표시. 정렬 기준이 되는 값 |

---

## 6. 컴포넌트 구성

기능 단위로 분해했을 때 필요한 컴포넌트 목록과 각자의 책임.

| 컴포넌트 | 책임 |
|---|---|
| **MemoContainer** | 메모 컨테이너 셸(구현 완료). `layout.tsx`에서 라우트와 무관하게 항상 마운트되며, `useMemoStore`의 `isOpen`을 구독해 열림·닫힘을 결정. Header / Nav / Main 배치, `isCreating` state로 생성 폼 표시 여부, `sortOrder` state로 정렬 기준을 담당. Header는 별도 컴포넌트로 분리하지 않고 이 안에 직접 작성 |
| **MemoCreateForm** | 메모 작성 폼(화면 흐름 구현 완료, 저장 미구현). `react-hook-form` + `memoCreateSchema`(zod, `src/lib/memoCreateSchema.ts`)로 제목·내용 검증, `MemoColorPicker`로 색상 선택. 저장 시 상위(`MemoContainer`)로 값을 전달하지만 실제 메모 목록에 반영하는 로직은 아직 없음 |
| **MemoEditForm** | 메모 수정 폼(화면 흐름 구현 완료, 저장 미구현). 기존 `memo`(title/content/accent/background)를 prop으로 받아 `MemoCreateForm`과 동일한 검증·색상 선택 UI로 수정. 저장 시 값을 상위로 전달하지만 반영 로직은 없음 |
| **MemoFilter** | 정렬 필터 UI(구현 완료). `sortOrder`/`onChangeSortOrder` props를 받는 controlled 컴포넌트로, 클릭 시 실제로 `MemoContainer`의 정렬 기준을 바꿈 |
| **MemoCard** | 메모 목록 그리드 렌더링(구현 완료). `openedMenuId`(열린 카드), `menuMode`(`"menu"`/`"color"`/`"delete"`), `editedMemoId`(편집 중인 카드) state로 카드별 UI 전환을 관리하고, `createForm` prop으로 받은 `MemoCreateForm`을 그리드 맨 앞에 함께 렌더링 |
| **MemoCardMenu** | 케밥 메뉴 UI(구현 완료). `onEdit`/`onChangeColor`/`onDelete` props로 `MemoCard`의 모드 전환을 트리거함 (실제 저장/적용/삭제는 `MemoCard`에도 없음) |
| **MemoColorPicker** | 색상 선택 UI(구현 완료). `selectedColor`/`onChange` props를 받는 controlled 컴포넌트로, `MemoCreateForm`/`MemoEditForm`뿐 아니라 `MemoCard`의 인라인 색상 변경 UI에서도 재사용됨. 팔레트 12색과 API `color` enum(`ROSE`/`MUSTARD`/`SAGE`/`BLUE`/`LAVENDER`/`PINK`/`SLATE`/`PEACH`/`TEAL`/`OLIVE`/`CLAY`/`INDIGO`, `.docs/api/memo/apiIntegration.md`)이 1:1로 확정됨. 다만 `MemoColor` 타입(`accent`/`background`)엔 아직 이 enum 값을 담는 필드가 없어서, 실제 API 연동 시 각 팔레트 항목에 색상 키를 추가해야 함 |

> `approval` 도메인이 생성/수정 모달을 분리(`CreateApprovalModal` / `UpdateApprovalModal`)해 쓰는 것과 동일하게, 메모도 작성 폼과 수정 폼을 분리하는 구조로 확정.

> 메모 도메인 밖의 `src/components/layout/OpenMemo.tsx`는 Sidebar의 메모 메뉴 트리거로, `MemoContainer`와는 `useMemoStore`로만 연결된다 (컴포넌트 트리상 부모-자식 관계 아님).

### 관계

```
MemoContainer            (isCreating, sortOrder state)
├── MemoFilter            (sortOrder / onChangeSortOrder props)
└── MemoCard              (memos = sortedMemos, createForm prop
                            / openedMenuId, menuMode, editedMemoId state)
    ├── MemoCreateForm    (createForm prop으로 전달, isCreating일 때만)
    │   └── MemoColorPicker
    └── [카드별 반복]
        ├── editedMemoId === 카드 id  → MemoEditForm (카드 자체가 이 컴포넌트로 교체됨)
        │                                └── MemoColorPicker
        ├── menuMode === "menu"       → MemoCardMenu (onEdit/onChangeColor/onDelete)
        ├── menuMode === "color"      → MemoColorPicker (인라인, 카드 위에 오버레이)
        └── menuMode === "delete"     → 삭제 확인 UI (카드 위에 오버레이)
```

> 원래 구상은 `MemoCreateForm`/`MemoEditForm`이 `MemoContainer` 아래 `MemoCard`와 형제로 붙는 구조였지만, 실제 구현은 `MemoContainer`가 `isCreating`을 들고 있다가 `MemoCreateForm` 엘리먼트를 만들어 `MemoCard`의 `createForm` prop으로 내려주는 방식이다. `MemoEditForm`도 형제가 아니라, `MemoCard`가 `editedMemoId`로 해당 카드 자체를 `<article>`에서 `<MemoEditForm>`으로 바꿔 끼우는 방식으로 구현되어 있다. 케밥 메뉴/색상변경/삭제확인도 별도 컴포넌트 트리가 아니라 `menuMode` 하나로 같은 위치에 오버레이만 바꿔 끼우는 구조다.

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 컨테이너 열림 상태 | `src/store/useMemoStore.ts` (Zustand). 페이지 단위가 아닌 전역 스토어로 관리해 라우트 이동과 무관하게 유지 | 구현 완료 |
| 정렬 상태 | `MemoContainer`의 `sortOrder` state(`"latest"`/`"oldest"`). 더미 배열을 클라이언트에서 직접 정렬 | 구현 완료 (더미 데이터 기준) |
| 메모 데이터 | 메모 목록 조회 및 CRUD | 미구현. `MemoContainer`의 `INITIAL_MEMOS` 더미 배열만 있고, 생성·수정·색상변경·삭제 어느 것도 이 배열에 반영되지 않음(진짜 상태 관리도 아직 없음) |
| 카드별 케밥 메뉴 상태 | `MemoCard`의 `openedMenuId`(열린 카드) + `menuMode`(`"menu"`/`"color"`/`"delete"`) state. 카드 1건만 열리도록 단일 id로 관리, 바깥 클릭 시 초기화 | 구현 완료 |
| 편집 중인 카드 상태 | `MemoCard`의 `editedMemoId` state. 해당 id의 카드를 `MemoEditForm`으로 교체 렌더링 | 구현 완료 |
| 생성 폼 표시 상태 | `MemoContainer`의 `isCreating` state | 구현 완료 |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 컨테이너 | 열림 / 닫힘 |
| 정렬 | 최신순 / 오래된순 (`sortOrder`) |
| 새 메모 생성 폼 | 표시 / 숨김 (`isCreating`) |
| 메모 카드 | 표시 모드 / 편집 모드 (`editedMemoId`) |
| 케밥 메뉴 | 닫힘 / 메뉴 / 색상 변경 / 삭제 확인 (`openedMenuId` + `menuMode`) |

---