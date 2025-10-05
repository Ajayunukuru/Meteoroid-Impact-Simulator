# Meteoroid Impact Simulator

A comprehensive web application for simulating asteroid impacts with realistic physics calculations and stunning 3D visualizations.

## Features

- **Authentication System**: Secure login/signup with email verification and disposable email blocking
- **Educational Content**: Learn about asteroids, meteors, comets, and space debris
- **3D Impact Simulator**: Interactive globe with realistic physics calculations
- **Impact Visualizations**: Detailed crater formation, blast radius, and trajectory animations
- **Theme Support**: Light and dark space-themed modes
- **NASA Integration**: Real asteroid data and imagery

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Three.js
- **Backend**: Python Flask, SQLite
- **Authentication**: JWT tokens, SHA-256 password hashing
- **3D Graphics**: React Three Fiber, Three.js

## Setup Instructions

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm or yarn

### Local Development

1. **Install Frontend Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Install Backend Dependencies**
   \`\`\`bash
   cd backend
   pip install -r requirements.txt
   \`\`\`

3. **Start Backend Server**
   \`\`\`bash
   cd backend
   python app.py
   \`\`\`
   Backend will run on http://localhost:5000

4. **Start Frontend Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Frontend will run on http://localhost:3000

### Docker Setup

\`\`\`bash
docker build -t asteroid-simulator .
docker run -p 3000:3000 -p 5000:5000 asteroid-simulator
\`\`\`

## Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/users/verify` - Verify email address

### Physics (Coming Soon)

- `POST /api/simulate` - Calculate impact physics
- `GET /api/nasa/asteroids` - Fetch NASA asteroid data

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── verify/            # Email verification page
│   └── home/              # Main application (coming soon)
├── backend/               # Python Flask backend
│   ├── app.py            # Main Flask application
│   └── requirements.txt   # Python dependencies
├── components/            # React components
└── public/               # Static assets
\`\`\`

## Security Features

- Password hashing with SHA-256
- JWT token authentication
- Disposable email blocking
- Email verification (double opt-in)
- SQL injection prevention

## Coming Soon

- 3D interactive globe with Earth textures
- Real-time impact physics calculations
- Interactive map with blast radius visualization
- NASA API integration
- Impact comparison with historical events
- Safety precautions and evacuation planning

## License

MIT License
