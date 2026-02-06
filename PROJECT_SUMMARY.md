# Eventic - Modern Event Discovery Platform
## Project Summary & UI Flow Documentation

---

## 🎯 Project Overview

**Eventic** is a modern, AI-powered event discovery platform built with React, TypeScript, and Vite. The platform features a premium SaaS design with a cinematic video introduction, intelligent event search, AI-powered recommendations, and a seamless booking experience.

---

## 📁 Project Structure

### **Tech Stack**
- **Frontend Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Animations**: Motion (Framer Motion) v12.23.26
- **AI Integration**: Google Gemini AI (@google/genai v1.34.0)
- **Styling**: Tailwind CSS (via className)

### **Key Files**
- `App.tsx` - Main application component (state management, routing logic)
- `components/` - All React components
  - `Hero.tsx` - Premium hero section with video background
  - `VideoIntro.tsx` - Cinematic video introduction
  - `EventCard.tsx` - Event listing cards
  - `BookingModal.tsx` - Event booking modal
  - `AIAssistant.tsx` - AI chat interface
  - `BlurText.tsx` - Animated text component
- `constants.ts` - Mock event data and categories
- `types.ts` - TypeScript type definitions
- `services/geminiService.ts` - AI recommendation service

---

## 🎬 Application Flow & Sections

### **1. Video Introduction (VideoIntro Component)**
**Location**: Full-screen overlay on initial load  
**Purpose**: Cinematic entry experience

**Features**:
- Plays animated video (`/AI_Animation_Building_Facade_To_Venue.mp4`)
- Auto-plays on page load (muted, inline)
- Black overlay (40% opacity) for text readability
- **Instant switch** - No transition when video ends
- Video uses: `objectFit: 'cover'`, `objectPosition: 'center center'`
- Exact alignment with hero background image

**User Interaction**:
- Video plays automatically
- When video ends → instantly switches to hero section (no fade transition)
- If video fails to load → auto-switches after 3 seconds

---

### **2. Hero Section (Hero Component)**
**Location**: Full-screen hero (exactly viewport height - `h-screen`)  
**Purpose**: Premium landing area with clear call-to-action

**Design Style**: Premium SaaS aesthetic - clean, modern, high-conversion focused

**Visual Elements**:
- **Background**: `hero-background.png` image
  - Exact alignment with video (same `objectFit: 'cover'`, `objectPosition: 'center center'`)
  - Black overlay (40% opacity) matching video
  - Very slow parallax scroll effect on scroll
  - Appears instantly when video ends (no transition)
- **Layout**: Fits exactly within viewport (no scrolling required)

**Header Navigation**:
- **Layout**: Logo left, Navigation centered, Actions right
- **Logo**: Ticket icon (white background) + "Eventic" text (white)
- **Nav Links** (Centered, Desktop only):
  - "Explore" - Scrolls to events grid
  - "How It Works"
  - "About"
- **Action Buttons** (Right side):
  - "Sign In" - Text link (white/80 opacity)
  - "List Your Event" - Ghost/outline button (white border)
- **Style**: Transparent header, no background card

**Main Hero Content** (Left-aligned, 65% max width):
- **Headline**: "Book experiences that matter"
  - Large, bold (text-5xl md:text-6xl lg:text-7xl)
  - White text, fade-in animation with Y-translate
- **Secondary Text**: "Discover concerts, conferences, and curated events near you."
  - Lighter weight, white/80 opacity
  - Fade-in animation

**CTA Section** (Primary focus):
- **Primary CTA**: "Explore Events"
  - Solid indigo button (bg-indigo-600)
  - Rounded corners, shadow, hover scale (1.02)
  - Functional: Scrolls to events grid section
- **Secondary CTA**: "List Your Event"
  - Ghost/outline style (white border)
  - Hover scale effect
  - Currently placeholder (no action)

**Search Bar** (Secondary action, below CTAs):
- Soft white card with backdrop blur
- Placeholder: "Search by city, artist, or event type"
- Simple text input (no category dropdown)
- Gentle glow on focus
- Functional: Submits search query

**Trust Signals** (Below search):
- Low contrast, subtle design
- Three checkmarks with text:
  - ✔ 1M+ Attendees
  - ✔ Curated Events
  - ✔ Secure Booking
- White/70 opacity, small text

**Animations & Transitions**:
- Hero elements fade in slowly (1500ms transition)
- Headline: Fade-in + Y-translate (200ms delay)
- Secondary text: Fade-in + Y-translate (400ms delay)
- CTAs: Fade-in + Y-translate (600ms delay)
- Search: Fade-in + Y-translate (800ms delay)
- Trust signals: Fade-in + Y-translate (1000ms delay)
- Buttons: Scale 1.02 on hover
- Background: Very slow parallax on scroll

---

### **3. Events Grid Section**
**Location**: Below hero section (`id="events-grid"`)  
**Purpose**: Display filtered event listings

