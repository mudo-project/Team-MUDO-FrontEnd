import { LECTURES } from "../data";
import LectureItem from "./LectureItem";

export default function LectureList() {
    return (
        <section className="mt-4 min-w-[920px] overflow-hidden rounded-[10px] border border-[#D7E8DB] bg-white">
            <div className={`grid grid-cols-15 items-center px-5 h-[38px] border-b border-[#D7E8DB] text-[11px] font-medium text-[#B0B8C1]`}>
                <p className="col-span-3">강의명</p>
                <p className="col-span-1">유형</p>
                <p className="col-span-1">학년</p>
                <p className="col-span-2">담당 선생님</p>
                <p className="col-span-1">강의실</p>
                <p className="col-span-3">시간표</p>
                <p className="col-span-2 text-right">수강료</p>
                <p className="col-span-2 text-center">수강생</p>
            </div>

            {LECTURES.map((lecture) => (
                <LectureItem key={lecture.title} lecture={lecture} />
            ))}
        </section>
    );
}
