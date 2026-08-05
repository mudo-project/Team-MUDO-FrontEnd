import {
    ChevronDown,
    Ellipsis,
    FileText,
    Folder,
    Grid2X2,
    LayoutTemplate,
    Search,
    Upload,
} from "lucide-react";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const categories = [
    { label: "전체", count: 12, active: true },
    { label: "결재 기본", count: 4 },
    { label: "출결 기본", count: 3 },
    { label: "강사 계약서", count: 3 },
    { label: "학부모 안내문", count: 2 },
];

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const templates = [
    { name: "강사 채용 동의서", category: "강사 계약서", type: "문서", editedAt: "2026.08.03 14:22", editor: "김지수", initials: "KJ" },
    { name: "월별 시간표 양식", category: "출결", type: "스프레드시트", editedAt: "2026.08.02 11:05", editor: "정다운", initials: "JD", grid: true },
    { name: "연간 신청서", category: "결재", type: "문서", editedAt: "2026.08.01 09:30", editor: "이민준", initials: "LM" },
    { name: "수업 계획서 템플릿", category: "결재", type: "문서", editedAt: "2026.07.30 16:40", editor: "박서연", initials: "PS" },
    { name: "학부모 동의서 양식", category: "학부모 안내문", type: "문서", editedAt: "2026.07.29 13:15", editor: "김지수", initials: "KJ" },
    { name: "출석부 (주간)", category: "출결", type: "스프레드시트", editedAt: "2026.07.28 10:00", editor: "정다운", initials: "JD", grid: true },
    { name: "강사 근태 집계표", category: "결재", type: "스프레드시트", editedAt: "2026.07.27 14:55", editor: "정다운", initials: "JD", grid: true, status: "변환 중" },
    { name: "교재 구매 품의서", category: "결재", type: "문서", editedAt: "2026.07.26 09:00", editor: "이민준", initials: "LM", status: "변환 실패" },
    { name: "학부모 상담 일지", category: "학부모 안내문", type: "문서", editedAt: "2026.07.25 15:20", editor: "박서연", initials: "PS" },
    { name: "재원 확인서", category: "결재", type: "문서", editedAt: "2026.07.24 11:30", editor: "김지수", initials: "KJ" },
    { name: "출결 통보서", category: "출결", type: "문서", editedAt: "2026.07.23 14:10", editor: "정다운", initials: "JD" },
    { name: "강사 계약서 표준안", category: "강사 계약서", type: "문서", editedAt: "2026.07.22 10:45", editor: "김지수", initials: "KJ" },
];

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const summaryItems = [
    { value: "12", label: "전체 서식", tone: "text-[#0F172A]" },
    { value: "10", label: "현재 사용 가능", tone: "text-[#47865B]" },
    { value: "1", label: "변환 중", tone: "text-[#A87931]" },
    { value: "1", label: "변환 실패", tone: "text-[#B75C56]" },
];

