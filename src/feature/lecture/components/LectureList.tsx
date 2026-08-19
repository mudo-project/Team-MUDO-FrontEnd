import { LectureListItemData } from "../type";
import LectureItem from "./LectureItem";

export default function LectureList({ lectures }: { lectures: LectureListItemData[] }) {
    return (
        <section className="mt-3 md:mt-4  overflow-hidden rounded-[10px] border border-[#D7E8DB] bg-white">
            <div className="grid h-[34px] md:h-[36px] lg:h-[38px] grid-cols-9 md:grid-cols-13  items-center border-b border-[#D7E8DB] px-3 md:px-4 lg:px-5 text-[11px] font-medium text-[#B0B8C1]">
                <p className="col-span-3">강의명</p>
                <p className="col-span-2 sm:col-span-1">유형</p>
                <p className="col-span-1">학년</p>
                <p className="col-span-2">담당 선생님</p>
                <p className="col-span-1 md:block hidden">강의실</p>
                <p className="col-span-3 md:block hidden">시간표</p>
                <p className="col-span-2 text-center sm:block hidden">수강생</p>
            </div>
            <div className="h-[calc(100dvh-230px)] min-h-0 overflow-y-auto">

                {lectures.length === 0 ? (
                    <p className="py-8 md:py-10 lg:py-12 text-center text-[12px] md:text-[13px] text-[#94A3B8]">조회된 강의가 없습니다.</p>
                ) : lectures.map((lecture) => <LectureItem key={lecture.id} lecture={lecture} />)}
            </div>
        </section>
    );
}
