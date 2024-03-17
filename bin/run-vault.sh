#!/usr/bin/env bash

set -e

if [ "$#" -ne 1 ]; then
  echo "Usage: npx run-vault <name>"
  exit 1
fi

name="$1"

function install_vault_cli() {
  docker create --name vault-cli quay.io/mynth/docker-vault-cli
  docker cp vault-cli:/usr/local/bin/vault-cli vault-cli

  if [ -w /usr/local/bin/ ]; then
    mv vault-cli /usr/local/bin/vault-cli
  else
    sudo mv vault-cli /usr/local/bin/vault-cli
  fi

  docker rm vault-cli
}

SCRIPT_PATH=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
SCRIPT=$(realpath "$SCRIPT_DIR/../mynth-helper/src/vault-secrets.ts" 2>/dev/null || realpath "$SCRIPT_DIR/../src/vault-secrets.ts")

if [ -f "$SCRIPT_DIR/../node_modules/.bin/tsx" ]; then
  TSX="$SCRIPT_DIR/../node_modules/.bin/tsx"
else
  TSX="$SCRIPT_DIR/../../.bin/tsx"
fi

TSX=$(realpath "$TSX")

function wait_for_vault() {
  while true; do
    if docker exec vault ls /vault/file/init.json > /dev/null 2>&1; then
      TOKEN=$(docker exec vault token)
      if [ -z "$TOKEN" ]; then
        echo "Waiting for Vault..."
        sleep 1
      else
        echo "Vault is ready"
        break
      fi
    else
      echo "Waiting for Vault..."
      sleep 1
    fi
  done
}

function enable_vault_secrets() {
  while true; do
    docker exec vault vault secrets enable -path="$name" -version=1 kv && break
    sleep 1
  done
}

docker stop vault > /dev/null 2>&1 || true
docker rm vault > /dev/null 2>&1 || true
docker run --rm -d \
  --name vault \
  --cap-add=IPC_LOCK \
  -p 8200:8200 quay.io/mynth/local-vault
wait_for_vault
enable_vault_secrets

if ! command -v vault-cli &> /dev/null; then
  echo "Installing vault-cli"
  install_vault_cli
fi

"$TSX" "$SCRIPT" "$name"