export default function TemplatePage() {
    return (
        <main className="h-[calc(100dvh-52px)] min-w-0 overflow-hidden text-[#1E293B]">
            <div className="flex h-full min-h-0 flex-col">
                <section className="shrink-0 border-b border-[#E5EEE7] px-5 py-3 sm:px-7">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-[17px] font-semibold text-[#162033]">템플릿</h1>
                            <span className="text-[11px] text-[#718096]">총 12개 템플릿</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <label 
                                className="
                                flex h-8 w-full min-w-44 items-center rounded-md border border-[#DCE8DE] bg-white px-3 sm:w-48"
                            >
                                <Search className="h-3.5 w-3.5 text-[#718096]" strokeWidth={1.8} />
                                <input 
                                    aria-label="파일명 검색" 
                                    className="
                                    min-w-0 flex-1 border-0 bg-transparent pl-2 text-[11px] outline-none placeholder:text-[#94A3B8]" 
                                    placeholder="파일명 검색" 
                                />
                            </label>

                            <button 
                                className="
                                inline-flex h-8 items-center rounded-md border border-[#DCE8DE] bg-white px-3 text-[11px] font-medium text-[#526170]" 
                                type="button"
                            >
                                <Upload className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.8} />
                                업로드
                            </button>
                            <button 
                                className="
                                inline-flex h-8 items-center rounded-md bg-[#111A2B] px-3 text-[11px] font-semibold text-white" 
                                type="button"
                            >
                                + 새 템플릿 
                                <ChevronDown className="ml-1.5 h-3.5 w-3.5" strokeWidth={1.8} />
                            </button>
                        </div>
                    </div>
                </section>

                <div className="shrink-0 bg-[#FCFCFC] px-5 py-3 sm:px-7">
                    <section 
                        className="
                        grid rounded-xl border border-[#DCE8DE] bg-white px-4 py-3 sm:grid-cols-4 sm:divide-x sm:divide-[#E3ECE5]"
                    >
                        {summaryItems.map((item) => (
                            <div className="py-1 sm:px-4 first:pl-0" key={item.label}>
                                <p className={`text-[17px] font-semibold ${item.tone}`}>{item.value}</p>
                                <p className="mt-1 text-[10px] text-[#718096]">{item.label}</p>
                            </div>
                        ))}
                    </section>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden border-t border-[#EDF2EE] lg:grid-cols-[225px_minmax(0,1fr)]">
                    <aside className="overflow-y-auto border-b border-[#E5EEE7] px-3 py-3 lg:border-r lg:border-b-0">
                        <nav 
                            className="flex gap-1 overflow-x-auto lg:flex-col" 
                            aria-label="템플릿 카테고리"
                        >
                            {categories.map((category) => (
                                <button 
                                    className=
                                    {`flex h-9 min-w-32 items-center rounded-md px-3 text-left text-[11px] 
                                    ${category.active 
                                        ? 
                                        "bg-[#EEF5F0] font-semibold text-[#2C7A46]" 
                                        :
                                        "text-[#526170] hover:bg-white"
                                        }
                                     `
                                    } 
                                    key={category.label} 
                                    type="button"
                                >
                                    {
                                    category.active 
                                    ? 
                                    <LayoutTemplate className="mr-2 h-4 w-4" strokeWidth={1.7} /> 
                                    :
                                    <Folder className="mr-2 h-4 w-4" strokeWidth={1.7} />
                                    }
                                    <span>{category.label}</span>
                                    <span className="ml-auto text-[10px] font-normal text-[#718096]">{category.count}</span>
                                </button>
                            ))}
                        </nav>
                        <button 
                            className="
                            mt-3 hidden h-8 w-full rounded-md border border-dashed border-[#DCE8DE] bg-white text-[11px] text-[#718096] lg:block" 
                            type="button"
                        >
                            + 카테고리 추가
                        </button>
                    </aside>

                    <section className="flex min-h-0 min-w-0 flex-col p-3 sm:p-5">
                        <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-[#DCE8DE] bg-white">
                            <table className="min-w-[760px] w-full text-left text-[11px]">
                                <thead className="border-b border-[#E6EEE8] text-[10px] text-[#718096]">
                                    <tr>
                                        <th className="w-16 px-4 py-3 font-medium">종류</th>
                                        <th className="px-3 py-3 font-medium">파일명</th>
                                        <th className="w-32 px-3 py-3 font-medium">종류</th>
                                        <th className="w-40 px-3 py-3 font-medium">최종 수정일</th>
                                        <th className="w-32 px-3 py-3 font-medium">수정자</th>
                                        <th className="w-20 px-3 py-3 font-medium">액션</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {templates.map((template) => {
                                        const TypeIcon = template.grid ? Grid2X2 : FileText;

                                        return (
                                            <tr 
                                                className="border-b border-[#EDF2EE] last:border-b-0" 
                                                key={template.name}
                                            >
                                                <td className="px-4 py-3.5 text-[#718096]">
                                                    <TypeIcon className="h-4 w-4" strokeWidth={1.6} />
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                        <span className="font-medium text-[#253246]">{template.name}</span>
                                                        <span className="rounded bg-[#F0F3F7] px-1.5 py-0.5 text-[9px] text-[#718096]">{template.category}</span>
                                                        {template.status && 
                                                            <span 
                                                                className=
                                                                {
                                                                `rounded px-1.5 py-0.5 text-[9px] 
                                                                ${template.status === "변환 실패" 
                                                                ?
                                                                "bg-[#FFF1EF] text-[#B75C56]"
                                                                :
                                                                "bg-[#EDF7F0] text-[#47865B]"
                                                                    }
                                                                `}
                                                            >
                                                                {template.status}
                                                            </span>
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3.5 text-[#718096]">{template.type}</td>
                                                <td className="px-3 py-3.5 text-[#334155]">{template.editedAt}</td>
                                                <td className="px-3 py-3.5">
                                                    <span className="flex items-center gap-2 text-[#334155]">
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111A2B] text-[7px] font-semibold text-white">
                                                            {template.initials}
                                                        </span>
                                                        {template.editor}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <button 
                                                        className="inline-flex items-center text-[11px] font-medium text-[#334155]" 
                                                        type="button" 
                                                        aria-label={`${template.name} 메뉴`}
                                                    >
                                                        열기 
                                                        <Ellipsis className="ml-1.5 h-4 w-4" strokeWidth={1.8} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
