@echo off
cd /d %~dp0
call conda activate slui
uvicorn main:app --reload --port 8000
pause
