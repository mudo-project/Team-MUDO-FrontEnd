import Link from "next/link";

interface PaginationProps {
    url: string;
    page: string;
    hasNext?: boolean | undefined;
    sort?: string;
    type?: string;
    keyword?: string;
}

export default function PaginationPrev({ url, page, hasNext, sort, type, keyword }: PaginationProps) {
    const currentpage = Number(page);
    const getPageUrl = (nextPage: number) => {
        const params = new URLSearchParams({ page: String(nextPage) });

        if (sort) params.set("sort", sort);
        if (type) params.set("type", type);
        if (keyword) params.set("keyword", keyword);

        return `/${url}?${params.toString()}`;
    }
    console.log(hasNext)

    return (
        <div className="flex gap-3 text-[#2A3A4A] font-semibold text-base justify-center mt-5">
            <Link href={getPageUrl(Math.max(currentpage - 1, 0))} className="rounded-md px-2 transition-colors hover:bg-[#F1F5F9]">이전</Link>
            {hasNext && <Link href={getPageUrl(currentpage + 1)} className="rounded-md px-2 transition-colors hover:bg-[#F1F5F9]">다음</Link>}
        </div>
    );
}