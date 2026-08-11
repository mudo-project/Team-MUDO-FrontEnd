"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import AttendanceTodaySituation from "./AttendanceTodaySituation";
import AttendanceCalendar from "./AttendanceCalendar";
import AttendanceCommuteInformation from "./AttendanceCommuteInformation";
import AttendanceAnnualLeave from "./AttendanceAnnualLeave";
import AttendanceMyEditRequest from "./AttendanceMyEditRequest";
import AttendanceLateModal from "./AttendanceLateModal";
import AttendanceLeaveWorkModal from "./AttendanceLeaveWorkModal";
import AttendanceOvertimeWork from "./AttendanceOvertimeWork";
import AttendanceDetailModal from "./AttendanceDetailModal";
import AttendanceCreateEditRequestModal from "./AttendanceCreateEditRequestModal";
import AttendanceAllEmployees from "./AttendanceAllEmployees";
import AttendanceEditRequestManage from "./AttendanceEditRequestManage";
import AttendanceMyEditRequestList from "./AttendanceMyEditRequestList";
import {
  createEmptyAttendanceRecord,
  getStandardEnd,
  getStandardStart,
  INITIAL_MY_EDIT_REQUESTS,
  isSameDate,
  type AttendanceEditRequest,
  type EditRequestType,
} from "../attendanceDemo";

type ModalState = "late" | "leave" | "overtime" | "detail" | "editRequest" | null;
type TabKey = "mine" | "all" | "manage" | "myEdits";

const TABS: { key: TabKey; label: string }[] = [
  { key: "mine", label: "내 근태" },
  { key: "all", label: "전직원 현황" },
  { key: "manage", label: "수정 요청 관리" },
  { key: "myEdits", label: "내 근태수정" },
];

