# Approval Domain — CONTEXT

> 배치 경로: `src/feature/approval/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 전자결재 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: 목록 조회(4.1), 결재 문서 상신(4.2), 결재 처리·승인/반려(4.3), 내 문서 관리(4.4), 결재 템플릿 관리(4.5), 첨부파일 다운로드·AI 요약(4.6) 모두 실제 API(`src/feature/approval/type.ts`·`actions.ts`, `src/service/approval.service.ts`)에 연결되어 있다. 단, `modal/UpdateApprovalModal.tsx`(정적 목업, 미사용)와 `ApprovalLineEditButton.tsx`(어디서도 import되지 않는 트리거 버튼)는 코드베이스에 파일만 존재할 뿐 실제로 쓰이지 않는 죽은 코드이므로 이 도메인의 구현 상태에 포함하지 않는다(6장 참고).

---

## 1. 개요

사내 전자결재(상신 → 결재선 승인/반려)를 처리하는 도메인.

사용자는 결재 문서를 작성해 정해진 결재선(순서가 있는 결재자 목록)에 상신하고, 결재선의 각 결재자는 자신의 차례에 승인 또는 반려를 결정한다. 반복적으로 쓰이는 결재선은 결재 양식(템플릿)으로 미리 등록해 두고 상신 시 재사용할 수 있다. 메모 도메인처럼 다른 화면 위에 떠 있는 컨테이너가 아니라, `/approval/*` 아래 5개의 독립된 라우트로 구성된 페이지형 도메인이다.

### 핵심 제약

- 결재선은 `stepOrder` 오름차순으로 진행되며, 모든 단계가 승인되어야 문서 상태가 최종 승인(`APPROVED`)이 된다.
- 결재자로 본인 자신을 지정할 수 없다. 상신 화면(`ApprovalLine`), 템플릿 화면(`ApprovalLineItem`), 결재라인 수정 화면(`EditApprovalModal`) 세 곳 모두 동일하게 본인을 결재자 후보에서 제외한다.
- 문서를 상신할 때 사용자가 결재선을 수정하지 않았다면 요청에 `approverIds`를 아예 포함하지 않아 서버가 템플릿의 기본 결재선을 그대로 쓰게 한다. 결재선을 한 번이라도 수정하면 그 시점부터는 화면에 보이는 순서 그대로 `approverIds`를 전달한다.
- 목록 화면에 전달되는 `type`(`'my' | 'other'`) prop은 문서의 실제 소유권이 아니라 **라우트(페이지)에 의해 고정**된다. `내가 신청한 결재`/`내 결재 이력` 페이지는 항상 `type='my'`(내 문서 상세 뷰)를, `내게 온 결재`/`전체` 페이지는 항상 기본값 `'other'`(승인/반려 처리 뷰)를 사용한다.

### 진입점

`src/feature/approval/components/ApprovalNavBar.tsx`의 5개 탭(`내가 신청한 결재`/`내게 온 결재`/`전체`/`내 결재 이력`/`템플릿 관리`) 중 하나로 직접 라우팅해 진입한다. Sidebar 등 이 도메인 밖에서 여닫는 별도 진입 트리거는 없다.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **결재 문서** | 사용자가 작성해 상신하는 개별 전자결재 건 (`ApprovalDetailData`) |
| **결재선** | 한 문서에 대해 정해진 결재자 순서 목록. `stepOrder` 오름차순으로 진행 |
| **결재 양식(템플릿)** | 이름 + 기본 결재선을 미리 등록해 두고 상신 시 선택하는 단위 |
| **상신** | 결재 문서를 새로 작성해 결재선에 제출하는 행위 |
| **재상신** | 반려된 문서를 기반으로 새 문서를 다시 상신하는 행위 |
| **결재 처리(승인/반려)** | 본인 차례가 된 결재선에서 승인 또는 반려를 결정하는 행위 |
| **결재라인 수정** | 이미 상신되어 진행 중인 문서의 결재자 목록을 바꾸는 행위. 템플릿 자체를 수정하는 것과는 별개 기능 |
| **AI 요약** | 결재 문서 첨부파일의 내용을 자동 요약하는 기능. 별도 버튼 없이 수신 결재 상세를 열 때 자동 실행됨 |

---

## 3. 화면 구성

```
┌─ 결재 페이지 (/approval/*) ───────────────────────────────────────┐
│ [ApprovalNavBar]                                                   │
│  내가 신청한 결재 | 내게 온 결재 | 전체 | 내 결재 이력 | 템플릿 관리   [결재 상신] │
├─────────────────────────────────────────────────────────────────┤
│ [목록 영역]                                                        │
│  문서 제목 | 기안자 | 유형 | 현재 결재자 | 상태                        │
│  ─────────────────────────────────────────────────              │
│  (행 클릭 → 상세 모달)                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 탭 (ApprovalNavBar / ApprovalNav)

| 탭 | 경로 | 노출 조건 |
|---|---|---|
| 내가 신청한 결재 | `/approval/my` | 항상 |
| 내게 온 결재 | `/approval/received` | 항상 |
| 전체 | `/approval/all` | 권한 `APPROVAL:READ_ALL` 보유 시 |
| 내 결재 이력 | `/approval/history` | 항상 |
| 템플릿 관리 | `/approval/templates` | 권한 `APPROVAL:TEMPLATE_MANAGE` 보유 시 |

"현재 탭" 활성 표시는 서버에서 내려주는 값이 아니라 각 `ApprovalNav`가 `usePathname()`으로 자신의 `href`와 현재 경로를 비교해 클라이언트에서 직접 판단한다. 우측 버튼은 기본 `결재 상신`이며, `템플릿 관리` 탭에서는 `템플릿 추가`로 대체된다.

### 목록 영역

| 탭 | 표시 컴포넌트 | 빈 상태 |
|---|---|---|
| 내가 신청한 결재 / 내게 온 결재 / 전체 / 내 결재 이력 | `ApprovalList` (문서 제목 / 기안자 / 유형 / 현재 결재자 / 상태) | `NoneApproval` ("결재 문서가 없습니다") |
| 템플릿 관리 | 인라인 테이블 + `TemplateItem` (템플릿 이름 / 생성자 / 결재 라인 / 생성일) | "템플릿 문서가 없습니다" |

---

## 4. 기능 목록

### 4.1 목록 조회 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 내가 신청한 결재 목록 | `/approval/my` 진입 | `getSubmittedApprovalListAction` 호출 → `ApprovalList type="my"`로 렌더링 |
| 내게 온 결재 목록 | `/approval/received` 진입 | `getReceivedApprovalListAction` 호출 → `ApprovalList`(type 기본값 `'other'`) |
| 전체 결재 목록 | `/approval/all` 진입 | `getAllApprovalListAction` 호출 → `ApprovalList`(type 기본값 `'other'`) |
| 내 결재 이력 | `/approval/history` 진입 | `getApprovalHistoryAction` 호출 → `ApprovalList type="my"` |
| 템플릿 목록 | `/approval/templates` 진입 | `getApprovalTemplateListAction` 호출 → `TemplateItem` 목록 |

다섯 페이지 모두 async Server Component이며, 조회 실패 시 각 페이지가 `response.message`를 화면에 직접 표시한다(`templates` 페이지만 "다시 시도해주세요." 문구를 덧붙이는 별도 스타일 사용).

### 4.2 결재 문서 상신 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 상신 모달 열기 | `ApprovalNavBar`의 `결재 상신` 버튼 (`ApprovalCreateButton`) | `useModal`로 `CreateApprovalModal` 오픈 |
| 결재 양식 선택 | `CreateApprovalModal` 내부 `ApprovalLine`의 양식 select | 모달이 열리면 `getApprovalTemplateListAction`과 `getUserListAction`으로 템플릿·사용자 목록을 조회해 첫 템플릿을 자동 선택. 이후 양식을 바꾸면 해당 템플릿의 `lines`(stepOrder 오름차순)로 결재선을 다시 채우고 "결재선을 수정했는지" 여부(`hasChangedApprovalLine`)를 초기화 |
| 결재자 추가 / 삭제 / 변경 | `ApprovalLine`의 "결재자 추가" 버튼 / 행 삭제(×) / 결재자 select | 본인과 이미 포함된 결재자는 선택할 수 없고, 마지막 1명은 삭제할 수 없다. 변경 시 `hasChangedApprovalLine=true`로 표시되어 4.2의 상신 payload 규칙에 반영됨 |
| 첨부파일 추가 | 파일 드래그앤드롭 또는 클릭 선택 | PDF·DOCX·XLSX, 개당 최대 50MB만 허용. 위반 파일이 하나라도 있으면 이번에 선택한 파일 전체를 거부하고 오류 메시지 표시. 이름·크기·수정시각이 같은 파일은 중복 등록하지 않음 |
| 상신 제출 | "상신하기" 버튼 | 제목/내용 필수 검증, 휴가 시작일·종료일 형식·순서 검증 → `uploadFiles`로 파일 업로드(presigned URL 발급 → S3 PUT → 메타데이터 등록, `CreateApprovalModal.md` 참고) → `createApprovalAction` 호출. `approverIds`는 결재선을 수정한 경우에만 포함해 전달. 성공 시 토스트 안내 + 모달 닫힘 + `router.refresh()`, 실패 시 모달과 입력값을 유지한 채 오류 메시지 표시 |

### 4.3 결재 처리(승인/반려) — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 결재 상세 확인 | `내게 온 결재`/`전체` 탭 행 클릭 (`ApprovalItemButton`, type 기본값 `'other'`) | `ReceivedApprovalModal` 오픈. 상세 조회 후 아직 요약이 없는 첨부파일에 대해 AI 요약을 자동 실행(4.6 참고) |
| 승인/반려 사유 입력으로 전환 | `ReceivedApprovalModal`의 "승인" / "반려" 버튼 | 상세 모달을 닫고 `mode`(`'승인'`/`'반려'`)를 지정한 채 `ReceivedReasonModal`을 연다 (`ApprovalItemButton`이 들고 있는 `otherModal`의 `activeModal`/`noneActiveModal`로 전달됨) |
| 결재 처리 확정 | `ReceivedReasonModal`의 "{mode} 처리" 버튼 | 사유(`comment`, 승인 시 선택)를 입력받아 `decideApprovalAction(id, { decision: mode==='승인' ? "APPROVE" : "REJECT", comment })` 호출. 성공 시 토스트("결재를 처리했습니다.") + 모달 닫힘 + `router.refresh()`, 실패 시 오류 토스트만 표시(모달 유지) |

### 4.4 내 문서 관리 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 내 문서 상세 확인 | `내가 신청한 결재`/`내 결재 이력` 탭 행 클릭 (`ApprovalItemButton`, type=`'my'`) | `MyApprovalModal` 오픈. 상세 조회 후 `ApprovalLineView`로 결재선 진행 상태를 스텝퍼로 표시 |
| 결재 취소 | 결재선 전원이 대기/검토중 상태일 때만 노출되는 "결재 취소" 버튼 | `cancelApprovalAction(id)` 호출. 성공 시 토스트("결재 신청을 취소했습니다.") + 모달 닫힘 + 새로고침 |
| 결재라인 수정 | 결재선 전원이 대기/검토중 상태일 때만 노출되는 "결재라인 수정" 버튼 | `MyApprovalModal`이 자체 보유한 `useModal()`로 `EditApprovalModal`을 오픈 → 결재자 추가/삭제/변경 후 제출 시 `changeApprovalLinesAction(documentId, { approverIds })` 호출. 성공 시 토스트("결재선을 수정했습니다.") + 모달 닫힘 + 새로고침 |
| 재상신 | 문서 상태가 "반려"일 때만 노출되는 "재상신" 버튼 | `resubmitApprovalAction(id)` 호출(반려 문서를 기반으로 새 문서를 생성). 성공 시 토스트 + 모달 닫힘 + 새로고침 |
| 이력 삭제 | 문서 상태가 "반려" 또는 "승인"일 때만 노출되는 "삭제" 버튼 | `hideApprovalHistoryAction(id)` 호출. 성공 시 토스트("내 결재 이력에서 삭제했습니다.") + 모달 닫힘 + 새로고침 |

네 버튼 모두 성공 시에만 모달을 닫고(`toast.success` + `closeModal()` + `router.refresh()`), 실패 시에는 `toast.error(response.message)`만 표시하고 모달은 열린 채로 유지된다. 처리 중에는 버튼이 비활성화되고 라벨이 "처리 중..."으로 바뀐다.

### 4.5 결재 템플릿 관리 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 템플릿 생성 모달 열기 | `템플릿 관리` 탭의 "템플릿 추가" 버튼 (`ApprovalTemplateCreateButton`) | `useModal`로 `CreateApprovalTemplateModal` 오픈 |
| 템플릿 생성 | 생성 모달의 "템플릿 저장" 버튼 | `useActionState(createApprovalTemplateAction, ...)`으로 이름 + 결재자 목록(행마다 `ApprovalLineItem`)을 제출. 성공 시 토스트 + 모달 닫힘 + 새로고침 |
| 템플릿 상세 확인 | 템플릿 행 클릭 (`TemplateDetailButton`) | `ApprovalTemplateModal` 오픈. `ApprovalTemplateLine`으로 결재 체인을 화살표(→)로 연결해 표시 |
| 템플릿 수정 | 상세 모달의 "수정" 버튼 | 상세 모달을 닫고 `EditApprovalTemplateModal`을 연다 → `useActionState(changeApprovalTemplateAction.bind(null, id), ...)`으로 이름/결재자 수정 제출. 성공 시 토스트("결재 템플릿을 수정했습니다.") + 모달 닫힘 + 새로고침 |
| 템플릿 삭제 | 상세 모달의 "삭제" 버튼 | 상세 모달을 닫고 확인 다이얼로그(`TwoButtonModal`, 제목 "템플릿 삭제")를 연다 → 확인 시 `deleteApprovalTemplateAction(id)` 호출. 성공 시 토스트("결재 템플릿을 삭제했습니다.") + 상세 모달·확인 다이얼로그 모두 닫힘 + 새로고침 |

### 4.6 첨부파일 다운로드 & AI 요약 — 구현 완료

| 기능 | 트리거 | 동작 |
|---|---|---|
| 첨부파일 다운로드 | 상세 모달의 "첨부파일 #{fileId}" 버튼 (`ApprovalAttachmentDownloadButton`) | 클릭 시점마다 `getApprovalAttachmentDownloadUrlAction(documentId, fileId)`로 임시 다운로드 URL을 새로 조회해 `window.open`으로 새 탭에 연다. URL을 캐시하지 않고 매번 재조회(임시 URL이므로) |
| AI 요약 자동 생성 | `ReceivedApprovalModal`이 열릴 때 (별도 버튼 없이 자동 실행) | 상세 조회 결과 중 `aiSummary`가 없는 첨부파일(`fileId > 0`)에 대해 `summarizeApprovalAttachmentAction`을 병렬로 호출한 뒤, 결재 상세를 다시 조회해 갱신된 `aiSummary`를 반영. `aiSummary`가 있는 첨부파일 중 첫 번째 값을 "요약" 영역에 표시하고, 요약 호출이 실패하면 그 오류 메시지를, 둘 다 없으면 "생성된 AI 요약이 없습니다."를 표시 |

---

## 5. 데이터

결재 문서 상세(`ApprovalDetailData`) 기준.

| 항목 | 설명 |
|---|---|
| 제목 / 내용 | `title`, `text`. `contentType`은 `TEXT`/`FILE` 두 값이 정의되어 있으나 현재 상신 흐름은 `TEXT`만 사용 |
| 결재 양식 | `templateId`, `templateName` |
| 기안자 | `creatorId`, `creatorName` |
| 상태 | `status`: 진행중(`IN_PROGRESS`) / 승인(`APPROVED`) / 반려(`REJECTED`) / 취소(`CANCELLED`) |
| 결재선 | `lines: ApprovalLineData[]` — `stepOrder`, `approverId`, `approverName`, `status`, `comment`, `decidedAt` |
| 결재선 상태 | `status`: 대기(`WAITING`) / 검토중(`PENDING`) / 승인(`APPROVED`) / 반려(`REJECTED`) |
| 첨부파일 | `attachments: ApprovalAttachmentData[]` — `fileId`, `aiSummary`, `summaryStatus`, `summarizedAt`. `summaryStatus`(`PENDING`/`COMPLETED`/`FAILED`)는 타입에는 정의되어 있지만 화면 어디에서도 읽지 않는다 — 실제 요약 유무 판단은 `aiSummary`(string \| null)만으로 이루어진다 |
| 생성일 | `createdAt` |

결재 템플릿 상세(`ApprovalTemplateDetailData`) 기준.

| 항목 | 설명 |
|---|---|
| 이름 | `name` |
| 생성자 | `creatorId`. 단, 템플릿 **목록** 화면(`TemplateItem`)의 "생성자" 컬럼은 이 값이 아니라 실제로는 `content.id`(템플릿 id)를 그대로 표시하고 있다 — `ApprovalTemplateListData`에 생성자 필드가 없어서 생긴 표시 오류로 보임 |
| 결재선 | `lines: ApprovalTemplateLineData[]` — `stepOrder`, `approverId`, `approverName` |
| 생성일 | `createdAt` |

---

## 6. 컴포넌트 구성

기능 단위로 분해했을 때 필요한 컴포넌트 목록과 각자의 책임.

| 컴포넌트 | 책임 |
|---|---|
| **ApprovalNavBar** | 탭 내비게이션 셸(구현 완료, Server Component). 하드코딩된 5개 탭 배열을 `ApprovalNav`로 렌더링하고, `buttonType` prop(기본 `'결재 상신'`)에 따라 `ApprovalCreateButton` 또는 `ApprovalTemplateCreateButton`을 우측에 렌더링 |
| **ApprovalNav** | 탭 링크 하나(구현 완료, Client Component). `usePathname()`으로 활성 탭 여부를 직접 판단하고, `useUserStore`의 `permissions`로 `전체`/`템플릿 관리` 탭의 노출 여부를 결정 |
| **ApprovalCreateButton** / **ApprovalTemplateCreateButton** | "결재 상신"/"템플릿 추가" 버튼(구현 완료, Client Component). 각각 `useModal`로 `CreateApprovalModal`/`CreateApprovalTemplateModal`을 여는 역할만 담당 |
| **ApprovalList** | 목록 테이블 셸(구현 완료, Server Component). `approvals`/`type` prop을 받아 헤더 행과 `ApprovalItem` 목록을 렌더링 |
| **ApprovalItem** | 목록 행 1건(구현 완료, Server Component). 상태별 배지 스타일(진행중/승인/반려/취소)과 날짜·기안자·현재 결재자 텍스트를 계산해 `ApprovalItemButton`에 감싸 렌더링 |
| **ApprovalItemButton** | 행 클릭 시 모달 분기 허브(구현 완료, Client Component). `mode`(`'승인'`\|`'반려'`) state와 `reasonModal`/`myModal`/`otherModal` 세 개의 `useModal`을 보유. `type='my'`면 `MyApprovalModal`을, 아니면 `ReceivedApprovalModal`(승인/반려 클릭 시 `ReceivedReasonModal`로 이어짐)을 연다 |
| **MyApprovalModal** | 내 문서 상세(구현 완료, Client Component). `getApprovalDetailAction`으로 상세를 불러오고, 상태 조건에 따라 삭제/결재라인 수정/취소/재상신 버튼을 노출. 자체 `useModal()`로 `EditApprovalModal`을 오픈 |
| **ReceivedApprovalModal** | 수신 문서 상세 + AI 요약(구현 완료, Client Component). 상세 조회 후 `aiSummary`가 없는 첨부파일에 대해 `summarizeApprovalAttachmentAction`을 병렬 호출하고 재조회해 요약을 반영. "승인"/"반려" 버튼은 부모(`ApprovalItemButton`)가 내려준 `activeModal`/`noneActiveModal`을 그대로 호출 |
| **ReceivedReasonModal** | 승인/반려 사유 입력(구현 완료, Client Component). `mode` prop에 따라 제목·버튼 라벨이 바뀌며, 제출 시 `decideApprovalAction` 호출 |
| **CreateApprovalModal** | 결재 상신 폼(구현 완료, Client Component). 파일 선택/검증/드래그앤드롭(`ALLOWED_FILE_EXTENSIONS`, `MAX_FILE_SIZE`), 제목·내용·휴가 기간 상태와 검증, `uploadFiles` 호출, `createApprovalAction` 제출을 담당. 결재 양식·결재선 편집은 자식 `ApprovalLine`에 위임 |
| **ApprovalLine** | 상신 화면의 양식 선택 + 결재선 편집(구현 완료, Client Component). 템플릿·사용자 목록 조회, 템플릿 변경 시 결재선 재설정, 결재자 추가/삭제/변경(`hasChangedApprovalLine` 플래그 관리)을 모두 담당하는 완전 제어 컴포넌트 |
| **EditApprovalModal** | 진행 중인 문서의 결재라인 수정(구현 완료, Client Component). `approval.lines`로 초기화한 결재선을 `ApprovalLine`과 동일한 규칙(본인 제외, 최소 1인)으로 편집한 뒤 `changeApprovalLinesAction`을 호출 |
| **ApprovalLineView** | 결재선 진행 스텝퍼 한 칸(구현 완료, Server Component). `line.status`를 한글 라벨로 매핑해 `ApprovalRest`(대기)/`ApprovalIng`(검토중)/`ApprovalComp`(승인)/`ApprovalReject`(반려) 아이콘 중 하나와 결재자·시각을 표시. `MyApprovalModal`/`ReceivedApprovalModal` 양쪽에서 사용 |
| **ApprovalRest / ApprovalIng / ApprovalComp / ApprovalReject** | 결재선 상태 아이콘(구현 완료, Server Component, props 없음). `ApprovalLineView` 전용 |
| **ApprovalLineItem** | 결재선 편집 행 하나(구현 완료, Client Component). 자체 `useEffect`로 사용자 목록을 직접 조회해 select 옵션을 만든다. **템플릿 생성/수정 모달에서만** 재사용됨 |
| **ApprovalTemplateLine** | 템플릿 상세의 결재 체인 표시(구현 완료, Server Component). 이름 첫 글자 아바타 + `→` 연결선 |
| **TemplateItem / TemplateDetailButton** | 템플릿 목록 행(구현 완료). `TemplateDetailButton`이 상세/수정/삭제 모달 전환을 모두 오케스트레이션(`useModal` 3개: `editModal`/`deleteModal`/`modal`) |
| **ApprovalTemplateModal** | 템플릿 읽기 전용 상세(구현 완료, Client Component). "수정"/"삭제" 버튼은 자체 로직 없이 부모의 `activeModal`/`noneActiveModal`을 그대로 호출 |
| **CreateApprovalTemplateModal / EditApprovalTemplateModal** | 템플릿 생성/수정 폼(구현 완료, Client Component). 각각 `useActionState(createApprovalTemplateAction)` / `useActionState(changeApprovalTemplateAction.bind(null, id))`로 서버 액션 폼 바인딩을 사용하고, 결재자 행은 `ApprovalLineItem`을 반복 렌더링 |
| **ApprovalAttachmentDownloadButton** | 첨부파일 다운로드(구현 완료, Client Component). 클릭 시점마다 임시 URL을 새로 조회해 여는 것 외의 상태를 갖지 않음 |
| **NoneApproval** | 목록 빈 상태 문구(구현 완료, Server Component, props 없음) |

> `modal/UpdateApprovalModal.tsx`는 실제로 어디에서도 import되지 않는 죽은 코드다. `"use client"` 지시어, props, state, 이벤트 핸들러가 전혀 없고 결재자 이름·차수까지 하드코딩된 정적 목업 마크업만 남아 있다. 진행 중인 문서의 결재선을 수정하는 실제 기능은 전적으로 `EditApprovalModal`이 담당한다. (참고: `memo`의 `CONTEXT.md` 6장은 memo의 작성/수정 폼 분리 구조를 설명하며 "approval 도메인이 생성/수정 모달을 분리(`CreateApprovalModal`/`UpdateApprovalModal`)해 쓰는 것과 동일하게"라고 언급하지만, 이는 오독이다. `UpdateApprovalModal`은 사용되지 않는 죽은 코드이며, `CreateApprovalModal`에 실제로 대응하는 "수정" 기능은 `EditApprovalModal`이다.)

> `ApprovalLineEditButton.tsx`도 `EditApprovalModal`을 올바르게 열도록 구현되어 있지만, 이 도메인의 어떤 페이지·컴포넌트에서도 import되지 않는다. 실제로 화면에 노출되는 "결재라인 수정" 버튼은 `MyApprovalModal` 내부에 동일한 로직이 인라인으로 별도 구현되어 있다.

> 결재선 편집 UI는 하나로 공유되지 않는다. 템플릿 생성/수정 흐름(`CreateApprovalTemplateModal`/`EditApprovalTemplateModal`)은 `ApprovalLineItem` 컴포넌트를 재사용하는 반면, 문서 상신/결재라인 수정 흐름(`ApprovalLine`/`EditApprovalModal`)은 동일한 UX(본인 제외, 중복 제외, 최소 1인 유지)를 각자 인라인 JSX로 중복 구현하고 있다.

### 관계

```
ApprovalNavBar
├── ApprovalNav × 5                        (usePathname 기반 활성 탭 표시)
└── ApprovalCreateButton | ApprovalTemplateCreateButton
    └── (클릭 시) CreateApprovalModal | CreateApprovalTemplateModal

[my, history 페이지]                        (type='my')
ApprovalList
└── ApprovalItem × N
    └── ApprovalItemButton (type='my')
        └── (행 클릭) MyApprovalModal
            ├── ApprovalLineView × N → ApprovalRest|ApprovalIng|ApprovalComp|ApprovalReject
            ├── ApprovalAttachmentDownloadButton × N
            └── (버튼 "결재라인 수정") EditApprovalModal
            (버튼 "결재 취소"/"재상신"/"삭제" → 각각 액션 직접 호출, 추가 모달 없음)

[all, received 페이지]                      (type='other', 기본값)
ApprovalList
└── ApprovalItem × N
    └── ApprovalItemButton (type='other')
        └── (행 클릭) ReceivedApprovalModal
            ├── ApprovalLineView × N
            └── ApprovalAttachmentDownloadButton × N
            (버튼 "반려"/"승인" → 자신을 닫고) ReceivedReasonModal (mode='반려'|'승인')

[templates 페이지]
TemplateItem × N
└── TemplateDetailButton
    └── (행 클릭) ApprovalTemplateModal
        ├── ApprovalTemplateLine × N
        (버튼 "수정" → 자신을 닫고) EditApprovalTemplateModal → ApprovalLineItem × N
        (버튼 "삭제" → 자신을 닫고) TwoButtonModal("템플릿 삭제") → deleteApprovalTemplateAction

상신 모달
CreateApprovalModal
└── ApprovalLine  (양식 select + 결재선 편집, 완전 제어)

[미사용 / 죽은 코드]
modal/UpdateApprovalModal.tsx      — 어디서도 import되지 않는 정적 목업
ApprovalLineEditButton.tsx         — EditApprovalModal을 열도록 구현돼 있으나 미사용
```

### 컴포넌트 외 필요한 조각

| 조각 | 역할 | 상태 |
|---|---|---|
| 권한 체크 | `useUserStore`의 `permissions` 배열로 `APPROVAL:READ_ALL`(전체 탭)/`APPROVAL:TEMPLATE_MANAGE`(템플릿 관리 탭) 노출 여부 결정 | 구현 완료 |
| 파일 업로드 | `src/feature/file/uploadFiles.ts` — presigned URL 발급 → S3 PUT → 메타데이터 등록 3단계, 이름·크기·수정시각이 같은 파일은 중복 업로드하지 않음 (`CreateApprovalModal.md`에 상세 명세) | 구현 완료 |
| 결재선 편집 규칙 | 본인 제외 / 중복 결재자 제외 / 최소 1인 유지 규칙이 `ApprovalLine`·`ApprovalLineItem`·`EditApprovalModal` 세 곳에 각각 개별 구현되어 있음(공유 훅·유틸 없음) | 구현 완료(중복 존재) |
| 모달 체이닝 | `useModal`의 `activeModal`/`noneActiveModal`을 이용해 "확인 다이얼로그 닫고 다음 모달 열기"(승인/반려 사유 입력, 템플릿 상세→수정/삭제 확인) 패턴을 여러 곳에서 재사용 | 구현 완료 |

---

## 7. 상태 정리

| 상태 | 값 |
|---|---|
| 결재 문서 상태 | 진행중(`IN_PROGRESS`) / 승인(`APPROVED`) / 반려(`REJECTED`) / 취소(`CANCELLED`) |
| 결재선 상태 | 대기(`WAITING`) / 검토중(`PENDING`) / 승인(`APPROVED`) / 반려(`REJECTED`) |
| 목록 화면 type | `'my'`(내 문서 뷰) / `'other'`(승인·반려 처리 뷰) — 라우트에 의해 고정, 문서 소유권과 무관 |
| 결재 처리 모드 | `ApprovalItemButton`의 `mode` state: `'승인'` / `'반려'` |
| 결재선 수정 여부 | `hasChangedApprovalLine` — 상신/결재라인 수정 payload에서 `approverIds` 포함 여부를 결정 |
| AI 요약 | `aiSummary`(string \| null) 값 유무로만 판단. `summaryStatus`(`PENDING`/`COMPLETED`/`FAILED`) 필드는 정의만 되어 있고 UI에서 사용되지 않음 |

---
