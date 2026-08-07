import NoticeCreateForm from "@/feature/notice/components/NoticeCreateForm";
import NoticeList from "@/feature/notice/components/NoticeList";
import NoticeSearch from "@/feature/notice/components/NoticeSearch";

export default function NoticePage() {
    return (
        <main className="mx-auto w-full max-w-[930px] px-5 py-6">

            <section aria-label="공지 목록" className="mt-4">
                <div className="mb-3 flex items-center justify-end gap-4">
                    <div className="flex items-center gap-2">
                        <NoticeSearch />
                        <NoticeCreateForm />
                    </div>
                </div>

                <NoticeList />
            </section>
        </main>
    );
}
