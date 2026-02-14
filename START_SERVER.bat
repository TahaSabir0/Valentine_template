@echo off
echo.
echo ========================================
echo   Rose Garden Memory Map - Local Server
echo ========================================
echo.
echo Starting local server...
echo.
echo Once started, open your browser to:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python -m http.server 8000
