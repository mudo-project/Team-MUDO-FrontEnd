'use client'

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { EllipsisVertical } from "lucide-react";
import MemoCardMenu from "./MemoCardMenu";
import MemoColorPicker, { MEMO_COLORS, type MemoColor } from "./MemoColorPicker";
import MemoEditForm from "./MemoEditForm";

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

type MenuMode = "menu" | "color" | "delete";

export default function MemoCard({ memos, createForm }: MemoCardProps) {
  const [openedMenuId, setOpenedMenuId] = useState<number | null>(null);
  const [menuMode, setMenuMode] = useState<MenuMode>("menu");
  const [selectedColor, setSelectedColor] = useState<MemoColor | null>(null);
  const [editedMemoId, setEditedMemoId] = useState<number | null>(null);

  const closeMenu = useCallback(() => {
    setOpenedMenuId(null);
    setMenuMode("menu");
    setSelectedColor(null);
  }, []);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Element
        && !event.target.closest("[data-memo-menu]")
        && !event.target.closest("[data-memo-menu-trigger]")
      ) {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", closeMenuOnOutsideClick);

    return () => document.removeEventListener("pointerdown", closeMenuOnOutsideClick);
  }, [closeMenu]);

  const openMenu = (memo: Memo) => {
    if (openedMenuId === memo.id) {
      closeMenu();
      return;
    }

    setOpenedMenuId(memo.id);
    setMenuMode("menu");
    setSelectedColor(
      MEMO_COLORS.find((color) => color.background === memo.background) ?? MEMO_COLORS[0],
    );
  };

  return (
    <div className="grid grid-cols-1 content-start gap-2 overflow-y-auto p-3 sm:grid-cols-2">
      {createForm}
      {memos.map((memo) => {
        if (editedMemoId === memo.id) {
          return (
            <MemoEditForm
              key={memo.id}
              memo={memo}
              onCancel={() => setEditedMemoId(null)}
              onSave={() => setEditedMemoId(null)}
            />
          );
        }

        return (
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
              onClick={() => openMenu(memo)}
            >
              <EllipsisVertical className="size-3.5" strokeWidth={1.8} />
            </button>
            {openedMenuId === memo.id && menuMode === "menu" && (
              <MemoCardMenu
                onEdit={() => {
                  closeMenu();
                  setEditedMemoId(memo.id);
                }}
                onChangeColor={() => setMenuMode("color")}
                onDelete={() => setMenuMode("delete")}
              />
            )}
            {openedMenuId === memo.id && menuMode === "color" && selectedColor && (
              <div data-memo-menu className="absolute right-2 top-7 z-10 rounded-xl border border-[#E6EBE7] bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
                <MemoColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
              </div>
            )}
            {openedMenuId === memo.id && menuMode === "delete" && (
              <div data-memo-menu className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-md bg-white/90 px-3 text-center">
                <p className="text-[11px] font-semibold text-[#425466]">삭제할까요?</p>
                <div className="mt-3 flex items-center gap-2">
                  <button className="h-8 rounded-md border border-[#E0E6E1] bg-white px-3 text-[11px] text-[#53606E]" type="button" onClick={closeMenu}>
                    취소
                  </button>
                  <button className="h-8 rounded-md bg-[#C65A50] px-3 text-[11px] font-medium text-white" type="button" onClick={closeMenu}>
                    삭제
                  </button>
                </div>
              </div>
            )}
            <h2 className="pr-5 text-[12px] font-bold leading-5 tracking-[-0.02em]">{memo.title}</h2>
            <div className="mt-1.5 space-y-0.5 text-[10px] leading-4 text-[#425466]">
              {memo.content.map((line) => <p key={line}>{line}</p>)}
            </div>
            <time className="absolute bottom-3 left-3 text-[9px] text-[#718096]">{memo.time}</time>
          </article>
        );
      })}
    </div>
  );
}
