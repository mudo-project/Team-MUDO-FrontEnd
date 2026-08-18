import MessageTemplateCreateButton from "@/feature/message/components/MessageTemplateCreateButton";
import MessageTemplateItem from "@/feature/message/components/MessageTemplateItem";
import { getMessageTemplateListAction } from "@/feature/message/actions";

export default async function MessagePage() {
    const response = await getMessageTemplateListAction();
    const templates = response.data ?? [];

    return (
        <main className="h-[calc(100dvh-52px)] overflow-y-auto bg-[#FCFCFC] px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-7">
            <div className="flex items-center gap-2 sm:gap-2 md:gap-2.5">

                <MessageTemplateCreateButton />
            </div>

            <section className="mt-4 sm:mt-5 md:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
                {!response.success && (
                    <p className="col-span-3 py-6 sm:py-8 md:py-10 text-center text-[12px] sm:text-[12px] md:text-[13px] text-[#DC2626]" role="alert">
                        {response.message}
                    </p>
                )}
                {response.success && templates.length === 0 && (
                    <p className="col-span-3 py-6 sm:py-8 md:py-10 text-center text-[12px] sm:text-[12px] md:text-[13px] text-[#94A3B8]">
                        등록된 메시지 템플릿이 없습니다.
                    </p>
                )}
                {response.success && templates.map((template) => (
                    <MessageTemplateItem
                        key={template.id}
                        template={template}
                    />
                ))}
            </section>
        </main>
    );
}
