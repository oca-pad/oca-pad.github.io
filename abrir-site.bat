@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Gerando a lista de musicas...
node scripts\gerar-indice.js
if errorlevel 1 (
  echo.
  echo Corrija o erro acima e tente de novo.
  pause
  exit /b 1
)
set ABRIR_NAVEGADOR=1
node scripts\servidor-local.js
pause
