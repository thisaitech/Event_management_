# Eventic Project Restructuring Instructions

This guide provides step-by-step instructions to complete the restructuring of the Eventic project into separate frontend and backend folders.

## Current Status

The project has been partially restructured:
- ✅ `frontend/` folder exists with some files
- ✅ `backend/` folder exists with server.js
- ❌ Components, contexts, and public folders still at root level
- ❌ Import paths need updating

## Complete Restructuring Steps

### Step 1: Move Remaining Frontend Files

Move these folders/files from root to `frontend/`:

```bash
# On Windows (PowerShell)
Move-Item -Path components -Destination frontend\components
Move-Item -Path contexts -Destination frontend\contexts  
Move-Item -Path public -Destination frontend\public

# On Mac/Linux
mv components frontend/
mv contexts frontend/
mv public frontend/
```

**Files to move:**
- `components/` → `frontend/components/`
- `contexts/` → `frontend/contexts/` (if exists at root, otherwise it's already in frontend/)
- `public/` → `frontend/public/`

### Step 2: Verify Frontend Structure

After moving, your `frontend/` folder should contain:
```
frontend/
├── components/
│   ├── pages/
│   ├── react-bits/
│   └── sections/
├── contexts/          (if not already there)
├── public/
├── services/
├── utils/
├── App.tsx
├── index.html
├── index.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

### Step 3: Update Import Paths

All imports in components need to be relative to their new locations. Since we're moving `components/` into `frontend/`, paths remain the same.

**No changes needed for:**
- Imports within `components/` folder (they're relative to each other)
- Imports from `components/` to `utils/`, `contexts/`, etc. (use relative paths like `../../utils/api`)

### Step 4: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### Step 5: Configure Environment Variables

**Frontend `.env`:**
```bash
cd frontend
cp .env.example .env
# Edit .env and set:
# VITE_API_URL=http://localhost:3001
# GEMINI_API_KEY=your_key_here
```

**Backend `.env` (optional):**
```bash
cd backend
cp .env.example .env
# Edit .env and set:
# PORT=3001
# FRONTEND_URL=http://localhost:3000
```

### Step 6: Test the Setup

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Should see: "Backend server running on http://localhost:3001"

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Should see: "Local: http://localhost:3000"

### Step 7: Verify API Integration

1. Open `http://localhost:3000` in browser
2. Try logging in (username: `admin`, password: `admin123`)
3. Check browser console for any API errors
4. Verify that data loads from backend (events, bookings, etc.)

## Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution:** Check that all folders were moved correctly and import paths are relative to new structure.

### Issue: API calls failing
**Solution:** 
- Verify backend is running on port 3001
- Check `VITE_API_URL` in `frontend/.env`
- Check CORS settings in `backend/server.js`

### Issue: Port already in use
**Solution:** 
- Change PORT in `backend/.env` to a different port
- Update `VITE_API_URL` in `frontend/.env` to match

## Final Structure

```
eventic---modern-event-discovery/
├── frontend/
│   ├── components/
│   │   ├── pages/
│   │   ├── react-bits/
│   │   └── sections/
│   ├── contexts/
│   ├── public/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   ├── index.html
│   ├── index.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── package.json (root - for running both)
└── README.md
```

## Running the Application

From the root directory, you can use the convenience scripts:

```bash
# Install all dependencies
npm run install:all

# Run both servers (requires concurrently)
npm run dev:backend   # Terminal 1
npm run dev:frontend  # Terminal 2
```

Or run them separately:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2  
cd frontend && npm run dev
```

