import { DataImportResultData } from "../type";
import InitialResultCard from "./InitialResultCard";

export default function InitialImportResult({ result }: { result: DataImportResultData }) {
    const items = [
        { label: "생성 학생", value: result.createdStudents },
        { label: "생성 강의", value: result.createdLectures },
        { label: "생성 수강", value: result.createdEnrollments },
        { label: "제외 행", value: result.skippedRows },
        { label: "실패 행", value: result.failedRows },
    ];

    return (
        <main className="h-[calc(100dvh-52px)] overflow-y-auto bg-[#FCFCFC] px-8 py-7">
            <div className="mx-auto w-full max-w-[1180px]">
                <h1 className="text-[20px] font-bold text-[#0F172A]">초기 데이터 동기화 완료</h1>
                <p className="mt-1 text-[13px] text-[#64748B]">학생·강의·수강 관계 등록 결과입니다.</p>
                <section className="mt-5 grid grid-cols-5 gap-3">
                    {items.map((item) => <InitialResultCard key={item.label} label={item.label} value={item.value} />)}
                </section>
            </div>
        </main>
    );
}
