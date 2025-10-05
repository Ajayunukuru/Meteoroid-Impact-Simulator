# Multi-stage build for Next.js frontend and Python backend

# Stage 1: Build Next.js frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Python backend
FROM python:3.11-slim AS backend
WORKDIR /backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Stage 3: Final image
FROM node:20-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/package.json ./package.json
COPY --from=frontend-builder /app/public ./public

# Install Python
RUN apk add --no-cache python3 py3-pip

# Copy backend
COPY --from=backend /backend /backend
COPY --from=backend /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Expose ports
EXPOSE 3000 5000

# Start script
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
