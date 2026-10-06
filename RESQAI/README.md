# RESQAI

AI-Assisted Disaster Response System.

## Frontend

The frontend is implemented with:

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React

### Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

### Backend configuration

Copy `.env.example` to `.env`.

By default:

```env
VITE_USE_MOCK_API=true
```

This lets the frontend run independently while the backend is being integrated.

For the real backend:

```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_API=false
```

The API layer is in `frontend/src/services/api.js`. Adjust endpoint paths there to exactly match the backend implementation.

## Project structure

```text
RESQAI/
├── frontend/
├── backend/
├── model/
└── README.md
```

The original standalone HTML prototype has been split into React components, pages, context, styling, and API services.