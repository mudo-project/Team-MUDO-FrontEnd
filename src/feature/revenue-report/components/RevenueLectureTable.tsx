interface RevenueLectureTableProps {
    data: { lectureName: string; teacherName: string; studentCount: number; actualRevenue: number }[];
}

export default function RevenueLectureTable({ data }: RevenueLectureTableProps) {
    return (
        <section aria-label="강의별 매출" className="min-w-0 rounded-xl border border-[#DCE9DF] bg-white p-5">
            <h2 className="text-[14px] font-semibold text-[#0F172A]">강의별 매출</h2>

            {data.length === 0 ? (
                <p className="mt-3 text-[13px] text-[#94A3B8]">이번 달 매출이 발생한 강의가 없어요.</p>
            ) : (
                <table className="mt-3 w-full text-left text-[12px]">
                    <thead>
                        <tr className="border-b border-[#E1EBE3] text-[#718096]">
                            <th className="py-2 font-medium" scope="col">강의명</th>
                            <th className="py-2 font-medium" scope="col">담당 강사</th>
                            <th className="py-2 text-right font-medium" scope="col">수강생</th>
                            <th className="py-2 text-right font-medium" scope="col">매출</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((lecture) => (
                            <tr key={lecture.lectureName} className="border-b border-[#F1F5F1] last:border-b-0">
                                <td className="max-w-0 truncate py-2 pr-2 text-[#0F172A]">{lecture.lectureName}</td>
                                <td className="py-2 pr-2 text-[#64748B]">{lecture.teacherName}</td>
                                <td className="py-2 text-right text-[#64748B]">{lecture.studentCount}명</td>
                                <td className="py-2 text-right font-medium text-[#0F172A]">
                                    {lecture.actualRevenue.toLocaleString()}원
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}
