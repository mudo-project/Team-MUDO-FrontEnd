import { type Dispatch, type SetStateAction, useState } from "react";
import type { FloorConfig, TimetableTemplate } from "@/feature/timetable/types";

const weekDayNames = ["일", "월", "화", "수", "목", "금", "토"];

type NewTimetableFormValue = {
  endDate: string;
  name: string;
  startDate: string;
};

type UseNewTimetableWizardParams = {
  activeTemplate: TimetableTemplate;
  onFinish: (template: TimetableTemplate) => void;
  setTemplates: Dispatch<SetStateAction<TimetableTemplate[]>>;
};

const buildDefaultFloors = (): FloorConfig[] => Array.from({ length: 5 }, (_, index) => ({ floor: `${index + 1}층`, rooms: [`${index + 1}01`] }));

export function useNewTimetableWizard({ activeTemplate, onFinish, setTemplates }: UseNewTimetableWizardParams) {
  const [step, setStep] = useState<1 | 2 | 3 | null>(null);
  const [form, setForm] = useState<NewTimetableFormValue>({ name: "", startDate: "", endDate: "" });
  const [selectedTemplateOption, setSelectedTemplateOption] = useState<"empty" | "previous" | null>(null);
  const [floors, setFloors] = useState<FloorConfig[]>([]);
  const [newRoomNames, setNewRoomNames] = useState<Record<number, string>>({});
  const [slot, setSlot] = useState<10 | 30 | 60>(30);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const isBasicInfoComplete = Boolean(form.name && form.startDate && form.endDate);

  const open = () => {
    setEditingTemplateId(null);
    setForm({ name: "", startDate: "", endDate: "" });
    setSelectedTemplateOption(null);
    setSlot(30);
    setFloors(buildDefaultFloors());
    setStep(1);
  };

  const startEdit = (template: TimetableTemplate) => {
    setEditingTemplateId(template.id);
    setForm({ name: template.title, startDate: template.startDate.toLocaleDateString("sv-SE"), endDate: template.endDate.toLocaleDateString("sv-SE") });
    setSlot(template.slotMinutes);
    setFloors([{ floor: "강의실", rooms: [...template.roomsByDay[0].rooms] }]);
    setSelectedTemplateOption("previous");
    setStep(1);
  };

  const close = () => setStep(null);
  const changeForm = (patch: Partial<NewTimetableFormValue>) => setForm((current) => ({ ...current, ...patch }));
  const goToNextStep = () => setStep((current) => (current === 1 ? 2 : 3));
  const goToPrevStep = () => setStep((current) => (current === 3 ? 2 : 1));

  const selectTemplateOption = (option: "empty" | "previous") => {
    setSelectedTemplateOption(option);
    setFloors(option === "empty" ? buildDefaultFloors() : [{ floor: "현재 강의실", rooms: [...activeTemplate.roomsByDay[0].rooms] }]);
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
    const template: TimetableTemplate = {
      id: editingTemplateId ?? `template-${Date.now()}`,
      title: form.name,
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
      roomsByDay: weekDayNames.map((name) => ({ name, rooms: floors.flatMap((floor) => floor.rooms) })),
      classes: editingTemplateId ? activeTemplate.classes : [],
      slotMinutes: slot,
    };

    setTemplates((current) => editingTemplateId ? current.map((item) => item.id === editingTemplateId ? template : item) : [...current, template]);
    onFinish(template);
    setStep(null);
  };

  return {
    addFloor,
    addRoom,
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
