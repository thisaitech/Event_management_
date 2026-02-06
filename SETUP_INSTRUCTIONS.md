# Setup Instructions for Eventic

## Quick Start

### 1. Start the Backend Server

Open a terminal and run:
```bash
npm run server
```

The server will start on `http://localhost:3001`

### 2. Start the Frontend (in a NEW terminal)

Open another terminal and run:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port)

### 3. Access the Application

Open your browser and go to the frontend URL (usually `http://localhost:5173`)

## Demo Login Credentials

**Regular User:**
- Username: `user1`
- Password: `pass123`

**Admin User:**
- Username: `admin`
- Password: `admin123`

## Troubleshooting

### "Cannot connect to server" Error

If you see this error when trying to login:
1. Make sure the backend server is running (`npm run server`)
2. Check that port 3001 is not being used by another application
3. Verify the server started successfully (you should see "Server running on http://localhost:3001" in the terminal)

### Running Both Together

You can run both frontend and backend together using:
```bash
npm run dev:full
```

Note: This requires the `concurrently` package to be installed.

