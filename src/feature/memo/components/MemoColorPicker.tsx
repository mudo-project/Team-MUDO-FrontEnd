import { Check } from "lucide-react";

export type MemoColor = {
  accent: string;
  background: string;
};

export const MEMO_COLORS: MemoColor[] = [
  { accent: "#B9827F", background: "#FBEDEC" },
  { accent: "#C5A45B", background: "#FBF4DD" },
  { accent: "#779F8A", background: "#EAF5ED" },
  { accent: "#7894C2", background: "#EAF0FC" },
  { accent: "#947DB7", background: "#F1ECF8" },
  { accent: "#C885A0", background: "#FBEAF1" },
  { accent: "#8EA4A7", background: "#EDF4F4" },
  { accent: "#D29372", background: "#FDF0E9" },
  { accent: "#78AEB1", background: "#E8F7F6" },
  { accent: "#A39A68", background: "#F5F3E4" },
  { accent: "#A57B72", background: "#F6ECEA" },
  { accent: "#8C91B8", background: "#EEEFFC" },
];

type MemoColorPickerProps = {
  selectedColor: MemoColor;
  onChange: (color: MemoColor) => void;
};

export default function MemoColorPicker({ selectedColor, onChange }: MemoColorPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5" aria-label="메모 색상 선택">
      {MEMO_COLORS.map((color) => {
        const isSelected = color.background === selectedColor.background;

        return (
          <button
            aria-label={`메모 색상 ${color.background}`}
            aria-pressed={isSelected}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-white/70"
            key={color.background}
            style={{ backgroundColor: color.background }}
            type="button"
            onClick={() => onChange(color)}
          >
            {isSelected && <Check className="size-4 text-[#172033]" strokeWidth={2.3} />}
          </button>
        );
      })}
    </div>
  );
}
