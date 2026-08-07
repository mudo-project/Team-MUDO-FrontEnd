export default function Avatar({ initials }: { initials: string }) {
    return (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E2ECE4] text-[8px] font-semibold text-[#285D3B]">
            {initials}
        </span>
    );
}
