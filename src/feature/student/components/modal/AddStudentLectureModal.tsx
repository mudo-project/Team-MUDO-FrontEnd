"use client";

import {
    getLectureClassroomsAction,
    getLectureListAction,
    getLectureSubjectsAction,
    getLectureTeachersAction,
    getLectureTermsAction,
} from "@/feature/lecture/actions";
import { LectureListItemData, LectureTermData } from "@/feature/lecture/type";
import { createStudentEnrollmentAction } from "../../actions";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import AddStudentLectureFilter, { AddStudentLectureFilters } from "../AddStudentLectureFilter";
import StudentLectureItem from "../StudentLectureItem";

interface AddStudentLectureModalProps {
    closeModal: () => void;
    enrolledLectureIds: number[];
    refreshStudent: () => Promise<void>;
    studentId: number;
    studentName: string;
}

const initialState = {
    success: false,
    message: "",
    data: undefined,
};

export default function AddStudentLectureModal({ closeModal, enrolledLectureIds, refreshStudent, studentId, studentName }: AddStudentLectureModalProps) {
    const actionWithStudentId = createStudentEnrollmentAction.bind(null, studentId);
    const [state, formAction, isPending] = useActionState(actionWithStudentId, initialState);
    const [classrooms, setClassrooms] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState<AddStudentLectureFilters>({});
    const [isLoading, setIsLoading] = useState(true);
    const [lectures, setLectures] = useState<LectureListItemData[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [teachers, setTeachers] = useState<string[]>([]);
    const [terms, setTerms] = useState<LectureTermData[]>([]);

    useEffect(() => {
        let isActive = true;

        const loadFilterOptions = async () => {
            const [teachersResponse, subjectsResponse, classroomsResponse, termsResponse] = await Promise.all([
                getLectureTeachersAction(),
                getLectureSubjectsAction(),
                getLectureClassroomsAction(),
                getLectureTermsAction(),
            ]);

            if (!isActive) return;

            setTeachers(teachersResponse.success ? teachersResponse.data ?? [] : []);
            setSubjects(subjectsResponse.success ? subjectsResponse.data ?? [] : []);
            setClassrooms(classroomsResponse.success ? classroomsResponse.data ?? [] : []);
            setTerms(termsResponse.success ? termsResponse.data ?? [] : []);
        };

        void loadFilterOptions();

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        let isActive = true;

        const loadLectures = async () => {
            setIsLoading(true);
            setError("");

            const response = await getLectureListAction({ ...filters, page: 0, size: 100 });
            if (!isActive) return;

            if (response.success) {
                setLectures(response.data?.content ?? []);
            } else {
                setLectures([]);
                setError(response.message);
            }

            setIsLoading(false);
        };

        void loadLectures();

        return () => {
            isActive = false;
        };
    }, [filters]);

    const changeFilters = (nextFilters: AddStudentLectureFilters) => {
        setFilters(nextFilters);
    };

    useEffect(() => {
        if (!state.success) return;

        toast.success(state.message);
        closeModal();
        refreshStudent();
    }, [state, closeModal, refreshStudent]);

    return (
        <div className="fixed top-0 left-0 z-1001 flex h-screen w-screen items-center justify-center bg-black/35 p-5" onClick={closeModal}>
            <form action={formAction}
                className="fixed top-1/2 left-1/2 z-1000 flex max-h-[450px] md:max-h-[550px] w-[90%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_40px_rgba(22,34,54,0.18)] md:w-3/5 lg:w-[560px]"
                onClick={(event) => event.stopPropagation()}>
                <header className="shrink-0 px-7 pt-7 pb-3">
                    <h2 className="text-[16px] leading-6 font-bold text-[#1D2B3A]">
                        수강 등록
                    </h2>
                    <p className="pt-1.5 text-[12px] leading-[18px] text-[#64748B]">
                        {studentName} 원생의 강의를 선택하세요
                    </p>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5">
                    <div>
                        <AddStudentLectureFilter
                            classrooms={classrooms}
                            filters={filters}
                            onChange={changeFilters}
                            subjects={subjects}
                            teachers={teachers}
                            terms={terms}
                        />
                    </div>

                    <div className="mt-3 w-full pr-1">
                        {isLoading && <p className="py-12 text-center text-[12px] text-[#94A3B8]">강의 목록을 불러오는 중입니다.</p>}
                        {!isLoading && error && (
                            <div className="rounded-[8px] bg-[#FFF0F3] px-3 py-3 text-[12px] leading-6 text-[#D45D76]">
                                {error}
                            </div>
                        )}
                        {!isLoading && !error && lectures.length === 0 && (
                            <p className="py-12 text-center text-[12px] text-[#94A3B8]">조회된 강의가 없습니다.</p>
                        )}
                        {!isLoading && !error && lectures.map((lecture) => (
                            <StudentLectureItem
                                enrolledLectureIds={enrolledLectureIds}
                                key={lecture.id}
                                lecture={lecture}
                            />
                        ))}
                    </div>

                    {!state.success && state.message && (
                        <div className="mt-4 rounded-[8px] bg-[#FFF0F3] px-3 py-3 text-[12px] leading-6 text-[#D45D76]">
                            {state.message}
                        </div>
                    )}
                </div>

                <footer className="flex shrink-0 justify-end gap-2 px-7 pb-6 pt-2">
                    <button
                        className="h-[40px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-[18px] text-[13px] leading-[19.5px] text-[#64748B]"
                        onClick={closeModal}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-[40px] w-full rounded-[8px] bg-[#2A3A4A] px-5 text-[13px] leading-[19.5px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#DCE8E2]"
                        disabled={isPending}
                        type="submit"
                    >
                        {isPending ? "등록 중..." : "등록"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
