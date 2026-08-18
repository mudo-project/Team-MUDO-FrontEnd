interface RollbookStatusProps {
    color: string;
    count: number;
    hasRightBorder: boolean;
    label: string;
}

export default function RollbookStatus({ color, count, hasRightBorder, label }: RollbookStatusProps) {
    return (
        <div className={`${hasRightBorder ? "border-r" : ""} border-[#DCE8E2] py-3 text-center`}>
            <strong className={`block text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] leading-[22.5px] sm:leading-[24px] md:leading-[25.5px] lg:leading-[27px] font-bold ${color}`}>
                {count}
            </strong>
            <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#94A3B8]">{label}</span>
        </div>
    );
}
