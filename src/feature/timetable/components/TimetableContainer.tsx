"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNewTimetableWizard } from "@/components/hooks/useNewTimetableWizard";
import {
  createTimetableSetAction,
  createTimetableSlotAction,
  deleteTimetableSetAction,
  deleteTimetableSlotAction,
  exportTimetableSetAction,
  getTimetableSetDetailAction,
  getTimetableSetListAction,
  getTimetableSlotListAction,
  updateTimetableSetAction,
  updateTimetableSlotAction,
} from "@/feature/timetable/actions";
import ClassDetailModal from "@/feature/timetable/components/ClassDetailModal";
import ClassRegistrationModal from "@/feature/timetable/components/ClassRegistrationModal";
import NewTimetableStepModal from "@/feature/timetable/components/NewTimetableStepModal";
import TimetableExportMenu from "@/feature/timetable/components/TimetableExportMenu";
import TimetableFilterBar from "@/feature/timetable/components/TimetableFilterBar";
import TimetableManagementModal from "@/feature/timetable/components/TimetableManagementModal";
import TimetableTemplateSelector from "@/feature/timetable/components/TimetableTemplateSelector";
import TimetableWeekNav from "@/feature/timetable/components/TimetableWeekNav";
import WeeklyTimetableGrid from "@/feature/timetable/components/WeeklyTimetableGrid";
import { weekDayNames } from "@/feature/timetable/constants";
import {
  formatMinutesToTime,
  getClassEndTime,
  getClassStartTime,
  indexToDayOfWeek,
  parseTimeToMinutes,
  toTimetableSlotRequestPayload,
  toTimetableTemplate,
} from "@/feature/timetable/timetableFormat";
import type { ClassItem, TemplateStatus, TimetableTemplate } from "@/feature/timetable/viewModel";
import type { ClassRegistrationFormValues } from "@/lib/classRegistrationSchema";

