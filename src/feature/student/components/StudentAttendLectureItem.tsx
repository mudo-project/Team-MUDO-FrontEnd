import { StudentEnrollmentData } from "../type";
import { format } from "date-fns";

interface StudentAttendLectureItemProps {
    enrollment: StudentEnrollmentData;
    onEndLecture: (enrollmentId: number) => void;
}

export default function StudentAttendLectureItem({ enrollment, onEndLecture }: StudentAttendLectureItemProps) {
    return (
        <div className="mt-2 sm:mt-2.5 md:mt-3 flex items-center justify-between rounded-[10px] border border-[#E8F0EB] bg-[#F7FAF8] px-2.5 sm:px-3 md:px-3.5 py-2 sm:py-2.5 md:py-3">
            <div className="min-w-0">
                <p className="text-[12px] md:text-[13px] leading-[18px] md:leading-[19.5px] font-semibold text-[#1D2B3A]">{enrollment.lectureName}</p>
                <p className="pt-0.5 text-[10px] md:text-[11px] leading-[15px] md:leading-[16.5px] text-[#64748B]">{enrollment.teacherName ?? "담당자 미등록"} · {format(new Date(enrollment.enrolledAt), "yyyy-MM-dd")}</p>
            </div>
            <div className="flex items-center gap-1 md:gap-1.5">
                <span className="rounded-full bg-[#D1EAE4] px-1.5 md:px-2 py-[3px] text-[10px] leading-[15px] font-semibold text-[#3D7A6A]">수강중</span>
                <button className="rounded-[6px] border border-[#DCE8E2] bg-white px-1.5 md:px-2 py-1 text-[10px] md:text-[11px] leading-[15px] md:leading-[16.5px] text-[#64748B]" onClick={() => onEndLecture(enrollment.enrollmentId)} type="button">수강 종료</button>
            </div>
        </div>
    );
}
