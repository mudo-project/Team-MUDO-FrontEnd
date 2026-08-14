# Revenue Report(AI 매출 브리핑) Domain — CONTEXT
> 배치 경로: `src/feature/revenue-report/CONTEXT.md`
> 목적: 이 문서를 읽은 사람 또는 AI 에이전트가 매출 리포트 도메인이 **무엇을 하는 도메인이고, 어떤 기능이 있으며, 어떤 조각으로 이루어져 있는지** 파악할 수 있게 한다.
> 구현 상태: **정적 UI 단계**. 화면 구성 요소는 고정된 예시 데이터로 렌더링하며 상태·이벤트는 없다. `type.ts`/`service`/`actions`는 준비되어 있지만 화면에서는 아직 호출하지 않는다.

---

## 1. 개요

AI(Gemini)가 매월 학원의 매출·지출·순이익을 집계해 서술형 리포트로 생성하면, 원장(`ACADEMY:OWNER` 권한 계정)이 월별로 리포트를 조회하는 도메인.

리포트 1건은 대상 월의 AI 서술 텍스트(`report`)와 집계 숫자 스냅샷(`dataSnapshot`)으로 구성된다. 목록에서 월을 선택하면 상세 화면에서 서술 텍스트와 함께 매출/지출/순이익 요약, 전월 대비, 지출 카테고리 분포, 강의·강사별 매출을 확인할 수 있다.

### 핵심 제약

- 모든 API 엔드포인트 권한은 `ACADEMY:OWNER` 하나뿐이다. 화면·컴포넌트 단위의 권한 분기는 아직 없다.
- 리포트는 월간 배치로 쌓이는 데이터라 목록에 페이지네이션이 없다.
- 상세 조회는 최초 조회 시 자동으로 읽음 처리되는 부수효과가 있다(`read_at`은 한 번만 채워짐) — 화면에는 읽음/안읽음 배지로만 반영된다.
- `dataSnapshot`은 백엔드가 내려주는 JSON 문자열이며, 프론트에서 파싱해 사용한다. 구조:
  ```
  {
    targetMonth: string,
    revenue: { expected: number, actual: number },
    expense: { actual: number, byCategory: [{ category: string, amount: number }] },
    profit: { actual: number, expected: number },
    previousMonth: { available: boolean, revenue?: { actual: number }, profit?: { actual: number } },
    byLecture: [{ lectureName: string, teacherName: string, studentCount: number, actualRevenue: number }],
    byTeacher: [{ teacherName: string, lectureCount: number, studentCount: number, actualRevenue: number }],
  }
  ```
  `previousMonth.available`이 `true`일 때 `revenue.actual`/`profit.actual`이 채워진다고 가정한 구조다 — 실제 API 연동 단계에서 백엔드 응답으로 재확인이 필요하다. 증감율은 API 필드가 아니라 프론트에서 두 실적값을 비교해 계산한다.
- `expense.byCategory`의 `category`는 확정된 enum이 아니라 서버가 내려주는 문자열이다. `BOOK`(도서비), `FACILITY`(시설비) 두 값만 한글 라벨로 매핑하고, 그 외 값은 원문 문자열을 그대로 표시한다.
- 안읽은 리포트 수 조회(`GET /api/revenue-reports/unread-count`) API는 명세에 존재하지만, 사이드바에 이 도메인 메뉴가 아직 없어 배지 등으로 소비하는 화면이 없다.

### 진입점

사이드바에 노출되지 않는다. `/revenue-report`, `/revenue-report/{reportId}` 경로로 직접 접근하는 화면만 존재한다.

---

## 2. 용어

| 용어 | 정의 |
|---|---|
| **매출 리포트 목록** | 대상 월 최신순으로 리포트를 나열하는 화면. 항목마다 안읽음 배지를 표시 |
| **매출 리포트 상세** | 리포트 1건의 AI 서술 텍스트와 집계 스냅샷을 보여주는 화면 |
| **AI 서술 리포트** | 상세 화면 상단에서 강조 표시되는, AI가 생성한 한국어 서술 텍스트 영역 |
| **매출 요약 타일** | 예상/실제 매출, 지출, 예상/실제 순이익을 나열하는 스탯 카드 영역 |
| **전월 대비 영역** | 이번 달 실매출·실순이익을 전월과 비교하는 영역. 비교 데이터가 없으면 안내 문구로 대체 |
| **지출 카테고리 차트** | `expense.byCategory`를 막대 그래프로 보여주는 영역 |
| **강의별 매출 테이블** | `byLecture`를 매출 순으로 나열하는 표 |
| **강사별 매출 테이블** | `byTeacher`를 매출 순으로 나열하는 표 |

