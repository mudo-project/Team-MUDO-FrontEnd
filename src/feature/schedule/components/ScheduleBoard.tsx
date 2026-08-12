"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import ScheduleCalendar from "./ScheduleCalendar";
import ScheduleList from "./ScheduleList";
import ScheduleCreateForm, { type ScheduleFormSubmitValues } from "./ScheduleCreateForm";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleDeleteConfirmModal from "./ScheduleDeleteConfirmModal";
import { createScheduleAction, deleteScheduleAction, getScheduleListAction, updateScheduleAction } from "../actions";
import { toScheduleEvent, toScheduleRequestPayload } from "../scheduleFormat";
import type { ScheduleEvent } from "../scheduleTypes";

type FormState = { mode: "create" } | { mode: "edit"; event: ScheduleEvent } | null;

export default function ScheduleBoard() {
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [formState, setFormState] = useState<FormState>(null);
  const [detailEvent, setDetailEvent] = useState<ScheduleEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScheduleEvent | null>(null);

  const queryClient = useQueryClient();
  const yearMonth = format(month, "yyyy-MM");
  const queryKey = ["schedule", yearMonth];

  const {
    data: events = [],
    isPending,
    isError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const list = await getScheduleListAction({ yearMonth });
      return list.map(toScheduleEvent);
    },
    retry: false,
  });

  const invalidateSchedule = () => {
    void queryClient.invalidateQueries({ queryKey });
  };

  const createMutation = useMutation({
    mutationFn: (values: ScheduleFormSubmitValues) => createScheduleAction(toScheduleRequestPayload(values)),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      invalidateSchedule();
      setFormState(null);
      toast.success(result.message);
    },
    onError: () => toast.error("일정 등록에 실패하였습니다."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ eventId, values }: { eventId: number; values: ScheduleFormSubmitValues }) =>
      updateScheduleAction(eventId, toScheduleRequestPayload(values)),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      invalidateSchedule();
      setFormState(null);
      toast.success(result.message);
    },
    onError: () => toast.error("일정 수정에 실패하였습니다."),
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId: number) => deleteScheduleAction(eventId),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      invalidateSchedule();
      setDeleteTarget(null);
      toast.success(result.message);
    },
    onError: () => toast.error("일정 삭제에 실패하였습니다."),
  });

  const handleFormSubmit = (values: ScheduleFormSubmitValues) => {
    if (formState?.mode === "edit") {
      updateMutation.mutate({ eventId: formState.event.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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

          {isPending ? (
            <section className="flex min-w-0 items-center justify-center rounded-xl border border-[#DCE9DF] bg-white p-5 text-[13px] text-[#718096]">
              일정을 불러오는 중입니다.
            </section>
          ) : isError ? (
            <section className="flex min-w-0 items-center justify-center rounded-xl border border-[#DCE9DF] bg-white p-5 text-[13px] text-[#C65A50]">
              일정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </section>
          ) : (
            <ScheduleList
              events={events}
              month={month}
              selectedDate={selectedDate}
              onClearSelectedDate={() => setSelectedDate(undefined)}
              onSelectEvent={setDetailEvent}
            />
          )}
        </div>
      </div>

      {formState && (
        <ScheduleCreateForm
          initialDate={selectedDate ?? month}
          isSubmitting={isSubmitting}
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
          isDeleting={deleteMutation.isPending}
          title={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        />
      )}
    </>
  );
}
