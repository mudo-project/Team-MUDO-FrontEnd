import { Check, Pipette } from "lucide-react";

export type MemoColor = {
  code: MemoColorCode;
  accent: string;
  background: string;
};

export const MEMO_COLORS: MemoColor[] = [
  { code: "B9827F", accent: "#B9827F", background: "#FBEDEC" },
  { code: "C5A45B", accent: "#C5A45B", background: "#FBF4DD" },
  { code: "779F8A", accent: "#779F8A", background: "#EAF5ED" },
  { code: "7894C2", accent: "#7894C2", background: "#EAF0FC" },
  { code: "947DB7", accent: "#947DB7", background: "#F1ECF8" },
  { code: "C885A0", accent: "#C885A0", background: "#FBEAF1" },
  { code: "8EA4A7", accent: "#8EA4A7", background: "#EDF4F4" },
  { code: "D29372", accent: "#D29372", background: "#FDF0E9" },
  { code: "78AEB1", accent: "#78AEB1", background: "#E8F7F6" },
  { code: "A39A68", accent: "#A39A68", background: "#F5F3E4" },
  { code: "A57B72", accent: "#A57B72", background: "#F6ECEA" },
  { code: "8C91B8", accent: "#8C91B8", background: "#EEEFFC" },
];

// 임의의 6자리 16진수 색상에서 카드 배경용 파스텔 톤을 계산한다.
function toPastelBackground(hex: string): string {
  const [r, g, b] = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((part) => parseInt(part, 16));
  const toHex = (channel: number) => Math.round(channel + (255 - channel) * 0.85).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// 프리셋 팔레트에 없는 색상 코드(직접 선택한 색상)도 accent/background를 계산해 MemoColor로 만든다.
export function resolveMemoColor(code: MemoColorCode): MemoColor {
  const preset = MEMO_COLORS.find((color) => color.code === code);

  if (preset) return preset;

  const accent = `#${code}`;

  return { code, accent, background: toPastelBackground(code) };
}

type MemoColorPickerProps = {
  selectedColor: MemoColor;
  onChange: (color: MemoColor) => void;
};

export default function MemoColorPicker({ selectedColor, onChange }: MemoColorPickerProps) {
  const isCustomSelected = !MEMO_COLORS.some((color) => color.code === selectedColor.code);

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
      <label
        aria-label="직접 색상 선택"
        aria-pressed={isCustomSelected}
        className="relative inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[conic-gradient(from_0deg,#F87171,#FACC15,#4ADE80,#38BDF8,#818CF8,#F472B6,#F87171)]"
      >
        <input
          aria-hidden
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          tabIndex={-1}
          type="color"
          value={isCustomSelected ? selectedColor.accent : "#000000"}
          onChange={(event) => {
            const code = event.target.value.slice(1).toUpperCase();
            onChange(resolveMemoColor(code));
          }}
        />
        {isCustomSelected ? (
          <span className="pointer-events-none size-full rounded-full" style={{ backgroundColor: selectedColor.accent }}>
            <Check className="m-auto size-4 translate-y-1 text-white" strokeWidth={2.3} />
          </span>
        ) : (
          <Pipette className="pointer-events-none size-3.5 text-white drop-shadow" strokeWidth={2} />
        )}
      </label>
    </div>
  );
}
