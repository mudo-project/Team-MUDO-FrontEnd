import { LectureListItemData } from "@/feature/lecture/type";
import RollLectureItem from "./RollLectureItem";


export default function RollLectureList({ lectures }: { lectures: LectureListItemData[] }) {
    return (
        <section className="mt-4 min-w-[920px] overflow-hidden rounded-[10px] border border-[#D7E8DB] bg-white">
            <div className="grid h-[38px] grid-cols-13 items-center border-b border-[#D7E8DB] px-5 text-[11px] font-medium text-[#B0B8C1]">
                <p className="col-span-3">강의명</p><p className="col-span-1">유형</p><p className="col-span-1">학년</p>
                <p className="col-span-2">담당 선생님</p><p className="col-span-1">강의실</p><p className="col-span-3">시간표</p>
                <p className="col-span-2 text-center">수강생</p>
            </div>

            {lectures.length === 0 ? (
                <p className="py-12 text-center text-[13px] text-[#94A3B8]">조회된 강의가 없습니다.</p>
            ) : lectures.map((lecture) => <RollLectureItem key={lecture.id} lecture={lecture} />)}
        </section>
    );
}
