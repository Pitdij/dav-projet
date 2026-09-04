#!/bin/bash
# ============================================
# LogiFlow — Script d'installation automatique
# ============================================

set -e

echo "🚛 LogiFlow — Installation"
echo "=========================="

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trouvé. Installe-le d'abord :"
    echo "   https://nodejs.org/ (version 18+)"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ requis. Version actuelle : $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."
npm install

echo ""
echo "✅ Installation terminée !"
echo ""
echo "🚀 Commandes disponibles :"
echo "   npm run dev      → Développement local (ouvre l'app mobile)"
echo "   npm run build    → Build production"
echo "   npm run preview  → Prévisualiser le build"
echo ""
echo "📁 Structure :"
echo "   index.html   → Dashboard donneur d'ordre"
echo "   mobile.html  → App mobile convoyeur"
echo "   src/mobile/  → Code de l'app mobile"
echo ""
