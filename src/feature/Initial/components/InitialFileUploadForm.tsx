"use client";

import { FormEvent, useState } from "react";
import InitialFileUploadCard from "./InitialFileUploadCard";

const FILE_FIELDS = [
    { name: "studentFile", title: "학생", description: "이름, 학년, 학교, 연락처, 보호자 연락처, 메모" },
    { name: "lectureFile", title: "강의", description: "강의명, 학년, 과목, 강사, 교실, 요일, 시간, 수강료" },
    { name: "enrollmentFile", title: "수강 관계", description: "학생과 강의를 연결하는 수강 정보" },
] as const;

interface InitialFileUploadFormProps {
    error: string;
    isPending: boolean;
    onSubmit: (formData: FormData) => void;
}

export default function InitialFileUploadForm({ error, isPending, onSubmit }: InitialFileUploadFormProps) {
    const [fileNames, setFileNames] = useState<Record<string, string>>({});

    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(new FormData(event.currentTarget));
    };

    return (
        <form className="mt-5 rounded-[12px] border border-[#D7E8DB] bg-white px-6 py-6" onSubmit={submitForm}>
            <div className="grid md:grid-cols-3 gap-4">
                {FILE_FIELDS.map((field) => (
                    <InitialFileUploadCard
                        description={field.description}
                        fileName={fileNames[field.name] ?? ""}
                        key={field.name}
                        name={field.name}
                        onChange={(event) => setFileNames((current) => ({ ...current, [field.name]: event.target.files?.[0]?.name ?? "" }))}
                        title={field.title}
                    />
                ))}
            </div>
            {error && <p className="mt-4 text-[13px] text-[#C0483F]" role="alert">{error}</p>}
            <div className="mt-5 flex">
                <button className="ml-auto h-10 rounded-[8px] bg-[#2C8D50] px-5 text-[13px] font-semibold text-white disabled:bg-[#B8C8BD]" disabled={isPending} type="submit">
                    {isPending ? "파일 분석 중" : "파일 분석 요청"}
                </button>
            </div>
        </form>
    );
}
