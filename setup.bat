@echo off
setlocal
cd /d %~dp0

echo [1/3] Creating or updating conda environment from environment.yml...
call conda env create -f environment.yml
if errorlevel 1 (
  echo conda env create failed. Trying conda env update...
  call conda env update -f environment.yml --prune
  if errorlevel 1 (
    echo Failed to prepare conda environment.
    exit /b 1
  )
)

echo [2/3] Activating slui environment...
call conda activate slui
if errorlevel 1 (
  echo Failed to activate conda environment: slui
  exit /b 1
)

echo [3/3] Installing frontend npm packages...
cd frontend
call npm install
if errorlevel 1 (
  echo npm install failed.
  exit /b 1
)

echo Setup completed successfully.
echo Backend: cd backend ^&^& uvicorn main:app --reload --port 8000
echo Frontend: cd frontend ^&^& npm run dev
endlocal
