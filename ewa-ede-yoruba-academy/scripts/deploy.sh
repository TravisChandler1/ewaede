#!/bin/bash

# Production deployment script for Ẹwà Èdè Yorùbá Academy
# This script handles the deployment process for production

set -e

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Run database migrations (uncomment when you have a production database)
# echo "🗃️ Running database migrations..."
# npx prisma migrate deploy

# Build the application
echo "🔨 Building application..."
npm run build

# Run tests (uncomment when you have tests)
# echo "🧪 Running tests..."
# npm test

# Check build size
echo "📊 Build size check..."
BUILD_SIZE=$(du -sh .next | cut -f1)
echo "Build size: $BUILD_SIZE"

# Create deployment package (optional)
echo "📦 Creating deployment package..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp next.config.js "$DEPLOY_DIR/"
cp -r prisma "$DEPLOY_DIR/"

# Create production .env template
cp .env.example "$DEPLOY_DIR/.env.production"

echo "✅ Deployment package created: $DEPLOY_DIR"

# Deployment instructions
echo ""
echo "🎯 Deployment Instructions:"
echo "1. Upload the '$DEPLOY_DIR' folder to your hosting provider"
echo "2. Set up environment variables using .env.production as a template"
echo "3. Configure your domain and SSL certificate"
echo "4. Set up database connection for production"
echo "5. Configure monitoring and analytics services"
echo "6. Test the application thoroughly in production"

echo ""
echo "🔗 Important Production URLs:"
echo "- Sitemap: https://yourdomain.com/sitemap.xml"
echo "- Robots: https://yourdomain.com/robots.txt"

echo ""
echo "✅ Deployment preparation complete!"
echo "Ready to deploy to: Vercel, Netlify, AWS, or your preferred hosting provider."