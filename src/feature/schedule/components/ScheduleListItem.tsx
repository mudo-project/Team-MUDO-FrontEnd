import { formatEventRangeSummary } from "../scheduleFormat";
import type { ScheduleEvent } from "../scheduleTypes";

type ScheduleListItemProps = {
  event: ScheduleEvent;
  onClick: () => void;
};

export default function ScheduleListItem({ event, onClick }: ScheduleListItemProps) {
  return (
    <li className="rounded-lg border-b border-[#E5EEE7] last:border-b-0">
      <button
        className="w-full rounded-lg py-2.5 pl-3 text-left hover:bg-[#F8FAF9]"
        style={{ borderLeft: `3px solid ${event.color.accent}` }}
        type="button"
        onClick={onClick}
      >
        <strong className="block break-words text-[13px] font-semibold">{event.title}</strong>
        <time className="mt-1 block text-[11px] text-[#718096]">{formatEventRangeSummary(event)}</time>
      </button>
    </li>
  );
}
