@echo off
setlocal

:: Define Variables
set "FRAMEWORK_ROOT=%~dp0\.."
set "BACKEND_DIR=%FRAMEWORK_ROOT%\backend"
set "VENV_DIR=%BACKEND_DIR%\venv"

echo [1/3] Checking Backend Directory...
if not exist "%BACKEND_DIR%" (
    echo Error: Backend directory not found at "%BACKEND_DIR%"
    goto :error
)

echo [2/3] Setting up Python Environment (venv)...
if exist "%VENV_DIR%\Scripts\activate.bat" (
    echo Venv already exists. Skipping creation.
) else (
    echo Creating new venv...
    python -m venv "%VENV_DIR%"
    if errorlevel 1 goto :error
)

echo [3/3] Installing Dependencies...
if exist "%BACKEND_DIR%\requirements.txt" (
    "%VENV_DIR%\Scripts\pip.exe" install -r "%BACKEND_DIR%\requirements.txt"
    if errorlevel 1 goto :error
) else (
    echo No requirements.txt found. Skipping install.
)

echo ==================================================
echo Setup Complete!
echo You can now use the framework commands.
echo ==================================================
goto :success

:error
echo ==================================================
echo Setup Failed!
echo Please check your python installation.
echo ==================================================
exit /b 1

:success
exit /b 0
