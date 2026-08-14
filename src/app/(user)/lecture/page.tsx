import CreateLectureButton from "@/feature/lecture/components/CreateLectureButton";
import LectureFilter from "@/feature/lecture/components/LectureFilter";
import LectureList from "@/feature/lecture/components/LectureList";
import {
    getLectureClassroomsAction,
    getLectureListAction,
    getLectureSubjectsAction,
    getLectureTeachersAction,
    getLectureTermsAction,
} from "@/feature/lecture/actions";
import { LectureListQuery } from "@/feature/lecture/type";

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
        <main className="h-[calc(100dvh-52px)] overflow-y-auto bg-[#FCFCFC] px-8 py-7">
            <div className="flex min-w-[920px] items-center gap-2">
                <LectureFilter
                    classrooms={classrooms}
                    subjects={subjects}
                    teachers={teachers}
                    terms={terms}
                />
                <p className="pl-1 text-[12px] leading-[18px] text-[#94A3B8]">총 {lectures.length}개</p>
                <CreateLectureButton classrooms={classrooms} subjects={subjects} teachers={teachers} terms={terms} />
            </div>

            <div className="w-full overflow-x-auto">
                {!lectureResponse.success && <p className="mt-4 text-[13px] text-[#C0483F]">{lectureResponse.message}</p>}
                <LectureList lectures={lectures} />
            </div>
        </main>
    );
}
