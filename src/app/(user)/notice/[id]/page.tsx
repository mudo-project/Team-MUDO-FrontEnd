import NoticeDetail from "@/feature/notice/components/NoticeDetail";

interface paramsProps {
    params: Promise<{
        id: string;
    }>
}

export default async function NoticeDetailPage({ params }: paramsProps) {
    const { id } = await params;

    return (
        <main className="mx-auto w-full max-w-[930px] px-5 py-6">
            <NoticeDetail id={id} />
        </main>
    );
}
