// 일정 생성 요청값
interface ScheduleCreateRequest {
    title: string;
    content?: string;
    eventStartAt: string;
    eventEndAt?: string;
    allDay?: boolean;
    color?: string;
}

// 일정 생성 응답 데이터
interface ScheduleCreateData {
    eventId: number;
}

// 일정 생성 응답값
interface ScheduleCreateResponse {
    status: number;
    code: string;
    message: string;
    data: ScheduleCreateData;
}

// 일정 목록조회 요청 파라미터 (date, yearMonth 중 정확히 하나만 지정)
interface ScheduleListParams {
    date?: string;
    yearMonth?: string;
}

// 일정 목록조회·상세조회 공용 데이터값
interface ScheduleEventData {
    eventId: number;
    title: string;
    content: string | null;
    eventStartAt: string;
    eventEndAt: string | null;
    allDay: boolean;
    color: string | null;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
}

// 일정 목록조회 응답값
interface ScheduleListResponse {
    status: number;
    code: string;
    message: string;
    data: ScheduleEventData[];
}

// 일정 상세조회 응답값
interface ScheduleDetailResponse {
    status: number;
    code: string;
    message: string;
    data: ScheduleEventData;
}

// 일정 수정 요청값 (생성과 동일한 필드 구성, 전체 교체)
interface ScheduleUpdateRequest {
    title: string;
    content?: string;
    eventStartAt: string;
    eventEndAt?: string;
    allDay?: boolean;
    color?: string;
}
