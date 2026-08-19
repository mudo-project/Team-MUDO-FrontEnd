import Link from "next/link";

interface PaginationProps {
    url: string;
    page?: string | number;
    hasNext?: boolean | undefined;
    sort?: string;
    type?: string;
    keyword?: string;
    searchParams?: Record<string, string | string[] | undefined>;
}

export default function PaginationPrev({ url, page, hasNext, sort, type, keyword, searchParams }: PaginationProps) {
    const parsedPage = Number(page);
    const currentPage = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;
    const getPageUrl = (nextPage: number) => {
        const params = new URLSearchParams();

        Object.entries(searchParams ?? {}).forEach(([key, value]) => {
            if (key === "page" || value === undefined) return;

            if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
            else params.set(key, value);
        });

        params.set("page", String(nextPage));

        if (sort) params.set("sort", sort);
        if (type) params.set("type", type);
        if (keyword) params.set("keyword", keyword);

        return `/${url}?${params.toString()}`;
    }

    return (
        <div className="flex gap-3 text-[#2A3A4A] font-semibold text-base justify-center mt-5">
            <Link href={getPageUrl(Math.max(currentPage - 1, 0))} className="rounded-md px-2 transition-colors hover:bg-[#F1F5F9]">이전</Link>
            {hasNext && <Link href={getPageUrl(currentPage + 1)} className="rounded-md px-2 transition-colors hover:bg-[#F1F5F9]">다음</Link>}
        </div>
    );
}
