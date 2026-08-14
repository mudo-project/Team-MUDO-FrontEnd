// 매출 리포트 목록 항목
interface RevenueReportListItemData {
    reportId: number;
    targetMonth: string;
    read: boolean;
}

// 매출 리포트 목록조회 응답값
interface RevenueReportListResponse {
    status: number;
    code: string;
    message: string;
    data: RevenueReportListItemData[];
}

// 매출 리포트 집계 스냅샷 · 지출 카테고리 항목
interface RevenueSnapshotCategoryAmount {
    category: string;
    amount: number;
}

// 매출 리포트 집계 스냅샷 · 전월 대비
interface RevenueSnapshotPreviousMonth {
    available: boolean;
    revenue?: { actual: number };
    profit?: { actual: number };
}

// 매출 리포트 집계 스냅샷 · 강의별 매출
interface RevenueSnapshotLecture {
    lectureName: string;
    teacherName: string;
    studentCount: number;
    actualRevenue: number;
}

// 매출 리포트 집계 스냅샷 · 강사별 매출
interface RevenueSnapshotTeacher {
    teacherName: string;
    lectureCount: number;
    studentCount: number;
    actualRevenue: number;
}

// 매출 리포트 집계 스냅샷(dataSnapshot 파싱 결과)
interface RevenueSnapshot {
    targetMonth: string;
    revenue: { expected: number; actual: number };
    expense: { actual: number; byCategory: RevenueSnapshotCategoryAmount[] };
    profit: { actual: number; expected: number };
    previousMonth: RevenueSnapshotPreviousMonth;
    byLecture: RevenueSnapshotLecture[];
    byTeacher: RevenueSnapshotTeacher[];
}

// 매출 리포트 상세조회 응답 데이터값
interface RevenueReportDetailData {
    reportId: number;
    targetMonth: string;
    report: string;
    dataSnapshot: string;
}

// 매출 리포트 상세조회 응답값
interface RevenueReportDetailResponse {
    status: number;
    code: string;
    message: string;
    data: RevenueReportDetailData;
}

// 안읽은 매출 리포트 수 조회 응답 데이터값
interface RevenueReportUnreadCountData {
    unreadCount: number;
}

// 안읽은 매출 리포트 수 조회 응답값
interface RevenueReportUnreadCountResponse {
    status: number;
    code: string;
    message: string;
    data: RevenueReportUnreadCountData;
}
