# RESQAI Frontend

React + Vite frontend for the RESQAI AI-Assisted Disaster Response System.

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Features

### Three Role-Based Interfaces

#### 1. Reporter/Citizen
- Submit disaster incidents with optional location
- View submitted incident status
- Track AI classification results
- Monitor rescue team assignment

#### 2. Administrator
- View all incidents dashboard
- Filter by category, urgency, status
- View AI classification details
- Assign incidents to rescue teams
- Monitor incident statistics

#### 3. Rescue Team
- View assigned incidents
- Update incident status (Accept → En Route → On Site → Resolved)
- Add field notes
- Track high-priority incidents

## Prerequisites

- Node.js 16 or higher
- Backend server running on http://localhost:5000
- ML service running on http://localhost:8000

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy the example environment file:
```bash
copy .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will start on http://localhost:5173

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── AIResultCard.jsx
│   │   ├── CategoryBadge.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── IncidentCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── LocationCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RoleRoute.jsx
│   │   ├── StatusBadge.jsx
│   │   └── UrgencyBadge.jsx
│   │
│   ├── pages/                # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── reporter/
│   │   │   ├── ReporterDashboard.jsx
│   │   │   ├── SubmitIncident.jsx
│   │   │   └── IncidentDetails.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Incidents.jsx
│   │   │   └── IncidentDetails.jsx
│   │   └── rescue/
│   │       ├── RescueDashboard.jsx
│   │       └── IncidentDetails.jsx
│   │
│   ├── context/              # React Context
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/                # Custom hooks
│   │   └── useAuth.js
│   │
│   ├── services/             # API services
│   │   └── api.js
│   │
│   ├── utils/                # Utilities
│   │   └── constants.js
│   │
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
│
├── public/                   # Static assets
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts development server with hot reload at http://localhost:5173

### Build
```bash
npm run build
```
Builds production-ready bundle to `dist/` folder

### Preview
```bash
npm run preview
```
Preview production build locally

### Lint
```bash
npm run lint
```
Run ESLint to check code quality

## Features Detail

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Auto-redirect based on user role
- Protected routes with role-based access control

### Incident Submission
- Rich text message input
- Optional location via:
  - Browser geolocation
  - Manual latitude/longitude
  - Address/landmark
- Real-time AI classification
- Displays BERTweet or Gemini results
- Shows confidence scores and urgency

### AI Classification Display
- Category with color-coded badges
- Confidence percentage
- Model used (BERTweet or Gemini)
- Urgency level
- Humanitarian status
- Request for help indicator
- AI explanation
- Original BERTweet prediction (when Gemini is used)

### Admin Dashboard
- Statistics overview
- Category distribution
- Urgency distribution
- Model usage stats
- Filter by category, urgency, status
- Search functionality
- Assign rescue teams
- View incident details

### Rescue Team Interface
- View assigned incidents
- Update status workflow:
  - Assigned → Accepted
  - Accepted → En Route
  - En Route → On Site
  - On Site → Resolved
- Add field notes
- View incident details
- Contact information

## API Integration

The frontend communicates with the backend REST API:

### Auth Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Reporter Endpoints
- `POST /api/incidents` - Create incident
- `GET /api/incidents/my` - Get my incidents
- `GET /api/incidents/:id` - Get incident details

### Admin Endpoints
- `GET /api/admin/incidents` - Get all incidents (with filters)
- `GET /api/admin/incidents/stats` - Get statistics
- `POST /api/admin/incidents/:id/assign` - Assign rescue team
- `GET /api/admin/rescue-teams` - Get rescue teams

### Rescue Endpoints
- `GET /api/rescue/incidents` - Get assigned incidents
- `GET /api/rescue/incidents/:id` - Get incident details
- `PATCH /api/rescue/incidents/:id/status` - Update status

## Styling

### Tailwind CSS
The project uses Tailwind CSS with custom configuration:

- Custom color palette (primary, danger, warning, success)
- Reusable component classes (btn, input, card, badge)
- Responsive breakpoints
- Utility-first approach

### Component Patterns
- Consistent spacing and padding
- Color-coded urgency indicators
- Status badges with semantic colors
- Loading states for all async operations
- Error handling with user-friendly messages

## Security

### Frontend Security Measures
- No API keys or secrets in code
- JWT tokens stored in localStorage
- Auto-logout on token expiration
- Role-based route protection
- Input validation
- HTTPS required in production

### What's NOT in Frontend
- ML model inference
- Gemini API calls
- Database operations
- Authentication logic
- All sensitive operations handled by backend

## Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Collapsible navigation on mobile
- Table → Card view on small screens
- Touch-friendly buttons and inputs

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader friendly

## Deployment

### Production Build

1. **Update environment variables**
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy `dist/` folder to:**
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

### Environment Variables

Only one environment variable:
- `VITE_API_URL` - Backend API URL

## Development Tips

### Hot Reload
Vite provides instant hot module replacement (HMR). Changes reflect immediately.

### Component Development
Create reusable components in `components/` folder. Use them across pages.

### State Management
- Local state with `useState`
- Global auth state with Context API
- No Redux needed for this scale

### API Calls
All API calls go through `services/api.js`. This centralizes:
- Base URL configuration
- Token injection
- Error handling
- Response interceptors

## Troubleshooting

### Cannot connect to backend
```
Error: Network Error
```
**Solution:** Ensure backend is running on http://localhost:5000

### CORS errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Backend should have CORS enabled for http://localhost:5173

### Token expired
```
Error: 401 Unauthorized
```
**Solution:** Login again to get a new token

### Build errors
```
Error: Module not found
```
**Solution:** Run `npm install` to ensure all dependencies are installed

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for routes (if needed)
- Optimized images
- Minified production build
- Code splitting by route
- Efficient re-renders with React best practices

## Testing

For testing, you can use:
```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test
```

## Contributing

1. Follow existing code structure
2. Use Tailwind utility classes
3. Create reusable components
4. Add proper error handling
5. Test on multiple screen sizes

## Support

For issues:
- Check backend is running
- Check ML service is running
- Check browser console for errors
- Verify API URL in .env

---

**Frontend built and ready for production!**
