# Eventic - LocalStorage Demo Mode

The project has been converted to use **browser localStorage** instead of a backend API, making it perfect for client demos without needing a server.

## ✅ Changes Made

1. **Created `frontend/src/utils/storage.ts`**
   - Replaced all API calls with localStorage-based functions
   - Automatic initialization of demo data on first load
   - Same function signatures as API for easy switching back

2. **Updated All Components**
   - ✅ `AuthContext.tsx` - Login/logout using localStorage
   - ✅ `App.tsx` - Events loading from localStorage
   - ✅ `BookingPage.tsx` - Booking creation to localStorage
   - ✅ `MyBookings.tsx` - Bookings from localStorage
   - ✅ `AdminPanel.tsx` - Full admin functionality with localStorage
   - ✅ `Newsletter.tsx` - Subscriptions to localStorage
   - ✅ `BookingModal.tsx` - Booking modal using localStorage
   - ✅ `AIAssistant.tsx` - Event recommendations from localStorage

3. **Demo Data Included**
   - 5 sample events (Weddings, Corporate, Festival, Conference, Gala)
   - Demo user accounts
   - Sample subscriber

## 🚀 Running the Demo

1. **No Backend Required**
   - You can completely ignore the `backend/` folder
   - All data is stored in the browser's localStorage

2. **Start Frontend Only**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the App**
   - Open `http://localhost:3000` in your browser
   - All data persists in browser localStorage

## 🔑 Demo Credentials

### User Account
- **Username:** `user1`
- **Password:** `pass123`
- **Role:** User

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Admin

## 📊 Data Persistence

All data is stored in browser localStorage with these keys:
- `eventic_users` - User accounts
- `eventic_events` - Event listings
- `eventic_bookings` - Booking requests
- `eventic_subscribers` - Newsletter subscriptions
- `auth_token` - Current user session token
- `auth_user` - Current user data

**Note:** Data persists across browser sessions but is browser-specific. To reset data, clear browser localStorage.

## 🎯 Demo Features

### ✅ Fully Functional
- User login/logout
- Event browsing and searching
- Booking creation
- My Bookings page (track booking status)
- Admin Panel (manage events, bookings, subscribers)
- Newsletter subscription
- Event management (create, edit, delete, feature)
- Booking approval/rejection
- All form validations

### 📝 Sample Data
The demo includes:
- 5 pre-loaded events in different categories
- Events in Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem
- Various price ranges ($30,000 - $75,000)
- Featured events for homepage display

## 🔄 Switching Back to Backend

If you need to switch back to backend API:
1. Replace all imports from `@/utils/storage` back to `@/utils/api`
2. Ensure backend server is running on `http://localhost:3001`
3. Update `VITE_API_URL` environment variable if needed

## 🎨 Client Demo Tips

1. **Clear Data for Fresh Demo**
   - Open browser DevTools (F12)
   - Go to Application > Local Storage
   - Clear all localStorage keys starting with `eventic_`
   - Refresh page to see fresh demo data

2. **Show Different Scenarios**
   - Login as user → Create booking → Check "My Bookings"
   - Login as admin → Approve/reject bookings
   - Create new events in admin panel
   - Subscribe to newsletter

3. **Data Persists**
   - All changes persist in localStorage
   - Perfect for showing workflow continuity
   - Multiple interactions can be demonstrated without losing data

## ⚠️ Important Notes

- **No Backend Required** - This is a standalone frontend demo
- **Browser-Specific** - Data is stored per browser/device
- **No Cross-Device Sync** - Each browser has its own data
- **Perfect for Demos** - All features work without server setup

## 🎉 Ready for Client Presentation!

The application is now fully functional as a standalone demo using browser localStorage. Perfect for client presentations without any backend setup required!

