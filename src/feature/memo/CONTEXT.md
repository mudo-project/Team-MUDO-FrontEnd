# Memo Domain — CONTEXT
> 배치 경로: `src/feature/memo/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 메모 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: **부분 구현**. 컨테이너 열림/닫힘·영속성(4.1)은 Zustand(`useMemoStore`)로 구현되어 있다. 새 메모 생성 폼과 케밥 메뉴 열기/닫기(4.2, 4.4)는 화면 동작까지 구현됐지만, 저장·수정·색상변경·삭제는 로컬 상태·API 어디에도 반영되지 않는다. 정렬(4.3)과 실제 메모 데이터 연동은 아직 더미 데이터를 렌더링하는 정적 프로토타입 상태다.

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

### 4.2 메모 CRUD — 부분 구현 (생성 폼 UI만)

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 새 메모 생성 폼 열기 | Header `새 메모` 클릭 | `MemoContainer`의 `isCreating` state가 `true`가 되어 카드 그리드 맨 앞에 `MemoCreateForm`(제목·내용 입력 + `MemoColorPicker`)이 나타남 | 구현 완료 |
| 새 메모 저장 | `MemoCreateForm` 저장 버튼 (`react-hook-form` + `memoCreateSchema`(zod) 검증) | 폼이 닫히기만 함. 입력한 제목·내용·색상이 실제 메모 목록(`INITIAL_MEMOS`)에 추가되지 않음 | **미구현** (저장 로직 없음) |
| 새 메모 생성 취소 | `MemoCreateForm` 취소 버튼 | 입력값 초기화 후 폼 닫힘 | 구현 완료 |
| 메모 수정 | 케밥 메뉴 → `수정` | 해당 카드가 편집 모드로 전환되어 제목·내용·색상을 수정할 수 있음 | 미구현 (버튼 클릭 핸들러 없음, `MemoEditForm` 빈 껍데기) |
| 색상 변경 | 케밥 메뉴 → `색상 변경` | 해당 카드의 색상을 변경할 수 있음 | 미구현 (버튼 클릭 핸들러 없음) |
| 메모 삭제 | 케밥 메뉴 → `삭제` | 해당 메모를 삭제 | 미구현 (버튼 클릭 핸들러 없음) |

### 4.3 정렬 — 미구현 (UI만 존재)

| 기능 | 트리거 | 동작 |
|---|---|---|
| 최신순 정렬 | Nav `최신순` 클릭 | 메모 카드를 최신순으로 정렬 |
| 오래된순 정렬 | Nav `오래된순` 클릭 | 메모 카드를 오래된순으로 정렬 |

### 4.4 케밥 메뉴 — 부분 구현 (열기/닫기만)

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 메뉴 열기 | 카드 내 `⋮` 클릭 (`MemoCard`의 `openedMenuId` state) | 해당 카드에 `MemoCardMenu`(수정 / 색상 변경 / 삭제 항목) 표시 | 구현 완료 |
| 메뉴 닫기 | 다른 카드의 `⋮` 재클릭, 메뉴 바깥 클릭 (`pointerdown` + `data-memo-menu`/`data-memo-menu-trigger`) | 메뉴 숨김 | 구현 완료 |
| 항목 클릭(수정/색상 변경/삭제) | `MemoCardMenu` 내 각 버튼 | 각 기능 동작 | 미구현 (버튼만 있고 `onClick` 없음) |

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
| **MemoContainer** | 메모 컨테이너 셸. `layout.tsx`에서 라우트와 무관하게 항상 마운트되며, `useMemoStore`의 `isOpen`을 구독해 열림·닫힘을 결정(구현 완료). Header / Nav / Main 배치, `isCreating` state로 생성 폼 표시 여부를 담당. Header는 별도 컴포넌트로 분리하지 않고 이 안에 직접 작성 |
| **MemoCreateForm** | 메모 작성 폼(구현 완료). `react-hook-form` + `memoCreateSchema`(zod, `src/lib/memoCreateSchema.ts`)로 제목·내용 검증, `MemoColorPicker`로 색상 선택. 저장 시 상위(`MemoContainer`)로 값을 전달하지만 실제 메모 목록에 반영하는 로직은 아직 없음 |
| **MemoEditForm** | 메모 수정. 기존 메모의 제목·내용·색상 수정 (빈 껍데기, 미구현) |
| **MemoFilter** | 정렬 필터(최신순 / 오래된순) UI (구현 완료, 클릭 동작은 미구현) |
| **MemoCard** | 메모 목록 그리드 렌더링(구현 완료). `openedMenuId` state로 카드별 케밥 메뉴 열림 여부를 관리하고, `createForm` prop으로 받은 `MemoCreateForm`을 그리드 맨 앞에 함께 렌더링 |
| **MemoCardMenu** | 케밥 메뉴 UI(구현 완료). 수정 / 색상 변경 / 삭제 항목 표시만 하고, 각 항목의 클릭 동작은 미구현 |
| **MemoColorPicker** | 색상 선택 UI(구현 완료). `selectedColor`/`onChange` props를 받는 controlled 컴포넌트로, 현재 `MemoCreateForm`만 사용 중. 팔레트가 12색 헥스값이라 API의 5색 enum과 맞지 않음(5. 데이터 참고) |

> `approval` 도메인이 생성/수정 모달을 분리(`CreateApprovalModal` / `UpdateApprovalModal`)해 쓰는 것과 동일하게, 메모도 작성 폼과 수정 폼을 분리하는 구조로 확정.

> 메모 도메인 밖의 `src/components/layout/OpenMemo.tsx`는 Sidebar의 메모 메뉴 트리거로, `MemoContainer`와는 `useMemoStore`로만 연결된다 (컴포넌트 트리상 부모-자식 관계 아님).

### 관계

```
MemoContainer            (isCreating state)
├── MemoFilter
└── MemoCard              (memos, createForm prop / openedMenuId state)
    ├── MemoCreateForm    (createForm prop으로 전달, isCreating일 때만)
    │   └── MemoColorPicker
    ├── [카드별 반복]
    │   └── MemoCardMenu  (openedMenuId === 해당 카드 id일 때만, ⋮ 클릭 트리거)
    └── MemoEditForm       (미구현 — 케밥 메뉴 → 수정 선택 시 붙을 위치)
        └── MemoColorPicker
