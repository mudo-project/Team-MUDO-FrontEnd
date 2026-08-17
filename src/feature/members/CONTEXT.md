# Members Domain — CONTEXT
> 배치 경로: `src/feature/members/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 구성원(members) 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: 구성원 목록 조회·검색(4.1), 구성원 상세 조회·정보 수정(4.2), 재직 상태 변경(4.3), 계정 생성(4.4) 모두 실제 API(`src/feature/members/type.ts`·`actions.ts`, `src/service/members.service.ts`)에 연결되어 있다. 다만 상단 "전체/재직/비활성" 상태 필터는 현재 URL의 `state` 쿼리만 바꾸고 실제 목록 조회에는 반영되지 않으며, 페이지네이션(`page`/`hasNext`)도 타입·서버 호출 계층에는 준비되어 있지만 화면에 페이지 이동 UI는 없다. 자세한 내용은 8장 "확인된 이슈" 참고.

---

## 1. 개요

회사 구성원(직원) 계정을 조회·관리하는 도메인.

사용자는 구성원의 이름, 이메일, 전화번호, 역할, 입사일을 조회하고 수정할 수 있으며, 각 구성원을 휴직·퇴사·활성 상태로 전환할 수 있다. 신규 구성원에게 발급할 계정 생성도 이 도메인이 담당한다.

### 핵심 제약

- 계정을 생성할 때 이름, 아이디, 역할을 입력하면 해당 계정의 임시 비밀번호가 발급된다.
- 임시 비밀번호는 발급 시점 화면에서만 확인·복사할 수 있고, 이후에는 재조회할 수 없다.
- **재직 상태**(활성/휴직/퇴사)와 **출퇴근 상태**(출근/미출근/휴무/휴가)는 서로 다른 값이다. 이 도메인에서 변경할 수 있는 것은 재직 상태뿐이며, 출퇴근 상태는 배지로 조회만 할 수 있다.
- 구성원 상세 정보 수정 시, 실제로 값이 바뀐 필드만 API 요청에 담아 보낸다.

### 진입점

Sidebar의 `구성원` 메뉴 클릭 → `/members`(`src/app/(user)/members/page.tsx`)로 이동. 이 페이지가 이 도메인의 유일한 화면이다.

### 권한

계정 생성 버튼(`MemberCreateButton`)은 `useUserStore`(Zustand, `src/store/useUserStore.ts`)의 `permissions` 배열에 `"ACCOUNT:CREATE"`가 포함된 경우에만 렌더링된다. 그 외 조회·수정·상태변경 기능에는 이 도메인 코드 안에 별도의 권한 분기가 없다.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **구성원** | 조직에 소속된 직원 계정 1건 (`MemberListData`) |
| **재직 상태** | 계정의 활성/휴직/퇴사 여부. `MemberAccountStatus`: `ACTIVE`(활성) / `INACTIVE`(휴직) / `RESIGNED`(퇴사) |
| **출퇴근 상태** | 당일 출근 여부. `MemberAttendanceStatus`: `PRESENT`(출근) / `ABSENT`(미출근) / `OFF`(휴무) / `LEAVE`(휴가). 이 도메인에서는 배지로 조회만 가능하다 |
| **구성원 상세 모달** | 목록에서 구성원 행을 클릭하면 열리는 조회·수정 모달(`ViewMembersModal`) |
| **계정 생성 모달** | 상단 `계정 생성` 버튼으로 여는, 신규 계정을 만드는 모달(`CreateMemberModal`) |
| **임시 비밀번호** | 계정 생성 시 함께 발급되는 초기 비밀번호. 발급 직후에만 화면에 노출되고 복사할 수 있다 |

---

## 3. 화면 구성

구성원 페이지는 상단 액션 영역과 하단 목록 영역으로 구성된다.

```text
┌─ 구성원 페이지 ────────────────────────────────────────────┐
│ [검색창]   [전체|재직|비활성]      총 N명   [계정 생성]     │
├───────────────────────────────────────────────────────────┤
│ 이름            역할      연락처      입사일      상태      │
├───────────────────────────────────────────────────────────┤
│ 구성원 행 (클릭 시 상세 모달)                                │
│ 구성원 행                                                    │
│ ...                                                          │
└───────────────────────────────────────────────────────────┘
```

### 상단 액션 영역

| 요소 | 설명 |
|---|---|
| 검색창 | 이름·역할 통합 키워드 검색(`MemberSearchInput`) |
| 상태 필터 탭 | 전체 / 재직 / 비활성 탭(`MemberStateFilter`). URL `state` 값만 바꾸며 탭 강조 외의 동작은 없다(8장 참고) |
| 총 인원 수 | 현재 화면에 표시된 구성원 수. 서버 전체 합계가 아니라 응답 `content` 배열의 길이다 |
| 계정 생성 버튼 | `ACCOUNT:CREATE` 권한 보유자에게만 노출(`MemberCreateButton`) |

### 하단 목록 영역

- 컬럼: 이름(+이메일), 역할, 연락처, 입사일(640px 미만에서는 숨김), 출퇴근 상태 배지(640px 미만에서는 숨김).
- 각 행은 버튼으로 구현되어 있으며, 클릭하면 `ViewMembersModal`이 열린다.
- 목록이 비어 있거나 조회에 실패하면 안내 문구만 표시한다.

---

## 4. 기능 목록

### 4.1 페이지 진입 / 조회 / 검색 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 구성원 페이지 이동 | Sidebar `구성원` 클릭 | `/members`로 이동 |
| 구성원 목록 조회 | 페이지 진입 (서버 컴포넌트 `MembersPage`) | `getMemberListAction({ keyword, roleId, page })` → `GET /api/users/members` 조회. 실패 시 응답 메시지를 목록 자리에 그대로 표시 |
| 이름·역할 검색 | 검색창 입력(`MemberSearchInput`) | `useDebounce`가 500ms 후 URL의 `keyword` 쿼리스트링을 갱신(`router.replace`)하고 `page`를 0으로 초기화. 서버 컴포넌트가 새 쿼리로 재조회 |
| 상태 탭 전환 | 상단 탭(`MemberStateFilter`) 클릭 | URL의 `state` 값을 `all`/`employ`/`unemploy`로 바꿔 탭 강조만 갱신한다. `getMemberListAction`에는 전달되지 않아 실제 조회 결과는 바뀌지 않는다(8장 참고) |

### 4.2 구성원 상세 조회 / 정보 수정 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 상세 모달 열기 | 목록에서 구성원 행 클릭 | `MemberItem`의 `useModal`이 열리며 `ViewMembersModal` 표시. 진입 시 이름 입력창에 자동 포커스(`setFocus("name")`) |
| 역할 목록 불러오기 | 모달 마운트 | `getRoleListAction`으로 역할 옵션 조회. 조회 결과가 비어 있으면 기존 역할명을 단일 옵션으로 대신 표시 |
| 이름/연락처/이메일/입사일/역할 수정 | 각 입력값 변경 후 저장 버튼(`react-hook-form` + `authEditSchema`(zod) 검증: 이메일 형식, 전화번호 `00-0000-0000` 형식, 입사일 `YYYY-MM-DD` 형식) | `onSubmit`이 기존 값과 달라진 필드만 골라 `updateMemberAction(userId, payload)` 호출 → `PATCH /api/users/{userId}`. 성공 시 토스트 + `router.refresh()` + 모달 닫힘, 실패 시 에러 토스트만 표시하고 모달·입력값 유지 |
| 저장하지 않고 닫기 확인 | X 버튼 또는 배경 클릭(`handleClose`) | 역할 선택값이 원래 값과 다르면 확인 모달을 띄우고, 같으면 바로 닫는다(8장의 구현 이슈로 이 비교가 항상 "같음"으로 평가된다) |

### 4.3 재직 상태 변경 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 상태 변경 버튼 노출 | 상세 모달 하단 | 현재 상태(`member.status`)와 다른 상태로 전환하는 버튼만 노출한다(예: 이미 활성 상태면 "계정 활성화" 버튼은 표시되지 않음) |
| 상태 변경 확인 | `계정 활성화` / `휴직 처리` / `퇴사 처리` 버튼 클릭 | 선택한 상태를 `selectedStatus`에 저장하고 확인 모달(`TwoButtonModal`)을 연다 |
| 상태 변경 실행 | 확인 모달의 확인 버튼 | `changeMemberStatusAction(userId, selectedStatus)` 호출 → `PATCH /api/users/{userId}/status`. 성공 시 토스트 + `router.refresh()`. 상세 모달 자체는 닫히지 않고 그대로 유지된다 |

### 4.4 계정 생성 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 생성 모달 열기 | 상단 `계정 생성` 버튼(`ACCOUNT:CREATE` 권한 보유자만 노출) | `CreateMemberModal` 표시. 마운트 시 `getRoleListAction`으로 역할 목록 조회 |
| 이름/아이디/역할 입력 | 각 입력란(`react-hook-form` + `authSchema`(zod) 검증: 아이디 2~50자, 이름 필수, 역할은 0 이상의 정수) | 유효성 통과 후 제출 가능 |
| 계정 생성 | 저장 버튼 클릭 | `createEmployeeAccountAction(payload)` 호출 → `POST /api/users`. 성공 시 응답의 아이디·임시 비밀번호로 화면이 결과 표시 영역으로 전환, 실패 시 에러 토스트 후 입력 폼 유지 |
| 임시 비밀번호 복사 | 결과 화면의 복사 아이콘 클릭 | `navigator.clipboard.writeText`로 "아이디: {username} 비밀번호: {temporaryPassword}" 복사, 성공/실패 토스트 표시 |
| 저장 확인 후 닫기 | X 버튼 또는 배경 클릭(`handleClose`) | 임시 비밀번호가 이미 발급된 상태에서 닫으려 하면 "임시비밀번호는 재조회가 불가능합니다. 저장하셨습니까?" 확인 모달을 띄운다. 확인 시 모달이 닫히고 `router.refresh()`로 새 구성원이 목록에 반영된다 |

---

## 5. 데이터

구성원 한 건이 가지는 정보(`MemberListData`).

| 항목 | 조회 | 수정 | 설명 |
|---|---|---|---|
| 이름 | 가능 | 가능 | 구성원 이름 |
| 이메일 | 가능 | 가능 | 연락용 이메일 |
| 전화번호 | 가능 | 가능 | `00-0000-0000` 형식 |
| 역할 | 가능 | 가능(8장의 구현 이슈 있음) | role 도메인의 역할을 참조(`roleId`/`roleName`) |
| 입사일 | 가능 | 가능 | `YYYY-MM-DD` |
| 재직 상태 | 가능 | 가능(전용 버튼으로만) | 활성 / 휴직 / 퇴사 |
| 출퇴근 상태 | 가능 | 불가능 | 출근 / 미출근 / 휴무 / 휴가. 배지로만 표시 |
| 아이디 | 계정 생성 시에만 확인 가능 | - | 로그인 아이디. 생성 이후에는 이 도메인에 조회·수정 UI가 없다 |

---

## 6. 컴포넌트 구성

기능 단위로 분해했을 때 필요한 컴포넌트와 책임.

| 컴포넌트 | 책임 |
|---|---|
| **MembersPage** | 페이지 서버 컴포넌트(구현 완료, `src/app/(user)/members/page.tsx`). `searchParams`의 `keyword`/`roleId`/`page`로 `getMemberListAction`을 호출해 목록을 조회하고, 상단 액션 영역과 목록 테이블을 배치. `state`는 `MemberStateFilter`에 그대로 넘기기만 하고 조회 조건에는 쓰지 않는다 |
| **MemberSearchInput** | 검색창(구현 완료). `keyword` prop으로 초기값을 받는 controlled input이며, `useDebounce(searchInput, true)`로 500ms 뒤 URL의 `keyword` 쿼리를 갱신하고 `page`를 0으로 리셋 |
| **MemberStateFilter** | 상태 필터 탭(구현 완료, UI 한정). `state` prop과 현재 탭을 비교해 활성 스타일을 주는 `Link` 3개(`all`/`employ`/`unemploy`)로만 구성되어 있고, 조회 로직과는 연결되어 있지 않다 |
| **MemberCreateButton** | 계정 생성 진입점(구현 완료). `useUserStore`의 `permissions`에 `ACCOUNT:CREATE`가 있을 때만 버튼과 `CreateMemberModal`을 렌더 |
| **MemberItem** | 목록 행 1건(구현 완료). `member` prop을 받아 이름/이메일/역할/연락처/입사일/출퇴근 상태 배지를 표시하고, 클릭 시 `ViewMembersModal`을 여는 `useModal` 상태를 가짐 |
| **CreateMemberModal** | 계정 생성 모달(구현 완료). `react-hook-form` + `authSchema`(zod, `src/lib/authSchema.ts`)로 이름·아이디·역할을 검증하고, 마운트 시 `getRoleListAction`으로 역할 옵션을 채움. 생성 성공 시 같은 모달 안에서 임시 비밀번호 결과 화면으로 전환되고, `handleCloseAll`(내부 확인 모달의 `activeModal`)에서 `closeModal` + `router.refresh()`를 함께 호출 |
| **ViewMembersModal** | 구성원 상세 조회·수정 모달(구현 완료). `member` prop으로 초기값을 채운 `react-hook-form` + `authEditSchema`(zod)로 이름·이메일·연락처·입사일·역할을 수정하고, 하단에서 재직 상태 변경 버튼과 확인 모달(`TwoButtonModal`)을 함께 관리 |

> 삭제/역할 선택 확인처럼 "저장 여부 확인" 다이얼로그는 별도 컴포넌트가 아니라 공용 `src/components/ui/TwoButtonModal.tsx`를 `useModal`의 두 번째 인자(콜백)와 함께 재사용하는 방식이다. `CreateMemberModal`(저장 확인), `ViewMembersModal`(역할 미저장 확인·재직 상태 변경 확인)이 모두 이 패턴을 쓴다.

### 관계

```text
MembersPage                 (keyword/roleId/page 쿼리로 getMemberListAction 호출)
├── MemberSearchInput        (keyword prop)
├── MemberStateFilter        (state prop — 조회에는 미반영)
├── MemberCreateButton       (ACCOUNT:CREATE 권한 시에만 렌더)
│   └── CreateMemberModal
│       └── TwoButtonModal   (임시 비밀번호 미저장 닫기 확인)
└── [구성원별 반복] MemberItem (member prop)
    └── ViewMembersModal      (member, closeModal props)
        └── TwoButtonModal    (역할 미저장 닫기 확인 / 재직 상태 변경 확인 — 각각 별도 useModal)
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 검색·필터·페이지 상태 | URL 쿼리스트링(`keyword`/`state`/`roleId`/`page`)으로 관리, 별도 클라이언트 상태 저장소 없음 | 부분 구현 완료(`state`는 조회에 미반영, 8장 참고) |
| 권한 상태 | `src/store/useUserStore.ts`(Zustand)의 `permissions` 배열 | 구현 완료 |
| 임시 비밀번호 표시 상태 | `CreateMemberModal`의 `temporary` state(`username`/`temporaryPassword`) | 구현 완료 |
| 재직 상태 변경 대상 | `ViewMembersModal`의 `selectedStatus` state | 구현 완료 |