**Section Header**:
- **Title**: "Upcoming Events" (BlurText animation)
- **Subtitle**: "Discover events happening near you and around the world." (BlurText animation)
- **Category Tabs**: Quick filter buttons
  - All (clears category filter)
  - Music
  - Tech
  - Food

**Event Display**:
- **Layout**: Responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- **Event Cards**: Clickable cards with hover effects
  - Image with hover zoom (scale 1.1)
  - Category badge overlay
  - Date, price, title, description
  - Location with pin icon
- **Empty State**: Shown when no events match filters
  - Message: "No events found"
  - Help text: "Try adjusting your search filters..."
  - **Button**: "Clear all filters" - Resets search and category

**Event Card Features**:
- Image: Event cover image with hover zoom effect
- Category Badge: White badge with category name
- Date: Upper left corner
- Price: Upper right corner
- Title: Large, bold (hover: indigo color)
- Description: 2-line clamp preview
- Location: Location pin icon + address
- Click Action: Opens BookingModal

---

### **4. Booking Modal (BookingModal Component)**
**Location**: Full-screen overlay (z-index: 100)  
**Trigger**: Clicking any event card

**Modal Layout**:
- **Background**: Dark overlay with blur effect (clickable to close)
- **Close Button**: X button (top right, white icon on blurred background)

**Left Side - Event Image**:
- Full-height event image
- Gradient overlay at bottom
- Category badge (top)
- Event title (bottom overlay)

**Right Side - Booking Details**:
- **When & Where Section**:
  - Date display
  - Location address
- **About Section**: Full event description
- **Pricing Section**:
  - Price display (large)
  - Organizer name
- **Action Button**: "Confirm Booking"
  - Full width, indigo background
  - *(Note: No actual booking functionality implemented)*
- **Footer Text**: "Secure payment via Stripe. No hidden fees."

**User Actions**:
- Click outside modal → Closes modal
- Click X button → Closes modal
- Click "Confirm Booking" → *(No action - placeholder)*

---

### **5. Call-to-Action Section**
**Location**: Below events grid  
**Purpose**: Encourage event hosting

**Visual Design**:
- Indigo-900 background
- Diagonal accent shape (right side)
- Two-column layout (content + image)

**Content**:
- **Headline**: "Host your own event on Eventic." (BlurText animation)
- **Description**: Marketing copy about the platform
- **Buttons**:
  - "Create an Event" - White button, indigo text
  - "Learn More" - Indigo button, white text
  - *(Note: No actions defined)*
- **Image**: Rotated community image (hover: rotates to 0°)

---

### **6. Footer**
**Location**: Bottom of page  
**Purpose**: Brand and links

