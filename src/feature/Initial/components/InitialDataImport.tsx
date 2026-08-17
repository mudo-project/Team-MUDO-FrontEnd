"use client";

import {
    changeOnboardingDataImportDraftAction,
    confirmOnboardingDataImportAction,
    createOnboardingDataImportAction,
    getOnboardingDataImportDraftAction,
    getOnboardingDataImportResultAction,
} from "../actions";
import {
    DataImportDraftData,
    DataImportResultData,
} from "../type";
import EnrollmentDraftSection from "./EnrollmentDraftSection";
import InitialFileUploadForm from "./InitialFileUploadForm";
import InitialImportResult from "./InitialImportResult";
import LectureDraftSection from "./LectureDraftSection";
import StudentDraftSection from "./StudentDraftSection";
import { useState } from "react";
import { toast } from "sonner";

export default function InitialDataImport() {
    const [importId, setImportId] = useState<number>();
    const [draft, setDraft] = useState<DataImportDraftData>();
    const [result, setResult] = useState<DataImportResultData>();
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const uploadFiles = async (formData: FormData) => {
        setIsPending(true);
        setError("");

        const uploadResponse = await createOnboardingDataImportAction(formData);
        if (!uploadResponse.success || !uploadResponse.data) {
            setError(uploadResponse.message);
            setIsPending(false);
            return;
        }

        const draftResponse = await getOnboardingDataImportDraftAction(uploadResponse.data.importId);
        if (!draftResponse.success || !draftResponse.data) {
            setError(draftResponse.message);
            setIsPending(false);
            return;
        }

        setImportId(uploadResponse.data.importId);
        setDraft(draftResponse.data);
        setIsPending(false);
        toast.success(uploadResponse.message);
    };

    const toggleStudent = (rowId: string) => setDraft((current) => current && ({
        ...current,
        students: current.students.map((row) => row.rowId === rowId ? { ...row, selected: !row.selected } : row),
    }));
    const toggleLecture = (rowId: string) => setDraft((current) => current && ({
        ...current,
        lectures: current.lectures.map((row) => row.rowId === rowId ? { ...row, selected: !row.selected } : row),
    }));
    const toggleEnrollment = (rowId: string) => setDraft((current) => current && ({
        ...current,
        enrollments: current.enrollments.map((row) => row.rowId === rowId ? { ...row, selected: !row.selected } : row),
    }));

    const saveDraft = async () => {
        if (!importId || !draft) return false;
        setIsPending(true);
        setError("");
        const response = await changeOnboardingDataImportDraftAction(importId, draft);
        setIsPending(false);
        if (!response.success) {
            setError(response.message);
            return false;
        }
        toast.success(response.message);
        return true;
    };

    const confirmImport = async () => {
        if (!importId || !draft) return;
        const invalidSelected = [...draft.students, ...draft.lectures, ...draft.enrollments]
            .some((row) => row.selected && row.status !== "READY");
        if (invalidSelected) {
            setError("등록 가능한 상태가 아닌 선택 행을 제외해주세요.");
            return;
        }

        if (!(await saveDraft())) return;
        setIsPending(true);
        const confirmResponse = await confirmOnboardingDataImportAction(importId);
        if (!confirmResponse.success) {
            setError(confirmResponse.message);
            setIsPending(false);
            return;
        }

        const resultResponse = await getOnboardingDataImportResultAction(importId);
        setIsPending(false);
        if (!resultResponse.success || !resultResponse.data) {
            setError(resultResponse.message);
            return;
        }
        setResult(resultResponse.data);
        toast.success(confirmResponse.message);
    };

    if (result) {
        return <InitialImportResult result={result} />;
    }

    return (
        <main className="h-[calc(100dvh-52px)] overflow-y-auto bg-[#FCFCFC] px-8 py-7">
            <div className="mx-auto w-full max-w-[1180px]">
                <h1 className="text-[20px] font-bold text-[#0F172A]">초기 데이터 동기화</h1>
                <p className="mt-1 text-[13px] text-[#64748B]">기존 학생·강의·수강 데이터를 CSV 또는 XLSX 파일로 가져옵니다.</p>

                {!draft && <InitialFileUploadForm error={error} isPending={isPending} onSubmit={(formData) => void uploadFiles(formData)} />}

                {draft && <div className="mt-5 space-y-4 ">
                    <StudentDraftSection onToggle={toggleStudent} rows={draft.students} />
                    <LectureDraftSection onToggle={toggleLecture} rows={draft.lectures} />
                    <EnrollmentDraftSection onToggle={toggleEnrollment} rows={draft.enrollments} />
                    {error && <p className="text-[13px] text-[#C0483F]" role="alert">{error}</p>}
                    <div className="flex justify-end gap-2 pb-5">
                        <button className="h-10 rounded-[8px] bg-[#2C8D50] px-5 text-[13px] font-semibold text-white disabled:bg-[#B8C8BD]" disabled={isPending} onClick={() => confirmImport()} type="button">{isPending ? "처리 중" : "선택 항목 확정"}</button>
                    </div>
                </div>}
            </div>
        </main>
    );
}
