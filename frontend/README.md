# Eventic Frontend

Premium private event booking platform frontend built with React, TypeScript, and Vite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:3001
GEMINI_API_KEY=your_api_key_here
```

## Development

Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── components/         # React components
│   ├── pages/         # Page-level components (AdminPanel, MyBookings)
│   ├── react-bits/    # Reusable animation/UI components
│   └── sections/      # Section components (Hero, FeaturedEvents, etc.)
├── contexts/          # React contexts (AuthContext)
├── services/          # External services (Gemini AI)
├── utils/             # Utilities (API functions, helpers)
├── public/            # Static assets
└── types.ts           # TypeScript type definitions
```

