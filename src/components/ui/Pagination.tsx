import Link from "next/link";

interface PaginationProps {
    url: string;
    page: string;
    totalPage: number;
    sort?: string;
    type?: string;
    keyword?: string;
}

export default function Pagination({ url, page, totalPage, sort, type, keyword }: PaginationProps) {
    const currentpage = Number(page);
    const currentPageGroup = Math.ceil((currentpage + 1) / 5);
    const getPageUrl = (nextPage: number) => {
        const params = new URLSearchParams({ page: String(nextPage) });

        if (sort) params.set("sort", sort);
        if (type) params.set("type", type);
        if (keyword) params.set("keyword", keyword);

        return `/${url}?${params.toString()}`;
    }

    const arr = [];
    for (let i = (currentPageGroup - 1) * 5 + 1; i <= Math.min(currentPageGroup * 5, Math.max(totalPage, 1)); i++) {
        arr.push(i);
    }

    return (
        <div className="flex gap-3 text-white font-semibold text-base justify-center mt-5">
            <Link href={getPageUrl(Math.max(currentpage - 1, 0))} className="rounded-md px-2 transition-colors hover:bg-[#1E293999] hover:text-white">이전</Link>
            {
                arr.map(i => <Link key={i} href={getPageUrl(i - 1)} className={currentpage + 1 === i ? 'rounded-md px-2 text-[#BFFF0B] transition-colors hover:bg-[#BFFF0B99] hover:text-black' : 'rounded-md px-2 transition-colors hover:bg-[#1E293999] hover:text-white'}>{i}</Link>)
            }
            <Link href={getPageUrl(Math.min(currentpage + 1, Math.max(totalPage, 1) - 1))} className="rounded-md px-2 transition-colors hover:bg-[#1E293999] hover:text-white">다음</Link>
        </div>
    );
}