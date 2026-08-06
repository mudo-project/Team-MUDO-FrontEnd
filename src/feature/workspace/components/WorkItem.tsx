
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

type Card = {
    title: string;
    owner: string;
    date: string;
    comments: string;
} | {
    title: string;
    owner: string;
    date: string;
}

export default function WorkItem({ column, card }: { column: Column, card: Card }) {
    return (
        <article
            className="min-h-24 w-full rounded-[7px] border border-[#DEE2E8] bg-white px-2 py-3 sm:px-2.5 md:min-h-25 md:px-3 lg:min-h-26.5 lg:rounded-[9px] lg:px-4 lg:py-[14px]"
            key={card.title}
        >
            <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] leading-[15px] sm:px-2 lg:text-[11px] lg:leading-[16.5px] ${column.badgeClass}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${column.badgeDot}`} />
                {column.title}
            </span>
            <h3 className="mt-1.5 text-[10px] leading-[15px] font-medium wrap-break-word md:mt-2 md:text-[12px] md:leading-[17px] lg:text-[13px] lg:leading-[18px]">{card.title}</h3>
            <div className="mt-2 flex items-center text-[10px] leading-[15px] text-[#AEB6C3] lg:mt-2.5 lg:text-[11px] lg:leading-[16.5px]">
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EEF1F4] text-[7px] font-semibold text-[#515B6C]">
                    {card.owner}
                </span>
                <span className="ml-2">{card.date}</span>
                <span className="ml-auto">◌ card?.comments</span>
            </div>
        </article>
    )
}