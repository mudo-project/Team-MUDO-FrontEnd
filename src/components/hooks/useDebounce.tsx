'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react"


function useDebounce(searchInput: string, page?: boolean) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const debounceTimer = setTimeout(() => {
            const params = new URLSearchParams(searchParams);

            if (!searchInput.trim()) {
                params.delete('keyword');
            } else {
                params.set('keyword', searchInput);
            }
            if (page) {
                params.set('page', '0');
            }

            //검색어 변경은 주소에는 반영되지만, 뒤로가기 기록에는 계속 쌓이지 않습니다.
            //push는 뒤로가기에 쌓임
            router.replace(`?${params.toString()}`);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchInput]);
}

export default useDebounce