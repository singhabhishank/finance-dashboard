#!/bin/bash
# Quick Start Script for Finance Dashboard

echo "🚀 Finance Dashboard - Quick Start"
echo "===================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v python &> /dev/null; then
    echo "❌ Python not found"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found"
    exit 1
fi

echo "✅ All prerequisites found"
echo ""

# Backend setup
echo "🔧 Setting up Backend..."
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Ask about PostgreSQL
echo ""
read -p "Is PostgreSQL running? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please start PostgreSQL and try again"
    exit 1
fi

createdb finance_dashboard 2>/dev/null || echo "Database may already exist"
alembic upgrade head
python -m scripts.seed

echo ""
echo "✅ Backend setup complete!"
echo "📍 Backend URL: http://127.0.0.1:8000"
echo ""

# Frontend setup
echo "🎨 Setting up Frontend..."
cd frontend
npm install
cp .env.example .env

echo ""
echo "✅ Frontend setup complete!"
echo "📍 Frontend URL: http://127.0.0.1:3000"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "📝 Demo Credentials:"
echo "   Admin:   admin@demo.com / Admin123"
echo "   Analyst: analyst@demo.com / Analyst123"
echo "   Viewer:  viewer@demo.com / Viewer123"
echo ""
echo "🚀 To start the application:"
echo "   Terminal 1: uvicorn app.main:app --reload"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
