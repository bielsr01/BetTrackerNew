#!/bin/bash
set -e

echo "🐳 BetTracker Pro - Docker Build"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 Step 1: Building Docker image...${NC}"
docker build -t bettracker-pro:latest -t bettracker-pro:$(date +%Y%m%d) .

echo ""
echo -e "${BLUE}📝 Step 2: Creating docker-compose...${NC}"

# Create .env if doesn't exist
if [ ! -f .env.production ]; then
    cat > .env.production << 'ENVEOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@db:5432/bettracker
SESSION_SECRET=$(openssl rand -hex 32)
ENVEOF
    echo -e "${GREEN}✓ Created .env.production${NC}"
fi

echo ""
echo -e "${BLUE}📊 Step 3: Image info...${NC}"
docker images | grep bettracker-pro | head -1

echo ""
echo -e "${GREEN}✅ Build successful!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Configure .env.production with your DATABASE_URL"
echo "  2. Run: docker-compose up -d"
echo "  3. Access: http://localhost:5000"
echo ""
