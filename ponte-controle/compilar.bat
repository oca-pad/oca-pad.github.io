@echo off
rem Compila a ponte com o compilador C# que ja vem no Windows (.NET Framework 4.8). Nao precisa instalar nada.
cd /d "%~dp0"
"%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /nologo /target:winexe /optimize+ /out:ponte-controle.exe ^
  /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /r:System.Net.dll Ponte.cs
if errorlevel 1 (
  echo.
  echo Deu erro ao compilar.
  pause
  exit /b 1
)
echo Pronto: ponte-controle.exe
