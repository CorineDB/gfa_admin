#!/bin/bash
# Script de lancement local
# Usage: ./start-local.sh

echo "🚀 Starting local development environment..."

# Copier .env.example si .env n'existe pas
if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
fi

# Lancer docker-compose
echo "🐳 Starting containers..."
docker-compose up -d --build

echo "✅ Done! Access at http://localhost:3002"
