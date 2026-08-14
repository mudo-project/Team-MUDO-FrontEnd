'use server'

import {
    getRevenueReportDetail,
    getRevenueReportList,
    getRevenueReportUnreadCount,
} from "@/service/revenue-report.service";

// 매출 리포트 목록조회 액션
export const getRevenueReportListAction = async (): Promise<RevenueReportListItemData[]> => {
    return getRevenueReportList();
}

// 매출 리포트 상세조회 액션
export const getRevenueReportDetailAction = async (reportId: number): Promise<RevenueReportDetailData> => {
    return getRevenueReportDetail(reportId);
}

// 안읽은 매출 리포트 수 조회 액션
export const getRevenueReportUnreadCountAction = async (): Promise<number> => {
    return getRevenueReportUnreadCount();
}
