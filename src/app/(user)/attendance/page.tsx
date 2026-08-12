import AttendanceBoard from "@/feature/attendance/components/AttendanceBoard";

export const dynamic = "force-dynamic";

export default function AttendancePage() {
  return <AttendanceBoard initialNow={new Date().toISOString()} />;
}
