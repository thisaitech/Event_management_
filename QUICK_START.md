# Quick Start Guide - Eventic Restructuring

## Important Note

**This is a React + Vite project, NOT Next.js.** The project uses Vite for the build tool and development server.

## Step-by-Step Restructuring

### 1. Fix Backend Folder Issue

First, ensure `backend` is a directory, not a file:

**Windows PowerShell:**
```powershell
# Check if backend exists as a file
if (Test-Path backend -PathType Leaf) {
    Remove-Item backend
}
# Create directory
New-Item -ItemType Directory -Path backend -Force
```

**Mac/Linux:**
```bash
rm -f backend
mkdir -p backend
```

### 2. Create Backend Files

Create the files listed in `BACKEND_FILES.md` in the `backend/` folder.

Or use these quick commands after creating the backend folder:

```bash
cd backend
# Create files (copy content from BACKEND_FILES.md)
```

### 3. Move Frontend Files

**Windows PowerShell:**
```powershell
Move-Item -Path components -Destination frontend\components -Force
Move-Item -Path contexts -Destination frontend\contexts -Force -ErrorAction SilentlyContinue
Move-Item -Path public -Destination frontend\public -Force
```

**Mac/Linux:**
```bash
mv components frontend/
mv contexts frontend/ 2>/dev/null || true
mv public frontend/
```

### 4. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 5. Configure Environment Variables

**Frontend:**
```bash
cd frontend
# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3001
GEMINI_API_KEY=your_api_key_here
EOF
```

**Backend (optional):**
```bash
cd backend
# Create .env file
cat > .env << EOF
PORT=3001
FRONTEND_URL=http://localhost:3000
EOF
```

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Verify

1. Backend should show: "Backend server running on http://localhost:3001"
2. Frontend should show: "Local: http://localhost:3000"
3. Open http://localhost:3000 in browser
4. Try logging in with admin credentials:
   - Username: `admin`
   - Password: `admin123`

## Troubleshooting

### "Cannot find module" errors
- Verify all files were moved correctly
- Check that `npm install` ran successfully in both folders
- Ensure import paths use relative paths (e.g., `../../utils/api`)

### API calls failing
- Check backend is running on port 3001
- Verify `VITE_API_URL` in `frontend/.env` matches backend port
- Check browser console for CORS errors

### Port conflicts
- Change `PORT` in `backend/.env` to a different port
- Update `VITE_API_URL` in `frontend/.env` to match

## Final Structure

```
eventic---modern-event-discovery/
├── frontend/
│   ├── components/
│   ├── contexts/
│   ├── public/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── server.js
│   └── package.json
└── package.json (root)
```

