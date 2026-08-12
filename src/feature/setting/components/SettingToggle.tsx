type SettingToggleProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    ariaLabel: string;
};

export default function SettingToggle({ checked, onChange, ariaLabel }: SettingToggleProps) {
    return (
        <label className="relative inline-flex cursor-pointer items-center">
            <input
                aria-label={ariaLabel}
                checked={checked}
                className="peer sr-only"
                onChange={(event) => onChange(event.target.checked)}
                type="checkbox"
            />
            <span className="h-7 w-12 rounded-full bg-[#DCE9DF] transition peer-checked:bg-[#4D9560]" />
            <span className="absolute left-1 size-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
        </label>
    );
}
