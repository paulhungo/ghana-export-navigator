@echo off
title Ghana Agricultural Export Navigator
echo ============================================
echo   GHANA AGRICULTURAL EXPORT NAVIGATOR
echo ============================================
echo.
echo Starting the navigator on this computer...
echo (Keep this window open while using the site.)
echo.
cd /d "%~dp0"
start "" http://localhost:8087
python -m http.server 8087
pause
