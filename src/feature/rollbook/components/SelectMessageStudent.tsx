import { Check } from "lucide-react";

interface SelectMessageStudentProps {
    checked: boolean;
    id: string;
    indeterminate?: boolean;
    onChange: (checked: boolean) => void;
}

export default function SelectMessageStudent({ checked, id, indeterminate = false, onChange }: SelectMessageStudentProps) {
    return (
        <span className={`relative flex size-[15px] shrink-0 items-center justify-center rounded-[2px] border has-checked:border-[#2A3A4A] has-checked:bg-[#2A3A4A] has-checked:text-white ${indeterminate ? "border-[#2A3A4A] bg-[#2A3A4A]" : "border-[#767676] bg-white"}`}>
            <input
                checked={checked}
                className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                id={id}
                onChange={(event) => onChange(event.target.checked)}
                ref={(element) => {
                    if (element) {
                        element.indeterminate = indeterminate;
                    }
                }}
                type="checkbox"
            />
            <Check aria-hidden="true" className="hidden size-[13px] peer-checked:block" strokeWidth={3} />
            <span className="hidden h-0.5 w-2 rounded-full bg-white peer-indeterminate:block" />
        </span>
    );
}
