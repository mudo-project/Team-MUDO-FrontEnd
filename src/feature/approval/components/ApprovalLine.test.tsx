import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { getUserListAction } from "../../auth/actions";
import { useUserStore } from "../../../store/useUserStore";
import { getApprovalTemplateListAction } from "../actions";
import { ApprovalTemplateLineData, ApprovalTemplateListData } from "../type";
import ApprovalLine from "./ApprovalLine";

jest.mock("../actions", () => ({
    getApprovalTemplateListAction: jest.fn(),
}));

jest.mock("../../auth/actions", () => ({
    getUserListAction: jest.fn(),
}));

const mockedGetApprovalTemplateListAction = getApprovalTemplateListAction as jest.Mock;
const mockedGetUserListAction = getUserListAction as jest.Mock;

interface TemplateDatas {
    templates: ApprovalTemplateListData[];
    users: UserListResponse[];
    isLoading: boolean;
    error: string;
}

function ApprovalLineHarness() {
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [approvalLines, setApprovalLines] = useState<ApprovalTemplateLineData[]>([]);
    const [hasChangedApprovalLine, setHasChangedApprovalLine] = useState(false);
    const [templateDatas, setTemplateDatas] = useState<TemplateDatas>({
        templates: [],
        users: [],
        isLoading: true,
        error: "",
    });

    return (
        <div>
            <p>선택된 템플릿: {selectedTemplateId || "없음"}</p>
            <p>변경 여부: {hasChangedApprovalLine ? "변경됨" : "변경안됨"}</p>
            {templateDatas.error && <p>템플릿 오류: {templateDatas.error}</p>}
            <ApprovalLine
                approvalLines={approvalLines}
                selectedTemplateId={selectedTemplateId}
                setApprovalLines={setApprovalLines}
                setHasChangedApprovalLine={setHasChangedApprovalLine}
                setSelectedTemplateId={setSelectedTemplateId}
                setTemplateDatas={setTemplateDatas}
                templateDatas={templateDatas}
            />
        </div>
    );
}

const users: UserListResponse[] = [
    { userId: 1, name: "본인", username: "me" },
    { userId: 2, name: "김민수", username: "minsu" },
    { userId: 3, name: "이지은", username: "jieun" },
    { userId: 4, name: "박준호", username: "junho" },
];

const templateA: ApprovalTemplateListData = {
    id: 1,
    name: "휴가 신청서",
    createdAt: "2026-08-01T00:00:00.000Z",
    lines: [{ stepOrder: 1, approverId: 2, approverName: "김민수" }],
};

const templateB: ApprovalTemplateListData = {
    id: 2,
    name: "지출 결의서",
    createdAt: "2026-08-02T00:00:00.000Z",
    lines: [
        { stepOrder: 1, approverId: 3, approverName: "이지은" },
        { stepOrder: 2, approverId: 4, approverName: "박준호" },
    ],
};

describe("ApprovalLine", () => {
    beforeEach(() => {
        act(() => {
            useUserStore.setState({ user: { ...useUserStore.getState().user, sub: "1" } });
        });
    });

    afterEach(() => {
        act(() => {
            useUserStore.setState({ user: { ...useUserStore.getState().user, sub: "" } });
        });
        jest.clearAllMocks();
    });

    it("템플릿과 구성원을 조회해 첫 번째 템플릿을 자동 선택하고 결재선을 표시한다", async () => {
        mockedGetApprovalTemplateListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [templateA, templateB], page: 0, size: 20, hasNext: false },
        });
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(<ApprovalLineHarness />);

        expect(await screen.findByText("선택된 템플릿: 1")).toBeInTheDocument();
        expect(await screen.findByLabelText("1차 결재자")).toHaveValue("2");
    });

    it("다른 템플릿으로 변경하면 해당 템플릿의 결재선으로 갱신하고 변경 여부를 초기화한다", async () => {
        mockedGetApprovalTemplateListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [templateA, templateB], page: 0, size: 20, hasNext: false },
        });
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(<ApprovalLineHarness />);

        await screen.findByText("선택된 템플릿: 1");
        fireEvent.change(screen.getByLabelText(/양식 선택/), { target: { value: "2" } });

        expect(await screen.findByText("선택된 템플릿: 2")).toBeInTheDocument();
        expect(screen.getByLabelText("1차 결재자")).toHaveValue("3");
        expect(screen.getByLabelText("2차 결재자")).toHaveValue("4");
        expect(screen.getByText("변경 여부: 변경안됨")).toBeInTheDocument();
    });

    it("결재자 추가를 클릭하면 사용 가능한 구성원을 결재선에 추가하고 변경 여부를 표시한다", async () => {
        mockedGetApprovalTemplateListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [templateA], page: 0, size: 20, hasNext: false },
        });
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(<ApprovalLineHarness />);

        await screen.findByText("선택된 템플릿: 1");
        await screen.findByLabelText("1차 결재자");
        fireEvent.click(screen.getByRole("button", { name: "결재자 추가" }));

        expect(await screen.findByLabelText("2차 결재자")).toHaveValue("3");
        expect(screen.getByText("변경 여부: 변경됨")).toBeInTheDocument();
    });

    it("결재선이 한 명뿐이면 삭제할 수 없다", async () => {
        mockedGetApprovalTemplateListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [templateA], page: 0, size: 20, hasNext: false },
        });
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(<ApprovalLineHarness />);

        await screen.findByText("선택된 템플릿: 1");
        fireEvent.click(await screen.findByRole("button", { name: "1차 결재자 삭제" }));

        expect(screen.getByLabelText("1차 결재자")).toBeInTheDocument();
        expect(screen.getByText("변경 여부: 변경안됨")).toBeInTheDocument();
    });

    it("결재자를 삭제하면 결재선에서 제거하고 순서를 다시 매긴다", async () => {
        mockedGetApprovalTemplateListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [templateB], page: 0, size: 20, hasNext: false },
        });
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(<ApprovalLineHarness />);

        await screen.findByText("선택된 템플릿: 2");
        fireEvent.click(await screen.findByRole("button", { name: "1차 결재자 삭제" }));

        expect(screen.queryByLabelText("2차 결재자")).not.toBeInTheDocument();
        expect(screen.getByLabelText("1차 결재자")).toHaveValue("4");
        expect(screen.getByText("변경 여부: 변경됨")).toBeInTheDocument();
    });

    it("결재자를 변경하면 해당 결재선의 결재자를 갱신한다", async () => {
        mockedGetApprovalTemplateListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [templateA], page: 0, size: 20, hasNext: false },
        });
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(<ApprovalLineHarness />);

        await screen.findByText("선택된 템플릿: 1");
        const firstApprover = await screen.findByLabelText("1차 결재자");
        fireEvent.change(firstApprover, { target: { value: "3" } });

        expect(screen.getByLabelText("1차 결재자")).toHaveValue("3");
        expect(screen.getByText("변경 여부: 변경됨")).toBeInTheDocument();
    });

    it("템플릿 조회에 실패하면 오류 메시지를 표시하고 선택 가능한 양식이 없다고 안내한다", async () => {
        mockedGetApprovalTemplateListAction.mockResolvedValue({
            success: false,
            message: "결재 템플릿 목록 조회에 실패했습니다.",
        });
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(<ApprovalLineHarness />);

        expect(await screen.findByText("템플릿 오류: 결재 템플릿 목록 조회에 실패했습니다.")).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "선택 가능한 양식이 없습니다" })).toBeInTheDocument();
    });
});
