import { Check } from "lucide-react";

export type MemoColor = {
  code: MemoColorCode;
  accent: string;
  background: string;
};

export const MEMO_COLORS: MemoColor[] = [
  { code: "ROSE", accent: "#B9827F", background: "#FBEDEC" },
  { code: "MUSTARD", accent: "#C5A45B", background: "#FBF4DD" },
  { code: "SAGE", accent: "#779F8A", background: "#EAF5ED" },
  { code: "BLUE", accent: "#7894C2", background: "#EAF0FC" },
  { code: "LAVENDER", accent: "#947DB7", background: "#F1ECF8" },
  { code: "PINK", accent: "#C885A0", background: "#FBEAF1" },
  { code: "SLATE", accent: "#8EA4A7", background: "#EDF4F4" },
  { code: "PEACH", accent: "#D29372", background: "#FDF0E9" },
  { code: "TEAL", accent: "#78AEB1", background: "#E8F7F6" },
  { code: "OLIVE", accent: "#A39A68", background: "#F5F3E4" },
  { code: "CLAY", accent: "#A57B72", background: "#F6ECEA" },
  { code: "INDIGO", accent: "#8C91B8", background: "#EEEFFC" },
];

type MemoColorPickerProps = {
  selectedColor: MemoColor;
  onChange: (color: MemoColor) => void;
};

export default function MemoColorPicker({ selectedColor, onChange }: MemoColorPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5" aria-label="메모 색상 선택">
      {MEMO_COLORS.map((color) => {
        const isSelected = color.code === selectedColor.code;

        return (
          <button
            aria-label={`메모 색상 ${color.code}`}
            aria-pressed={isSelected}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-white"
            key={color.code}
            style={{ backgroundColor: color.accent }}
            type="button"
            onClick={() => onChange(color)}
          >
            {isSelected && <Check className="size-4 text-white" strokeWidth={2.3} />}
          </button>
        );
      })}
    </div>
  );
}
