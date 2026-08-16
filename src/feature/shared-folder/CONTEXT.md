# Shared Folder(공유폴더) Domain — CONTEXT
> 배치 경로: `src/feature/shared-folder/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 공유폴더 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.

---

## 1. 개요

학원의 자료(폴더·파일)를 한곳에서 관리하는 도메인. Google Drive와 실제로 연동되어 폴더 목록 조회와 폴더 탐색을 수행한다.

화면 디자인과 조작 방식은 Google Drive를 따른다 — 상단 검색바·필터·새로만들기, 그 아래 파일경로와 폴더/파일 목록으로 구성된 저장소 컨테이너 구조다.

화면 진입 시에는 `GET /api/shared-files/root`를 호출해 공유파일 시스템 루트가 사용 가능한 상태(`ready`)인지부터 확인한다. 사용할 수 없으면 목록 대신 안내와 "다시 만들기"(`POST /api/shared-files/root/recreation`) 버튼만 보여준다.

루트가 준비되면 `GET /api/shared-files/items`로 폴더 목록을 실제로 조회하고, 폴더 진입·breadcrumb 이동·더 보기(페이지네이션)·새 폴더 생성·Google Docs/Sheets/Slides 생성·파일 업로드·이름 변경·이동·삭제·다운로드·미리보기 열기까지 실제 API로 동작한다. 파일 이름을 클릭하면 미리보기 열기와 동일하게 `viewUrl`을 새 탭으로 연다. 케밥 메뉴에는 상세 보기 항목이 없다.

### 핵심 제약

- 폴더/파일의 실제 저장·관리 주체는 Google Drive이며, 자세한 API 계약은 `.docs/api/shared-folder/apiIntegration.md`를 따른다.
- 파일의 종류는 Google Docs, Google Sheets, Google Slides, 사용자가 업로드한 파일 네 가지로 구분한다. 서버는 Google Drive의 `mimeType`만 내려주므로, 프론트가 `mimeType`을 보고 이 네 가지 중 하나로 분류해 아이콘·표시값을 정한다(`sharedFolderFormat.ts`).
- API는 항목의 수정자(작성자)와 크기를 내려주지 않는다. 두 컬럼은 화면 레이아웃 유지를 위해 그대로 두되 값은 항상 "-"로 표시한다.
- 목록 조회는 한 번에 `size: 100`으로 요청한다. `hasNext`가 참이면 목록 하단에 "더 보기" 버튼이 나타나 `nextCursor`로 다음 페이지를 이어서 불러온다.
- 필터·검색은 현재까지 불러온 목록 위에서만 동작하는 클라이언트 사이드 필터링이다(전체 검색 API는 아직 사용하지 않음).
- 새 폴더 생성, Google Docs/Sheets/Slides 생성, 파일 업로드는 모두 **현재 위치한 경로**를 기준으로 생성·업로드된다. 현재 위치가 공유파일 루트(최상위)일 때는 `GET /api/shared-files/root`가 내려준 `rootId`를 `parentId`로 사용한다.
- Google Docs/Sheets/Slides 생성, 파일 업로드에 성공하면 목록을 다시 불러온다(경로 이동이 없어 새 폴더 생성과 달리 목록을 직접 다시 조회해야 한다). Google 파일 생성은 이어서 "새 탭에서 열기" 모달도 띄운다.
- 파일 업로드는 100MB 초과 시 요청을 보내지 않고 바로 안내한다(API 명세의 업로드 용량 제한과 동일).
- 이름 변경·이동에 성공하면 목록을 다시 불러온다(경로 이동이 없으므로).
- 이동은 공유파일 루트(`rootId`) 또는 하위 폴더로 들어간 위치로 할 수 있다. 이동 모달에서 탐색 위치가 곧 이동 대상이며, 최상위(공유파일 루트)에서도 `이동` 버튼이 활성화된다.
- 삭제는 Google Drive 휴지통으로 이동하는 것이며 API가 하위 항목 개수를 내려주지 않아, 삭제 확인 모달에는 하위 항목 개수를 표시하지 않는다. 성공하면 목록을 다시 불러온다(경로 이동이 없으므로).
- 다운로드는 서버 응답(바이너리)을 base64 문자열로 감싸 Server Action으로 반환한 뒤, 클라이언트에서 Blob으로 복원해 브라우저 다운로드를 트리거한다.
- 다운로드 응답의 `Content-Disposition` 파일명은 RFC 2047 encoded-word(`=?UTF-8?Q?...?=`/`=?UTF-8?B?...?=`)와 RFC 5987(`filename*=UTF-8''...`) 두 형식 모두 올 수 있어, `sharedFolder.service.ts`의 `decodeContentDispositionFilename()`이 두 형식을 모두 디코딩한다(그냥 `decodeURIComponent`만 쓰면 encoded-word 형식은 그대로 노출되어 OS가 `?` 등 금지 문자를 `_`로 바꾼 이상한 파일명으로 저장된다).
- 미리보기 열기는 별도 확인 모달 없이 항목의 `viewUrl`을 곧바로 새 탭으로 연다(Google 파일 생성 직후의 "새 탭에서 열기" 모달과 달리 확인 절차가 없다). 내용 행의 파일 이름 클릭도 동일하게 동작한다.
- 다운로드는 항목의 `downloadable`이 `true`인 파일에만 제공한다(케밥 메뉴에 `다운로드` 항목 자체가 나타나지 않는 경우 존재).
- Google Docs/Sheets/Slides는 원본 바이너리가 없어 항상 변환 형식(`format`)을 지정해야 한다(생략하면 Drive가 처리하지 못해 `SHAREDFILE_502_1`). 다운로드 클릭 시 원본 유형에 맞는 형식 선택 모달(`SharedFolderDownloadFormatModal`)이 먼저 뜨고, 선택한 형식으로 다운로드한다(Docs→PDF/DOCX, Sheets→PDF/XLSX, Slides→PDF/PPTX, `getSharedFolderDownloadFormats()`). 일반 업로드 파일은 형식 선택 없이 바로 원본을 다운로드한다.

### 진입점

Sidebar의 공유폴더 메뉴를 클릭해 공유폴더 화면으로 이동할 수 있다. (`src/components/layout/Sidebar.tsx`에 아직 공유폴더 메뉴 항목이 없어 미구현 상태다.)

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **공유파일 시스템 루트** | 이 학원의 공유폴더 전체를 담는 최상위 폴더. `GET /api/shared-files/root`로 사용 가능 여부(`ready`)와 Drive 폴더 ID(`rootId`)를 확인할 수 있다 |
| **저장소 컨테이너** | 화면 상단(검색바·필터·새로만들기) 아래에 위치하는, 파일경로와 폴더/파일 목록을 보여주는 영역 |
| **필터 탭** | 상단 툴바의 전체/폴더/파일 탭. 클릭하면 현재까지 불러온 목록을 종류별로 걸러 보여준다 |
| **파일경로** | 저장소 컨테이너 최상단에 표시되는 현재 위치 breadcrumb. "공유파일 루트"와 하위 폴더들이 `/`로 이어지며, 각 구간을 클릭하면 그 경로로 이동한다 |
| **제목 행** | 이름·종류·수정자·수정일·크기·케밥 메뉴 공간(화면상 빈 값)으로 구성된 목록 헤더 |
| **내용 행** | 폴더 또는 파일 1건을 표시하는 행. 폴더/파일 여부에 따라 표시되는 값이 다르다 |
| **케밥 메뉴** | 내용 행 우측의 `⋮` 버튼과 그 하위 메뉴. 폴더는 이름 변경/이동/삭제, 파일은 미리보기 열기/다운로드(`downloadable`이 `true`일 때만)/이름 변경/이동/삭제로 구성되며 모두 실제로 동작한다 |
| **새로만들기 컨테이너** | 상단 `새로 만들기` 버튼 클릭 시 나타나는, 새 폴더/Google Docs/Google Sheets/Google Slides/파일 업로드 선택 영역 |
| **새 폴더 만들기 모달** | 새 폴더 클릭 시 나타나는, 현재 위치와 폴더 이름을 입력하는 모달 |
| **Docs/Sheets/Slides 만들기 모달** | Google Docs/Sheets/Slides 클릭 시 나타나는, 파일 이름을 입력하는 모달 |
| **새 탭에서 열기 모달** | Docs/Sheets/Slides 생성 완료 후 나타나는, 새 탭에서 해당 파일을 열지 안내하는 모달. 실제로 Google Drive의 편집 URL을 새 탭으로 연다 |
| **이름 변경 모달** | 폴더 또는 파일의 이름을 바꾸는 모달. 입력창에 현재 이름이 채워진 상태로 열린다 |
| **이동 모달** | 폴더 또는 파일을 다른 폴더로 옮기는 모달. 전체 폴더 트리를 한 번에 보여주는 API가 없어, 공유파일 루트부터 한 단계씩 하위 폴더로 들어가며 탐색하는 방식이다. 하위 폴더로 들어간 상태에서만 그 위치로 `이동` 버튼이 활성화된다(공유파일 루트 자체로는 이동 불가) |
| **삭제 확인 모달** | 폴더 또는 파일을 삭제(Google Drive 휴지통으로 이동)하기 전 확인하는 모달. API가 하위 항목 개수를 내려주지 않아 개수는 표시하지 않는다 |

---

## 3. 화면 구성

```
┌─ 공유폴더 화면 ──────────────────────────────────────────┐
│ [검색바]              [필터]         [새로 만들기]        │
├───────────────────────────────────────────────────────────┤
│ [저장소 컨테이너]                                         │
│  공유파일 루트 / 폴더A / 폴더B                            │  ← 각 구간 클릭 시 이동
│ ───────────────────────────────────────────────────────── │
│  이름          | 종류        | 수정자 | 수정일  | 크기 | ⋮ │
│  📁 폴더 이름  | 폴더        | -      | 08.01   | -    | ⋮ │
│  📄 문서 이름  | Google Docs | -      | 07.30   | -    | ⋮ │
│  📄 업로드 파일| 파일        | -      | 07.29   | -    | ⋮ │
└───────────────────────────────────────────────────────────┘
```

- 시스템 루트를 사용할 수 없는 상태(`ready: false`, 조회 실패)면 목록 대신 안내 문구와 "다시 만들기" 버튼만 보여준다.
- 목록을 불러오는 중에는 "불러오는 중..." 문구를, 조회에 실패하면 서버가 내려준 오류 메시지를 보여준다.
- 현재 폴더에 항목이 실제로 하나도 없으면 "이 폴더에 파일이 없습니다." 안내와 함께 파일 업로드/폴더 만들기 버튼을 보여준다(둘 다 실제로 동작한다).
- 현재 폴더에 항목은 있지만 필터·검색 조건에 맞는 항목이 없으면 "파일이 없습니다." 문구만 보여준다(버튼 없음).
- 서버에 다음 페이지가 남아있으면(`hasNext`) 목록 맨 아래에 "더 보기" 버튼이 나타난다.

### 내용 행 — 폴더

폴더 아이콘, 폴더 제목(버튼 — 클릭하면 해당 폴더로 진입), 종류(고정값 "폴더"), 수정자("-"), 수정일 날짜, 크기("-"), 케밥 메뉴로 구성된다.

### 내용 행 — 파일

종류별 아이콘, 파일 제목(버튼 — 클릭하면 `viewUrl`을 새 탭으로 열어 미리보기), 종류(Google Docs/Google Sheets/Google Slides/업로드 파일 종류에 따라 표시), 수정자("-"), 수정일 날짜, 크기("-"), 케밥 메뉴로 구성된다.

---

## 4. 기능 목록

### 4.0 시스템 루트 상태

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 루트 상태 확인 | 화면 진입 | `GET /api/shared-files/root` 조회 결과 `ready`가 참이면 목록을 불러오고, 아니거나 조회 자체가 실패하면 안내 화면으로 전환 | 구현 완료 |
| 루트 재생성 | 안내 화면의 `다시 만들기` 클릭 | `POST /api/shared-files/root/recreation` 호출. 성공하면 목록 화면으로 전환, 실패하면 안내 화면에 오류 메시지 표시 | 구현 완료 |

### 4.1 필터 · 검색

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 필터 전환 | 상단 전체/폴더/파일 탭 클릭 | 현재까지 불러온 목록을 클릭한 종류로 걸러 보여줌 | 구현 완료 |
| 파일명 검색 | 검색바 입력 | 입력한 문자열을 포함하는 **파일**만 결과에 남김. 검색어가 있으면 폴더는 결과에서 제외된다 | 구현 완료 — 현재 폴더에서 이미 불러온 목록 안에서만 걸러낸다(전체 검색 API는 사용하지 않음) |

> 필터가 "폴더"인 상태에서 검색어를 입력하면 항상 결과가 없다 — 검색은 파일에만 적용되기 때문이다.
> 목록은 한 번에 최대 100건까지 불러오므로, 그보다 많은 파일이 있는 폴더에서는 "더 보기"로 더 불러오기 전까지 검색 결과에서 빠질 수 있다.

### 4.2 저장소 탐색

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 폴더 진입 | 내용 행의 폴더 이름 클릭 | `GET /api/shared-files/items?parentId=...`로 해당 폴더를 조회, 파일경로·필터·검색어 초기화 | 구현 완료 |
| 경로 이동(breadcrumb) | 파일경로의 "공유파일 루트" 또는 상위 폴더명 클릭 | 클릭한 경로를 다시 조회, 필터·검색어 초기화 | 구현 완료 |
| 더 보기 | 목록 하단 `더 보기` 클릭(`hasNext`가 참일 때만 노출) | `cursor`로 다음 페이지를 이어서 불러와 목록에 추가 | 구현 완료 |
| 파일 미리보기 | 내용 행의 파일 이름 클릭 | 항목의 `viewUrl`을 새 탭으로 연다(케밥 메뉴의 `미리보기 열기`와 동일) | 구현 완료 |
| 빈 폴더 안내(실제로 항목 없음) | 현재 폴더에 항목이 0건 | "이 폴더에 파일이 없습니다." 문구 + 파일 업로드/폴더 만들기 버튼 표시 | 구현 완료 |
| 결과 없음 안내(필터·검색으로 인함) | 항목은 있으나 필터·검색 결과가 0건 | "파일이 없습니다." 문구만 표시 | 구현 완료 |
| 목록 조회 실패 안내 | 목록 조회 API 실패 | 서버가 내려준 오류 메시지를 목록 영역에 표시 | 구현 완료 |

### 4.3 새로 만들기

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 새로만들기 컨테이너 열기/닫기 | 상단 `새로 만들기` 버튼 클릭 / 바깥 클릭 | 새 폴더/Google Docs/Google Sheets/Google Slides/파일 업로드 선택 영역 표시/닫힘 | 구현 완료 |
| 새 폴더 만들기 모달 열기/닫기 | 컨테이너에서 `새 폴더` 클릭 / 취소·바깥 클릭 | 현재 위치·폴더 이름 입력 모달 표시/닫힘 | 구현 완료 |
| 새 폴더 생성 | 모달 `만들기` 클릭(이름 미입력 시 버튼 비활성) | `POST /api/shared-files/folders` 호출. 성공하면 생성된 폴더로 즉시 이동하며 필터·검색어 초기화, 실패하면 토스트로 오류 안내 | 구현 완료 |
| Docs/Sheets/Slides 만들기 모달 열기/닫기 | 컨테이너에서 `Google Docs`/`Google Sheets`/`Google Slides` 클릭 / 취소·바깥 클릭 | 입력창 모달(제목이 선택한 종류에 맞춰 바뀜) 표시/닫힘 | 구현 완료 |
| Docs/Sheets/Slides 생성 | 모달 `만들기` 클릭 | `POST /api/shared-files/google-files` 호출. 성공하면 목록을 다시 불러오고 새 탭에서 열기 모달 표시, 실패하면 토스트로 오류 안내 | 구현 완료 |
| 새 탭에서 열기 | 새 탭에서 열기 모달의 `새 탭에서 열기` 클릭 | 생성된 파일의 `viewUrl`을 새 탭으로 연다 | 구현 완료 |
| 파일 업로드 | 컨테이너에서 `파일 업로드` 클릭 → 네이티브 파일 선택 창에서 파일 선택 | `POST /api/shared-files/items/upload`(multipart)로 업로드, 100MB 초과 시 요청 전에 막는다. 성공하면 목록을 다시 불러온다 | 구현 완료 |

### 4.4 케밥 메뉴 — 폴더 · 파일

| 기능 | 트리거 | 동작 | 상태 |
|---|---|---|---|
| 메뉴 열기/닫기 | 행의 `⋮` 클릭 / 바깥 클릭 / 다른 행의 `⋮` 클릭 | 폴더는 이름 변경/이동/삭제, 파일은 미리보기 열기/다운로드(`downloadable`일 때만)/이름 변경/이동/삭제 항목이 있는 컨테이너 표시/닫힘. 한 번에 하나의 행 메뉴만 열린다 | 구현 완료 |
| 이름 변경 | 메뉴 `이름 변경` → 모달에서 `변경`(값 미입력 시 버튼 비활성) | `PATCH /api/shared-files/items/{itemId}`(`name`)으로 이름 변경, 성공 시 목록을 다시 불러온다 | 구현 완료 |
| 이동 | 메뉴 `이동` → 모달에서 공유파일 루트 또는 하위 폴더로 들어가 `이동` 클릭 | `PATCH /api/shared-files/items/{itemId}`(`parentId`)으로 이동, 성공 시 목록을 다시 불러온다 | 구현 완료 |
| 삭제 | 메뉴 `삭제` → 확인 모달에서 `삭제` 클릭 | `DELETE /api/shared-files/items/{itemId}` 호출(Google Drive 휴지통으로 이동), 성공 시 목록을 다시 불러온다 | 구현 완료 |
| 미리보기 열기 | 메뉴 `미리보기 열기` 클릭 | 항목의 `viewUrl`을 새 탭으로 연다(확인 모달 없음) | 구현 완료 |
| 다운로드 | 메뉴 `다운로드` 클릭(`downloadable`이 `false`인 파일은 메뉴에 항목 자체가 없음) | 일반 업로드 파일은 바로 `GET /api/shared-files/items/{itemId}/download` 호출(원본 형식). Google Docs/Sheets/Slides는 형식 선택 모달을 먼저 띄우고 선택한 `format`으로 같은 API를 호출한다. 성공 시 브라우저 다운로드를 실행하고, 실패 시 토스트로 오류 안내 | 구현 완료 |

---

## 5. 데이터

`src/feature/shared-folder/type.ts`에 정의된 타입을 사용한다. API 응답의 id는 Google Drive 파일·폴더 ID(문자열)다.

### 폴더/파일 공통 항목(`SharedFolderDriveItemData`)

| 항목 | 필드명 | 설명 |
|---|---|---|
| 아이디 | `id` | Google Drive 파일·폴더 ID. 폴더 진입 등에 사용 |
| 이름 | `name` | 폴더/파일 제목 |
| MIME 타입 | `mimeType` | Google Drive MIME type. `getSharedFolderItemKind`/`getSharedFolderFileType`(`sharedFolderFormat.ts`)로 화면 표시용 폴더/파일 종류로 변환한다 |
| 미리보기 URL | `viewUrl` | Google 새 탭 미리보기·편집 URL. 케밥 메뉴 `미리보기 열기` 클릭 시 이 URL을 새 탭으로 연다 |
| 다운로드 가능 여부 | `downloadable` | 케밥 메뉴의 `다운로드` 항목 노출 여부를 결정한다(`SharedFolderItemMenu`). `false`인 파일(Google Docs/Sheets/Slides 등 원본 바이너리가 없는 파일)은 다운로드 항목이 아예 나타나지 않는다 |
| 수정일 | `modifiedAt` | ISO 시각. `formatSharedFolderModifiedAt`으로 `YYYY.MM.DD HH:mm` 형태로 변환해 표시 |

### 화면에는 있지만 API에는 없는 항목

| 항목 | 처리 |
|---|---|
| 수정자 | API가 내려주지 않아 항상 "-"로 표시 |
| 크기 | API가 내려주지 않아 항상 "-"로 표시 |

### 목록·페이지네이션

| 항목 | 설명 |
|---|---|
| 현재 경로 | `SharedFolderBoard`의 `path: { id, name }[]` 배열로 관리. 폴더 진입 시 push, breadcrumb 클릭 시 그 지점까지 자른다. 빈 배열이면 공유파일 루트를 의미한다 |
| 페이지네이션 | 목록 조회는 한 번에 `size: 100`으로 요청한다. `hasNext`가 참이면 `nextCursor`로 다음 페이지를 이어서 불러온다(더 보기) |

---

## 6. 컴포넌트 구성

`src/feature/shared-folder/components/`에 실제로 존재하는 컴포넌트 기준.

| 컴포넌트 | 책임 |
|---|---|
| **SharedFolderBoard** | 화면 최상위 컴포넌트(client). 마운트 시 시스템 루트 상태(`rootStatus`)를 확인해 사용 불가능하면 안내 화면만 보여준다. 준비되면 목록(`items`)과 로딩·오류·페이지네이션 상태, 현재 경로(`path`), 필터·검색어, 새로만들기·케밥 메뉴 열림 상태, 새 폴더 만들기·Google 파일 만들기·새 탭에서 열기·이름 변경·이동·삭제·다운로드 형식 선택 모달의 열림 상태(`renamingItem`/`movingItem`/`deletingItem`/`downloadFormatItem`)와 제출 상태(`isSubmitting`/`isDownloading`)를 소유한다. 숨겨진 `input[type=file]`(`fileInputRef`)도 여기서 관리한다. 마운트·경로 변경 시 목록을 자동 조회하는 effect는 `.then/.catch/.finally` 안에서만 state를 바꾼다(effect 안에서 곧바로 setState하지 않기 위함). 새 폴더 생성 성공 시에는 생성된 폴더로 바로 이동하고(경로가 바뀌며 자동 조회 effect가 다시 실행됨), Google 파일 생성·파일 업로드·이름 변경·이동·삭제 성공 시에는 경로 이동이 없어 `refreshItems`로 같은 경로를 직접 다시 조회한다. 미리보기 열기(내용 행 파일 이름 클릭·케밥 메뉴 모두)는 확인 없이 바로 `viewUrl`을 새 탭으로 열고, 다운로드는 `handleDownloadRequest`가 `getSharedFolderDownloadFormats()`로 형식 선택이 필요한지 가른 뒤(필요 없으면 바로 원본 다운로드, 필요하면 `SharedFolderDownloadFormatModal`을 띄움) base64 응답을 Blob으로 복원해 브라우저 다운로드를 트리거한다 |
| **SharedFolderToolbar** | 상단 검색바·필터 탭·새로 만들기 버튼(client). 검색어·필터 변경과 새로만들기 컨테이너에서 선택한 옵션을 그대로 부모에 전달한다 |
| **SharedFolderCreateMenu** | `새로 만들기` 클릭 시 나타나는 컨테이너. 선택한 옵션(`FOLDER`/`GOOGLE_DOCS`/`GOOGLE_SHEETS`/`GOOGLE_SLIDES`/`UPLOAD`)을 그대로 상위에 전달한다. `UPLOAD`는 숨겨진 파일 입력을 클릭해 네이티브 파일 선택 창을 연다 |
| **SharedFolderCreateNewFolderModal** | 새 폴더 이름 입력 모달. 현재 위치를 안내하고, 이름이 비어 있거나 요청 중이면 `만들기` 버튼이 비활성화된다 |
| **SharedFolderCreateGoogleModal** | Docs/Sheets/Slides 파일 이름 입력 모달. `fileType`에 따라 제목이 바뀌고, 이름이 비어 있으면 종류별 기본 이름("제목 없는 문서" 등)으로 생성한다. `SharedFolderItem`의 `FILE_TYPE_LABEL`을 재사용한다 |
| **SharedFolderOpenNewTabModal** | Google 파일 생성 완료 후 나타나는 모달. `viewUrl`을 받아 `새 탭에서 열기` 클릭 시 실제로 새 탭을 연다 |
| **SharedFolderPath** | 폴더 경로(breadcrumb, client). `{ id, name }[]`과 각 구간의 인덱스를 받아, 클릭한 인덱스까지로 경로를 자른다(-1은 루트) |
| **SharedFolderListHeader** | 이름·종류·수정자·수정일·크기 제목행 |
| **SharedFolderList** | 현재 폴더의 항목 목록을 `SharedFolderItem`으로 매핑한다. 폴더 자체가 비어 있으면(`isFolderEmpty`) 안내 문구 + 업로드/폴더 만들기 버튼을, 필터·검색 때문에 결과만 없으면 "파일이 없습니다." 문구만 보여준다. `hasNext`가 참이면 하단에 `더 보기` 버튼을 보여준다 |
| **SharedFolderItem** | 폴더/파일 내용 행 1건. `mimeType`으로 종류를 판별해(`sharedFolderFormat.ts`) 아이콘·라벨을 정하고, 수정자·크기는 항상 "-"로 표시한다. 폴더/파일 모두 이름이 버튼으로 렌더링되며, 폴더는 클릭 시 그 폴더로 진입하고 파일은 클릭 시 `viewUrl`을 새 탭으로 연다(미리보기). 케밥 버튼 클릭 시 `item.downloadable`을 `SharedFolderItemMenu`에 전달해 메뉴를 연다 |
| **SharedFolderItemMenu** | 케밥 메뉴 내용. `kind`가 `FILE`이면 미리보기 열기 항목이 추가되고, `downloadable`이 `true`일 때만 다운로드 항목도 추가된다. 모든 항목이 실제로 동작한다 |
| **SharedFolderEditNameModal** | 이름 변경 모달. 현재 이름으로 입력창이 채워지고, 값이 비어 있거나 요청 중이면 `변경` 버튼이 비활성화된다 |
| **SharedFolderMoveModal** | 이동 모달. 전체 폴더 트리를 한 번에 내려주는 API가 없어, 공유파일 루트부터 한 단계씩 하위 폴더 목록을 조회하며 탐색하는 방식이다(이동 대상 자기 자신은 목록에서 제외). 상단 breadcrumb으로 탐색 위치를 오갈 수 있고, 하위 폴더로 들어간 상태에서만 `이동` 버튼이 활성화된다 |
| **SharedFolderDeleteCheckModal** | 삭제 확인 모달. 대상 이름·종류를 보여주고 Google Drive 휴지통으로 이동한다는 안내를 표시한다. API가 하위 항목 개수를 내려주지 않아 개수는 표시하지 않는다 |
| **SharedFolderDownloadFormatModal** | 다운로드 형식 선택 모달. Google Docs/Sheets/Slides에서 `다운로드` 클릭 시에만 뜬다. `formats`(`getSharedFolderDownloadFormats()`가 원본 유형별로 정한 허용 목록 — Docs: PDF/DOCX, Sheets: PDF/XLSX, Slides: PDF/PPTX)를 버튼으로 나열하고, 선택하면 그 `format`으로 다운로드를 요청한다 |

### 관계

```
SharedFolderBoard                       (rootStatus, items, path, filter, searchQuery, 새로만들기·케밥 메뉴 열림 state, isSubmitting)
├── SharedFolderToolbar
│   └── SharedFolderCreateMenu          (새로 만들기 클릭 시)
├── (저장소 컨테이너 — Board가 직접 마크업)
│   ├── SharedFolderPath
│   ├── SharedFolderListHeader
│   └── SharedFolderList
│       └── SharedFolderItem[]
│           └── SharedFolderItemMenu    (케밥 클릭 시 — 이름 변경·이동·삭제만 모달로 이어짐)
├── input[type=file]                    (파일 업로드, 숨김)
├── SharedFolderCreateNewFolderModal    (새 폴더 선택 시)
├── SharedFolderCreateGoogleModal       (Google Docs/Sheets/Slides 선택 시)
├── SharedFolderOpenNewTabModal         (Google 파일 생성 완료 시)
├── SharedFolderEditNameModal           (이름 변경 선택 시)
├── SharedFolderMoveModal               (이동 선택 시)
├── SharedFolderDeleteCheckModal        (삭제 선택 시)
└── SharedFolderDownloadFormatModal     (Google Docs/Sheets/Slides 다운로드 선택 시)
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 폴더/파일 목록 데이터 | Google Drive 연동 조회 | 구현 완료(`.docs/api/shared-folder/apiIntegration.md` 기준) |
| 새 폴더/Google 파일 생성, 파일 업로드 | 새로만들기 컨테이너의 전체 항목 | 구현 완료 — 공유파일 루트에서는 `rootId`를 `parentId`로 사용한다(핵심 제약 참고) |
| 이름 변경 | 케밥 메뉴의 `이름 변경` | 구현 완료 |
| 이동 | 케밥 메뉴의 `이동` | 구현 완료 — 공유파일 루트로의 이동도 지원 |
| 삭제 | 케밥 메뉴의 `삭제` | 구현 완료 |
| 미리보기 열기 · 다운로드 | 케밥 메뉴의 해당 항목, 내용 행의 파일 이름 클릭(미리보기) | 구현 완료 — 다운로드는 `downloadable`이 `true`인 파일에만 제공. Google Docs/Sheets/Slides는 형식 선택(PDF/DOCX/XLSX/PPTX) 후, 일반 업로드 파일은 원본으로 바로 다운로드 |
| 시스템 루트 전체 검색 API 연동 | `GET /api/shared-files/items/search` | 미구현 — 현재 검색바는 현재 폴더에서 이미 불러온 목록만 걸러낸다 |
| Sidebar 진입점 | 공유폴더 메뉴 항목 | 미구현 |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 시스템 루트 상태 | 확인 중 / 사용 가능 / 사용 불가 |
| 목록 로딩 | 불러오는 중 / 정상 / 조회 실패(오류 메시지 표시) |
| 더 보기 로딩 | 불러오는 중 / 정상 |
| 필터 | 전체 / 폴더 / 파일 |
| 검색어 | 있음 / 없음 |
| 현재 경로 | 공유파일 루트(빈 배열) / 하위 폴더 경로 |
| 새로만들기 컨테이너 | 열림 / 닫힘 |
| 케밥 메뉴 | 닫힘 / 특정 항목에서 열림(한 번에 하나만) |
| 새 폴더 만들기 모달 | 열림 / 닫힘 |
| Docs/Sheets/Slides 만들기 모달 | 닫힘 / 특정 종류로 열림 |
| 새 탭에서 열기 모달 | 닫힘 / 특정 파일(이름·`viewUrl`)로 열림 |
| 이름 변경 모달 | 닫힘 / 특정 항목으로 열림 |
| 이동 모달 | 닫힘 / 특정 항목으로 열림(탐색 위치는 모달 내부 상태) |
| 삭제 확인 모달 | 닫힘 / 특정 항목으로 열림 |
| 다운로드 형식 선택 모달 | 닫힘 / 특정 항목으로 열림(`downloadFormatItem`) |
| 생성·수정 요청 중 | 아님 / 진행 중(관련 모달의 확인 버튼 비활성 + 문구 변경) |

---
