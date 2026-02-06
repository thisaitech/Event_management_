# Project Reorganization Guide

This document outlines the clean structure we're creating.

## Target Structure

```
eventic/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── AdminPanel.tsx
│   │   │   │   └── MyBookings.tsx
│   │   │   ├── sections/
│   │   │   │   ├── Categories.tsx
│   │   │   │   ├── EnhancedFooter.tsx
│   │   │   │   ├── FeaturedEvents.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── Newsletter.tsx
│   │   │   │   └── Testimonials.tsx
│   │   │   ├── react-bits/
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
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── geminiService.ts
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   └── storage.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── constants.ts
│   │   └── types.ts
│   ├── public/
│   │   └── [static assets]
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tsconfig.node.json
├── backend/
│   ├── server.js
│   ├── package.json
│   └── README.md
└── package.json (root)

```

## Import Path Updates

All imports will be updated to use the new structure:
- `./components/X` → `./components/X` (relative paths within src)
- `../utils/api` → `../utils/api` (relative paths within src)
- `@/components/X` → Can use alias if configured

