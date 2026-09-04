#!/bin/bash
# ============================================
# LogiFlow — Déploiement rapide sur Vercel
# ============================================

set -e

echo "🚀 Déploiement LogiFlow"
echo "======================="

echo "📦 Build production..."
npm run build

echo ""
echo "☁️  Déploiement sur Vercel..."
npx vercel --prod

echo ""
echo "✅ Déployé !"