**Content**:
- **Logo**: Calendar icon + "Eventic" text
- **Copyright**: "© 2024 Eventic Inc. All rights reserved."
- **Social Links**:
  - Twitter icon (link: #)
  - Instagram icon (link: #)
  - Hover: Indigo color change

---

### **7. AI Assistant (AIAssistant Component)**
**Location**: Fixed bottom-right corner (z-index: 60)  
**Purpose**: AI-powered event recommendations

**Default State - Floating Button**:
- Circular indigo button
- Chat bubble icon
- "AI" badge (pink, top-right)
- Hover: Scale 110%
- Click: Opens chat interface

**Open State - Chat Interface**:
- **Size**: 400px width (desktop), 90vw (mobile), 500px height
- **Header**: 
  - "AI Event Concierge" title
  - "Ask for personal recommendations" subtitle
  - Close button (X)
- **Chat Area**:
  - Scrollable message history
  - Empty state: Example prompt "I want to go to a music festival..."
  - **User Messages**: Indigo bubbles (right-aligned)
  - **AI Messages**: White bubbles (left-aligned, with border)
  - Loading indicator: Three bouncing dots
- **Input Area**:
  - Text input field
  - Send button (arrow icon)
  - Disabled during loading

**AI Integration**:
- Uses Google Gemini AI (gemini-3-flash-preview model)
- Analyzes user prompt against available events
- Returns top 2-3 recommendations with explanations
- Falls back to error message if API fails

**User Flow**:
1. Click AI button → Opens chat
2. Type query (e.g., "music festival with high energy")
3. Submit → Shows loading indicator
4. Receive AI recommendations
5. Continue conversation or close chat

---

## 🔄 State Management Flow

### **Main App State** (`App.tsx`):
```typescript
- showVideoIntro: boolean (controls video visibility)
- searchQuery: string (search input value)
- selectedCategory: string (active category filter)
- selectedEvent: Event | null (currently viewed event for modal)
```

### **Hero Component State**:
```typescript
- query: string (search input)
- isLoaded: boolean (controls fade-in animations)
```

### **Event Filtering Logic**:
- Filters events by:
  1. Search query (title or description match)
  2. Category selection
- Uses `useMemo` for performance optimization
- Updates in real-time as filters change

---

## 🎨 UI/UX Features

### **Animations**:
1. **BlurText Component**: Word-by-word blur-to-clear animations
   - Used in: Section headers, CTAs, empty states
   - Direction: Top or bottom
   - Intersection Observer triggered

2. **Video to Hero Transition**: 
   - Instant switch (no transition) between video and hero background
   - Background image appears immediately when video ends
   - Hero elements fade in slowly (1500ms) after background appears

3. **Hero Content Animations**:
   - Staggered fade-in with Y-translate
   - Sequential delays (200ms, 400ms, 600ms, 800ms, 1000ms)
   - Smooth ease-in-out timing

4. **Event Cards**:
   - Image zoom on hover (scale 1.1)
   - Shadow elevation on hover
   - Title color change (gray → indigo)

5. **Modal Entrance**: Zoom-in animation (95% → 100%)

6. **AI Button**: Scale animation on hover/click

7. **Parallax Background**: Very slow scroll effect (0.3x rate) on hero background

### **Responsive Design**:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Grid layouts adapt (1 → 2 → 3 columns)
- Hero content adapts (full width → 65% max width)
- Navigation collapses on mobile

---

## 🔘 Button Actions Summary

### **Functional Buttons**:
1. ✅ **"Explore Events"** (Hero primary CTA)
   - Action: Scrolls to events grid section
   - Smooth scroll behavior

2. ✅ **"Explore"** (Header navigation)
   - Action: Scrolls to events grid section
   - Smooth scroll behavior

3. ✅ **Category Tabs** (Events grid header: All/Music/Tech/Food)
   - Action: Filters events by selected category

4. ✅ **Event Card** (Click anywhere on card)
   - Action: Opens BookingModal with event details

5. ✅ **"Clear all filters"** (Empty state)
   - Action: Resets searchQuery and selectedCategory

6. ✅ **Search Bar** (Hero section)
   - Action: Submits search query, filters events

7. ✅ **AI Assistant Button** (Floating button)
   - Action: Opens/closes AI chat interface

8. ✅ **AI Chat Send Button**
   - Action: Sends user message, triggers AI recommendation

9. ✅ **Modal Close** (X button or backdrop click)
   - Action: Closes BookingModal

10. ✅ **AI Chat Close** (X button)
    - Action: Closes AI chat interface

### **Non-Functional Buttons** (Placeholders):
1. ⚠️ **"Sign In"** (Header)
2. ⚠️ **"List Your Event"** (Header & Hero secondary CTA)
3. ⚠️ **Navigation links** (How It Works, About)
4. ⚠️ **"Confirm Booking"** (Modal)
5. ⚠️ **"Create an Event"** (CTA section)
6. ⚠️ **"Learn More"** (CTA section)
7. ⚠️ **Social media links** (Twitter, Instagram)

---

## 📊 Data Structure

### **Event Object**:
```typescript
{
  id: string
  title: string
  description: string
  date: string
  location: string
  category: EventCategory (Music | Technology | Art | Sports | Food & Drink | Business)
  price: number
  imageUrl: string
  organizer: string
}
```

### **Mock Events** (5 sample events):
1. Summer Music Festival 2024 - $120
2. AI & Future Tech Summit - $499
3. Gourmet Food Tour - $85
4. Contemporary Art Expo - $45
5. Startup Pitch Night - $25

---

## 🚀 Key Features

1. **Cinematic Introduction**: Video intro with instant switch to hero
2. **Premium Hero Design**: Clean SaaS aesthetic with clear CTAs
3. **Intelligent Search**: Real-time filtering by text
4. **AI Recommendations**: Gemini AI-powered event suggestions
5. **Responsive Design**: Mobile-first, adaptive layouts
6. **Smooth Animations**: BlurText, fade-ins, hover effects, parallax
7. **Modal Booking**: Detailed event view with booking interface
8. **Performance**: Memoized filtering, optimized renders

---

## 🔧 Environment Requirements

- **Node.js** (required)
- **GEMINI_API_KEY** (optional, for AI features)
  - Set in `.env.local` file
  - Without it, AI Assistant will show error messages

---

## 📝 Design Notes

### **Hero Section Design Philosophy**:
- **Premium SaaS Aesthetic**: Clean, modern, conversion-focused
- **High Whitespace**: Strict grid alignment, spacious layout
- **Clear Visual Hierarchy**: Primary CTA prominently displayed
- **Single Primary Action**: "Explore Events" is the main focus
- **Trust Signals**: Subtle, reassuring elements
- **Calm & Confident**: No flashy animations, professional feel

### **Transition Strategy**:
- Video and hero background use identical positioning (`objectFit: 'cover'`, `objectPosition: 'center center'`)
- Instant switch ensures perfect alignment (no transition on background)
- Hero elements fade in slowly after background appears
- Black overlay (40%) on both video and background for consistency

---

**Last Updated**: Current project state - Premium Hero Redesign
