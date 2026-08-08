#!/usr/bin/env bash
# Run on a fresh Ubuntu 22.04/24.04 OCI VM (as ubuntu user with sudo).
set -euo pipefail

echo "==> Updating packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "==> Installing Docker..."
sudo apt-get install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"

echo "==> Docker installed."
docker --version
docker compose version

echo ""
echo "Next steps:"
echo "  1. Log out and SSH back in (so docker group applies), OR run: newgrp docker"
echo "  2. git clone https://github.com/MahmudulHasanJoy/VERA.git"
echo "  3. cd VERA"
echo "  4. cp deploy/.env.production.example deploy/.env"
echo "  5. Edit deploy/.env — set PUBLIC_URL to http://<your-vm-public-ip>"
echo "  6. docker compose --env-file deploy/.env -f docker-compose.prod.yml up -d --build"
echo "  7. Open http://<your-vm-public-ip> in your browser"
