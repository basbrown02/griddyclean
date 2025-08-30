# Griddy - Renewable Energy Platform

A modern web application for AI-powered renewable energy analysis and recommendations, built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Interactive Google Maps**: Australia-focused map with renewable energy site markers
- **AI Chat Interface**: Modern chat UI with loading states and message history
- **Filter System**: Toggle between different renewable energy types (Solar, Wind, Hydro)
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Maps**: Google Maps JavaScript API
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd griddy2
```

2. Install dependencies:
```bash
npm install
```

3. Create your env file (one command), then run the dev server:
```bash
cp .env.example .env.local
# Edit .env.local and paste your API keys
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
griddy2/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── textarea.tsx
│   │   └── ai-input.tsx
│   └── GoogleMap.tsx     # Google Maps component
├── lib/                  # Utility functions
│   └── utils.ts
├── public/               # Static assets
│   └── images/
│       ├── Background.png
│       └── Logo.png
└── images/               # Original images
```

## Key Components

### GoogleMap Component
- Integrates Google Maps JavaScript API
- Shows Australia with renewable energy site markers
- Custom map styling for better visualization
- Interactive controls for layers and options

### AIInput Component
- Modern chat input with auto-resize
- Loading states with animated indicators
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Placeholder text and status messages

### Main Page
- Two-column layout (map + sidebar)
- Filter system for renewable energy types
- Chat message history
- Responsive grid system

## Configuration

### Google Maps API
Provide your Google Maps API key in `.env.local` using `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (and optionally `GOOGLE_MAPS_API_KEY` for server).

### Environment Variables
Copy `.env.example` to `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
ML_SERVICE_URL=http://localhost:3000/api/echo-ml
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Styling
The application uses Tailwind CSS with custom CSS variables for theming. Colors and other design tokens can be modified in:
- `tailwind.config.js` - Tailwind configuration
- `app/globals.css` - CSS variables and global styles

### Components
All UI components are built with shadcn/ui and can be customized by modifying their respective files in the `components/ui/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.
