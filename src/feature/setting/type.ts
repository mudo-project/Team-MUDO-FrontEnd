// 현재 접속 IP 조회 응답 데이터값
interface CurrentIpData {
    ipAddress: string;
}

// 현재 접속 IP 조회 응답값
interface CurrentIpResponse {
    status: number;
    code: string;
    message: string;
    data: CurrentIpData;
}

// 와이파이 IP 등록 요청값
interface WifiIpCreateRequest {
    confirmedIpAddress: string;
    note: string;
}

// 와이파이 IP 등록 응답 데이터값
interface WifiIpCreateData {
    wifiIpId: number;
    ipAddress: string;
    note: string;
}

// 와이파이 IP 등록 응답값
interface WifiIpCreateResponse {
    status: number;
    code: string;
    message: string;
    data: WifiIpCreateData;
}

// 와이파이 IP 목록조회 응답 항목
interface WifiIpListItemData {
    wifiIpId: number;
    ipAddress: string;
    note: string;
    createdAt: string;
}

// 와이파이 IP 목록조회 응답값
interface WifiIpListResponse {
    status: number;
    code: string;
    message: string;
    data: WifiIpListItemData[];
}

// 근무시간 정책의 요일별 설정
interface WorkingHoursWeekday {
    dayOfWeek: number;
    isWorkday: boolean;
    startTime: string | null;
    endTime: string | null;
}

// 근무시간 정책 저장 요청값
interface WorkingHoursPolicySaveRequest {
    defaultStartTime: string;
    defaultEndTime: string;
    lateGraceMinutes: number;
    weekdayExceptionEnabled: boolean;
    weekdays: WorkingHoursWeekday[];
}

// 근무시간 정책 저장 응답 데이터값
interface WorkingHoursSaveData {
    policyId: number;
    defaultStartTime: string;
    defaultEndTime: string;
    lateGraceMinutes: number;
    weekdayExceptionEnabled: boolean;
    weekdays: WorkingHoursWeekday[];
}

// 근무시간 정책 저장 응답값
interface WorkingHoursSaveResponse {
    status: number;
    code: string;
    message: string;
    data: WorkingHoursSaveData;
}
