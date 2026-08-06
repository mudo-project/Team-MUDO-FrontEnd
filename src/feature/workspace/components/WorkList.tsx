import WorkItem from "./WorkItem";

type Column = {
    title: string;
    count: number;
    dotColor: string;
    badgeClass: string;
    badgeDot: string;
    cards: {
        title: string;
        owner: string;
        date: string;
    }[]
} | {
    title: string;
    count: number;
    dotColor: string;
    badgeClass: string;
    badgeDot: string;
    cards: {
        title: string;
        owner: string;
        date: string;
        comments: string;
    }[]
}

export default function WorkList({ column }: { column: Column }) {
    return (
        <section className="w-full" key={column.title}>
            <div className="mb-2 flex items-center gap-1 sm:gap-1.5 lg:mb-2.5 lg:gap-2">
                <span className={`h-2 w-2 rounded-full ${column.dotColor}`} />
                <h2 className="text-[10px] leading-[16px] font-semibold sm:text-[11px] lg:text-[12px] lg:leading-[18px]">{column.title}</h2>
                <span className="rounded-full bg-[#F0F2F5] px-[7px] py-px text-[10px] leading-[15px] text-[#A5ADBA]">
                    {column.count}
                </span>
            </div>

            <div className="space-y-2">
                {column.cards.map((card) => (
                    <WorkItem key={card.date} column={column} card={card} />
                ))}

                <button className="flex h-8 w-full items-center rounded-[7px] border border-dashed border-[#E1E5EA] px-2 text-[10px] leading-[16px] text-[#C2C8D1] sm:text-[11px] md:px-3 lg:h-9 lg:rounded-[8px] lg:px-3.5 lg:text-[12px] lg:leading-[18px]">
                    <span className="mr-1 text-[12px] font-light sm:text-[13px] lg:mr-1.5 lg:text-[14px]">＋</span> 업무 추가
                </button>
            </div>
        </section>
    )
}