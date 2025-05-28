# Docker Setup

Simple Docker configuration for both development and production environments.

## Development

```bash
# Start development environment with hot reloading
docker-compose -f docker-compose.dev.yml up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

## Production

```bash
# Start production environment
docker-compose up --build

# Stop production environment
docker-compose down
```