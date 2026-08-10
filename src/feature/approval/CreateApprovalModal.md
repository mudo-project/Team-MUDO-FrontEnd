# 전자결재 신청 모달 구현 명세

## 목적

전자결재 신청은 `src/feature/approval/components/modal/CreateApprovalModal.tsx`에서 진행한다. 사용자는 결재 양식을 선택하고 결재선, 제목, 내용, 휴가 기간 및 첨부파일을 입력한 뒤 결재를 신청할 수 있어야 한다.

## 신청 흐름

1. 모달이 열리면 `getApprovalTemplateListAction`으로 결재 템플릿 목록을 조회한다.
2. 사용자가 목록에서 양식을 선택하면 `getApprovalTemplateDetailAction(templateId)`으로 템플릿 상세와 기본 결재선을 조회한다.
3. 조회된 기본 결재선을 화면에 표시한다. 사용자는 결재자를 추가하거나 삭제하고 순서를 변경할 수 있다.
4. 사용자가 제목과 내용을 입력한다.
5. 휴가 신청 양식이면 `leaveStartDate`와 `leaveEndDate`를 함께 입력한다.
6. 첨부파일이 있으면 아래의 파일 업로드 절차를 모두 완료해 `fileId` 목록을 만든다.
7. 최종 payload로 `createApprovalAction`을 호출한다.
8. 성공한 경우 성공 메시지를 표시하고 모달을 닫은 뒤 결재 목록을 갱신한다. 실패한 경우 모달과 입력값을 유지하고 오류 메시지를 표시한다.

## 상태와 입력값

모달에서 최소한 다음 상태를 관리한다.

- 선택한 `templateId`
- 조회된 템플릿 목록
- 선택한 템플릿의 결재선
- 사용자가 수정한 결재자 ID 목록
- `title`
- `text`
- `leaveStartDate`, `leaveEndDate`
- 선택한 파일 목록과 파일별 업로드 상태
- 템플릿 조회, 파일 업로드, 결재 신청의 진행 및 오류 상태

양식을 변경하면 이전 양식에서 조회한 결재선과 휴가 기간처럼 양식에 종속된 값을 새 양식 기준으로 초기화한다. 비동기 템플릿 상세 조회에는 취소 플래그 또는 요청 식별자를 적용해 이전 양식의 늦은 응답이 현재 상태를 덮어쓰지 않게 한다.

## 결재선 처리

- 템플릿 상세의 `lines`를 `stepOrder` 순서로 표시한다.
- 사용자가 결재선을 수정하지 않았다면 신청 payload에서 `approverIds`를 생략하거나 빈 값으로 보내 템플릿 기본 결재선을 사용한다.
- 사용자가 결재선을 수정했다면 화면 순서대로 `approverIds`를 전달한다.
- 최종 결재선은 최소 1명이어야 하며, 중복된 사용자 ID를 보내지 않는다.

## 휴가 기간 처리

- 휴가 신청 양식에서만 날짜 입력을 표시한다.
- `leaveStartDate`와 `leaveEndDate`는 `YYYY-MM-DD` 형식으로 함께 전달한다.
- 한쪽 날짜만 입력할 수 없으며 종료일은 시작일보다 빠를 수 없다.
- 현재 템플릿 응답 타입에는 휴가 양식을 식별하는 별도 코드가 없다. 구현 시 템플릿 이름을 임의로 비교하기보다 백엔드와 합의된 식별 기준을 사용한다. 별도 필드가 추가되기 전 이름으로 판단해야 한다면 그 값을 상수 한 곳에서만 관리한다.

## 파일 input 디자인

파일 input은 아래 Figma 노드의 디자인을 기준으로 구현한다.

