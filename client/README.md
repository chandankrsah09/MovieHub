# MovieHub Frontend

A modern, responsive movie rating and review platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: User registration, login, and profile management
- **Movie Management**: Browse, add, and manage movies
- **Voting System**: Upvote/downvote movies with real-time updates
- **Comment System**: Add, edit, and delete comments on movies
- **Search & Filter**: Find movies by title, genre, and other criteria
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Instant UI updates with React Query

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── login/          # Authentication pages
│   │   ├── register/
│   │   ├── movies/         # Movie pages
│   │   │   ├── [id]/       # Movie detail page
│   │   │   └── new/        # Add movie page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components
│   │   ├── ui/            # Base UI components
│   │   ├── Navigation.tsx  # Main navigation
│   │   ├── MovieCard.tsx   # Movie card component
│   │   └── ReactQueryProvider.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   └── lib/               # Utilities and configurations
│       ├── api.ts         # API client and types
│       └── utils.ts       # Utility functions
├── .env.local             # Environment variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 UI Components

### Base Components
- **Button**: Customizable button with loading states
- **Input**: Form input with validation
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Card**: Container component with header, content, footer

### Feature Components
- **Navigation**: Main site navigation with user menu
- **MovieCard**: Movie display card with voting
- **AuthContext**: Authentication state management

## 🔗 API Integration

The frontend integrates with the MovieHub backend API:

- **Authentication**: Login, register, profile management
- **Movies**: CRUD operations, voting, filtering
- **Comments**: Add, edit, delete comments
- **Real-time Updates**: Automatic data refetching

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Grid Layouts**: Responsive movie grids
- **Navigation**: Mobile-friendly navigation menu

## 🎯 Key Features

### Authentication
- Secure login/register with form validation
- JWT token management
- Protected routes
- User profile display

### Movie Management
- Browse movies with pagination
- Search and filter by genre, year, etc.
- Add new movies (authenticated users)
- Movie detail pages with full information

### Voting System
- Upvote/downvote movies
- Real-time vote count updates
- User vote tracking
- Score calculation display

### Comment System
- Add comments to movies
- Edit/delete own comments
- Admin comment management
- Real-time comment updates

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `globals.css` for global styles
- Component styles use Tailwind utility classes

### API Configuration
- Update `src/lib/api.ts` for API endpoint changes
- Modify request/response interceptors as needed

## 📝 Development

### Code Structure
- **Pages**: Next.js App Router pages in `src/app/`
- **Components**: Reusable components in `src/components/`
- **Hooks**: Custom hooks in `src/hooks/` (if needed)
- **Utils**: Utility functions in `src/lib/`

### Best Practices
- TypeScript for type safety
- React Query for server state management
- Form validation with Zod
- Responsive design with Tailwind CSS
- Component composition and reusability

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test responsive design
5. Update documentation as needed