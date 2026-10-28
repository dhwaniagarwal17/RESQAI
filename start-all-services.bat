@echo off
echo ========================================
echo Starting RESQAI Services
echo ========================================
echo.

echo Starting ML Service...
start "ML Service" cmd /k "cd ml-service && venv\Scripts\activate && python -m app.main"
timeout /t 5 /nobreak > nul

echo Starting Backend...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo ML Service:   http://localhost:8000
echo Backend:      http://localhost:5000
echo Frontend:     http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
