"use client";

import { useState } from "react";
import ScheduleCalendar from "./ScheduleCalendar";
import ScheduleList from "./ScheduleList";
import ScheduleCreateForm, { type ScheduleFormSubmitValues } from "./ScheduleCreateForm";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleDeleteConfirmModal from "./ScheduleDeleteConfirmModal";
import { scheduleEvents as initialScheduleEvents, type ScheduleEvent } from "../dummySchedules";

type FormState = { mode: "create" } | { mode: "edit"; event: ScheduleEvent } | null;

function formatToday(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export default function ScheduleBoard() {
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [events, setEvents] = useState<ScheduleEvent[]>(initialScheduleEvents);
  const [formState, setFormState] = useState<FormState>(null);
  const [detailEvent, setDetailEvent] = useState<ScheduleEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScheduleEvent | null>(null);

  const handleFormSubmit = (values: ScheduleFormSubmitValues) => {
    if (formState?.mode === "edit") {
      const editingEvent = formState.event;
      setEvents((prev) => prev.map((event) => (event.id === editingEvent.id ? { ...event, ...values } : event)));
    } else {
      const newEvent: ScheduleEvent = { ...values, id: Date.now(), createdAt: formatToday() };
      setEvents((prev) => [...prev, newEvent]);
    }
    setFormState(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setEvents((prev) => prev.filter((event) => event.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="mx-auto h-full w-full max-w-[1530px]">
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:h-full xl:grid-cols-[minmax(0,1fr)_384px] xl:overflow-hidden">
          <ScheduleCalendar
            events={events}
            month={month}
            selectedDate={selectedDate}
            onAddClick={() => setFormState({ mode: "create" })}
            onChangeMonth={setMonth}
            onSelectDate={setSelectedDate}
          />

          <ScheduleList
            events={events}
            month={month}
            selectedDate={selectedDate}
            onClearSelectedDate={() => setSelectedDate(undefined)}
            onSelectEvent={setDetailEvent}
          />
        </div>
      </div>

      {formState && (
        <ScheduleCreateForm
          initialDate={selectedDate ?? month}
          mode={formState.mode}
          schedule={formState.mode === "edit" ? formState.event : undefined}
          onCancel={() => setFormState(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {detailEvent && (
        <ScheduleDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onDelete={() => {
            setDeleteTarget(detailEvent);
            setDetailEvent(null);
          }}
          onEdit={() => {
            setFormState({ mode: "edit", event: detailEvent });
            setDetailEvent(null);
          }}
        />
      )}

      {deleteTarget && (
        <ScheduleDeleteConfirmModal
          title={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}
