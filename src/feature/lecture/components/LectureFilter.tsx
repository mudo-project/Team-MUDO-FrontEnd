"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LECTURE_DAY_LABEL, LECTURE_GRADE_LABEL } from "../constants";
import { LectureTermData } from "../type";

interface LectureFilterProps {
    classrooms: string[];
    subjects: string[];
    teachers: string[];
    terms: LectureTermData[];
}

const selectClassName =
    "h-9 rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] outline-none";

export default function LectureFilter({ classrooms, subjects, teachers, terms }: LectureFilterProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const changeFilter = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) params.set(name, value);
        else params.delete(name);

        params.delete("page");
        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    };

    return (
        <div className="flex items-center gap-2">
            <select aria-label="학년" className={selectClassName} onChange={(event) => changeFilter("grade", event.target.value)} value={searchParams.get("grade") ?? ""}>
                <option value="">전체 학년</option>
                {Object.entries(LECTURE_GRADE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select aria-label="요일" className={selectClassName} onChange={(event) => changeFilter("dayOfWeek", event.target.value)} value={searchParams.get("dayOfWeek") ?? ""}>
                <option value="">전체 요일</option>
                {Object.entries(LECTURE_DAY_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select aria-label="과목" className={selectClassName} onChange={(event) => changeFilter("subjectName", event.target.value)} value={searchParams.get("subjectName") ?? ""}>
                <option value="">과목</option>
                {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
            <select aria-label="선생님" className={selectClassName} onChange={(event) => changeFilter("teacherName", event.target.value)} value={searchParams.get("teacherName") ?? ""}>
                <option value="">선생님</option>
                {teachers.map((teacher) => <option key={teacher} value={teacher}>{teacher}</option>)}
            </select>
            <select aria-label="강의실" className={selectClassName} onChange={(event) => changeFilter("classroomCode", event.target.value)} value={searchParams.get("classroomCode") ?? ""}>
                <option value="">강의실</option>
                {classrooms.map((classroom) => <option key={classroom} value={classroom}>{classroom}</option>)}
            </select>
            <select aria-label="학기" className={selectClassName} onChange={(event) => changeFilter("termId", event.target.value)} value={searchParams.get("termId") ?? ""}>
                <option value="">학기</option>
                {terms.map((term) => <option key={term.termId} value={term.termId}>{term.termName}</option>)}
            </select>
        </div>
    );
}
