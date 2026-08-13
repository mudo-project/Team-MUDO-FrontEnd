import { create } from "zustand";

export interface EditingTaskComment {
    workspaceId: number;
    taskId: number;
    commentId: number;
    content: string;
    mentionedUserIds?: number[];
    authorName: string;
    createdAt: string;
}

type TaskCommentEditStore = {
    editingComment?: EditingTaskComment;
    setEditingComment: (comment: EditingTaskComment) => void;
    setEditingContent: (content: string) => void;
    setEditingMentionedUserIds: (mentionedUserIds: number[]) => void;
    clearEditingComment: () => void;
};

export const useTaskCommentEditStore = create<TaskCommentEditStore>((set) => ({
    editingComment: undefined,
    setEditingComment: (editingComment) => set({ editingComment }),
    setEditingContent: (content) => set((state) => ({
        editingComment: state.editingComment
            ? { ...state.editingComment, content }
            : undefined,
    })),
    setEditingMentionedUserIds: (mentionedUserIds) => set((state) => ({
        editingComment: state.editingComment
            ? { ...state.editingComment, mentionedUserIds }
            : undefined,
    })),
    clearEditingComment: () => set({ editingComment: undefined }),
}));
