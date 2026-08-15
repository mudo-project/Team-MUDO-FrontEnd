import MessageTemplateCreateButton from "@/feature/message/components/MessageTemplateCreateButton";
import MessageTemplateItem from "@/feature/message/components/MessageTemplateItem";

const templates = [
    {
        name: "결석 안내",
        status: "결석",
        content: "{studentName} 학생이 오늘 결석했습니다. 문의사항은 학원으로 연락 주세요.",
        updatedAt: "2026.08.06",
        createdAt: "2026.08.06",
        dotClassName: "bg-[#DC2626]",
        badgeClassName: "bg-[#FEF2F2] text-[#DC2626]",
    },
    {
        name: "지각 안내",
        status: "지각",
        content: "{studentName} 학생이 오늘 지각했습니다. 수업에 늦지 않도록 안내 부탁드립니다.",
        updatedAt: "2026.08.07",
        createdAt: "2026.08.07",
        dotClassName: "bg-[#D97706]",
        badgeClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
        name: "출석 확인",
        status: "출석",
        content: "{studentName} 학생이 오늘 정상 출석하였습니다.",
        updatedAt: "2026.08.08",
        createdAt: "2026.08.08",
        dotClassName: "bg-[#16A34A]",
        badgeClassName: "bg-[#F0FDF4] text-[#16A34A]",
    },
    {
        name: "온라인 수업 안내",
        status: "온라인",
        content: "{studentName} 학생이 오늘 온라인으로 수업에 참여했습니다.",
        updatedAt: "2026.08.09",
        createdAt: "2026.08.09",
        dotClassName: "bg-[#2563EB]",
        badgeClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
];

export default function MessagePage() {
    return (
        <main className="h-[calc(100dvh-52px)] overflow-y-auto bg-[#FCFCFC] px-8 py-7">
            <div className="flex min-w-[920px] items-center gap-2.5">

                <MessageTemplateCreateButton />
            </div>

            <section className="mt-6 grid min-w-[920px] grid-cols-3 gap-4">
                {templates.map((template) => (
                    <MessageTemplateItem
                        key={template.name}
                        template={template}
                    />
                ))}
            </section>
        </main>
    );
}
