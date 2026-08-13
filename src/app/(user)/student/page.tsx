import StudentList from "@/feature/student/components/StudentList";
import { STUDENTS } from "@/feature/student/data";
import CreateStudentButton from "@/feature/student/components/CreateStudentButton";
import SearchBar from "@/components/ui/SearchBar";

export default function Page() {
    return (
        <main className="h-[calc(100dvh-52px)] overflow-hidden bg-[#FCFCFC] px-8 py-7">
            <div className="flex w-full items-center gap-2.5">
                <SearchBar />
                <p className="pl-1 text-xs text-[#64748B]">총 {STUDENTS.length}명</p>
                <CreateStudentButton />
            </div>

            <div className="w-full overflow-x-auto">
                <StudentList students={STUDENTS} />
            </div>
        </main>
    );
}
