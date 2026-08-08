import type { ScheduleEvent } from "../dummySchedules";

type ScheduleListItemProps = {
  event: ScheduleEvent;
};

export default function ScheduleListItem({ event }: ScheduleListItemProps) {
  return (
    <li
      className="rounded-lg border-b border-[#E5EEE7] py-2.5 pl-3 last:border-b-0"
      style={{ borderLeft: `3px solid ${event.color}` }}
    >
      <strong className="block break-words text-[13px] font-semibold">{event.title}</strong>
      <time className="mt-1 block text-[11px] text-[#718096]">{event.detail}</time>
    </li>
  );
}
