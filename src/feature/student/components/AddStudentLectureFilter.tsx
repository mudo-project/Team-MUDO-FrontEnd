import { LECTURE_DAY_LABEL, LECTURE_GRADE_LABEL } from "@/feature/lecture/constants";
import { LectureListQuery, LectureTermData } from "@/feature/lecture/type";

export type AddStudentLectureFilters = Pick<
    LectureListQuery,
    "grade" | "dayOfWeek" | "subjectName" | "teacherName" | "classroomCode" | "termId"
>;

interface AddStudentLectureFilterProps {
    classrooms: string[];
    filters: AddStudentLectureFilters;
    onChange: (filters: AddStudentLectureFilters) => void;
    subjects: string[];
    teachers: string[];
    terms: LectureTermData[];
}

const selectClassName =
    "h-7 md:h-8 min-w-0 rounded-[8px] border border-[#DCE8E2] bg-white px-1.5 sm:px-2 text-[11px] text-[#0F172A] outline-none";

export default function AddStudentLectureFilter({
    classrooms,
    filters,
    onChange,
    subjects,
    teachers,
    terms,
}: AddStudentLectureFilterProps) {
    const changeFilter = <K extends keyof AddStudentLectureFilters>(
        name: K,
        value: AddStudentLectureFilters[K],
    ) => {
        onChange({ ...filters, [name]: value || undefined });
    };

    return (
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-1.5">
            <select aria-label="학년" className={selectClassName} onChange={(event) => changeFilter("grade", event.target.value as AddStudentLectureFilters["grade"])} value={filters.grade ?? ""}>
                <option value="">전체 학년</option>
                {Object.entries(LECTURE_GRADE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select aria-label="요일" className={selectClassName} onChange={(event) => changeFilter("dayOfWeek", event.target.value as AddStudentLectureFilters["dayOfWeek"])} value={filters.dayOfWeek ?? ""}>
                <option value="">전체 요일</option>
                {Object.entries(LECTURE_DAY_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select aria-label="과목" className={selectClassName} onChange={(event) => changeFilter("subjectName", event.target.value)} value={filters.subjectName ?? ""}>
                <option value="">과목</option>
                {subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
            <select aria-label="선생님" className={selectClassName} onChange={(event) => changeFilter("teacherName", event.target.value)} value={filters.teacherName ?? ""}>
                <option value="">선생님</option>
                {teachers.map((teacher) => <option key={teacher} value={teacher}>{teacher}</option>)}
            </select>
            <select aria-label="강의실" className={selectClassName} onChange={(event) => changeFilter("classroomCode", event.target.value)} value={filters.classroomCode ?? ""}>
                <option value="">강의실</option>
                {classrooms.map((classroom) => <option key={classroom} value={classroom}>{classroom}</option>)}
            </select>
            <select aria-label="학기" className={selectClassName} onChange={(event) => changeFilter("termId", event.target.value ? Number(event.target.value) : undefined)} value={filters.termId ?? ""}>
                <option value="">학기</option>
                {terms.map((term) => <option key={term.termId} value={term.termId}>{term.termName}</option>)}
            </select>
        </div>
    );
}
