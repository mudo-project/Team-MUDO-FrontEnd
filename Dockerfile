# syntax=docker/dockerfile:1

# Node.js 20과 경량 Alpine Linux를 사용하는 빌드 환경을 만든다.
FROM node:20-alpine AS builder

# 이후 builder 명령을 실행할 컨테이너 내부 작업 경로를 지정한다.
WORKDIR /app

# 의존성 캐시를 활용할 수 있도록 패키지 파일을 소스보다 먼저 복사한다.
COPY package.json package-lock.json ./

# package-lock.json을 기준으로 의존성을 설치하고 npm 다운로드 캐시를 재사용한다.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# .dockerignore에서 제외되지 않은 프로젝트 소스 전체를 작업 경로로 복사한다.
COPY . .

# Docker 빌드 명령에서 공개 API 주소를 전달받는다.
ARG NEXT_PUBLIC_API_BASE_URL
# 전달받은 주소를 Next.js 빌드가 읽을 수 있는 환경변수로 등록한다.
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
# 빌드 중 Next.js 익명 사용 통계 수집을 비활성화한다.
ENV NEXT_TELEMETRY_DISABLED=1

# 공개 API 주소가 누락된 경우 잘못된 이미지를 만들지 않고 빌드를 중단한다.
RUN test -n "${NEXT_PUBLIC_API_BASE_URL}" || \
    (echo "NEXT_PUBLIC_API_BASE_URL is required" && exit 1)

# standalone 설정을 적용한 Next.js 프로덕션 결과물을 생성한다.
RUN npm run build


# 빌드 도구가 없는 새로운 Node.js 20 Alpine 실행 환경을 만든다.
FROM node:20-alpine AS runner

# 이후 runner 명령을 실행할 컨테이너 내부 작업 경로를 지정한다.
WORKDIR /app

# Node.js와 의존성을 운영 모드로 실행한다.
ENV NODE_ENV=production
# 실행 중 Next.js 익명 사용 통계 수집을 비활성화한다.
ENV NEXT_TELEMETRY_DISABLED=1
# standalone Next.js 서버가 사용할 내부 포트를 지정한다.
ENV PORT=3000
# 호스트에서 컨테이너에 접근할 수 있도록 모든 네트워크 인터페이스에 바인딩한다.
ENV HOSTNAME=0.0.0.0

# non-root 사용자가 런타임 캐시를 기록할 수 있도록 .next 디렉터리 소유권을 설정한다.
RUN mkdir .next && chown node:node .next

# 정적 이미지와 폰트 등 public 자산을 builder에서 가져온다.
COPY --from=builder --chown=node:node /app/public ./public
# standalone 서버와 실행에 필요한 최소 의존성을 builder에서 가져온다.
COPY --from=builder --chown=node:node /app/.next/standalone ./
# 브라우저에 제공할 빌드된 JavaScript와 CSS를 builder에서 가져온다.
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# 애플리케이션 프로세스를 root가 아닌 node 사용자로 실행한다.
USER node

# 이 이미지가 컨테이너 내부에서 3000번 포트를 사용함을 명시한다.
EXPOSE 3000

# 컨테이너가 시작되면 standalone 서버 진입점을 실행한다.
CMD ["node", "server.js"]
