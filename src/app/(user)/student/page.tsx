import StudentList from "@/feature/student/components/StudentList";
import CreateStudentButton from "@/feature/student/components/CreateStudentButton";
import SearchBar from "@/components/ui/SearchBar";
import { getStudentListAction } from "@/feature/student/actions";
import PaginationPrev from "@/components/ui/PaginationPrev";

interface paramsProps {
    searchParams: Promise<{
        page: string;
        keyword: string;
    }>
}

export default async function Page({ searchParams }: paramsProps) {
    const { page = '0', keyword } = await searchParams;
    const parsedPage = Number(page);
    const currentPage = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;
    let response;
    try {
        response = await getStudentListAction(keyword, currentPage);
    } catch {
        return (
            <div>
                네트워크 오류가 발생하였습니다.
                잠시후 다시 시도해주세요
            </div>
        )
    }

    return (
        <main className="h-[calc(100dvh-52px)] overflow-hidden bg-[#FCFCFC] px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-7">
            <div className="flex w-full items-center gap-1.5 sm:gap-2 md:gap-2.5">
                <SearchBar page={true} />
                <p className="hidden sm:block pl-1 text-xs text-[#64748B]">총 {response.data?.content.length ?? 0}명</p>
                <CreateStudentButton />
            </div>

            <div className="w-full overflow-x-auto">
                {!response.success ? (
                    <p className="mt-4 text-sm text-red-500">{response.message}</p>
                ) : (
                    <StudentList students={response.data?.content ?? []} />
                )}
            </div>
            <PaginationPrev url="student" page={currentPage} hasNext={response.data?.hasNext} searchParams={{ keyword }} />
        </main>
    );
}
