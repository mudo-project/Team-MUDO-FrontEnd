import LectureFilter from "@/feature/lecture/components/LectureFilter";
import {
    getLectureClassroomsAction,
    getLectureListAction,
    getLectureSubjectsAction,
    getLectureTeachersAction,
    getLectureTermsAction,
} from "@/feature/lecture/actions";
import { LectureListQuery } from "@/feature/lecture/type";
import RollLectureList from "@/feature/rollbook/components/RollLectureList";

type LecturePageSearchParams = Record<string, string | string[] | undefined>;

const getParam = (params: LecturePageSearchParams, name: string) => {
    const value = params[name];
    return Array.isArray(value) ? value[0] : value;
};

export default async function LecturePage({ searchParams }: { searchParams: Promise<LecturePageSearchParams> }) {
    const params = await searchParams;
    const [teachersResponse, subjectsResponse, classroomsResponse, termsResponse] = await Promise.all([
        getLectureTeachersAction(),
        getLectureSubjectsAction(),
        getLectureClassroomsAction(),
        getLectureTermsAction(),
    ]);

    const query: LectureListQuery = {
        grade: getParam(params, "grade") as LectureListQuery["grade"],
        dayOfWeek: getParam(params, "dayOfWeek") as LectureListQuery["dayOfWeek"],
        subjectName: getParam(params, "subjectName"),
        teacherName: getParam(params, "teacherName"),
        classroomCode: getParam(params, "classroomCode"),
        termId: getParam(params, "termId") ? Number(getParam(params, "termId")) : undefined,
        page: getParam(params, "page") ? Number(getParam(params, "page")) : 0,
        size: 30,
    };
    const lectureResponse = await getLectureListAction(query);
    const lectures = lectureResponse.success ? lectureResponse.data?.content ?? [] : [];
    const classrooms = classroomsResponse.success ? classroomsResponse.data ?? [] : [];
    const subjects = subjectsResponse.success ? subjectsResponse.data ?? [] : [];
    const teachers = teachersResponse.success ? teachersResponse.data ?? [] : [];
    const terms = termsResponse.success ? termsResponse.data ?? [] : [];

    return (
        <main className="h-[calc(100dvh-52px)] overflow-y-auto bg-[#FCFCFC] px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-7">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 sm:flex-row flex-col ">
                <LectureFilter
                    classrooms={classrooms}
                    subjects={subjects}
                    teachers={teachers}
                    terms={terms}
                />
                <p className="ml-auto pl-1 text-[12px] leading-[18px] text-[#94A3B8] md:block hidden">총 {lectures.length}개</p>
            </div>

            <div className="w-full overflow-x-auto">
                {!lectureResponse.success && <p className="mt-4 text-[13px] text-[#C0483F]">{lectureResponse.message}</p>}
                <RollLectureList lectures={lectures} />
            </div>
        </main>
    );
}
