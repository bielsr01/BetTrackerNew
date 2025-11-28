# BetTracker Pro - Docker Deployment Guide

## Quick Start

### 1. Prerequisites
- Docker (v20+)
- Docker Compose (v1.29+)
- PostgreSQL 14+ (or use the included compose file)

### 2. Build the Docker Image

```bash
# Using the build script
./build-docker.sh

# Or manually
docker build -t bettracker-pro:latest .
```

### 3. Environment Configuration

Create `.env.production`:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/bettracker
SESSION_SECRET=your_secret_key_here
```

### 4. Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f bettracker

# Stop services
docker-compose down
```

### 5. Access the Application

```
http://localhost:5000
```

## Production Deployment

### Using Docker Swarm

```bash
docker swarm init
docker stack deploy -c docker-compose.yml bettracker
```

### Using Kubernetes

```bash
kubectl apply -f k8s/
```

See the K8s deployment files in the `k8s/` directory.

## Troubleshooting

### Database Connection Error
```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs db
```

### Port Already in Use
```bash
# Use a different port
PORT=3000 docker-compose up -d
```

### Rebuild After Changes
```bash
docker-compose build --no-cache
docker-compose up -d
```

## Performance Tuning

### Increase Memory
Edit `docker-compose.yml`:
```yaml
services:
  bettracker:
    deploy:
      resources:
        limits:
          memory: 2G
```

### Enable Cache
The application includes Redis support (disabled by default). To enable:
1. Add Redis service to `docker-compose.yml`
2. Set `REDIS_URL` in `.env.production`

## Monitoring

```bash
# Container stats
docker stats bettracker-pro

# Health check logs
docker-compose logs bettracker | grep health
```

## Cleanup

```bash
# Remove stopped containers
docker-compose rm

# Remove images
docker rmi bettracker-pro:latest

# Full cleanup
docker system prune -a
```