---

## 7. 상태 정리

| 상태 | 값 또는 설명 |
|---|---|
| 검색어 | URL `keyword` 쿼리 (입력 후 500ms 디바운스로 반영) |
| 상태 필터 탭 | URL `state` 쿼리 (`all`/`employ`/`unemploy`, 목록 조회 결과에는 미반영) |
| 페이지 | URL `page` 쿼리 (화면에 페이지 이동 UI 없음) |
| 구성원 상세 모달 | 열림 / 닫힘 (`MemberItem`의 `useModal`) |
| 구성원 상세 모달 – 닫기 확인 | 열림 / 닫힘 (`ViewMembersModal`의 `modal`) |
| 구성원 상세 모달 – 상태변경 확인 | 열림 / 닫힘 + 선택된 상태(`selectedStatus`) |
| 계정 생성 모달 | 열림 / 닫힘 (`MemberCreateButton`의 `useModal`) |
| 계정 생성 모달 – 발급 결과 | 미발급 / 발급됨(`temporary.username` + `temporaryPassword`) |
| 계정 생성 모달 – 닫기 확인 | 열림 / 닫힘 (`CreateMemberModal`의 `modal`) |

---

## 8. 확인된 이슈

문서 작성을 위해 실제 구현 코드를 읽는 과정에서 확인된, 기획 의도와 다르게 동작할 수 있는 지점이다. 이 문서 작성 범위에서는 코드를 수정하지 않았다.

