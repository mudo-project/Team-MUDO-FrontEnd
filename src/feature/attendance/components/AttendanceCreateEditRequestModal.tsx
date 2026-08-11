"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  EDIT_REQUEST_TYPE_LABEL,
  dateToTimeValue,
  formatDateWithWeekday,
  formatTime,
  generateTimeOptions,
  type AttendanceRecordState,
  type EditRequestType,
} from "../attendanceDemo";

const REQUEST_TYPES: EditRequestType[] = ["clockIn", "clockOut", "missing", "note"];
const TIME_OPTIONS = generateTimeOptions();

type AttendanceCreateEditRequestModalProps = {
  date: Date;
  record: AttendanceRecordState;
  onCancel: () => void;
  onSubmit: (type: EditRequestType, changeSummary: string, reason: string) => void;
};

export default function AttendanceCreateEditRequestModal({ date, record, onCancel, onSubmit }: AttendanceCreateEditRequestModalProps) {
  const [type, setType] = useState<EditRequestType>("clockIn");
  const [clockInTime, setClockInTime] = useState(record.clockInAt ? dateToTimeValue(record.clockInAt) : "09:00");
  const [clockOutTime, setClockOutTime] = useState(record.clockOutAt ? dateToTimeValue(record.clockOutAt) : "18:00");
  const [missingClockInTime, setMissingClockInTime] = useState("09:00");
  const [missingClockOutTime, setMissingClockOutTime] = useState("18:00");
  const [noteContent, setNoteContent] = useState(record.clockInNote || record.clockOutNote || "");
  const [reason, setReason] = useState("");

  const canSubmit = reason.trim().length > 0;
  const currentClockIn = record.clockInAt ? formatTime(record.clockInAt) : "--:--";
  const currentClockOut = record.clockOutAt ? formatTime(record.clockOutAt) : "--:--";

  function handleSubmit() {
    if (!canSubmit) return;

    let changeSummary = "";

    if (type === "clockIn") {
      changeSummary = `출근 ${currentClockIn} → ${clockInTime}`;
    } else if (type === "clockOut") {
      changeSummary = `퇴근 ${currentClockOut} → ${clockOutTime}`;
    } else if (type === "missing") {
      changeSummary = `출근 ${missingClockInTime} · 퇴근 ${missingClockOutTime} 추가`;
    } else {
      changeSummary = `비고 수정: "${noteContent.trim() || "(내용 없음)"}"`;
    }

    onSubmit(type, changeSummary, reason.trim());
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="w-full max-w-[440px] rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#172033]">근태 수정 요청</h2>
          <button 
            aria-label="닫기" 
            className="text-[#94A3B8] hover:text-[#64748B]" 
            type="button" 
            onClick={onCancel}
          >
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#344054]">
          <p className="font-medium">{formatDateWithWeekday(date)}</p>
          <p className="mt-1 text-[12px] text-[#718096]">
            현재 기록: 출근 {currentClockIn} · 퇴근 {currentClockOut}
          </p>
        </div>

        <fieldset className="mt-4">
          <legend className="text-[12px] font-medium text-[#344054]">요청 구분</legend>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[#344054]">
            {REQUEST_TYPES.map((option) => (
              <label className="flex items-center gap-1.5" key={option}>
                <input
                  checked={type === option}
                  className="size-3.5 accent-[#172033]"
                  name="attendance-edit-request-type"
                  type="radio"
                  value={option}
                  onChange={() => setType(option)}
                />
                {EDIT_REQUEST_TYPE_LABEL[option]}
              </label>
            ))}
          </div>
        </fieldset>

        {(type === "clockIn" || type === "clockOut") && (
          <div className="mt-4">
            <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-time">
              요청 시각
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-[#172033] outline-none focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
              id="attendance-edit-request-time"
              value={type === "clockIn" ? clockInTime : clockOutTime}
              onChange={(event) => (type === "clockIn" ? setClockInTime(event.target.value) : setClockOutTime(event.target.value))}
            >
              {TIME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === "missing" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-missing-in">
                출근 시간
              </label>
              <select
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-[#172033] outline-none focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
                id="attendance-edit-request-missing-in"
                value={missingClockInTime}
                onChange={(event) => setMissingClockInTime(event.target.value)}
              >
                {TIME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-missing-out">
                퇴근 시간
              </label>
              <select
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-[#172033] outline-none focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
                id="attendance-edit-request-missing-out"
                value={missingClockOutTime}
                onChange={(event) => setMissingClockOutTime(event.target.value)}
              >
                {TIME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {type === "note" && (
          <div className="mt-4">
            <p className="text-[12px] font-medium text-[#344054]">현재 비고 내용</p>
            <p className="mt-1 rounded-lg bg-[#F8FAFC] px-3 py-2 text-[13px] text-[#718096]">
              {record.clockInNote || record.clockOutNote || "등록된 비고가 없습니다"}
            </p>
            <label className="mt-3 block text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-note">
              수정할 비고 내용
            </label>
            <textarea
              className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
              id="attendance-edit-request-note"
              value={noteContent}
              onChange={(event) => setNoteContent(event.target.value)}
            />
          </div>
        )}

        <div className="mt-4">
          <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-reason">
            사유 (필수)
          </label>
          <textarea
            className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
            id="attendance-edit-request-reason"
            placeholder="수정이 필요한 사유를 구체적으로 입력해주세요"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <p className="mt-2 text-[11px] text-[#94A3B8]">요청일시는 자동으로 기록되며, 관리자 승인 후 반영됩니다</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#64748B]" type="button" onClick={onCancel}>
            취소
          </button>
          <button
            className="h-10 rounded-lg bg-[#172033] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            type="button"
            onClick={handleSubmit}
          >
            요청하기
          </button>
        </div>
      </div>
    </div>
  );
}
