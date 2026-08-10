"use client";

import { uploadFiles } from "@/feature/file/uploadFiles";
import {
    createApprovalAction,
} from "@/feature/approval/actions";
import {
    ApprovalTemplateLineData,
    ApprovalTemplateListData,
} from "@/feature/approval/type";
import { Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    ChangeEvent,
    DragEvent,
    FormEvent,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";
import ApprovalLine from "../ApprovalLine";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = ["pdf", "docx", "xlsx"];

const getFileKey = (file: File) =>
    `${file.name}:${file.size}:${file.lastModified}`;

interface CreateApprovalModalProps {
    closeModal: () => void;
}

interface TemplateDatas {
    templates: ApprovalTemplateListData[];
    users: UserListResponse[];
    isLoading: boolean;
    error: string;
}


export default function CreateApprovalModal({
    closeModal,
}: CreateApprovalModalProps) {
    const router = useRouter();
    const isMounted = useRef(true);

    const [templateDatas, setTemplateDatas] = useState<TemplateDatas>({
        templates: [],
        users: [],
        isLoading: true,
        error: ''
    });
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [approvalLines, setApprovalLines] = useState<ApprovalTemplateLineData[]>([]);
    const [hasChangedApprovalLine, setHasChangedApprovalLine] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedFileIds, setUploadedFileIds] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");


    //파일 수정
    const addFiles = (selectedFiles: File[]) => {
        setError("");

        const invalidFile = selectedFiles.find((file) => {
            const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
            return (
                !ALLOWED_FILE_EXTENSIONS.includes(extension) ||
                file.size > MAX_FILE_SIZE
            );
        });

        if (invalidFile) {
            setError("PDF, DOCX, XLSX 파일만 개당 최대 50MB까지 첨부할 수 있습니다.");
            return;
        }

        setFiles((current) => {
            const currentKeys = new Set(current.map(getFileKey));
            return [
                ...current,
                ...selectedFiles.filter((file) => !currentKeys.has(getFileKey(file))),
            ];
        });
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        addFiles(Array.from(event.target.files ?? []));
        event.target.value = "";
    };

    const handleFileDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        addFiles(Array.from(event.dataTransfer.files));
    };

    const removeFile = (file: File) => {
        const fileKey = getFileKey(file);
        setFiles((current) => current.filter((item) => getFileKey(item) !== fileKey));
        setUploadedFileIds((current) => {
            const next = { ...current };
            delete next[fileKey];
            return next;
        });
    };

    const canSubmit =
        Boolean(selectedTemplateId) &&
        approvalLines.length > 0 &&
        !templateDatas.isLoading &&
        !isSubmitting;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit) return;

        const formData = new FormData(event.currentTarget);

        const title = String(formData.get("title"));
        const text = String(formData.get("content"))
        const leaveStartDate = String(formData.get("leaveStartDate"))
        const leaveEndDate = String(formData.get("leaveEndDate"));

        if (leaveStartDate.length !== leaveEndDate.length) {
            setError('휴가 신청 시 시작일과 종료일을 모두 작성해주세요')
            return;
        }

        if (leaveEndDate < leaveStartDate) {
            setError('휴가 시작일과 종료일을 다시 확인해주세요')
            return;
        }

        if (!title.trim() || !text.trim()) {
            setError('제목과 내용을 입력해주세요')
            return;
        }


        setIsSubmitting(true);
        setError("");

        try {
            const uploadResult = await uploadFiles(files, uploadedFileIds);

            if (isMounted.current) {
                setUploadedFileIds(uploadResult.uploadedFileIds);
            }

            const request = {
                templateId: Number(selectedTemplateId),
                title: title.trim(),
                contentType: "TEXT" as const,
                text: text.trim(),
                fileIds: uploadResult.fileIds,
                approverIds: hasChangedApprovalLine
                    ? approvalLines.map(({ approverId }) => approverId)
                    : undefined,
            }

            const leaveDate = {
                leaveStartDate: leaveStartDate,
                leaveEndDate: leaveEndDate
            }

            const payload = leaveEndDate && leaveEndDate ? { ...request, ...leaveDate } : request;

            const response = await createApprovalAction(payload);

            if (!response.success) {
                throw new Error(response.message);
            }

            toast.success(response.message);
            closeModal();
            router.refresh();
        } catch (submitError) {
            if (isMounted.current) {
                setError(
                    submitError instanceof Error
                        ? submitError.message
                        : "결재 신청에 실패했습니다.",
                );
            }
        } finally {
            if (isMounted.current) {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35"
            onClick={closeModal}
        >
            <form
                className="fixed top-1/2 left-1/2 z-1000 max-h-[85vh] w-5/6 max-w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[14px] bg-white p-6 shadow-[0_8px_40px_rgba(22,34,54,0.18)] scrollbar-hide md:w-3/5 lg:w-[560px] lg:p-7"
                onClick={(event) => event.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="flex items-center">
                    <h2 className="text-[15px] font-bold leading-[22.5px] text-[#0F172A] lg:text-[18px] lg:leading-[27px]">
                        결재 상신
                    </h2>
                    <button
                        aria-label="결재 상신 모달 닫기"
                        className="ml-auto flex size-[22px] items-center justify-center text-[#C0C8D0]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

                <ApprovalLine setSelectedTemplateId={setSelectedTemplateId} setApprovalLines={setApprovalLines} setHasChangedApprovalLine={setHasChangedApprovalLine} approvalLines={approvalLines} selectedTemplateId={selectedTemplateId} templateDatas={templateDatas} setTemplateDatas={setTemplateDatas} isMounted={isMounted} />

                <div className="mt-4 w-full">
                    <label className="block pb-1.5 text-[12px] font-medium leading-[18px] text-[#6B7280]" htmlFor="approval-title">제목 <span className="text-[#C0483F]">*</span></label>
                    <input className="h-[37px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none" id="approval-title" placeholder="결재 제목을 입력하세요" name="title" />
                </div>

                <div className="mt-4 w-full">
                    <label className="block pb-1.5 text-[12px] font-medium leading-[18px] text-[#6B7280]" htmlFor="approval-content">내용 <span className="text-[#C0483F]">*</span></label>
                    <textarea className="block h-[96px] w-full resize-none rounded-[8px] border border-[#D7E8DB] px-3 py-2 text-[13px] leading-[19.5px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none" id="approval-content" placeholder="결재 내용을 입력하세요" name="content" />
                </div>


                <div className="mt-4 grid grid-cols-2 gap-2">
                    <label className="text-[12px] font-medium text-[#6B7280]">휴가 시작일<input className="mt-1.5 h-[37px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[12px] focus:outline-none" type="date" name="leaveStartDate" /></label>
                    <label className="text-[12px] font-medium text-[#6B7280]">휴가 종료일<input className="mt-1.5 h-[37px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[12px] focus:outline-none" type="date" name='leaveEndDate' /></label>
                </div>


                <div className="mt-4 w-full">
                    <p className="text-[12px] font-medium leading-[18px] text-[#6B7280]">첨부파일</p>
                    <label className="mt-2 flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] border border-dashed border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5" onDragOver={(event) => event.preventDefault()} onDrop={handleFileDrop}>
                        <Upload className="size-[18px] shrink-0 text-[#64748B]" strokeWidth={1.5} />
                        <span>
                            <strong className="block text-[12px] font-medium leading-[18px] text-[#0F172A]">파일 끌어다 놓기 또는 클릭해 선택</strong>
                            <span className="block text-[11px] leading-[16.5px] text-[#64748B]">PDF, DOCX, XLSX · 개당 최대 50MB</span>
                        </span>
                        <input accept=".pdf,.docx,.xlsx" className="hidden" multiple onChange={handleFileChange} type="file" />
                    </label>
                    {files.length > 0 && (
                        <ul className="mt-2 space-y-1">
                            {files.map((file) => (
                                <li className="flex items-center rounded-[7px] bg-[#F7F8FA] px-3 py-2 text-[11px] text-[#64748B]" key={getFileKey(file)}>
                                    <span className="min-w-0 truncate">{file.name}</span>
                                    <button aria-label={`${file.name} 삭제`} className="ml-auto pl-2 text-[14px] text-[#C0C8D0]" disabled={isSubmitting} onClick={() => removeFile(file)} type="button">×</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {error && <p className="mt-3 text-[12px] text-red-500" role="alert">{error}</p>}

                <button className="mt-4 h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white disabled:opacity-40" disabled={!canSubmit} type="submit">
                    {isSubmitting ? "상신 중..." : "상신하기"}
                </button>
            </form>
        </div>
    );
}
