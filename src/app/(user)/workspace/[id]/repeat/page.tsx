import WorkAddModal from "@/feature/workspace/components/modals/WorkAddModal";

const repeatTasks = [
    {
        title: "주간 출결 현황 정리",
        cycle: "매주 월요일",
        lastCreated: "2025.01.13",
    },
    {
        title: "숙납 현황 확인",
        cycle: "매월 1일",
        lastCreated: "2025.01.01",
    },
];

export default function Page() {

    return (
        <main className="min-h-[calc(100vh-112px)] w-full bg-[#FCFDFE] px-5 py-5 text-[#202A3C]">
            <div className="text-[12px] leading-[18px] text-[#AEB6C3]">
                <p>
                    반복 주기와 업무 제목을 미리 등록해두면 주기 도래 시 자동으로 상태
                    <strong className="mx-1 font-semibold text-[#4F5868]">대기</strong>
                    로 업무가 생성됩니다.
                </p>
                <p className="text-[#C2C8D1]">아래 &apos;지금 생성&apos; 버튼으로 즉시 테스트할 수 있습니다.</p>
            </div>
            <WorkAddModal />
            <section className="mt-6 space-y-2">
                {repeatTasks.map((task) => (
                    <article
                        className="flex h-[76px] w-full items-center rounded-[10px] border border-[#DEE3E9] bg-white px-4"
                        key={task.title}
                    >
                        <button
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#F5F6F8] text-[21px] font-light text-[#A9B2BF]"
                            aria-label={`${task.title} 수정`}
                        >
                            ⟋
                        </button>

                        <div className="ml-4">
                            <h2 className="text-[14px] font-semibold tracking-[-0.02em]">{task.title}</h2>
                            <div className="mt-1 flex items-center text-[11px] text-[#B4BCC7]">
                                <span className="rounded-full bg-[#EDF5FF] px-2 py-0.5 text-[#76A9DF]">{task.cycle}</span>
                                <span className="ml-2">마지막 생성: {task.lastCreated}</span>
                            </div>
                        </div>

                        <button className="ml-auto h-8 rounded-[7px] border border-[#DCE1E7] bg-white px-4 text-[12px] font-semibold text-[#515B6A]">
                            지금 생성
                        </button>
                        <button
                            className="ml-5 px-1 text-[14px] font-light text-[#C5CBD4]"
                            aria-label={`${task.title} 삭제`}
                        >
                            ×
                        </button>
                    </article>
                ))}
            </section>
        </main>
    );
}