const formatMonthDay = (date: Date) => `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

const getWeekEndDate = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return endDate;
};

const getShiftedWeekStart = (startDate: Date, amount: number) => {
  const nextStartDate = new Date(startDate);
  nextStartDate.setDate(startDate.getDate() + amount);
  return nextStartDate;
};

const getTemplateStatus = (status: TimetableSetStatus): TemplateStatus => {
  if (status === "ACTIVE") return { label: "진행 중", tone: "bg-[#EDF7EF] text-[#5A9A68]" };
  if (status === "PLANNED") return { label: "예정", tone: "bg-[#EDF4FC] text-[#6B8AB7]" };
  return { label: "종료", tone: "bg-[#F1F3F5] text-[#8290A0]" };
};

const blankRegistrationDefaultValues: ClassRegistrationFormValues = { day: "월", room: "", startTime: "09:00", endTime: "11:00", grade: "HIGH_3", teacher: "", course: "", color: "90A9C6" };

const buildRegistrationDefaultValues = (classItem: ClassItem, activeTemplate: TimetableTemplate): ClassRegistrationFormValues => ({
  day: weekDayNames[classItem.day],
  room: activeTemplate.roomsByDay[classItem.day].rooms[classItem.room],
  startTime: getClassStartTime(activeTemplate, classItem),
  endTime: getClassEndTime(activeTemplate, classItem),
  grade: classItem.grade ?? "HIGH_3",
  teacher: classItem.teacher,
  course: classItem.course,
  color: classItem.color,
});

const EXPORT_EXTENSIONS: Record<TimetableExportFormat, string> = {
  EXCEL: "xlsx",
  PDF: "pdf",
  PNG: "png",
};

// 서버가 base64로 내려준 파일을 브라우저에서 바로 다운로드시킨다.
const downloadBase64File = (base64: string, mimeType: string, filename: string) => {
  const byteString = atob(base64);
  const bytes = new Uint8Array(byteString.length);

  for (let index = 0; index < byteString.length; index += 1) {
    bytes[index] = byteString.charCodeAt(index);
  }

  const url = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export default function TimetableContainer() {
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [isClassRegistrationOpen, setIsClassRegistrationOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isTimetableManagementOpen, setIsTimetableManagementOpen] = useState(false);
  const [openTimetableOption, setOpenTimetableOption] = useState<number | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedDayFilter, setSelectedDayFilter] = useState("전체");
  const [selectedFloorFilter, setSelectedFloorFilter] = useState("전체");
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
  const [weekOffsetWeeks, setWeekOffsetWeeks] = useState(0);

  const queryClient = useQueryClient();

  const {
    data: templates = [],
    isPending: isLoadingTemplates,
    isError: isTemplatesError,
  } = useQuery({
    queryKey: ["timetable-sets"],
    queryFn: getTimetableSetListAction,
    retry: false,
  });

  // selectedTemplateId가 목록에 없으면(초기 로드, 삭제 후) 첫 번째 템플릿으로 대체한다.
  const activeTemplateId = selectedTemplateId !== null && templates.some((template) => template.timetableSetId === selectedTemplateId)
    ? selectedTemplateId
    : templates[0]?.timetableSetId ?? null;

  const {
    data: activeTemplateDetail,
    isPending: isLoadingActiveTemplate,
    isError: isActiveTemplateError,
  } = useQuery({
    queryKey: ["timetable-set-detail", activeTemplateId],
    queryFn: () => getTimetableSetDetailAction(activeTemplateId as number),
    enabled: activeTemplateId !== null,
    retry: false,
  });

  const { data: slots = [] } = useQuery({
    queryKey: ["timetable-slots", activeTemplateId],
    queryFn: () => getTimetableSlotListAction(activeTemplateId as number),
    enabled: activeTemplateId !== null,
    retry: false,
  });

  const activeTemplate = useMemo(
    () => (activeTemplateDetail ? toTimetableTemplate(activeTemplateDetail, slots) : null),
    [activeTemplateDetail, slots]
  );

  const slotCountQueries = useQueries({
    queries: isTimetableManagementOpen
      ? templates.map((template) => ({
        queryKey: ["timetable-slots", template.timetableSetId],
        queryFn: () => getTimetableSlotListAction(template.timetableSetId),
        retry: false,
      }))
      : [],
  });

  const classCounts = useMemo(() => {
    const counts: Record<number, number> = {};

    templates.forEach((template, index) => {
      counts[template.timetableSetId] = slotCountQueries[index]?.data?.length ?? 0;
    });

    return counts;
  }, [templates, slotCountQueries]);

  const saveSlotMutation = useMutation({
    mutationFn: ({ payload, targetSlotId }: { payload: TimetableSlotCreateRequest; targetSlotId: number | null }) =>
      targetSlotId !== null
        ? updateTimetableSlotAction(activeTemplateId as number, targetSlotId, { scope: "ALL", ...payload })
        : createTimetableSlotAction(activeTemplateId as number, payload),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["timetable-slots", activeTemplateId] });
      setEditingSlotId(null);
      setIsClassRegistrationOpen(false);
    },
    onError: () => toast.error("수업 저장에 실패하였습니다."),
  });

  const deleteSlotMutation = useMutation({
    mutationFn: (slotId: number) => deleteTimetableSlotAction(activeTemplateId as number, slotId, "ALL"),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["timetable-slots", activeTemplateId] });
      setSelectedSlotId(null);
    },
    onError: () => toast.error("수업 삭제에 실패하였습니다."),
  });

  const timetableSetMutation = useMutation({
    mutationFn: ({ payload, editingTimetableSetId }: { payload: TimetableSetCreateRequest; editingTimetableSetId: number | null }) =>
      editingTimetableSetId !== null
        ? updateTimetableSetAction(editingTimetableSetId, payload)
        : createTimetableSetAction(payload),
    onSuccess: (result, variables) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      const savedId = variables.editingTimetableSetId ?? (result as { timetableSetId?: number }).timetableSetId;

      queryClient.invalidateQueries({ queryKey: ["timetable-sets"] });
      if (savedId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ["timetable-set-detail", savedId] });
        queryClient.invalidateQueries({ queryKey: ["timetable-slots", savedId] });
        setSelectedTemplateId(savedId);
        setWeekOffsetWeeks(0);
        setSelectedDayFilter("전체");
        setSelectedFloorFilter("전체");
        setCourseSearch("");
      }

      wizard.close();
    },
    onError: () => toast.error("시간표 세트 저장에 실패하였습니다."),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId: number) => deleteTimetableSetAction(templateId),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["timetable-sets"] });
    },
    onError: () => toast.error("시간표 세트 삭제에 실패하였습니다."),
  });

  const exportMutation = useMutation({
    mutationFn: (format: TimetableExportFormat) => {
      if (activeTemplateId === null || !activeTemplate) {
        throw new Error("내보낼 시간표가 없습니다.");
      }

      const dayIndex = weekDayNames.indexOf(selectedDayFilter);
      const params: TimetableExportParams = {
        format,
        density: "NORMAL",
        ...(dayIndex >= 0 ? { dayOfWeek: indexToDayOfWeek[dayIndex] } : {}),
        ...(selectedFloorFilter !== "전체" ? { floor: selectedFloorFilter } : {}),
      };

      return exportTimetableSetAction(activeTemplateId, params);
    },
    onSuccess: (result, format) => {
      if (!result.success || !result.file || !result.mimeType) {
        toast.error(result.message);
        return;
      }

      downloadBase64File(result.file, result.mimeType, `${activeTemplate?.title ?? "timetable"}.${EXPORT_EXTENSIONS[format]}`);
      setIsExportMenuOpen(false);
    },
    onError: () => toast.error("시간표 내보내기에 실패하였습니다."),
  });

  const wizard = useNewTimetableWizard({
    activeClassroomGroups: activeTemplate?.classroomGroups ?? [],
    onFinish: (payload, editingTimetableSetId) => timetableSetMutation.mutate({ payload, editingTimetableSetId }),
  });

  const activeClasses = activeTemplate?.classes ?? [];

  const isRoomInFloor = (room: string, floor: string) => floor === "전체" || (floor === "다모아" ? room === "다모아" : room.startsWith(floor.replace("층", "")));
  const isClassVisible = (item: ClassItem) => {
    if (!activeTemplate) return false;

    const room = activeTemplate.roomsByDay[item.day]?.rooms[item.room] ?? "";

    return (selectedDayFilter === "전체" || selectedDayFilter === weekDayNames[item.day])
      && isRoomInFloor(room, selectedFloorFilter)
      && item.course.toLowerCase().includes(courseSearch.trim().toLowerCase());
  };
  const floorOptions = activeTemplate
    ? [...new Set(activeTemplate.roomsByDay.flatMap((day) => day.rooms.map((room) => room === "다모아" ? "다모아" : `${room.slice(0, 1)}층`)))]
    : [];
  const visibleRoomColumns = activeTemplate
    ? [...new Set(activeTemplate.roomsByDay.flatMap((day) => day.rooms).filter((room) => isRoomInFloor(room, selectedFloorFilter)))]
    : [];
  const timetableGridColumns = `68px repeat(7, minmax(${Math.max(visibleRoomColumns.length, 1) * 72}px, 1fr))`;

  const weekStart = activeTemplate ? getShiftedWeekStart(activeTemplate.startDate, weekOffsetWeeks * 7) : null;
  const weekEnd = weekStart ? getWeekEndDate(weekStart) : null;
  const currentDays = activeTemplate && weekStart
    ? Array.from({ length: 7 }, (_, index) => {
      const date = getShiftedWeekStart(weekStart, index);
      const dayOfWeek = date.getDay();
      const day = activeTemplate.roomsByDay[dayOfWeek];

      return {
        ...day,
        name: weekDayNames[dayOfWeek],
        date: formatMonthDay(date),
        dayOfWeek,
      };
    })
    : [];
  const isTemplateStartWeek = Boolean(activeTemplate && weekStart && weekStart.getTime() === activeTemplate.startDate.getTime());
  const isTemplateEndWeek = Boolean(activeTemplate && weekStart && getWeekEndDate(getShiftedWeekStart(weekStart, 7)).getTime() > activeTemplate.endDate.getTime());

  const slotCount = activeTemplate
    ? (parseTimeToMinutes(activeTemplate.operatingEndTime) - parseTimeToMinutes(activeTemplate.operatingStartTime)) / activeTemplate.slotMinutes
    : 0;
  const rowHeight = !activeTemplate ? 26 : activeTemplate.slotMinutes === 10 ? 14 : activeTemplate.slotMinutes === 30 ? 26 : 52;
  const timetableTimes = activeTemplate
    ? Array.from({ length: slotCount + 1 }, (_, index) => formatMinutesToTime(parseTimeToMinutes(activeTemplate.operatingStartTime) + index * activeTemplate.slotMinutes))
    : [];

  const selectedClass = selectedSlotId !== null ? activeClasses.find((item) => item.slotId === selectedSlotId) ?? null : null;
  const editingClass = editingSlotId !== null ? activeClasses.find((item) => item.slotId === editingSlotId) ?? null : null;
  const registrationDefaultValues = editingClass && activeTemplate ? buildRegistrationDefaultValues(editingClass, activeTemplate) : blankRegistrationDefaultValues;
  const getAvailableRoomsForDay = (day: string) => activeTemplate?.roomsByDay[weekDayNames.indexOf(day)]?.rooms ?? [];

  const selectTimetableTemplate = (template: TimetableSetListData) => {
    setSelectedTemplateId(template.timetableSetId);
    setWeekOffsetWeeks(0);
    setSelectedDayFilter("전체");
    setSelectedFloorFilter("전체");
    setCourseSearch("");
    setIsTemplateMenuOpen(false);
  };

  const submitClassRegistration = (values: ClassRegistrationFormValues) => {
    if (!activeTemplate) return;

    const payload = toTimetableSlotRequestPayload(values, editingClass?.classType ?? "CLASS");

    saveSlotMutation.mutate({ payload, targetSlotId: editingSlotId });
  };

  const openEditForSelectedClass = () => {
    if (!selectedClass) return;

    setEditingSlotId(selectedClass.slotId);
    setSelectedSlotId(null);
    setIsClassRegistrationOpen(true);
  };

  const deleteSelectedClass = () => {
    if (selectedSlotId === null) return;

    deleteSlotMutation.mutate(selectedSlotId);
  };

  const openNewTimetable = () => {
    setIsTemplateMenuOpen(false);
    setIsTimetableManagementOpen(false);
    wizard.open();
  };

  const editTimetable = async (template: TimetableSetListData) => {
    setIsTimetableManagementOpen(false);

    try {
      const detail = await getTimetableSetDetailAction(template.timetableSetId);
      wizard.startEdit(detail);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "시간표 세트 정보를 불러오지 못했습니다.");
    }
  };

  const deleteTemplate = (templateId: number) => {
    setOpenTimetableOption(null);
    deleteTemplateMutation.mutate(templateId);
  };

  const activeTemplateSummary = templates.find((template) => template.timetableSetId === activeTemplateId) ?? templates[0];

  return (
    <main className="h-[calc(100dvh-3.25rem)] min-w-0 w-full overflow-hidden bg-[#FCFCFC] text-[#172033]">
      <div className="h-full overflow-y-auto px-4 pb-2 pt-5 sm:px-5 lg:px-6">
        <div className="mx-auto min-w-0 w-full max-w-[1760px]">
          <h1 className="sr-only">시간표</h1>
          <div className="flex flex-col gap-4 border-b border-[#E5EEE7] pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {activeTemplateSummary && (
                <TimetableTemplateSelector
                  activeTemplate={activeTemplateSummary}
                  getStatus={getTemplateStatus}
                  isOpen={isTemplateMenuOpen}
                  onCreate={openNewTimetable}
                  onSelect={selectTimetableTemplate}
                  onToggle={() => setIsTemplateMenuOpen((isOpen) => !isOpen)}
                  templates={templates}
                />
              )}
              <TimetableWeekNav
                isNextDisabled={isTemplateEndWeek}
                isPrevDisabled={isTemplateStartWeek}
                label={weekStart && weekEnd ? `${formatMonthDay(weekStart)} ~ ${formatMonthDay(weekEnd)}` : ""}
                onNext={() => setWeekOffsetWeeks((currentOffset) => {
                  if (!weekStart || !activeTemplate) return currentOffset;

                  const nextWeekStart = getShiftedWeekStart(weekStart, 7);

                  return getWeekEndDate(nextWeekStart).getTime() > activeTemplate.endDate.getTime() ? currentOffset : currentOffset + 1;
                })}
                onPrev={() => setWeekOffsetWeeks((currentOffset) => currentOffset - 1)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#273548] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!activeTemplate}
                onClick={() => {
                  setEditingSlotId(null);
                  setIsClassRegistrationOpen(true);
                }}
                type="button"
              >
                <Plus className="size-4" />
                수업 등록
              </button>
              <TimetableExportMenu
                isExporting={exportMutation.isPending}
                isOpen={isExportMenuOpen}
                onExport={(format) => exportMutation.mutate(format)}
                onToggle={() => setIsExportMenuOpen((isOpen) => !isOpen)}
              />
              <button
                className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#526071]"
                onClick={() => {
                  setOpenTimetableOption(null);
                  setIsTimetableManagementOpen(true);
                }}
                type="button"
              >
                시간표 관리
              </button>
            </div>
          </div>

          {isLoadingTemplates ? (
            <p className="py-10 text-center text-[13px] text-[#718096]">시간표를 불러오는 중입니다.</p>
          ) : isTemplatesError ? (
            <p className="py-10 text-center text-[13px] text-[#C65A50]">시간표 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-[13px] text-[#718096]">등록된 시간표가 없습니다.</p>
              <button
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#273548] px-4 text-[13px] font-semibold text-white"
                onClick={openNewTimetable}
                type="button"
              >
                <Plus className="size-4" />
                새 시간표 만들기
              </button>
            </div>
          ) : isActiveTemplateError ? (
            <p className="py-10 text-center text-[13px] text-[#C65A50]">시간표 상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
          ) : !activeTemplate || isLoadingActiveTemplate ? (
            <p className="py-10 text-center text-[13px] text-[#718096]">시간표를 불러오는 중입니다.</p>
          ) : (
            <>
              <TimetableFilterBar
                courseSearch={courseSearch}
                days={currentDays}
                floorOptions={floorOptions}
                onCourseSearchChange={setCourseSearch}
                onDayChange={setSelectedDayFilter}
                onFloorChange={setSelectedFloorFilter}
                selectedDay={selectedDayFilter}
                selectedFloor={selectedFloorFilter}
              />

              <WeeklyTimetableGrid
                classes={activeClasses}
                days={currentDays}
                gridColumns={timetableGridColumns}
                isClassVisible={isClassVisible}
                onSelectClass={(item) => setSelectedSlotId(item.slotId)}
                rowHeight={rowHeight}
                slotCount={slotCount}
                times={timetableTimes}
                visibleRooms={visibleRoomColumns}
              />
            </>
          )}
        </div>
      </div>
      {isClassRegistrationOpen && (
        <ClassRegistrationModal
          defaultValues={registrationDefaultValues}
          getAvailableRooms={getAvailableRoomsForDay}
          isSubmitting={saveSlotMutation.isPending}
          onClose={() => setIsClassRegistrationOpen(false)}
          onSubmit={submitClassRegistration}
        />
      )}
      {selectedClass && activeTemplate && (
        <ClassDetailModal
          activeTemplate={activeTemplate}
          onClose={() => setSelectedSlotId(null)}
          onDelete={deleteSelectedClass}
          onEdit={openEditForSelectedClass}
          selectedClass={selectedClass}
        />
      )}
      {isTimetableManagementOpen && (
        <TimetableManagementModal
          classCounts={classCounts}
          getStatus={getTemplateStatus}
          onClose={() => {
            setOpenTimetableOption(null);
            setIsTimetableManagementOpen(false);
          }}
          onCreate={openNewTimetable}
          onDeleteTemplate={deleteTemplate}
          onEditTemplate={editTimetable}
          onToggleOption={(templateId) => setOpenTimetableOption((current) => current === templateId ? null : templateId)}
          openOptionId={openTimetableOption}
          templates={templates}
        />
      )}
      {wizard.step && (
        <NewTimetableStepModal
          floors={wizard.floors}
          form={wizard.form}
          isBasicInfoComplete={wizard.isBasicInfoComplete}
          isSubmitting={timetableSetMutation.isPending}
          newRoomNames={wizard.newRoomNames}
          onAddFloor={wizard.addFloor}
          onAddRoom={wizard.addRoom}
          onBasicInfoValidityChange={wizard.changeBasicInfoValidity}
          onChangeForm={wizard.changeForm}
          onChangeNewRoomName={wizard.changeNewRoomName}
          onChangeSlot={wizard.changeSlot}
          onClose={wizard.close}
          onComplete={wizard.finish}
          onNext={wizard.goToNextStep}
          onPrev={wizard.goToPrevStep}
          onRemoveRoom={wizard.removeRoom}
          onSelectTemplateOption={wizard.selectTemplateOption}
          selectedTemplateOption={wizard.selectedTemplateOption}
          slot={wizard.slot}
          step={wizard.step}
        />
      )}
    </main>
  );
}
