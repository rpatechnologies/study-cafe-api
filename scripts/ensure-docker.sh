#!/usr/bin/env bash
# Ensure Docker daemon is running. On macOS, start Docker Desktop and wait.
set -e

if docker info >/dev/null 2>&1; then
  echo "Docker is running."
  exit 0
fi

echo "Docker is not running."
if [[ "$(uname)" == "Darwin" ]]; then
  if ! open -a Docker 2>/dev/null; then
    echo "ERROR: Docker Desktop is not installed or not found."
    echo "Install it from: https://www.docker.com/products/docker-desktop/"
    exit 1
  fi
  echo "Waiting for Docker to be ready (up to 120s)..."
  for i in $(seq 1 120); do
    if docker info >/dev/null 2>&1; then
      echo "Docker is ready."
      exit 0
    fi
    printf "."
    sleep 1
  done
  echo ""
fi

echo "ERROR: Docker did not start in time."
echo "Please start Docker Desktop manually (from Applications or the menu bar), then run: npm run dev"
exit 1
