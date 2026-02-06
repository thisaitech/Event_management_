# Eventic Restructuring Migration Checklist

Use this checklist to ensure all restructuring steps are completed correctly.

## File Movement
- [ ] Move `components/` folder to `frontend/components/`
- [ ] Move `contexts/` folder to `frontend/contexts/` (if exists at root)
- [ ] Move `public/` folder to `frontend/public/`
- [ ] Verify no duplicate files remain at root level

## Backend Setup
- [ ] `backend/server.js` exists with CORS configuration
- [ ] `backend/package.json` exists with correct dependencies
- [ ] `backend/.env.example` exists
- [ ] Create `backend/.env` from example (if using custom ports)

## Frontend Setup
- [ ] `frontend/package.json` exists with correct dependencies
- [ ] `frontend/vite.config.ts` configured correctly
- [ ] `frontend/tsconfig.json` exists
- [ ] `frontend/.env.example` exists
- [ ] Create `frontend/.env` from example

## API Integration
- [ ] `frontend/utils/api.ts` uses `VITE_API_URL` environment variable
- [ ] All API calls use the centralized `api.ts` utility
- [ ] No hardcoded `http://localhost:3001` in components
- [ ] CORS configured in backend for frontend origin

## Import Paths
- [ ] All imports in components use relative paths correctly
- [ ] Context imports use `../../contexts/AuthContext` or similar
- [ ] Utility imports use `../../utils/api` or similar
- [ ] No broken imports after file movement

## Testing
- [ ] Backend server starts without errors
- [ ] Frontend dev server starts without errors
- [ ] Login functionality works
- [ ] Events load from backend API
- [ ] Bookings work correctly
- [ ] Admin panel functions correctly
- [ ] No console errors in browser

## Documentation
- [ ] `README.md` updated with new structure
- [ ] `RESTRUCTURE_INSTRUCTIONS.md` created
- [ ] Both `frontend/README.md` and `backend/README.md` exist

## Environment Variables
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:3001`
- [ ] Frontend `.env` has `GEMINI_API_KEY` (if using AI features)
- [ ] Backend `.env` has `PORT=3001` (if custom port needed)
- [ ] Backend `.env` has `FRONTEND_URL=http://localhost:3000` (if custom)

## Final Verification
- [ ] Both servers run simultaneously without conflicts
- [ ] Application works end-to-end (login, browse events, create bookings, admin features)
- [ ] No localStorage dependencies (all data from backend API)
- [ ] Responsive design still works
- [ ] All styling and themes preserved

