'use client'

import { useEffect, useState, type ReactNode } from "react";
import { EllipsisVertical } from "lucide-react";
import MemoCardMenu from "./MemoCardMenu";

type Memo = {
  id: number;
  title: string;
  content: string[];
  time: string;
  accent: string;
  background: string;
};

type MemoCardProps = {
  memos: Memo[];
  createForm: ReactNode;
};

export default function MemoCard({ memos, createForm }: MemoCardProps) {
  const [openedMenuId, setOpenedMenuId] = useState<number | null>(null);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Element
        && !event.target.closest("[data-memo-menu]")
        && !event.target.closest("[data-memo-menu-trigger]")
      ) {
        setOpenedMenuId(null);
      }
    };

    document.addEventListener("pointerdown", closeMenuOnOutsideClick);

    return () => document.removeEventListener("pointerdown", closeMenuOnOutsideClick);
  }, []);

  return (
    <div className="grid grid-cols-1 content-start gap-2 overflow-y-auto p-3 sm:grid-cols-2">
      {createForm}
      {memos.map((memo) => (
        <article
          className="relative min-h-[130px] rounded-md px-3 pb-3 pt-2.5"
          key={memo.id}
          style={{ backgroundColor: memo.background, borderTop: `2px solid ${memo.accent}` }}
        >
          <button
            aria-expanded={openedMenuId === memo.id}
            aria-label={`${memo.title} 더보기`}
            className="absolute right-2 top-2 text-[#53606E]"
            data-memo-menu-trigger
            type="button"
            onClick={() => setOpenedMenuId((currentId) => currentId === memo.id ? null : memo.id)}
          >
            <EllipsisVertical className="size-3.5" strokeWidth={1.8} />
          </button>
          {openedMenuId === memo.id && <MemoCardMenu />}
          <h2 className="pr-5 text-[12px] font-bold leading-5 tracking-[-0.02em]">{memo.title}</h2>
          <div className="mt-1.5 space-y-0.5 text-[10px] leading-4 text-[#425466]">
            {memo.content.map((line) => <p key={line}>{line}</p>)}
          </div>
          <time className="absolute bottom-3 left-3 text-[9px] text-[#718096]">{memo.time}</time>
        </article>
      ))}
    </div>
  );
}
