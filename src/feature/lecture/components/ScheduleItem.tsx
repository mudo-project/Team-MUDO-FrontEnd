export default function ScheduleItem({ schedule }: { schedule: any }) {
    const [day, time] = schedule.split(" ");
    return (
        <span className="block text-[12px] leading-[18px]" key={schedule}>
            <strong className="font-semibold text-[#0F172A]">{day}</strong>{" "}
            <span className="text-[#64748B]">{time}</span>
        </span>
    );
}