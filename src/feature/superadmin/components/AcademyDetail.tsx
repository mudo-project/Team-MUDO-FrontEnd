export default function AcademyDetail({ academyCode }: { academyCode: string }) {
    return (
        <section>
            <h2 className="mb-3 text-[11px] font-medium text-[#64748B] md:text-[12px]">선택 학원 상세 · <span className="text-[#2C8D50]">{academyCode}</span></h2>
            <div className="grid grid-cols-3 gap-3">
                <article className="rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
                    <p className="text-[10px] text-[#64748B] md:text-[12px]">활성 회원 수</p>
                    <p className="mt-3 text-[24px] font-bold text-[#0F172A]">78 <span className="text-[12px] font-normal text-[#64748B]">명</span></p>
                    <p className="mt-3 text-[10px] text-[#94A3B8] md:text-[12px]">수집 2026.08.13 12:00</p>
                </article>
                <article className="rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
                    <p className="text-[10px] text-[#64748B] md:text-[12px]">데이터베이스 사용량</p>
                    <p className="mt-3 text-[24px] font-bold text-[#0F172A]">43.8 MB</p>
                    <p className="mt-3 text-[10px] text-[#94A3B8] md:text-[12px]">RDS 스키마 사용량</p>
                </article>
                <article className="rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
                    <p className="text-[10px] text-[#64748B] md:text-[12px]">S3 사용량</p>
                    <p className="mt-3 text-[24px] font-bold text-[#0F172A]">97.1 MB</p>
                    <p className="mt-3 text-[10px] text-[#94A3B8] md:text-[12px]">tenants/{academyCode}/ 경로 · 수집 2026.08.13 12:00</p>
                </article>
            </div>
        </section>
    );
}
