import AuthoritySelectGroup from "./AuthoritySelectGroup";

const permissionGroups = [
    {
        title: "구성원 관리",
        permissions: [
            { name: "구성원 초대", description: "새 구성원을 학원에 초대할 수 있습니다." },
            { name: "구성원 내보내기", description: "기존 구성원을 내보낼 수 있습니다." },
            { name: "역할 관리", description: "역할을 생성, 수정, 삭제하고 구성원에게 지정할 수 있습니다." },
        ],
    },
    {
        title: "원생 관리",
        permissions: [
            { name: "원생 조회", description: "원생 목록 및 상세 정보를 조회할 수 있습니다.", enabled: true },
            { name: "원생 등록·수정", description: "원생 정보를 등록하거나 수정할 수 있습니다." },
            { name: "원생 삭제", description: "원생 정보를 삭제할 수 있습니다." },
        ],
    },
    {
        title: "일정 및 수업",
        permissions: [
            { name: "일정 조회", description: "학원 일정 및 시간표를 조회할 수 있습니다.", enabled: true },
            { name: "일정 관리", description: "일정을 생성, 수정, 삭제할 수 있습니다." },
            { name: "시간표 관리", description: "수업 시간표와 강사 배정을 관리할 수 있습니다." },
        ],
    },
    {
        title: "전자결재",
        permissions: [
            { name: "전자결재 조회", description: "전자결재 문서 목록을 조회할 수 있습니다.", enabled: true },
            { name: "전자결재 처리", description: "전자결재 문서를 승인하거나 반려할 수 있습니다." },
        ],
    },
];

export default function AuthoritySelectList() {
    return (
        <div className="md:h-[calc(100%-153px)] w-full md:overflow-y-auto py-2 scrollbar-hide">
            {permissionGroups.map((group) => (
                <AuthoritySelectGroup key={group.title} />
            ))}
        </div>
    )
}