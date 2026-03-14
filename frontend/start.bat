@echo off
cd /d %~dp0
call conda activate slui
npm run dev
pause
