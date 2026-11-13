@echo off
rem Startet den Schaeppi Verkaufsunterlagen (Oberflaeche + automatischer Eingangsordner).
title Schaeppi Verkaufsunterlagen
cd /d "%~dp0..\.."
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js ist nicht installiert. Bitte zuerst "Installieren.cmd" ausfuehren.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Erster Start: Komponenten werden installiert ...
  call npm install --omit=dev --no-audit --no-fund
)
node scripts\desktop.js %*
if errorlevel 1 pause
