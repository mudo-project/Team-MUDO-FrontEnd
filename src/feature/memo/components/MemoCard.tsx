'use client'

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { changeMemoColorAction, deleteMemoAction, updateMemoAction } from "../actions";
import MemoCardMenu from "./MemoCardMenu";
import MemoColorPicker, { resolveMemoColor, type MemoColor } from "./MemoColorPicker";
import MemoEditForm from "./MemoEditForm";

type MemoCardProps = {
  memos: MemoData[];
  createForm: ReactNode;
  isLoading: boolean;
  onRefresh: () => void;
};

type MenuMode = "menu" | "color" | "delete";

function formatMemoDate(isoDate: string): string {
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}.${day}`;
}

export default function MemoCard({ memos, createForm, isLoading, onRefresh }: MemoCardProps) {
  const [openedMenuId, setOpenedMenuId] = useState<number | null>(null);
  const [menuMode, setMenuMode] = useState<MenuMode>("menu");
  const [selectedColor, setSelectedColor] = useState<MemoColor | null>(null);
  const [editedMemoId, setEditedMemoId] = useState<number | null>(null);

  const closeMenu = useCallback(() => {
    setOpenedMenuId(null);
    setMenuMode("menu");
    setSelectedColor(null);
  }, []);

  const handleColorChange = async (memo: MemoData, color: MemoColor) => {
    setSelectedColor(color);

    const result = await changeMemoColorAction(memo.id, color.code);

    if (result.success) {
      toast.success(result.message);
      closeMenu();
      onRefresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (memoId: number) => {
    const result = await deleteMemoAction(memoId);

    if (result.success) {
      toast.success(result.message);
      closeMenu();
      onRefresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleEditSave = async (memo: MemoData, title: string, content: string, color: MemoColor) => {
    const updateResult = await updateMemoAction(memo.id, title, content);

    if (!updateResult.success) {
      toast.error(updateResult.message);
      return;
    }

    if (color.code !== memo.color) {
      const colorResult = await changeMemoColorAction(memo.id, color.code);

      if (!colorResult.success) {
        toast.error(colorResult.message);
      }
    }

    toast.success(updateResult.message);
    setEditedMemoId(null);
    onRefresh();
  };

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

  const openMenu = (memo: MemoData) => {
    if (openedMenuId === memo.id) {
      closeMenu();
      return;
    }

    setOpenedMenuId(memo.id);
    setMenuMode("menu");
    setSelectedColor(resolveMemoColor(memo.color));
  };

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 content-start items-start gap-2 overflow-y-auto p-3 sm:grid-cols-2">
      {createForm && <div className="col-span-full">{createForm}</div>}
      {isLoading && memos.length === 0 && (
        <p className="col-span-full py-8 text-center text-[11px] text-[#94A3B8]">불러오는 중...</p>
      )}
      {!isLoading && memos.length === 0 && !createForm && (
        <p className="col-span-full py-8 text-center text-[11px] text-[#94A3B8]">메모가 없습니다. 새 메모를 추가해보세요.</p>
      )}
      {memos.map((memo) => {
        if (editedMemoId === memo.id) {
          return (
            <MemoEditForm
              key={memo.id}
              memo={memo}
              onCancel={() => setEditedMemoId(null)}
              onSave={(title, content, color) => handleEditSave(memo, title, content, color)}
            />
          );
        }

        const paletteColor = resolveMemoColor(memo.color);

        return (
          <article
            className="relative min-h-[130px] rounded-md px-3 pb-3 pt-2.5"
            key={memo.id}
            style={{ backgroundColor: paletteColor.background, borderTop: `2px solid ${paletteColor.accent}` }}
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
                <MemoColorPicker selectedColor={selectedColor} onChange={(color) => handleColorChange(memo, color)} />
              </div>
            )}
            {openedMenuId === memo.id && menuMode === "delete" && (
              <div data-memo-menu className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-md bg-white/90 px-3 text-center">
                <p className="text-[11px] font-semibold text-[#425466]">삭제할까요?</p>
                <div className="mt-3 flex items-center gap-2">
                  <button className="h-8 rounded-md border border-[#E0E6E1] bg-white px-3 text-[11px] text-[#53606E]" type="button" onClick={closeMenu}>
                    취소
                  </button>
                  <button className="h-8 rounded-md bg-[#C65A50] px-3 text-[11px] font-medium text-white" type="button" onClick={() => handleDelete(memo.id)}>
                    삭제
                  </button>
                </div>
              </div>
            )}
            <h2 className="pr-5 text-[12px] font-bold leading-5 tracking-[-0.02em]">{memo.title}</h2>
            <div className="mt-1.5 space-y-0.5 text-[10px] leading-4 text-[#425466]">
              {(memo.content ?? "").split("\n").filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}
            </div>
            <time className="absolute bottom-3 left-3 text-[9px] text-[#718096]">{formatMemoDate(memo.createdAt)}</time>
          </article>
        );
      })}
    </div>
  );
}
