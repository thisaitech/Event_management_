# Eventic Project Restructure Guide

This guide explains how to restructure the Eventic project into separate frontend and backend folders, and update all code to use backend APIs instead of localStorage.

## Step 1: Create Folder Structure

Manually create these folders:
```
eventic---modern-event-discovery/
├── frontend/
└── backend/
```

## Step 2: Move Frontend Files

Move these files/folders to `frontend/`:
- `components/`
- `contexts/`
- `services/`
- `utils/` (will be updated with api.ts)
- `public/`
- `App.tsx`
- `index.tsx`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `constants.ts`
- `types.ts`
- `metadata.json`

## Step 3: Move Backend Files

Move these files to `backend/`:
- `server.mjs` → rename to `server.js`

## Step 4: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install react react-dom @vitejs/plugin-react vite typescript @types/node @google/genai motion
```

**Backend:**
```bash
cd backend
npm install express cors
npm install --save-dev @types/express @types/cors
```

## Step 5: Environment Variables

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:3001
GEMINI_API_KEY=your_api_key_here
```

**Backend `.env` (optional):**
```
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Step 6: Update Code Files

See the updated component files below that replace localStorage with API calls.

## Step 7: Run the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Access the app at `http://localhost:3000`

