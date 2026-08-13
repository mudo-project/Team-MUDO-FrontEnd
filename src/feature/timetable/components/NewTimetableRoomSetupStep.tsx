import type { FloorConfig } from "@/feature/timetable/viewModel";

type NewTimetableRoomSetupStepProps = {
  floors: FloorConfig[];
  newRoomNames: Record<number, string>;
  onAddFloor: () => void;
  onAddRoom: (floorIndex: number) => void;
  onChangeNewRoomName: (floorIndex: number, value: string) => void;
  onRemoveRoom: (floorIndex: number, room: string) => void;
};

export default function NewTimetableRoomSetupStep({
  floors,
  newRoomNames,
  onAddFloor,
  onAddRoom,
  onChangeNewRoomName,
  onRemoveRoom,
}: NewTimetableRoomSetupStepProps) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_160px] gap-3 overflow-y-auto scrollbar-hide px-5 py-4">
      <div className="space-y-3">
        {floors.map((floor, floorIndex) => {
          const newRoomName = newRoomNames[floorIndex]?.trim() ?? "";
          const isDuplicate = floor.rooms.includes(newRoomName);

          return (
            <section className="rounded-lg bg-[#F3F6F4] p-3" key={floor.floor}>
              <div className="flex items-center justify-between">
                <span className="rounded-md border border-[#DCE9DF] bg-white px-3 py-1 text-sm text-[#526071]">{floor.floor}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">{floor.rooms.map((room) => 
                  <span 
                    className="inline-flex items-center gap-1 rounded-full border border-[#DCE9DF] bg-white py-1 pl-3 pr-1 text-[12px] text-[#526071]" 
                    key={room}
                  >
                    {room}
                    <button 
                      aria-label={`${room} 제거`} 
                      className="flex size-5 items-center justify-center rounded-full text-[#94A3B8] hover:bg-[#EEF2F6]"
                      onClick={() => onRemoveRoom(floorIndex, room)} type="button"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <input 
                  aria-label={`${floor.floor} 호실 이름`}
                  className="h-8 min-w-0 flex-1 rounded-md border border-[#DCE9DF] bg-white px-2 text-[12px] text-[#526071] outline-none"
                  onChange={(event) => onChangeNewRoomName(floorIndex, event.target.value)}
                  placeholder="예: 302" 
                  value={newRoomNames[floorIndex] ?? ""}
                />
                  <button 
                    className="rounded-md bg-white px-3 py-1 text-[12px] text-[#718096] disabled:cursor-not-allowed disabled:opacity-40" 
                    disabled={!newRoomName || isDuplicate} 
                    onClick={() => onAddRoom(floorIndex)} 
                    type="button"
                  >
                    + 호수 추가
                  </button>
                </div>
              {isDuplicate && <p className="mt-1 text-[11px] text-[#C46A62]">이미 추가된 호실입니다.</p>}
            </section>
          );
        })}
        <button 
          className="h-11 w-full rounded-lg border border-dashed border-[#DCE9DF] text-sm text-[#718096]" 
          onClick={onAddFloor} 
          type="button"
        >
          + 층 추가
        </button>
      </div>
      <aside className="rounded-lg bg-[#F3F6F4] p-3">
        <strong className="text-sm text-[#273548]">미리보기</strong>
        <div className="mt-3 space-y-3 text-[12px] text-[#718096]">
          {floors.map((floor) => 
            <div key={floor.floor}>
              <span className="block font-semibold">{floor.floor}</span>
              <div className="mt-1 flex flex-wrap gap-1">{floor.rooms.map((room) => 
                <span className="bg-[#DCE9DF] px-1.5 py-0.5" key={room}>{room}</span>)}
              </div>
            </div>
          )}
          <span className="block">총 {floors.reduce((count, floor) => count + floor.rooms.length, 0)}개 강의실</span>
        </div>
      </aside>
    </div>
  );
}
