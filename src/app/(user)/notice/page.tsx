import NoticeCreateForm from "@/feature/notice/components/NoticeCreateForm";
import NoticeList from "@/feature/notice/components/NoticeList";
import NoticeSearch from "@/feature/notice/components/NoticeSearch";
import { getNoticeListAction } from "@/feature/notice/actions";

interface NoticePageProps {
    searchParams: Promise<{
        keyword?: string;
    }>;
}

export default async function NoticePage({ searchParams }: NoticePageProps) {
    const { keyword } = await searchParams;

    let notices: NoticeListItemData[] = [];
    let loadError = false;
    try {
        const noticeList = await getNoticeListAction({ keyword });
        notices = noticeList.content;
    } catch {
        loadError = true;
    }

    return (
        <main className="mx-auto w-full max-w-[930px] px-5 py-6">

            <section aria-label="공지 목록" className="mt-4">
                <div className="mb-3 flex items-center justify-end gap-4">
                    <div className="flex items-center gap-2">
                        <NoticeSearch defaultValue={keyword} />
                        <NoticeCreateForm />
                    </div>
                </div>

                {loadError ? (
                    <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B] shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                        공지 목록을 불러오지 못했습니다.
                    </div>
                ) : (
                    <NoticeList keyword={keyword} notices={notices} />
                )}
            </section>
        </main>
    );
}
