# Eventic - Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation & Running

### Step 1: Install Dependencies

**Root level (optional - installs both frontend and backend):**
```bash
npm run install:all
```

**Or install separately:**

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

### Step 2: Start Backend Server

Open Terminal 1:
```bash
cd backend
npm run dev
```

You should see:
```
Backend server running on http://localhost:3001
Frontend URL: http://localhost:3000
```

### Step 3: Start Frontend Server

Open Terminal 2:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://xxx.xxx.xxx.xxx:3000/
```

### Step 4: Open in Browser

Navigate to: **http://localhost:3000**

---

## Demo Credentials

### User Account
- **Username**: `user1`
- **Password**: `pass123`
- **Role**: User

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin

---

## Testing Features

### 1. **Browse Events**
- Events load automatically from backend
- Click any event card to view details
- Use search to filter events

### 2. **Book an Event**
- Click on any event card
- Fill in booking form (name, email, guest count)
- Submit booking request
- Booking will be in "Pending" status

### 3. **Login as User**
- Click "Sign In" button
- Use demo credentials: `user1` / `pass123`
- View "My Bookings" to see your requests

### 4. **Login as Admin**
- Click "Sign In" button
- Use demo credentials: `admin` / `admin123`
- You'll see the Admin Panel automatically
- Can manage events, bookings, and subscribers

### 5. **Admin Panel Features**
- **Events Tab**: Create, edit, delete events
- **Bookings Tab**: Approve/reject booking requests
- **Subscribers Tab**: View and manage newsletter subscribers

### 6. **Newsletter Subscription**
- Scroll to footer
- Enter email and subscribe
- Admin can view subscribers in Admin Panel

### 7. **AI Assistant**
- Click the AI chat button (bottom right)
- Ask for event recommendations
- AI will suggest events based on your query

---

## Troubleshooting

### Backend won't start
- Check if port 3001 is already in use
- Verify Node.js version (should be v16+)
- Check if dependencies are installed: `cd backend && npm install`

### Frontend won't start
- Check if port 3000 is already in use
- Verify dependencies are installed: `cd frontend && npm install`
- Check for TypeScript errors: Look at terminal output

### API calls failing
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify `VITE_API_URL` in frontend/.env (optional, defaults to localhost:3001)

### Login not working
- Verify backend server is running
- Check browser console for errors
- Ensure you're using correct credentials

---

## Project Structure

```
eventic/
├── backend/           # Node.js/Express API server
│   └── server.js     # All API endpoints
│
└── frontend/          # React + Vite application
    └── src/
        ├── components/    # React components
        ├── contexts/      # React contexts (Auth)
        ├── utils/         # API utilities
        └── App.tsx        # Main app component
```

---

## Environment Variables (Optional)

Create `frontend/.env.local` for custom API URL:
```env
VITE_API_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_api_key_here
```

---

## Production Build

### Frontend
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

### Backend
Backend doesn't require a build step. Just run:
```bash
cd backend
npm start
```

---

## Need Help?

Check the following files:
- `COMPREHENSIVE_AUDIT_REPORT.md` - Full audit details
- `README.md` - Project documentation
- `backend/README.md` - Backend API documentation