- **역할 수정이 반영되지 않을 수 있음**: `ViewMembersModal`의 `role` state(`useState<number | "">(member.roleId ?? "")`)는 선언만 되어 있고 `setRole`을 호출하는 곳이 코드 안에 없다. `onSubmit`은 역할이 바뀌었는지 여부는 `react-hook-form`의 `data.roleId`로 정확히 판단하지만, 실제로 서버에 보내는 값은 `Number(role)`(항상 초기값)이다. 즉 드롭다운에서 역할을 바꿔 저장해도 요청에는 기존 역할 번호가 실릴 수 있다.
- **상태 필터 미반영**: 상단 "전체/재직/비활성" 탭은 URL의 `state` 쿼리만 바꾸고, `MembersPage`가 `getMemberListAction`을 호출할 때 이 값을 params로 넘기지 않는다. `MemberListParams`(`keyword`/`roleId`/`page`)에도 상태 필터를 위한 필드가 없어, 탭을 눌러도 목록 내용은 바뀌지 않는다.
- **"총 N명"은 전체 합계가 아님**: 상단에 표시되는 인원 수는 서버가 별도로 내려주는 총합 필드가 아니라 현재 응답 `content` 배열의 길이(`members.length`)다. 페이지네이션이 실제로 쓰이게 되면 이 숫자는 "현재 페이지에 표시된 인원 수"로 읽어야 한다.
- **페이지네이션 UI 없음**: `MemberListPageData`에 `page`/`size`/`hasNext` 필드가 있어 서버 응답과 액션 파라미터 계층은 페이지네이션을 지원하지만, 화면에는 페이지를 이동할 수 있는 버튼/컨트롤이 아직 없다.
