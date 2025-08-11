# Backend Setup Guide

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Setup database:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Start the server:
```bash
npm run dev
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/academia_hub"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# File Upload
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Documentation

- Swagger UI: http://localhost:3001/api-docs
- Health Check: http://localhost:3001/health