export default function AttendanceBoard() {
  // `now`는 클라이언트에서만 채워집니다. 서버 렌더링 시점의 Date와 하이드레이션 시점의
  // Date가 다르면 하이드레이션 불일치가 나기 때문에, 마운트 전에는 null로 두고 렌더를 건너뜁니다.
  const [nowState, setNow] = useState<Date | null>(null);
  const [record, setRecord] = useState(createEmptyAttendanceRecord);
  const [editRequests, setEditRequests] = useState<AttendanceEditRequest[]>(INITIAL_MY_EDIT_REQUESTS);
  const [modal, setModal] = useState<ModalState>(null);
  const [tab, setTab] = useState<TabKey>("mine");

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow((prev) => new Date((prev ?? new Date()).getTime() + 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (nowState === null) {
    return null;
  }

  // 이후 클로저(핸들러)에서도 non-null로 좁혀지도록 명시적으로 타입을 고정한 값을 사용합니다.
  const now: Date = nowState;
  const standardStart = getStandardStart(now);
  const standardEnd = getStandardEnd(now);
  const hasClockedIn = record.clockInAt !== null;
  const hasClockedOut = record.clockOutAt !== null;
  const canOvertime = hasClockedIn && !hasClockedOut && now.getTime() >= standardEnd.getTime() && !record.overtimeStartedAt;
  const hasEditRequestToday = editRequests.some((request) => isSameDate(request.targetDate, now));

  function handleClockInClick() {
    if (now.getTime() > standardStart.getTime()) {
      setModal("late");
      return;
    }

    setRecord((prev) => ({ ...prev, clockInAt: now, isLate: false }));
  }

  function handleLateConfirm(note: string) {
    setRecord((prev) => ({ ...prev, clockInAt: now, isLate: true, clockInNote: note }));
    setModal(null);
  }

  function handleLeaveConfirm(note: string) {
    setRecord((prev) => ({ ...prev, clockOutAt: now, clockOutNote: note }));
    setModal(null);
  }

  function handleOvertimeConfirm(reason: string) {
    setRecord((prev) => ({ ...prev, overtimeStartedAt: now, overtimeReason: reason }));
    setModal(null);
  }

  function handleEditRequestSubmit(type: EditRequestType, changeSummary: string, reason: string) {
    const request: AttendanceEditRequest = {
      id: `edit-${now.getTime()}`,
      targetDate: now,
      type,
      changeSummary,
      reason,
      requestedAt: now,
      status: "대기",
    };

    setEditRequests((prev) => [...prev, request]);
    setModal(null);
  }

  function handleDemoJump(hour: number, minute: number) {
    setNow((prev) => {
      const next = new Date(prev ?? new Date());
      next.setHours(hour, minute, 0, 0);
      return next;
    });
  }

  function handleDemoReset() {
    setRecord(createEmptyAttendanceRecord());
    setEditRequests(INITIAL_MY_EDIT_REQUESTS);
    setModal(null);
  }

  return (
    <>
      <main className="h-[calc(100dvh-3.25rem)] overflow-hidden bg-[#FCFCFC] px-5 py-6 pb-16 text-[#172033] lg:px-6">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-[1360px]">
            <AttendanceTodaySituation />

            <section className="mt-6">
              <nav aria-label="근태 메뉴" className="flex gap-7 border-b border-[#DCE9DF] text-[12px]">
                {TABS.map((item) => (
                  <button
                    className={
                      tab === item.key
                        ? "border-b-2 border-[#4D9560] px-1 pb-3 font-semibold"
                        : "pb-3 text-[#718096]"
                    }
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                  >
                    {item.label}
                    {item.key === "manage" && <span className="ml-1 rounded-full bg-[#172033] px-1.5 py-0.5 text-[8px] text-white">3</span>}
                  </button>
                ))}
              </nav>

              {tab === "mine" && (
                <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
                  <AttendanceCalendar 
                    record={record} 
                    hasEditRequest={hasEditRequestToday} 
                    onSelectToday={() => setModal("detail")} 
                  />

                  <aside className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <AttendanceCommuteInformation
                      now={now}
                      record={record}
                      standardStart={standardStart}
                      standardEnd={standardEnd}
                      canOvertime={canOvertime}
                      onClockIn={handleClockInClick}
                      onClockOut={() => setModal("leave")}
                      onOvertime={() => setModal("overtime")}
                    />
                    <AttendanceAnnualLeave />
                    <AttendanceMyEditRequest 
                      requests={editRequests} 
                      onViewAll={() => setTab("myEdits")} 
                    />
                  </aside>
                </div>
              )}

              {tab === "all" && (
                <div className="mt-5">
                  <AttendanceAllEmployees />
                </div>
              )}

              {tab === "manage" && (
                <div className="mt-5">
                  <AttendanceEditRequestManage />
                </div>
              )}

              {tab === "myEdits" && (
                <div className="mt-5">
                  <AttendanceMyEditRequestList requests={editRequests} />
                </div>
              )}
            </section>
          </div>
        </div>
        <button
          aria-label="수정 요청 작성"
          type="button"
          className="fixed bottom-24 right-6 flex size-12 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-lg"
        >
          <Pencil className="size-5" />
        </button>
      </main>

      {modal === "late" && 
        <AttendanceLateModal 
          date={now} 
          onCancel={() => setModal(null)} 
          onConfirm={handleLateConfirm} 
        />
      }
      {modal === "leave" && (
        <AttendanceLeaveWorkModal 
          now={now}
          record={record}
          onCancel={() => setModal(null)}
          onConfirm={handleLeaveConfirm} 
        />
      )}
      {modal === "overtime" && (
        <AttendanceOvertimeWork 
          now={now}
          standardEnd={standardEnd}
          onCancel={() => setModal(null)}
          onConfirm={handleOvertimeConfirm} 
        />
      )}
      {modal === "detail" && (
        <AttendanceDetailModal
          date={now}
          record={record}
          hasEditRequest={hasEditRequestToday}
          onClose={() => setModal(null)}
          onEditRequest={() => setModal("editRequest")}
        />
      )}
      {modal === "editRequest" && (
        <AttendanceCreateEditRequestModal 
          date={now}
          record={record}
          onCancel={() => setModal(null)} onSubmit={handleEditRequestSubmit} 
        />
      )}
    </>
  );
}
