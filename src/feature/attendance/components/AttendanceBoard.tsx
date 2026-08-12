"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
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
  checkInAction,
  checkOutAction,
  createCorrectionRequestAction,
  getMyCorrectionRequestListAction,
  getMyDashboardAction,
  getMyDayDetailAction,
  getTeamTodayAction,
} from "../actions";

type ModalState = "late" | "leave" | "overtime" | "detail" | "editRequest" | null;
type TabKey = "mine" | "all" | "manage" | "myEdits";

type AttendanceBoardProps = {
  initialNow: string;
};

const TABS: { key: TabKey; label: string }[] = [
  { key: "mine", label: "내 근태" },
  { key: "all", label: "전직원 현황" },
  { key: "manage", label: "수정 요청 관리" },
  { key: "myEdits", label: "내 근태수정" },
];

function combineDateWithTime(base: Date, timeStr: string): Date {
  const [hour, minute] = timeStr.split(":").map(Number);
  const result = new Date(base);
  result.setHours(hour, minute, 0, 0);
  return result;
}

export default function AttendanceBoard({ initialNow }: AttendanceBoardProps) {
  const [now, setNow] = useState(() => new Date(initialNow));
  const [month, setMonth] = useState(() => {
    const initialDate = new Date(initialNow);
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });
  const serverOffsetRef = useRef(0);

  const [dashboard, setDashboard] = useState<AttendanceDashboardData | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [team, setTeam] = useState<AttendanceTeamTodayData | null>(null);
  const [isTeamLoading, setIsTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [myRequests, setMyRequests] = useState<AttendanceMyCorrectionRequestData[]>([]);

  const [modal, setModal] = useState<ModalState>(null);
  const [selectedDayDetail, setSelectedDayDetail] = useState<AttendanceDayDetailData | null>(null);
  const [tab, setTab] = useState<TabKey>("mine");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date(Date.now() + serverOffsetRef.current));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadTeam = useCallback(() => {
    return getTeamTodayAction()
      .then(setTeam)
      .catch((error) => {
        const message = error instanceof Error ? error.message : "오늘 팀 근태 현황 조회에 실패하였습니다.";
        setTeamError(message);
        toast.error(message);
      })
      .finally(() => setIsTeamLoading(false));
  }, []);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const loadMyRequests = useCallback(() => {
    getMyCorrectionRequestListAction()
      .then(setMyRequests)
      .catch((error) => toast.error(error instanceof Error ? error.message : "내 근태 수정 요청 목록 조회에 실패하였습니다."));
  }, []);

  useEffect(() => {
    loadMyRequests();
  }, [loadMyRequests]);

  const loadDashboard = useCallback(
    (targetMonth: Date) => {
      return getMyDashboardAction({ year: targetMonth.getFullYear(), month: targetMonth.getMonth() + 1 })
        .then((data) => {
          setDashboard(data);
          serverOffsetRef.current = new Date(data.today.serverTime).getTime() - Date.now();
          setNow(new Date(Date.now() + serverOffsetRef.current));
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : "근태 대시보드 조회에 실패하였습니다.";
          setDashboardError(message);
          toast.error(message);
        })
        .finally(() => setIsDashboardLoading(false));
    },
    [],
  );

  useEffect(() => {
    void loadDashboard(month);
  }, [month, loadDashboard]);

  const refreshDashboard = useCallback(
    (targetMonth: Date) => {
      setIsDashboardLoading(true);
      setDashboardError(null);
      return loadDashboard(targetMonth);
    },
    [loadDashboard],
  );

  if ((dashboardError && !dashboard) || (teamError && !team)) {
    return (
      <main className="flex h-[calc(100dvh-3.25rem)] flex-col items-center justify-center gap-3 bg-[#FCFCFC] text-[13px] text-[#718096]">
        <p>{dashboardError ?? teamError}</p>
        <button
          className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[12px] font-medium text-[#344054]"
          type="button"
          onClick={() => {
            if (dashboardError) void refreshDashboard(month);
            if (teamError) {
              setIsTeamLoading(true);
              setTeamError(null);
              void loadTeam();
            }
          }}
        >
          다시 시도
        </button>
      </main>
    );
  }

  if (isDashboardLoading || isTeamLoading || !dashboard || !team) {
    return <main className="flex h-[calc(100dvh-3.25rem)] items-center justify-center bg-[#FCFCFC] text-[13px] text-[#718096]">근태 정보를 불러오는 중입니다...</main>;
  }

  const today = dashboard.today;
  const standardStart = combineDateWithTime(now, today.workStartTime);
  const standardEnd = combineDateWithTime(now, today.workEndTime);
  const hasClockedIn = today.clockInAt !== null;
  const hasClockedOut = today.clockOutAt !== null;
  const canOvertime = hasClockedIn && !hasClockedOut && now.getTime() >= standardEnd.getTime();
  const pendingCorrectionDates = new Set(myRequests.filter((request) => request.status === "PENDING").map((request) => request.date));

  async function handleClockInClick() {
    if (now.getTime() > standardStart.getTime()) {
      setModal("late");
      return;
    }

    setIsSubmitting(true);
    const result = await checkInAction();
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      void refreshDashboard(month);
    } else {
      toast.error(result.message);
    }
  }

  async function handleLateConfirm(note: string) {
    setIsSubmitting(true);
    const result = await checkInAction({ clockInNote: note });
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setModal(null);
      void refreshDashboard(month);
    } else {
      toast.error(result.message);
    }
  }

  async function handleLeaveConfirm(note: string) {
    setIsSubmitting(true);
    const result = await checkOutAction({ clockOutType: "NORMAL", clockOutNote: note || undefined });
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setModal(null);
      void refreshDashboard(month);
    } else {
      toast.error(result.message);
    }
  }

  async function handleOvertimeConfirm(reason: string) {
    setIsSubmitting(true);
    const result = await checkOutAction({ clockOutType: "OVERTIME", clockOutNote: reason });
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setModal(null);
      void refreshDashboard(month);
    } else {
      toast.error(result.message);
    }
  }

  async function handleSelectDay(dateStr: string) {
    try {
      const detail = await getMyDayDetailAction(dateStr);
      setSelectedDayDetail(detail);
      setModal("detail");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "근태 상세 조회에 실패하였습니다.");
    }
  }

  async function handleEditRequestSubmit(payload: Omit<AttendanceCorrectionCreateRequest, "date">) {
    if (!selectedDayDetail) return;

    setIsSubmitting(true);
    const result = await createCorrectionRequestAction({ ...payload, date: selectedDayDetail.date });
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setModal(null);
      setSelectedDayDetail(null);
      loadMyRequests();
      void refreshDashboard(month);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <>
      <main className="h-[calc(100dvh-3.25rem)] overflow-hidden bg-[#FCFCFC] px-5 py-6 text-[#172033] lg:px-6">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-[1360px]">
            <AttendanceTodaySituation team={team} />

            <section className="mt-6">
              <nav aria-label="근태 메뉴" className="flex gap-7 border-b border-[#DCE9DF] text-[12px]">
                {TABS.map((item) => (
                  <button
                    className={tab === item.key ? "border-b-2 border-[#4D9560] px-1 pb-3 font-semibold" : "pb-3 text-[#718096]"}
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {tab === "mine" && (
                <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
                  <AttendanceCalendar
                    days={dashboard.calendar.days}
                    month={month}
                    pendingCorrectionDates={pendingCorrectionDates}
                    onChangeMonth={(nextMonth) => {
                      setIsDashboardLoading(true);
                      setDashboardError(null);
                      setMonth(nextMonth);
                    }}
                    onSelectDay={handleSelectDay}
                  />

                  <aside className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <AttendanceCommuteInformation
                      canOvertime={canOvertime}
                      now={now}
                      today={today}
                      onClockIn={handleClockInClick}
                      onClockOut={() => setModal("leave")}
                      onOvertime={() => setModal("overtime")}
                    />
                    <AttendanceAnnualLeave employment={dashboard.employment} leave={dashboard.leave} />
                    <AttendanceMyEditRequest requests={myRequests} onViewAll={() => setTab("myEdits")} />
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
                  <AttendanceMyEditRequestList requests={myRequests} />
                </div>
              )}
            </section>
          </div>
        </div>
        <button
          aria-label="수정 요청 작성"
          type="button"
          className="fixed bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-lg"
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
      {modal === "leave" && 
        <AttendanceLeaveWorkModal 
          now={now} 
          today={today} 
          onCancel={() => setModal(null)} 
          onConfirm={handleLeaveConfirm} 
        />
      }
      {modal === "overtime" && 
        <AttendanceOvertimeWork 
          now={now} 
          today={today} 
          onCancel={() => setModal(null)} 
          onConfirm={handleOvertimeConfirm} 
        />
      }
      {modal === "detail" && selectedDayDetail && (
        <AttendanceDetailModal
          dayDetail={selectedDayDetail}
          onClose={() => {
            setModal(null);
            setSelectedDayDetail(null);
          }}
          onEditRequest={() => setModal("editRequest")}
        />
      )}
      {modal === "editRequest" && selectedDayDetail && (
        <AttendanceCreateEditRequestModal 
          dayDetail={selectedDayDetail} 
          onCancel={() => setModal("detail")}
          onSubmit={handleEditRequestSubmit} 
        />
      )}

      {isSubmitting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10">
          <div className="rounded-lg bg-white px-4 py-2 text-[12px] text-[#718096] shadow">처리 중입니다...</div>
        </div>
      )}
    </>
  );
}
