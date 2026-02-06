# Eventic Project Structure

## Clean, Organized Structure

```
eventic/
├── frontend/
│   ├── src/                          # All source code
│   │   ├── components/               # React components
│   │   │   ├── pages/                # Page-level components
│   │   │   │   ├── AdminPanel.tsx
│   │   │   │   └── MyBookings.tsx
│   │   │   ├── sections/             # Section components
│   │   │   │   ├── Categories.tsx
│   │   │   │   ├── EnhancedFooter.tsx
│   │   │   │   ├── FeaturedEvents.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── Newsletter.tsx
│   │   │   │   └── Testimonials.tsx
│   │   │   ├── react-bits/           # Animation/reusable components
│   │   │   │   └── [all animation components]
│   │   │   ├── AccountMenu.tsx
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── BlurText.tsx
│   │   │   ├── BookingModal.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventDetailModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── LoginModal.tsx
│   │   │   └── VideoIntro.tsx
│   │   ├── contexts/                 # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── services/                 # External services
│   │   │   └── geminiService.ts
│   │   ├── utils/                    # Utilities
│   │   │   ├── api.ts                # API calls to backend
│   │   │   └── storage.ts            # Local storage utilities (if needed)
│   │   ├── App.tsx                   # Main app component
│   │   ├── index.tsx                 # Entry point
│   │   ├── constants.ts              # Constants and mock data
│   │   └── types.ts                  # TypeScript types
│   ├── public/                       # Static assets
│   │   ├── AI_Animation_Building_Facade_To_Venue.mp4
│   │   ├── hero-background.jpeg
│   │   └── hero-background.png
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.ts                # Vite configuration
│   ├── tsconfig.json                 # TypeScript config
│   └── tsconfig.node.json            # TypeScript node config
│
├── backend/
│   ├── server.js                     # Express server
│   ├── package.json                  # Backend dependencies
│   └── README.md                     # Backend documentation
│
└── package.json                      # Root package.json (optional scripts)
```

## Import Paths

All imports use relative paths within the `src/` directory:

### From Components:
- `import { useAuth } from '../contexts/AuthContext'` (from components/)
- `import { Event } from '../types'` (from components/)
- `import { getEvents } from '../utils/api'` (from components/)
- `import { FadeIn } from '../react-bits/FadeIn'` (from components/sections/)

### From Pages (components/pages/):
- `import { useAuth } from '../../contexts/AuthContext'`
- `import { getEvents } from '../../utils/api'`

### From Sections (components/sections/):
- `import { addSubscriber } from '../../utils/api'`

## Key Features

✅ Clean separation of concerns
✅ All source code in `src/` directory
✅ Proper folder organization (components, contexts, services, utils)
✅ Consistent import paths
✅ No duplicate files
✅ TypeScript support throughout
✅ Vite configured correctly

## Running the Project

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend will be available at `http://localhost:3001`