---

## 3. 화면 구성

```
┌─ 매출 리포트 목록 화면 ──────────────────────────┐
│ [Header] AI 매출 브리핑                          │
├──────────────────────────────────────────────────┤
│ [목록]                                            │
│  ● 2026년 8월                       안읽음        │
│    2026년 7월                                     │
│    2026년 6월                                     │
└──────────────────────────────────────────────────┘

┌─ 매출 리포트 상세 화면 ──────────────────────────┐
│ [← 목록] 2026년 8월 매출 리포트                   │
├──────────────────────────────────────────────────┤
│ [AI 서술 리포트]                                  │
│  "원장님, 안녕하세요! ..."                        │
├──────────────────────────────────────────────────┤
│ [매출 요약 타일] 예상매출 실매출 지출 예상/실순이익 │
├──────────────────────────────────────────────────┤
│ [전월 대비] 이번달 vs 전월 매출·순이익 비교 바      │
├──────────────────────────────────────────────────┤
│ [지출 카테고리 차트]  도서비 ▓▓▓  시설비 ▓▓▓▓▓     │
├──────────────────────────────────────────────────┤
│ [강의별 매출 테이블]  [강사별 매출 테이블]          │
└──────────────────────────────────────────────────┘
```

### 컴포넌트

- `src/feature/revenue-report/components/RevenueReportList.tsx` — 목록 컨테이너, 항목을 `RevenueReportListItem`으로 나열
- `src/feature/revenue-report/components/RevenueReportListItem.tsx` — 목록 행 1개(대상 월, 안읽음 배지)
- `src/feature/revenue-report/components/RevenueReportDetail.tsx` — 상세 화면 컨테이너, 하위 섹션을 조합
- `src/feature/revenue-report/components/RevenueSummaryTiles.tsx` — 매출 요약 타일
- `src/feature/revenue-report/components/RevenuePreviousMonthCompare.tsx` — 전월 대비 영역
- `src/feature/revenue-report/components/RevenueCategoryChart.tsx` — 지출 카테고리 막대 그래프(`recharts`, 클라이언트 컴포넌트)
- `src/feature/revenue-report/components/RevenueLectureTable.tsx` — 강의별 매출 테이블
- `src/feature/revenue-report/components/RevenueTeacherTable.tsx` — 강사별 매출 테이블

### 라우트

- `src/app/(user)/revenue-report/page.tsx` — 목록 화면 서버 컴포넌트
- `src/app/(user)/revenue-report/[reportId]/page.tsx` — 상세 화면 서버 컴포넌트

### 데이터 연동 계층

- `src/feature/revenue-report/type.ts` — 요청/응답 인터페이스. `export` 없이 선언되어 프로젝트 전역에서 import 없이 바로 참조된다. `RevenueSnapshot`은 `dataSnapshot` 문자열을 `JSON.parse`한 뒤의 구조를 나타낸다.
- `src/service/revenue-report.service.ts` — `fetchWithAuth` 기반 API 호출(`getRevenueReportList`, `getRevenueReportDetail`, `getRevenueReportUnreadCount`).
- `src/feature/revenue-report/actions.ts` — 위 service를 감싼 Server Action(`getRevenueReportListAction`, `getRevenueReportDetailAction`, `getRevenueReportUnreadCountAction`). 컴포넌트는 이 액션만 호출하고 service를 직접 부르지 않는다.
- 세 API 모두 조회 전용이라 별도의 실패 상태 객체(`{ success, message }`) 없이 데이터 또는 예외를 그대로 반환한다. 호출부(페이지 컴포넌트)가 `try/catch`로 에러 상태를 판단한다.
