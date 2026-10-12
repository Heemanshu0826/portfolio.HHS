@echo off
echo ===================================================
echo   portfolio.HHS - Local High-Speed Web Server
echo ===================================================
echo Starting local web server at http://localhost:5500 ...
echo Press Ctrl+C in this terminal window to stop the server.
echo.

start "" "http://localhost:5500"
python -m http.server 5500
pause
