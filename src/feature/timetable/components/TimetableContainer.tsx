"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useClassRegistrationForm } from "@/components/hooks/useClassRegistrationForm";
import { useNewTimetableWizard } from "@/components/hooks/useNewTimetableWizard";
import ClassDetailModal from "@/feature/timetable/components/ClassDetailModal";
import ClassRegistrationModal from "@/feature/timetable/components/ClassRegistrationModal";
import NewTimetableStepModal from "@/feature/timetable/components/NewTimetableStepModal";
import TimetableExportMenu from "@/feature/timetable/components/TimetableExportMenu";
import TimetableFilterBar from "@/feature/timetable/components/TimetableFilterBar";
import TimetableManagementModal from "@/feature/timetable/components/TimetableManagementModal";
import TimetableTemplateSelector from "@/feature/timetable/components/TimetableTemplateSelector";
import TimetableWeekNav from "@/feature/timetable/components/TimetableWeekNav";
import WeeklyTimetableGrid from "@/feature/timetable/components/WeeklyTimetableGrid";
import type { ClassItem, TemplateStatus, TimetableTemplate } from "@/feature/timetable/types";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const days = [
  { name: "일", rooms: ["601", "602", "603", "604", "605"] },
  { name: "월", rooms: ["601", "602", "603", "604", "605"] },
  { name: "화", rooms: ["501", "502", "401", "301", "다모아"] },
  { name: "수", rooms: ["601", "602", "603", "604", "605"] },
  { name: "목", rooms: ["501", "502", "401", "301", "다모아"] },
  { name: "금", rooms: ["601", "602", "603", "604", "605"] },
  { name: "토", rooms: ["501", "502", "401", "301", "다모아"] },
] as const;


// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const classItems: ClassItem[] = [
  { day: 0, room: 1, start: 3, duration: 4, course: "고3", teacher: "최T", tone: "blue" },
  { day: 0, room: 2, start: 3, duration: 4, course: "고3", teacher: "오T", tone: "green" },
  { day: 1, room: 3, start: 5, duration: 5, course: "고3", teacher: "오T", tone: "green" },
  { day: 1, room: 4, start: 4, duration: 6, course: "원T", teacher: "김T", tone: "stone" },
  { day: 2, room: 0, start: 5, duration: 3, course: "고1", teacher: "윤T", tone: "blue" },
  { day: 2, room: 3, start: 11, duration: 4, course: "고2", teacher: "박T", tone: "stone" },
  { day: 3, room: 1, start: 8, duration: 4, course: "고1", teacher: "김T", tone: "sky" },
  { day: 4, room: 2, start: 4, duration: 5, course: "고2", teacher: "오T", tone: "green" },
  { day: 5, room: 0, start: 6, duration: 4, course: "고3", teacher: "최T", tone: "blue" },
  { day: 5, room: 4, start: 12, duration: 5, course: "고1", teacher: "김T", tone: "sky" },
  { day: 6, room: 1, start: 5, duration: 6, course: "중3", teacher: "박T", tone: "stone" },
  { day: 6, room: 3, start: 3, duration: 4, course: "고2", teacher: "윤T", tone: "blue" },
];

const timetableTemplates: TimetableTemplate[] = [
  { id: "summer-2026", title: "2026 여름특강", startDate: new Date(2026, 6, 20), endDate: new Date(2026, 7, 16), roomsByDay: days.map((day) => ({ ...day, rooms: [...day.rooms] })), classes: classItems, slotMinutes: 30 },
  { id: "fall-2026", title: "2026 하반기 정규", startDate: new Date(2026, 8, 1), endDate: new Date(2026, 11, 31), roomsByDay: days.map((day) => ({ ...day, rooms: ["301", "302", "401", "402"] })), classes: [{ day: 1, room: 0, start: 3, duration: 4, course: "수학", teacher: "김T", tone: "blue" }, { day: 3, room: 1, start: 5, duration: 4, course: "영어", teacher: "오T", tone: "green" }], slotMinutes: 30 },
  { id: "spring-2026", title: "2026 상반기 정규", startDate: new Date(2026, 2, 1), endDate: new Date(2026, 5, 30), roomsByDay: days.map((day) => ({ ...day, rooms: ["201", "202", "501"] })), classes: [{ day: 2, room: 2, start: 4, duration: 5, course: "국어", teacher: "윤T", tone: "stone" }], slotMinutes: 60 },
  { id: "winter-2025", title: "2025 겨울특강", startDate: new Date(2025, 11, 22), endDate: new Date(2026, 0, 31), roomsByDay: days.map((day) => ({ ...day, rooms: ["101", "102", "201", "202"] })), classes: [{ day: 4, room: 3, start: 6, duration: 4, course: "과학", teacher: "박T", tone: "sky" }], slotMinutes: 30 },
];

