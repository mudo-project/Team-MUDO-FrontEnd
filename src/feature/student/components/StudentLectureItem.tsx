import { LECTURE_DAY_LABEL, LECTURE_GRADE_LABEL } from "@/feature/lecture/constants";
import { LectureListItemData } from "@/feature/lecture/type";

interface StudentLectureItemProps {
    enrolledLectureIds: number[];
    lecture: LectureListItemData;
}

export default function StudentLectureItem({ enrolledLectureIds, lecture }: StudentLectureItemProps) {
    const isEnrolled = enrolledLectureIds.includes(lecture.id);
    const schedule = lecture.schedules[0];

    return (
        <label
            htmlFor={String(lecture.id)}
            className={`mb-2 flex w-full items-center justify-between rounded-[10px] border border-[#DCE8E2] px-3.5 py-3 text-left last:mb-0 has-checked:bg-[#F7FAF8] ${isEnrolled ? "cursor-not-allowed bg-[#E5E7E7] opacity-60" : "bg-white"}`}
        >
            <input disabled={isEnrolled} hidden id={String(lecture.id)} name="lectureId" type="radio" value={lecture.id} />
            <span>
                <strong className="block text-[13px] leading-[19.5px] font-semibold text-[#1D2B3A]">
                    {lecture.name}
                </strong>
                <span className="block text-[11px] leading-[16.5px] text-[#64748B]">
                    {lecture.teacherName ?? "담당자 미등록"} · {lecture.grade ? LECTURE_GRADE_LABEL[lecture.grade] : "학년 미등록"}
                </span>
            </span>
            <span className="text-right text-[10px] leading-[15px] text-[#94A3B8]">
                {isEnrolled ? "수강 중" : schedule ? `${LECTURE_DAY_LABEL[schedule.dayOfWeek]} ${schedule.startTime.slice(0, 5)}-${schedule.endTime.slice(0, 5)}` : "시간 미등록"}
            </span>
        </label>
    );
}
