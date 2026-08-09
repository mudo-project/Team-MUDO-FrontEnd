import { generateHalfHourOptions } from "@/feature/setting/utils";

const TIME_OPTIONS = generateHalfHourOptions();

type SettingTimeSelectProps = {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    className?: string;
};

export default function SettingTimeSelect({ value, onChange, id, className }: SettingTimeSelectProps) {
    return (
        <select
            className={
                className ??
                "h-11 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[13px] font-medium outline-none"
            }
            id={id}
            onChange={(event) => onChange(event.target.value)}
            value={value}
        >
            {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                    {time}
                </option>
            ))}
        </select>
    );
}
