#!/bin/bash

# 🚀 Deployment script for Szymon Baranowski Website
# Run this script on VPS after git pull

echo "🚀 Starting deployment..."

# Stop the application
echo "⏸️  Stopping application..."
pm2 stop szymonbaranowski

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🏗️  Building application..."
npm run build

# Start the application
echo "▶️  Starting application..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

echo "✅ Deployment completed successfully!"
echo "📊 Check status: pm2 status"
echo "📝 Check logs: pm2 logs szymonbaranowski"