const weekDayNames = ["일", "월", "화", "수", "목", "금", "토"];

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

const getClassKey = (item: ClassItem) => `${item.day}-${item.room}-${item.start}-${item.course}-${item.teacher}`;

export default function TimetableContainer() {
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [isClassRegistrationOpen, setIsClassRegistrationOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isTimetableManagementOpen, setIsTimetableManagementOpen] = useState(false);
  const [openTimetableOption, setOpenTimetableOption] = useState<string | null>(null);
  const [templates, setTemplates] = useState(timetableTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState(timetableTemplates[0].id);
  const [registeredClasses, setRegisteredClasses] = useState<Record<string, ClassItem[]>>({});
  const [selectedDayFilter, setSelectedDayFilter] = useState("전체");
  const [selectedFloorFilter, setSelectedFloorFilter] = useState("전체");
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedClassKey, setSelectedClassKey] = useState<string | null>(null);
  const activeTemplate = templates.find((template) => template.id === selectedTemplateId) ?? templates[0];
  const [weekStart, setWeekStart] = useState(() => new Date(timetableTemplates[0].startDate));
  const weekEnd = getWeekEndDate(weekStart);
  const currentDays = Array.from({ length: 7 }, (_, index) => {
    const date = getShiftedWeekStart(weekStart, index);
    const dayOfWeek = date.getDay();
    const day = activeTemplate.roomsByDay[dayOfWeek];

    return {
      ...day,
      name: weekDayNames[dayOfWeek],
      date: formatMonthDay(date),
      dayOfWeek,
    };
  });
  const isTemplateStartWeek = weekStart.getTime() === activeTemplate.startDate.getTime();
  const isTemplateEndWeek = getWeekEndDate(getShiftedWeekStart(weekStart, 7)).getTime() > activeTemplate.endDate.getTime();
  const activeClasses = [...activeTemplate.classes, ...(registeredClasses[activeTemplate.id] ?? [])];

  const isRoomInFloor = (room: string, floor: string) => floor === "전체" || (floor === "다모아" ? room === "다모아" : room.startsWith(floor.replace("층", "")));
  const isClassVisible = (item: ClassItem) => {
    const room = activeTemplate.roomsByDay[item.day].rooms[item.room];

    return (selectedDayFilter === "전체" || selectedDayFilter === weekDayNames[item.day])
      && isRoomInFloor(room, selectedFloorFilter)
      && item.course.toLowerCase().includes(courseSearch.trim().toLowerCase());
  };
  const floorOptions = [...new Set(activeTemplate.roomsByDay.flatMap((day) => day.rooms.map((room) => room === "다모아" ? "다모아" : `${room.slice(0, 1)}층`)))];
  const visibleRoomColumns = [...new Set(activeTemplate.roomsByDay.flatMap((day) => day.rooms).filter((room) => isRoomInFloor(room, selectedFloorFilter)))];
  const timetableGridColumns = `68px repeat(7, minmax(${Math.max(visibleRoomColumns.length, 1) * 72}px, 1fr))`;
  const getTemplateStatus = (template: TimetableTemplate): TemplateStatus => {
    const today = new Date(2026, 7, 11);

    if (template.startDate <= today && template.endDate >= today) return { label: "진행 중", tone: "bg-[#EDF7EF] text-[#5A9A68]" };
    if (template.startDate > today) return { label: "예정", tone: "bg-[#EDF4FC] text-[#6B8AB7]" };
    return { label: "종료", tone: "bg-[#F1F3F5] text-[#8290A0]" };
  };
  const slotCount = (14 * 60) / activeTemplate.slotMinutes;
  const rowHeight = activeTemplate.slotMinutes === 10 ? 14 : activeTemplate.slotMinutes === 30 ? 26 : 52;
  const timetableTimes = Array.from({ length: slotCount + 1 }, (_, index) => {
    const minutes = 8 * 60 + index * activeTemplate.slotMinutes;

    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  });
  const selectedClass = selectedClassKey ? activeClasses.find((item) => getClassKey(item) === selectedClassKey) ?? null : null;

  const selectTimetableTemplate = (template: TimetableTemplate) => {
    setSelectedTemplateId(template.id);
    setWeekStart(new Date(template.startDate));
    setSelectedDayFilter("전체");
    setSelectedFloorFilter("전체");
    setCourseSearch("");
    setIsTemplateMenuOpen(false);
  };

  const wizard = useNewTimetableWizard({ activeTemplate, onFinish: selectTimetableTemplate, setTemplates });

  const classRegistration = useClassRegistrationForm({
    activeTemplate,
    onSubmit: (classItem, editingClassKey) => {
      if (editingClassKey) {
        const matches = (item: ClassItem) => getClassKey(item) === editingClassKey;
        setTemplates((current) => current.map((template) => template.id === activeTemplate.id ? { ...template, classes: template.classes.map((item) => matches(item) ? classItem : item) } : template));
        setRegisteredClasses((current) => ({ ...current, [activeTemplate.id]: (current[activeTemplate.id] ?? []).map((item) => matches(item) ? classItem : item) }));
      } else {
        setRegisteredClasses((current) => ({ ...current, [activeTemplate.id]: [...(current[activeTemplate.id] ?? []), classItem] }));
      }
      setIsClassRegistrationOpen(false);
    },
  });

  const openEditForSelectedClass = () => {
    if (!selectedClass || !selectedClassKey) return;

    classRegistration.startEdit(selectedClass, selectedClassKey);
    setSelectedClassKey(null);
    setIsClassRegistrationOpen(true);
  };

  const deleteSelectedClass = () => {
    const key = selectedClassKey;

    setTemplates((current) => current.map((template) => template.id === activeTemplate.id ? { ...template, classes: template.classes.filter((item) => getClassKey(item) !== key) } : template));
    setRegisteredClasses((current) => ({ ...current, [activeTemplate.id]: (current[activeTemplate.id] ?? []).filter((item) => getClassKey(item) !== key) }));
    setSelectedClassKey(null);
  };

  const openNewTimetable = () => {
    setIsTemplateMenuOpen(false);
    setIsTimetableManagementOpen(false);
    wizard.open();
  };

  const editTimetable = (template: TimetableTemplate) => {
    setIsTimetableManagementOpen(false);
    wizard.startEdit(template);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((current) => current.filter((item) => item.id !== templateId));
    setOpenTimetableOption(null);
  };

  return (
    <main className="h-[calc(100dvh-3.25rem)] min-w-0 w-full overflow-hidden bg-[#FCFCFC] text-[#172033]">
      <div className="h-full overflow-y-auto px-5 pb-2 pt-5 lg:px-6">
        <div className="mx-auto min-w-0 w-full max-w-[1760px]">
          <h1 className="sr-only">시간표</h1>
          <div className="flex flex-col gap-4 border-b border-[#E5EEE7] pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <TimetableTemplateSelector
                activeTemplate={activeTemplate}
                getStatus={getTemplateStatus}
                isOpen={isTemplateMenuOpen}
                onCreate={openNewTimetable}
                onSelect={selectTimetableTemplate}
                onToggle={() => setIsTemplateMenuOpen((isOpen) => !isOpen)}
                templates={templates}
              />
              <TimetableWeekNav
                isNextDisabled={isTemplateEndWeek}
                isPrevDisabled={isTemplateStartWeek}
                label={`${formatMonthDay(weekStart)} ~ ${formatMonthDay(weekEnd)}`}
                onNext={() => setWeekStart((currentWeekStart) => {
                  const nextWeekStart = getShiftedWeekStart(currentWeekStart, 7);

                  return getWeekEndDate(nextWeekStart).getTime() > activeTemplate.endDate.getTime() ? currentWeekStart : nextWeekStart;
                })}
                onPrev={() => setWeekStart((currentWeekStart) => getShiftedWeekStart(currentWeekStart, -7))}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#273548] px-4 text-[13px] font-semibold text-white"
                onClick={() => setIsClassRegistrationOpen(true)}
                type="button"
              >
                <Plus className="size-4" />
                수업 등록
              </button>
              <TimetableExportMenu
                isOpen={isExportMenuOpen}
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
            onSelectClass={(item) => setSelectedClassKey(getClassKey(item))}
            rowHeight={rowHeight}
            slotCount={slotCount}
            times={timetableTimes}
            visibleRooms={visibleRoomColumns}
          />
        </div>
      </div>
      {isClassRegistrationOpen && (
        <ClassRegistrationModal
          availableRooms={classRegistration.availableRooms}
          form={classRegistration.form}
          onChange={classRegistration.changeForm}
          onClose={() => setIsClassRegistrationOpen(false)}
          onSubmit={classRegistration.submit}
        />
      )}
      {selectedClass && (
        <ClassDetailModal
          activeTemplate={activeTemplate}
          onClose={() => setSelectedClassKey(null)}
          onDelete={deleteSelectedClass}
          onEdit={openEditForSelectedClass}
          selectedClass={selectedClass}
        />
      )}
      {isTimetableManagementOpen && (
        <TimetableManagementModal
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
          registeredClasses={registeredClasses}
          templates={templates}
        />
      )}
      {wizard.step && (
        <NewTimetableStepModal
          floors={wizard.floors}
          form={wizard.form}
          isBasicInfoComplete={wizard.isBasicInfoComplete}
          newRoomNames={wizard.newRoomNames}
          onAddFloor={wizard.addFloor}
          onAddRoom={wizard.addRoom}
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