- [MUDO Project 파일 input](https://www.figma.com/design/kLE2ILEjEAIkwLNw85iwfF/MUDO-Project?node-id=90-452&m=dev)

기존 모달의 전체 레이아웃과 Tailwind 작성 방식은 유지하고, 파일 input 영역의 크기, 여백, 테두리, 색상, 아이콘 및 파일 표시 상태는 해당 Figma 노드를 따른다.

## 파일 업로드 절차

파일마다 아래 과정을 순서대로 수행한다.

### 1. 업로드용 URL 발급

`createFilePresignedUrlAction`을 호출한다.

```ts
const contentType = file.type || "application/octet-stream";

const presignedResponse = await createFilePresignedUrlAction({
    fileName: file.name,
    contentType,
});
```

성공 응답의 `objectKey`와 `uploadUrl`을 다음 단계에서 사용한다. `uploadUrl`은 15분 동안 유효하다. 이 단계에서는 아직 `fileId`가 생성되지 않는다.

### 2. S3에 파일 직접 업로드

발급받은 `uploadUrl`로 파일을 PUT한다.

```ts
const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
        "Content-Type": contentType,
    },
    body: file,
});

if (!uploadResponse.ok) {
    throw new Error("파일 업로드에 실패했습니다.");
}
```

- S3 요청에는 프로젝트의 `fetchWithAuth`를 사용하지 않는다.
- `Content-Type`은 presigned URL 발급 요청에 전달한 값과 반드시 같아야 한다.
- S3 업로드가 실패하면 메타데이터 등록 및 결재 신청을 진행하지 않는다.

### 3. 파일 메타데이터 등록

S3 업로드 성공 후 `createFileMetadataAction`을 호출한다.

```ts
const metadataResponse = await createFileMetadataAction({
    objectKey,
    contentType,
});
```

성공 응답의 `fileId`를 수집한다. 동일한 `objectKey`를 중복 등록하면 `409 Conflict`가 발생할 수 있으므로 성공한 등록 요청을 임의로 재시도하지 않는다.

### 4. 결재 신청에 파일 ID 전달

모든 파일의 업로드와 메타데이터 등록이 성공한 후 수집한 ID를 `fileIds`로 전달한다.

```ts
const response = await createApprovalAction({
    templateId,
    title,
    contentType: "TEXT",
    text,
    fileIds,
    approverIds: hasChangedApprovalLine ? approverIds : undefined,
    leaveStartDate: isLeaveApproval ? leaveStartDate : undefined,
    leaveEndDate: isLeaveApproval ? leaveEndDate : undefined,
});
```

본문을 입력하는 현재 신청 흐름에서는 `contentType: "TEXT"`를 사용하고 첨부파일은 `fileIds`로 별도 전달한다. 백엔드에서 `contentType: "FILE"`을 요구하는 별도 문서 유형을 추가할 경우 해당 명세에 맞춰 분기한다.

## 다운로드 URL

결재 상세 화면의 첨부파일을 열거나 다운로드할 때는 `documentId`와 `fileId`로 `getApprovalAttachmentDownloadUrlAction(documentId, fileId)`을 호출한다. 범용 file 다운로드 API는 notice 등 결재 이외의 첨부파일에만 사용한다. 성공 응답의 임시 `downloadUrl`은 영구 저장하지 않고 사용 시점에 조회한다.

## 제출 및 오류 처리

- 템플릿 또는 제목이 없거나 필요한 입력이 유효하지 않으면 신청 버튼을 비활성화한다.
- 파일 업로드와 결재 신청 중에는 중복 제출을 막는다.
- 여러 파일 중 하나라도 실패하면 결재 신청을 호출하지 않는다.
- 단계별 오류 메시지를 구분해 사용자가 실패 지점을 알 수 있게 한다.
- 모달을 닫거나 컴포넌트가 언마운트되면 진행 중인 상태 업데이트를 중단한다.
- 실패 시 이미 S3에 업로드됐지만 메타데이터가 등록되지 않은 객체가 남을 수 있다. 현재 삭제 API가 없으므로 자동 삭제를 가정하지 않는다.

## 완료 조건

- 템플릿 목록과 선택한 템플릿의 결재선이 실제 API 데이터로 표시된다.
- 결재선 수정 결과가 신청 payload에 정확한 순서로 전달된다.
- 휴가 신청에서 두 날짜가 함께 검증되고 전달된다.
- 파일별로 presigned URL 발급, S3 PUT, 메타데이터 등록이 순서대로 수행된다.
- 등록된 모든 `fileId`가 결재 신청 payload에 포함된다.
- 진행 중 중복 제출이 방지되고 실패 시 입력 내용이 유지된다.
- 파일 input UI가 지정된 Figma 노드와 일치한다.

## 참고 자료

- [전자결재 API 명세서](https://app.notion.com/p/3b78e8800efe803f82f5ee3fe44c0699?v=9168e8800efe83e3979d88250fc9d39b&source=copy_link)
- [업로드용 presigned URL 발급](https://app.notion.com/p/0b68e8800efe825b8c9b01bbbfbec3a4)
- [파일 메타데이터 등록](https://app.notion.com/p/f7b8e8800efe833b9d37812ce80f0177)
- [다운로드용 URL 조회](https://app.notion.com/p/63b8e8800efe8258bba081cbbba0b4dc)
- [결재 신청](https://app.notion.com/p/8178e8800efe82a9a6aa01427b6f093e)
