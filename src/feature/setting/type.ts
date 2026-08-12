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

// 구글 연동 상태
type GoogleConnectionStatus = "CONNECTED" | "EXPIRING" | "EXPIRED" | "FAILED";

// 구글 연동 상태 조회 응답 데이터값
interface GoogleConnectionData {
    googleEmail: string;
    connectedByUserId: number;
    scope: string;
    connectedAt: string;
    tokenExpiresAt: string;
    lastCheckedAt: string;
    status: GoogleConnectionStatus;
}

// 구글 연동 상태 조회 응답값 (연동 안 됨이면 data가 null)
interface GoogleConnectionResponse {
    status: number;
    code: string;
    message: string;
    data: GoogleConnectionData | null;
}

// 구글 계정 연동 시작(인가 URL 발급) 응답 데이터값
interface GoogleAuthorizationUrlData {
    authorizationUrl: string;
}

// 구글 계정 연동 시작(인가 URL 발급) 응답값
interface GoogleAuthorizationUrlResponse {
    status: number;
    code: string;
    message: string;
    data: GoogleAuthorizationUrlData;
}
