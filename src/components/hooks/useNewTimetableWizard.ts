import { useState } from "react";
import { indexToDayOfWeek } from "@/feature/timetable/timetableFormat";
import type { FloorConfig } from "@/feature/timetable/types";
import type { NewTimetableBasicInfoFormValues } from "@/lib/newTimetableBasicInfoSchema";

type UseNewTimetableWizardParams = {
  activeClassroomGroups: FloorConfig[];
  onFinish: (payload: TimetableSetCreateRequest, editingTimetableSetId: number | null) => void;
};

const DEFAULT_OPERATING_START_TIME = "08:30";
const DEFAULT_OPERATING_END_TIME = "22:00";
const DEFAULT_OPERATING_DAYS: DayOfWeek[] = indexToDayOfWeek;

const buildDefaultFloors = (): FloorConfig[] => Array.from({ length: 5 }, (_, index) => ({ floor: `${index + 1}층`, rooms: [`${index + 1}01`] }));

export function useNewTimetableWizard({ activeClassroomGroups, onFinish }: UseNewTimetableWizardParams) {
  const [step, setStep] = useState<1 | 2 | 3 | null>(null);
  const [form, setForm] = useState<NewTimetableBasicInfoFormValues>({ name: "", startDate: "", endDate: "" });
  const [isBasicInfoComplete, setIsBasicInfoComplete] = useState(false);
  const [selectedTemplateOption, setSelectedTemplateOption] = useState<"empty" | "previous" | null>(null);
  const [floors, setFloors] = useState<FloorConfig[]>([]);
  const [newRoomNames, setNewRoomNames] = useState<Record<number, string>>({});
  const [slot, setSlot] = useState<10 | 30 | 60>(30);
  const [editingTimetableSetId, setEditingTimetableSetId] = useState<number | null>(null);
  const [operatingStartTime, setOperatingStartTime] = useState(DEFAULT_OPERATING_START_TIME);
  const [operatingEndTime, setOperatingEndTime] = useState(DEFAULT_OPERATING_END_TIME);
  const [operatingDays, setOperatingDays] = useState<DayOfWeek[]>(DEFAULT_OPERATING_DAYS);

  const open = () => {
    setEditingTimetableSetId(null);
    setForm({ name: "", startDate: "", endDate: "" });
    setIsBasicInfoComplete(false);
    setSelectedTemplateOption(null);
    setSlot(30);
    setFloors(buildDefaultFloors());
    setOperatingStartTime(DEFAULT_OPERATING_START_TIME);
    setOperatingEndTime(DEFAULT_OPERATING_END_TIME);
    setOperatingDays(DEFAULT_OPERATING_DAYS);
    setStep(1);
  };

  const startEdit = (detail: TimetableSetDetailData) => {
    setEditingTimetableSetId(detail.timetableSetId);
    setForm({ name: detail.name, startDate: detail.startDate, endDate: detail.endDate });
    setIsBasicInfoComplete(false);
    setSlot(detail.slotUnitMinutes as 10 | 30 | 60);
    setFloors(detail.classrooms.map((group) => ({ floor: group.floor, rooms: [...group.codes] })));
    setOperatingStartTime(detail.operatingStartTime);
    setOperatingEndTime(detail.operatingEndTime);
    setOperatingDays(detail.operatingDays);
    setSelectedTemplateOption("previous");
    setStep(1);
  };

  const close = () => setStep(null);
  const changeForm = (patch: Partial<NewTimetableBasicInfoFormValues>) => setForm((current) => ({ ...current, ...patch }));
  const goToNextStep = () => setStep((current) => (current === 1 ? 2 : 3));
  const goToPrevStep = () => setStep((current) => (current === 3 ? 2 : 1));

  const selectTemplateOption = (option: "empty" | "previous") => {
    setSelectedTemplateOption(option);
    setFloors(option === "empty" ? buildDefaultFloors() : activeClassroomGroups.map((group) => ({ floor: group.floor, rooms: [...group.rooms] })));
  };

  const addFloor = () => setFloors((current) => [...current, { floor: `${current.length + 1}층`, rooms: [`${current.length + 1}01`] }]);

  const addRoom = (floorIndex: number) => {
    const roomName = newRoomNames[floorIndex]?.trim();

    if (!roomName || floors[floorIndex].rooms.includes(roomName)) return;

    setFloors((current) => current.map((floor, index) => index === floorIndex ? { ...floor, rooms: [...floor.rooms, roomName] } : floor));
    setNewRoomNames((current) => ({ ...current, [floorIndex]: "" }));
  };

  const removeRoom = (floorIndex: number, roomName: string) => setFloors((current) => current.map((floor, index) => index === floorIndex ? { ...floor, rooms: floor.rooms.filter((room) => room !== roomName) } : floor));
  const changeNewRoomName = (floorIndex: number, value: string) => setNewRoomNames((current) => ({ ...current, [floorIndex]: value }));

  const finish = () => {
    const payload: TimetableSetCreateRequest = {
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      operatingStartTime,
      operatingEndTime,
      operatingDays,
      slotUnitMinutes: slot,
      classrooms: floors.map((floor) => ({ floor: floor.floor, codes: floor.rooms })),
    };

    onFinish(payload, editingTimetableSetId);
  };

  return {
    addFloor,
    addRoom,
    changeBasicInfoValidity: setIsBasicInfoComplete,
    changeForm,
    changeNewRoomName,
    changeSlot: setSlot,
    close,
    finish,
    floors,
    form,
    goToNextStep,
    goToPrevStep,
    isBasicInfoComplete,
    newRoomNames,
    open,
    removeRoom,
    selectedTemplateOption,
    selectTemplateOption,
    slot,
    startEdit,
    step,
  };
}
