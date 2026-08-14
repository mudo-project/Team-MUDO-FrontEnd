import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 매출 리포트 목록조회 API
export const getRevenueReportList = async (): Promise<RevenueReportListItemData[]> => {
    const response = await fetchWithAuth("/api/revenue-reports");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "매출 리포트 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as RevenueReportListResponse;

    return resData.data;
}

// 매출 리포트 상세조회 API
export const getRevenueReportDetail = async (reportId: number): Promise<RevenueReportDetailData> => {
    const response = await fetchWithAuth(`/api/revenue-reports/${reportId}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "매출 리포트 상세 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as RevenueReportDetailResponse;

    return resData.data;
}

// 안읽은 매출 리포트 수 조회 API
export const getRevenueReportUnreadCount = async (): Promise<number> => {
    const response = await fetchWithAuth("/api/revenue-reports/unread-count");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "안읽은 매출 리포트 수 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as RevenueReportUnreadCountResponse;

    return resData.data.unreadCount;
}
