import { StudentListItemData } from "../type";
import StudentItem from "./StudentItem";

interface StudentListProps {
    students: StudentListItemData[];
}

export default function StudentList({ students }: StudentListProps) {
    return (
        <section className="mt-3 sm:mt-3.5 md:mt-4 overflow-hidden rounded-xl border border-[#DCE8E2] bg-white">
            <div
                className="grid h-8 md:h-[37px] grid-cols-9 sm:grid-cols-10 md:grid-cols-15 items-center border-b border-[#DCE8E2] px-3 sm:px-3.5 md:px-[18px] text-[10px] md:text-[11px] font-medium tracking-[0.33px] text-[#94A3B8]"
                data-testid="student-list-header"
            >
                <p className="col-span-1">#</p>
                <p className="col-span-5 md:col-span-6">이름</p>
                <p className="col-span-1">학년</p>
                <p className="col-span-2 hidden md:block">학생연락처</p>
                <p className="col-span-2 hidden md:block">학부모연락처</p>
                <p className="col-span-1 hidden sm:block">수강</p>
                <p className="col-span-2">학교</p>
            </div>
            <div className="h-[calc(100dvh-230px)] min-h-0 overflow-y-auto">
                {students.length === 0 ? (
                    <p className="py-6 sm:py-8 md:py-10 text-center text-xs md:text-sm text-[#94A3B8]">등록된 원생이 없습니다.</p>
                ) : (
                    students.map((student, i) => (
                        <StudentItem key={student.studentId} student={student} index={i} />
                    ))
                )}
            </div>
        </section>
    );
}
