import { StudentListData } from "../type";
import StudentItem from "./StudentItem";

interface StudentListProps {
    students: StudentListData[];
}

export default function StudentList({ students }: StudentListProps) {
    return (
        <section className="mt-4 min-w-[760px] overflow-hidden rounded-xl border border-[#DCE8E2] bg-white">
            <div
                className="grid h-[37px] grid-cols-15 items-center border-b border-[#DCE8E2] px-[18px] text-[11px] font-medium tracking-[0.33px] text-[#94A3B8]"
                data-testid="student-list-header"
            >
                <p className="col-span-1">#</p>
                <p className="col-span-6">이름</p>
                <p className="col-span-1">학년</p>
                <p className="col-span-2">학생연락처</p>
                <p className="col-span-2">학부모연락처</p>
                <p className="col-span-1">수강</p>
                <p className="col-span-2">학교</p>
            </div>
            <div className="h-[calc(100dvh-197px)] min-h-0 overflow-y-auto">
                {students.map((student) => (
                    <StudentItem key={student.id} student={student} />
                ))}
            </div>
        </section>
    );
}
