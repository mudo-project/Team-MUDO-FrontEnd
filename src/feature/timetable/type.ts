// 요일
type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

// 시간표 세트 상태
type TimetableSetStatus = "PLANNED" | "ACTIVE" | "ENDED";

// 수업 슬롯 종류
type TimetableClassType = "CLASS" | "SPECIAL" | "CLINIC" | "STANDING" | "EXAM";

// 학년 (초1~고3 고정 12단계)
type Grade =
    | "ELEMENTARY_1" | "ELEMENTARY_2" | "ELEMENTARY_3" | "ELEMENTARY_4" | "ELEMENTARY_5" | "ELEMENTARY_6"
    | "MIDDLE_1" | "MIDDLE_2" | "MIDDLE_3"
    | "HIGH_1" | "HIGH_2" | "HIGH_3";

// 수업 슬롯 수정·삭제 적용 범위 (현재는 ALL만 처리됨)
type TimetableSlotUpdateScope = "THIS_OCCURRENCE" | "FROM_NOW" | "ALL";

// 층별 강의실 구성
interface TimetableClassroomGroup {
    floor: string;
    codes: string[];
}

// 시간표 세트 생성 요청값
interface TimetableSetCreateRequest {
    name: string;
    startDate: string;
    endDate: string;
    operatingStartTime: string;
    operatingEndTime: string;
    operatingDays: DayOfWeek[];
    slotUnitMinutes: number;
    classrooms: TimetableClassroomGroup[];
}

// 시간표 세트 생성 응답 데이터
interface TimetableSetCreateData {
    timetableSetId: number;
}

// 시간표 세트 생성 응답값
interface TimetableSetCreateResponse {
    status: number;
    code: string;
    message: string;
    data: TimetableSetCreateData;
}

// 시간표 세트 수정 요청값 (생성과 동일한 필드 구성, 전체 교체)
interface TimetableSetUpdateRequest {
    name: string;
    startDate: string;
    endDate: string;
    operatingStartTime: string;
    operatingEndTime: string;
    operatingDays: DayOfWeek[];
    slotUnitMinutes: number;
    classrooms: TimetableClassroomGroup[];
}

// 시간표 세트 목록조회 데이터
interface TimetableSetListData {
    timetableSetId: number;
    name: string;
    startDate: string;
    endDate: string;
    status: TimetableSetStatus;
}

// 시간표 세트 목록조회 응답값
interface TimetableSetListResponse {
    status: number;
    code: string;
    message: string;
    data: TimetableSetListData[];
}

// 시간표 세트 상세조회 데이터
interface TimetableSetDetailData {
    timetableSetId: number;
    name: string;
    startDate: string;
    endDate: string;
    operatingStartTime: string;
    operatingEndTime: string;
    operatingDays: DayOfWeek[];
    slotUnitMinutes: number;
    classrooms: TimetableClassroomGroup[];
    status: TimetableSetStatus;
}

// 시간표 세트 상세조회 응답값
interface TimetableSetDetailResponse {
    status: number;
    code: string;
    message: string;
    data: TimetableSetDetailData;
}

// 수업 슬롯 등록 요청값
interface TimetableSlotCreateRequest {
    classType: TimetableClassType;
    dayOfWeek: DayOfWeek;
    classroomCode: string;
    startTime: string;
    endTime: string;
    grade: Grade;
    teacherName?: string;
    subjectName?: string;
}

// 수업 슬롯 등록 응답 데이터
interface TimetableSlotCreateData {
    timetableSlotId: number;
}

// 수업 슬롯 등록 응답값
interface TimetableSlotCreateResponse {
    status: number;
    code: string;
    message: string;
    data: TimetableSlotCreateData;
}

// 수업 슬롯 수정 요청값
interface TimetableSlotUpdateRequest {
    scope: TimetableSlotUpdateScope;
    classType: TimetableClassType;
    dayOfWeek: DayOfWeek;
    classroomCode: string;
    startTime: string;
    endTime: string;
    grade: Grade;
    teacherName?: string;
    subjectName?: string;
}

// 수업 슬롯 목록조회·상세조회 공용 데이터값
interface TimetableSlotData {
    timetableSlotId: number;
    classType: TimetableClassType;
    dayOfWeek: DayOfWeek;
    classroomCode: string;
    startTime: string;
    endTime: string;
    grade: Grade;
    teacherName: string | null;
    subjectName: string | null;
}

// 수업 슬롯 목록조회 응답값
interface TimetableSlotListResponse {
    status: number;
    code: string;
    message: string;
    data: TimetableSlotData[];
}

// 수업 슬롯 상세조회 응답값
interface TimetableSlotDetailResponse {
    status: number;
    code: string;
    message: string;
    data: TimetableSlotData;
}

// 시간표 세트 내보내기 포맷
type TimetableExportFormat = "EXCEL" | "PDF" | "PNG";

// 시간표 세트 내보내기 배경색 기준
type TimetableExportColorCriterion = "CLASSROOM" | "TEACHER";

// 시간표 세트 내보내기 행 밀도
type TimetableExportDensity = "COMPACT" | "NORMAL" | "SPACIOUS";

// 시간표 세트 내보내기 요청 파라미터
interface TimetableExportParams {
    format: TimetableExportFormat;
    colorCriterion: TimetableExportColorCriterion;
    colorMap: Record<string, string>;
    density?: TimetableExportDensity;
    dayOfWeek?: DayOfWeek;
    floor?: string;
    classType?: TimetableClassType;
}
