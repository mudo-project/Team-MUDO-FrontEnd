import {
    getAcademyMemberCountAction,
    getAcademyStorageUsageAction,
} from "../actions";
import SectionError from "./SectionError";

const formatCollectedAt = (collectedAt: string) =>
    new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Seoul",
    }).format(new Date(collectedAt));

const formatMegabytes = (bytes: number) =>
    `${(bytes / 1024 / 1024).toLocaleString("ko-KR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })} MB`;

export default async function AcademyDetail({ academyCode }: { academyCode: string }) {
    const [memberCountResponse, storageUsageResponse] = await Promise.all([
        getAcademyMemberCountAction(academyCode),
        getAcademyStorageUsageAction(academyCode),
    ]);
    const memberCount = memberCountResponse.data;
    const storageUsage = storageUsageResponse.data;

    return (
        <section>
            <h2 className="mb-3 text-[11px] font-medium text-[#64748B] md:text-[12px]">선택 학원 상세 · <span className="text-[#2C8D50]">{academyCode}</span></h2>
            <div className="grid grid-cols-3 gap-3">
                <article className="rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
                    <p className="text-[10px] text-[#64748B] md:text-[12px]">활성 회원 수</p>
                    {memberCount ? (
                        <>
                            <p className="mt-3 text-[24px] font-bold text-[#0F172A]">{memberCount.activeMemberCount.toLocaleString()} <span className="text-[12px] font-normal text-[#64748B]">명</span></p>
                            <p className="mt-3 text-[10px] text-[#94A3B8] md:text-[12px]">수집 {formatCollectedAt(memberCount.collectedAt)}</p>
                        </>
                    ) : (
                        <div className="mt-3">
                            <SectionError message={memberCountResponse.message} />
                        </div>
                    )}
                </article>
                <article className="rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
                    <p className="text-[10px] text-[#64748B] md:text-[12px]">데이터베이스 사용량</p>
                    {storageUsage ? (
                        <>
                            <p className="mt-3 text-[24px] font-bold text-[#0F172A]">{formatMegabytes(storageUsage.databaseBytes)}</p>
                            <p className="mt-3 text-[10px] text-[#94A3B8] md:text-[12px]">RDS 스키마 사용량 · 수집 {formatCollectedAt(storageUsage.collectedAt)}</p>
                        </>
                    ) : (
                        <div className="mt-3">
                            <SectionError message={storageUsageResponse.message} />
                        </div>
                    )}
                </article>
                <article className="rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
                    <p className="text-[10px] text-[#64748B] md:text-[12px]">S3 사용량</p>
                    {storageUsage ? (
                        <>
                            <p className="mt-3 text-[24px] font-bold text-[#0F172A]">{formatMegabytes(storageUsage.s3Bytes)}</p>
                            <p className="mt-3 text-[10px] text-[#94A3B8] md:text-[12px]">tenants/{academyCode}/ 경로 · 수집 {formatCollectedAt(storageUsage.collectedAt)}</p>
                        </>
                    ) : (
                        <div className="mt-3">
                            <SectionError message={storageUsageResponse.message} />
                        </div>
                    )}
                </article>
            </div>
        </section>
    );
}
