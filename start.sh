#!/bin/sh

# Start Python backend
cd /backend && python3 app.py &

# Start Next.js frontend
cd /app && npm start
