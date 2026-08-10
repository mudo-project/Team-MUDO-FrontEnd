import { Pencil } from "lucide-react";
import ScheduleBoard from "@/feature/schedule/components/ScheduleBoard";

export default function SchedulePage() {
  return (
    <main className="h-[calc(100dvh-3.25rem)] overflow-y-auto bg-[#FCFCFC] px-5 py-6 text-[#172033] lg:px-6">
      <ScheduleBoard />

      <button
        aria-label="일정 메모 작성"
        className="fixed bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-[#12182B] text-white shadow-lg"
        type="button"
      >
        <Pencil className="size-5" strokeWidth={1.8} />
      </button>
    </main>
  );
}
