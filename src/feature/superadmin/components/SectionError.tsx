export default function SectionError({ message }: { message: string }) {
    return (
        <div className="rounded-[8px] bg-[#FFF0F3] px-3 py-3 text-[12px] leading-6 text-[#D45D76]">
            {message}
        </div>
    );
}
