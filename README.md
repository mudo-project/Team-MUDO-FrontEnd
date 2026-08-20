# Mudo Frontend

> 대표·강사·조교·직원이 함께 쓰는 학원 그룹웨어의 프론트엔드입니다.
> 특정 학원 전용 커스텀이 아니라, 어느 학원이든 도입할 수 있는 제품 수준의 구조를 목표로 합니다.

<br />

## 🏫 Team MUDO

| 구분 | 내용 |
| --- | --- |
| 프로젝트명 | Mudo |
| Repository | [Team-MUDO-FrontEnd](https://github.com/mudo-project/Team-MUDO-FrontEnd) |
| Frontend | 2명 |
| Backend | 6명 |

---

## 📌 프로젝트 소개

**Mudo**는 학원 구성원(대표·강사·조교·직원)이 역할에 맞는 범위 안에서 학원 운영 업무와 조직 협업 업무를 처리하는 그룹웨어입니다.

출결·수강·급여·매출 같은 학원 운영 업무와, 공지·전자결재·메신저·워크스페이스 같은 조직 협업 업무를 하나의 서비스에서 다룹니다. 역할별로 접근 가능한 기능과 조회 가능한 데이터 범위가 다릅니다.

---

## ✨ 주요 기능

프론트엔드는 도메인 단위(`src/feature/<domain>`)로 구성되어 있으며, 도메인별 상세 내용은 각 `CONTEXT.md`에 정리되어 있습니다.

### 🏢 학원 운영

- 원생 정보 등록·조회·수정, 수강 강의 관리 (`student`)
- 강의 등록·조회·필터링(학년/요일/과목/선생님/강의실/학기) (`lecture`)
- 강의별 출석부, 학생 출결 상태 관리 및 문자 발송 (`rollbook`)
- 시간표 템플릿 생성, 요일·강의실 단위 수업 등록, 엑셀/PDF/PNG 내보내기 (`timetable`)
- AI(Gemini) 기반 월별 매출·지출·순이익 서술형 리포트 (`revenue-report`)

### 💼 인사·재무

- 출근/퇴근/초과근무 기록, 연가·근속일수 조회, 수정 요청 (`attendance`)
- 직원별 급여 계산·검토·확정, 급여명세서(PDF) 생성 및 이메일 발송 (`payroll`)
- 법인카드 사용내역 조회, 정산 상신 (`corporate-card`)
- 구성원 계정 조회·수정, 재직 상태 관리, 계정 생성 (`members`)
- 역할·권한 관리 (`role`)

### 🤝 조직 협업

- 전체 공지 등록·조회, 상단 고정 (`notice`)
- 캘린더 기반 일정 등록·수정·삭제 (`schedule`)
- 전자결재(상신 → 결재선 승인/반려), 결재 템플릿 (`approval`)
- 팀 단위 업무 관리, 업무 댓글, 반복 업무 템플릿 (`workspace`)
- 1:1/그룹 채팅, 채팅방 기반 업무카드 (`messenger`)
- 출결 상태별 문자 발송 템플릿 관리 (`message`)
- 화면 어디서나 열 수 있는 개인 메모 (`memo`)
- 멘션·결재 차례 등 실시간 알림(WebSocket) 및 알림함 (`alarm`)
- Google Drive 연동 공유 자료함 (`shared-folder`)

### ⚙️ 계정·설정·시스템

- 로그인/인증 (`auth`), 내 정보 관리 (`mypage`)
- 근무시간, 와이파이 IP, 급여 지급일, 알림, 구글 계정 연동 (`setting`)
- 학원(테넌트) 및 시스템 관리 (`superadmin`, `admin`)
- 학원별 서브도메인 라우팅 (`tenant-routing`)
- 서비스 소개 페이지 (`landing`)

---

## 🛠️ 기술 스택

| 구분 | 기술 |
| --- | --- |
| Framework | Next.js (App Router, Server Actions) |
| Library | React |
| Language | TypeScript |
| Styling | TailwindCSS, Radix UI, shadcn, Lucide React |
| Form/Validation | React Hook Form, Zod, @hookform/resolvers |
| State | Zustand |
| Server State | TanStack Query, Fetch API |
| Realtime | STOMP.js (WebSocket) |
| Auth | jwt-decode |
| Unit Test | Jest, Testing Library, jsdom |
| E2E Test | Playwright |
| Package Manager | npm |
| Deployment | Docker, Docker Compose |

---

## 🚀 프로젝트 실행 방법

### 1. 저장소 Clone

```bash
git clone https://github.com/mudo-project/Team-MUDO-FrontEnd.git
```

### 2. 프로젝트 폴더 이동

```bash
cd Team-MUDO-FrontEnd
```

### 3. 패키지 설치

```bash
npm install
```

### 4. 환경변수 설정

프로젝트 루트에 `.env`, `.env.local` 파일이 필요합니다. 값은 팀 내에서 별도로 공유받으며, GitHub에는 Push하지 않습니다.

### 5. 개발 서버 실행

```bash
npm run dev
```

로컬 접속 주소:

```text
http://localhost:3000
```

### 주요 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | 정적 검사(ESLint) |
| `npm test` | 단위/통합 테스트(Jest) |
| `npm run test:e2e` | E2E 테스트(Playwright) |
| `npm run analyze` | 번들 사이즈 분석 |

---

# 📋 Mudo 프론트엔드 코드 컨벤션

> 실제 커밋/브랜치 이력과 GitHub 템플릿을 기준으로 정리한 규칙입니다.

---

## 📁 1. Branch 명명 규칙

```text
{작업유형}/{도메인 또는 작업 대상}-{작업명}#이슈번호
```

| 접두사 | 용도 |
| --- | --- |
| `feature/` | 새로운 기능 및 화면 개발 (가장 많이 쓰임) |
| `fix/`, `bug/` | 기능 또는 화면 오류 수정 |
| `refactor/` | 기능 변경 없는 코드 구조 개선 |
| `setting/` | CI/CD, 배포, 인프라 등 프로젝트 설정 작업 |

예시(실제 브랜치):

```text
feature/attendance-api#264
feature/timetable-testcode#503
fix/notice-file-error#561
refactor/memo-error#441
setting/ci-docker-pipeline#293
```

---

## 🔀 2. Branch 운영 방식

```text
develop
├── feature/*
├── fix/* , bug/*
├── refactor/*
└── setting/*
```

작업 흐름:

```text
develop 최신화
→ 작업 브랜치 생성
→ 기능 개발
→ 작업 브랜치 Push
→ develop 대상 PR 생성
→ CI(lint → test → build) 통과 확인
→ 코드 리뷰
→ develop 병합
```

- PR은 `develop`, `main`을 대상으로 생성되며, 두 브랜치를 대상으로 한 PR에서 GitHub Actions(`ci.yml`)가 자동 실행됩니다.
- `main` 브랜치에는 직접 Push하지 않습니다.

작업 시작 전:

```bash
git switch develop
git pull origin develop
```

---

## ✍️ 3. Commit Message 규칙

```text
[TYPE] 작업 내용#이슈번호
```

| Type | 설명 |
| --- | --- |
| `FEATURE` | 새로운 기능 또는 화면 추가 |
| `FIX` | 기능, UI 또는 API 오류 수정 |
| `BUG` | 버그 수정 |
| `REFACTOR` | 기능 변경 없는 코드 구조 개선 |
| `SETTING` | CI/CD, 배포, 환경설정 등 프로젝트 설정 |

실제 커밋 예시:

```text
[FEATURE] 공지·일정·설정·시간표 기능 보완#591
[FEATURE] 전 도메인 날짜형식 수정 & 오류 수정#584
[REFACTOR] 공통 API 요청 로직 분리
[BUG] 로그인 후 이동 경로 오류 수정
[SETTING] ec2 환경변수 값 세팅
```

### 작성 규칙

- Type은 대문자로 작성하고 대괄호로 감쌉니다.
- Type 뒤에는 한 칸 띄어씁니다.
- 관련 이슈가 있다면 마지막에 `#이슈번호`를 붙입니다.

---

## 🔖 4. Issue 규칙

이슈는 GitHub Issue Form(`.github/ISSUE_TEMPLATE/*.yml`) 4종으로 관리합니다.

| 템플릿 | 제목 접두사 | 용도 |
| --- | --- | --- |
| Feature Request | `[FEATURE]` | 새로운 화면·컴포넌트·기능 추가, UI/UX 개선 요청 |
| Bug Report | `[BUG]` | 화면, UI, 상태관리, API 연동 등에서 발생한 버그 |
| Refactor | `[REFACOTR]` | 코드 구조 개선, 성능 최적화, 기술 부채 해소 |
| Question | `[QUESTION]` | 설계, 구현, 기술 선택에 대한 질문 |

이슈 생성 후 이슈 번호를 포함해 브랜치를 생성합니다.

```text
feature/timetable-api-export#316
```

---

## 🔗 5. Pull Request 규칙

PR 템플릿([`.github/pull_request_template.md`](.github/pull_request_template.md))에 다음 항목을 작성합니다.

- 📌 PR 요약
- 💡 어떤 기능인가요
- ✨ 변경 사항
- 📝 작업 상세 내용 체크리스트(기능 구현/버그 수정/리팩토링/테스트 완료)
- 💬 리뷰어에게 할 말, ✅ 체크 리스트
- UI 변경사항(스크린샷)
- 📎 관련 이슈(`Closes #`)

- PR의 Base 브랜치는 `develop` 또는 `main`입니다.
- CI(`lint` → `test` → `build`)를 통과해야 병합할 수 있습니다.

---

## 💻 6. 코드 작성 규칙

### 네이밍 규칙(실제 코드 기준)

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| React 컴포넌트 파일 | PascalCase | `ScheduleCalendar.tsx` |
| Zustand 스토어 파일 | `use` 접두사 + PascalCase + `Store` | `useUserStore.ts`, `useMemoStore.ts` |
| 서비스 파일 | 도메인명 + `.service.ts` | `attendance.service.ts`, `memo.service.ts` |
| 검증 스키마 파일 | 도메인 + 목적 + `Schema` | `noticeCreateSchema.ts`, `scheduleCreateSchema.ts` |
| 유닛 테스트 파일 | 원본 파일명 + `.test.ts` (같은 폴더에 위치) | `fetch.test.ts`, `memo.service.test.ts` |

### 공통 규칙

- Server Component를 기본으로 하고, 상태·이벤트·브라우저 API가 필요한 최소 범위에만 `"use client"`를 사용합니다.
- Server Action, 서비스, UI 컴포넌트의 책임을 분리합니다.
- `any` 타입 사용은 지양하고, API 요청·응답 데이터에는 타입을 작성합니다.
- 폼 검증은 `react-hook-form` + `zod` 조합을 사용합니다.
- 서버 상태는 `@tanstack/react-query`, 전역 클라이언트 상태는 `zustand`을 사용합니다.

---

## 🎨 7. Styling 규칙

- TailwindCSS 유틸리티 클래스를 사용합니다.
- 공통 UI 컴포넌트는 shadcn 기반(`src/components/ui`)으로 구성하고, `components.json`의 alias(`@/components`, `@/lib`, `@/hooks` 등)를 따릅니다.
- 아이콘은 `lucide-react`를 사용합니다.

---

## 📂 8. 폴더 구조

```text
src/
├── app/         # Next.js App Router 라우트 ((user), auth, superadmin 등)
├── feature/     # 도메인별 기능 모듈 (actions, type, 컴포넌트 등)
│   └── <domain>/
│       └── CONTEXT.md   # 도메인 기능 명세
├── components/
│   ├── ui/      # shadcn 기반 공용 UI 컴포넌트
│   ├── layout/  # 공용 레이아웃 컴포넌트
│   └── hooks/   # 공용 훅
├── service/     # 도메인별 API 연동 서비스 (<domain>.service.ts)
├── store/       # 전역 상태(Zustand) (use<Domain>Store.ts)
└── lib/         # 공통 유틸리티, zod 스키마, fetch 래퍼
```

- 도메인 화면·기능을 구현하거나 수정할 때는 `src/feature/<domain>/CONTEXT.md`를 먼저 확인합니다.

---

## 🧪 9. 테스트 규칙

| 테스트 | 도구 | 위치 |
| --- | --- | --- |
| 단위/통합 테스트 | Jest, Testing Library | 대상 파일과 같은 폴더에 `*.test.ts(x)`로 위치 |
| E2E 테스트 | Playwright | `tests/e2e` |

```bash
npm test
npm run test:e2e
```

- 테스트 코드 작성 전 `.docs/tests/test-timing.md`를 참고해 현재 작업 단계(정적 UI/컴포넌트/로직/도메인 완성)를 먼저 판단합니다.
- 테스트 종류별 작성 규격은 `.docs/tests/jest-unit.md`, `.docs/tests/react-component.md`, `.docs/tests/e2e.md`를 따릅니다.

---

## 📎 관련 문서

- [AI 작업 규칙 (AGENTS.md)](AGENTS.md)
- [Claude 작업 규칙 (CLAUDE.md)](CLAUDE.md)
- [프로젝트 개요](.docs/project-overview.md)
- [API 연동 가이드](.docs/api)
- [UI 스타일 가이드](.docs/ui)
- [테스트 작성 가이드](.docs/tests)
- [배포/운영(DevOps)](.docs/devops)
- [GitHub Issue Templates](.github/ISSUE_TEMPLATE)
- [GitHub Pull Request Template](.github/pull_request_template.md)
