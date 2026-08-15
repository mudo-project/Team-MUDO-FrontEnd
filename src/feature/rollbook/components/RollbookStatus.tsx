interface RollbookStatusProps {
    color: string;
    count: number;
    hasRightBorder: boolean;
    label: string;
}

export default function RollbookStatus({ color, count, hasRightBorder, label }: RollbookStatusProps) {
    return (
        <div className={`${hasRightBorder ? "border-r" : ""} border-[#DCE8E2] py-3 text-center`}>
            <strong className={`block text-[18px] leading-[27px] font-bold ${color}`}>
                {count}
            </strong>
            <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#94A3B8]">{label}</span>
        </div>
    );
}
