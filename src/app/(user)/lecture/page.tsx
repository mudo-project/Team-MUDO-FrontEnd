import CreateLectureButton from "@/feature/lecture/components/CreateLectureButton";
import LectureList from "@/feature/lecture/components/LectureList";
import { LECTURES } from "@/feature/lecture/data";

const filters = ["전체 학년", "전체 요일", "과목", "선생님", "강의실", "학기"];

export default function LecturePage() {
    return (
        <main className="h-[calc(100dvh-52px)] overflow-y-auto bg-[#FCFCFC] px-8 py-7">
            <div className="flex min-w-[920px] items-center gap-2">
                {filters.map((filter) => (
                    <select
                        aria-label={filter}
                        className="h-9 rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] outline-none"
                        defaultValue=""
                        key={filter}
                    >
                        <option value="">{filter}</option>
                    </select>
                ))}

                <p className="pl-1 text-[12px] leading-[18px] text-[#94A3B8]">
                    총 {LECTURES.length}개
                </p>

                <CreateLectureButton />
            </div>

            <div className="w-full overflow-x-auto">
                <LectureList />
            </div>
        </main>
    );
}
