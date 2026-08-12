'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { memoCreateSchema, type MemoCreateFormValues } from "@/lib/memoCreateSchema";
import MemoColorPicker, { MEMO_COLORS, type MemoColor } from "./MemoColorPicker";

type MemoCreateFormProps = {
  onCancel: () => void;
  onSave: (title: string, content: string, color: MemoColor) => void;
};

export default function MemoCreateForm({ onCancel, onSave }: MemoCreateFormProps) {
  const [selectedColor, setSelectedColor] = useState<MemoColor>(
    () => MEMO_COLORS[Math.floor(Math.random() * MEMO_COLORS.length)],
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemoCreateFormValues>({
    resolver: zodResolver(memoCreateSchema),
    defaultValues: { title: "", content: "" },
  });

  const closeAndReset = () => {
    reset();
    onCancel();
  };

  const onSubmit = ({ title, content }: MemoCreateFormValues) => {
    onSave(title, content, selectedColor);
  };

  return (
    <form
      className="flex min-w-0 min-h-[190px] flex-col rounded-md border-t-2 px-3 pb-3 pt-2.5"
      style={{ backgroundColor: selectedColor.background, borderTopColor: selectedColor.accent }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <label className="sr-only" htmlFor="memo-title">메모 제목</label>
      <input
        className="h-8 w-full rounded-md border border-[#D6DEDA] bg-white/80 px-2 text-[12px] font-semibold outline-none placeholder:text-[#94A3B8] focus:border-[#718096]"
        id="memo-title"
        placeholder="제목을 입력하세요"
        {...register("title")}
      />
      {errors.title && <p className="mt-1 text-[10px] text-[#C65A50]">{errors.title.message}</p>}
      <label className="sr-only" htmlFor="memo-content">메모 내용</label>
      <textarea
        className="mt-2 min-h-20 w-full flex-1 resize-none rounded-md border border-[#D6DEDA] bg-white/80 p-2 text-[11px] leading-4 outline-none placeholder:text-[#94A3B8] focus:border-[#718096]"
        id="memo-content"
        placeholder="내용을 입력하세요"
        {...register("content")}
      />
      {errors.content && <p className="mt-1 text-[10px] text-[#C65A50]">{errors.content.message}</p>}
      <div className="mt-2 flex flex-col gap-2">
        <MemoColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
        <div className="flex shrink-0 items-center justify-end gap-1.5 whitespace-nowrap">
          <button className="h-7 px-2 text-[11px] text-[#718096]" type="button" onClick={closeAndReset}>
            취소
          </button>
          <button className="h-7 rounded-md bg-[#172033] px-2.5 text-[11px] font-medium text-white" type="submit">
            저장
          </button>
        </div>
      </div>
    </form>
  );
}
