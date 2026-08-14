#!/usr/bin/env bash

# EC2에서 새 Docker SHA 이미지를 배포하고 실패하면 이전 컨테이너를 복구한다.
set -Eeuo pipefail

# GitHub Actions가 전달한 Docker Hub 경로와 commit SHA 태그를 첫 번째 인수로 받는다.
IMAGE_NAME="${1:?Docker image name is required}"

# 운영 컨테이너와 배포 실패 시 되돌릴 임시 백업 컨테이너의 이름을 고정한다.
CURRENT_CONTAINER="mudo-frontend"
ROLLBACK_CONTAINER="mudo-frontend-rollback"

# 오류가 발생한 위치에 따라 어떤 컨테이너를 제거하고 다시 시작할지 판단하는 상태값이다.
HAD_CURRENT_CONTAINER=false
CURRENT_WAS_RUNNING=false
NEW_CONTAINER_STARTED=false

# ERR trap에서 호출되며, 새 컨테이너를 정리한 뒤 기존 컨테이너의 이름과 실행 상태를 복구한다.
rollback() {
  # 최초 실패 코드를 보존해 롤백 처리 후에도 배포 작업을 실패 상태로 반환한다.
  exit_code=$?
  # 롤백 명령 자체가 실패했을 때 rollback 함수가 재귀 호출되는 것을 막는다.
  trap - ERR

  echo "Deployment failed. Starting rollback."

  # 새 컨테이너가 만들어진 뒤 실패했다면 진단 로그를 남기고 해당 컨테이너를 제거한다.
  if [ "$NEW_CONTAINER_STARTED" = true ] && \
    docker container inspect "$CURRENT_CONTAINER" >/dev/null 2>&1; then
    docker logs --tail 100 "$CURRENT_CONTAINER" || true
    if ! docker rm -f "$CURRENT_CONTAINER"; then
      echo "Unable to remove the failed new container." >&2
      exit "$exit_code"
    fi
  fi

  # 배포 전 운영 컨테이너가 있었다면 백업 이름을 원래 이름으로 되돌린다.
  if [ "$HAD_CURRENT_CONTAINER" = true ]; then
    if docker container inspect "$ROLLBACK_CONTAINER" >/dev/null 2>&1 && \
      ! docker container inspect "$CURRENT_CONTAINER" >/dev/null 2>&1; then
      docker rename "$ROLLBACK_CONTAINER" "$CURRENT_CONTAINER"
    fi

    # 기존 컨테이너가 원래 실행 중이었던 경우에만 다시 시작한다.
    if [ "$CURRENT_WAS_RUNNING" = true ]; then
      docker start "$CURRENT_CONTAINER"
    fi
    echo "Previous container restored."
  fi

  exit "$exit_code"
}

# 이후 어떤 명령이든 실패하면 위 rollback 함수를 실행한다.
trap rollback ERR

# ubuntu 사용자의 Docker Hub Read-only 로그인을 사용하며 pull 성공 전에는 기존 서비스를 중지하지 않는다.
sudo -u ubuntu -H docker pull "$IMAGE_NAME"

# 이전 실패에서 남은 백업은 현재 운영 컨테이너가 존재할 때만 정리한다.
if docker container inspect "$CURRENT_CONTAINER" >/dev/null 2>&1; then
  HAD_CURRENT_CONTAINER=true

  # 실행 중인 컨테이너만 정상 종료하고, 기존 상태를 롤백에 사용할 수 있도록 기록한다.
  if [ "$(docker inspect --format='{{.State.Running}}' "$CURRENT_CONTAINER")" = true ]; then
    CURRENT_WAS_RUNNING=true
    docker stop "$CURRENT_CONTAINER"
  fi

  # 오래된 롤백 컨테이너가 이름을 선점하지 않게 정리한 뒤 현재 컨테이너를 백업한다.
  docker rm -f "$ROLLBACK_CONTAINER" >/dev/null 2>&1 || true
  docker rename "$CURRENT_CONTAINER" "$ROLLBACK_CONTAINER"
fi

# 새 SHA 이미지를 기존 운영 포트와 동일한 조건으로 실행한다.
docker run -d \
  --name "$CURRENT_CONTAINER" \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  --env-file /etc/mudo/frontend.env \
  -e HOSTNAME=0.0.0.0 \
  -e PORT=3000 \
  "$IMAGE_NAME"

# 이 시점 이후 오류가 발생하면 rollback 함수가 새 컨테이너를 제거해야 한다.
NEW_CONTAINER_STARTED=true

# Next.js가 시작될 때까지 최대 60초 동안 루트 페이지의 HTTP 200 응답을 확인한다.
HEALTHY=false
for attempt in $(seq 1 30); do
  # Next.js 시작 중 연결 실패는 정상적인 재시도 대상으로 보고 HTTP 상태 코드만 수집한다.
  status_code=$(curl --silent --output /dev/null --write-out '%{http_code}' \
    --max-time 2 http://127.0.0.1:3000/ || true)
  if [ "$status_code" = "200" ]; then
    HEALTHY=true
    break
  fi
  sleep 2
done

# 제한 시간 동안 HTTP 200을 받지 못하면 ERR trap을 발생시켜 이전 컨테이너로 되돌린다.
if [ "$HEALTHY" != true ]; then
  echo "Health Check failed for $IMAGE_NAME" >&2
  false
fi

# Health Check 성공 후에는 더 이상 자동 롤백이 실행되지 않도록 ERR trap을 해제한다.
trap - ERR

# 새 컨테이너가 정상임을 확인했으므로 중지 상태로 보관했던 이전 컨테이너를 정리한다.
if [ "$HAD_CURRENT_CONTAINER" = true ]; then
  if ! docker rm "$ROLLBACK_CONTAINER"; then
    echo "Warning: unable to remove the previous stopped container." >&2
  fi
fi

echo "Deployment succeeded: $IMAGE_NAME"