```

> 원래 구상은 `MemoCreateForm`/`MemoEditForm`이 `MemoContainer` 아래 `MemoCard`와 형제로 붙는 구조였지만, 실제 구현은 `MemoContainer`가 `isCreating`을 들고 있다가 `MemoCreateForm` 엘리먼트를 만들어 `MemoCard`의 `createForm` prop으로 내려주고, `MemoCard`가 그리드 안에서 카드들과 함께 렌더링하는 구조다.

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 컨테이너 열림 상태 | `src/store/useMemoStore.ts` (Zustand). 페이지 단위가 아닌 전역 스토어로 관리해 라우트 이동과 무관하게 유지 | 구현 완료 |
| 정렬 상태 | 현재 선택된 정렬 필터 | 미구현 |
| 메모 데이터 | 메모 목록 조회 및 CRUD | 미구현. `MemoContainer`의 `INITIAL_MEMOS` 더미 배열만 있고, 생성·수정·색상변경·삭제 어느 것도 이 배열에 반영되지 않음(진짜 상태 관리도 아직 없음) |
| 카드별 케밥 메뉴 열림 상태 | `MemoCard`의 `openedMenuId` state(구현 완료). 카드 1건만 열리도록 단일 id로 관리, 바깥 클릭 시 닫힘 | 구현 완료 |
| 생성 폼 표시 상태 | `MemoContainer`의 `isCreating` state(구현 완료) | 구현 완료 |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 컨테이너 | 열림 / 닫힘 |
| 정렬 | 최신순 / 오래된순 |
| 새 메모 생성 폼 | 표시 / 숨김 (`isCreating`) |
| 메모 카드 | 표시 모드 / 편집 모드 |
| 케밥 메뉴 | 열림(카드 1개) / 닫힘 (`openedMenuId`) |

---