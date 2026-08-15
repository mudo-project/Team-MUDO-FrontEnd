"use client";

import { FileSpreadsheet, Upload } from "lucide-react";
import { ChangeEvent } from "react";

interface InitialFileUploadCardProps {
    description: string;
    fileName: string;
    name: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    title: string;
}

export default function InitialFileUploadCard({ description, fileName, name, onChange, title }: InitialFileUploadCardProps) {
    return (
        <label className="cursor-pointer rounded-[10px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-4">
            <span className="flex items-center gap-2 text-[14px] font-semibold text-[#0F172A]"><FileSpreadsheet className="size-4 text-[#2C8D50]" />{title}</span>
            <span className="mt-1 block min-h-9 text-[11px] leading-[18px] text-[#64748B]">{description}</span>
            <span className="mt-4 flex h-[92px] flex-col items-center justify-center rounded-[8px] border border-dashed border-[#BFD4C5] bg-white text-center">
                <Upload className="size-5 text-[#64748B]" strokeWidth={1.5} />
                <span className="mt-1 max-w-[90%] truncate text-[12px] font-medium text-[#0F172A]">{fileName || "파일을 선택해주세요"}</span>
                <span className="mt-0.5 text-[11px] text-[#94A3B8]">CSV, XLSX</span>
            </span>
            <input accept=".csv,.xlsx" className="hidden" name={name} onChange={onChange} type="file" />
        </label>
    );
}
