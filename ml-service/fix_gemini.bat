@echo off
echo ========================================
echo Fixing Gemini API Package
echo ========================================

cd /d "%~dp0"

echo.
echo [1/3] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [2/3] Uninstalling old google-genai package...
pip uninstall -y google-genai google-generativeai

echo.
echo [3/3] Installing latest google-generativeai package...
pip install --upgrade google-generativeai

echo.
echo ========================================
echo Gemini package fixed!
echo ========================================
echo.
echo Now you can start the ML service with:
echo   cd ml-service
echo   venv\Scripts\activate
echo   python -m app.main
echo.
pause
