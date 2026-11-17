@echo off
cd /d "%~dp0"
echo ========================================
echo  Prueba de rendimiento UniDoc (Rectoria)
echo  Niveles: 5, 10, 15, 20 RPS x 20s
echo ========================================
set T=rendimiento\targets_unidoc.txt
set OUT=rendimiento\resultados
if not exist "%OUT%" mkdir "%OUT%"
where vegeta >nul 2>nul
if %errorlevel%==0 (set VG=vegeta) else (set VG=.\vegeta.exe)
for %%r in (5 10 15 20) do (
  echo.
  echo ^>^>^> Nivel %%r RPS durante 20s
  %VG% attack -targets=%T% -rate=%%r/s -duration=20s -output %OUT%\nivel_%%r.bin
  %VG% report %OUT%\nivel_%%r.bin
  %VG% report -type=json %OUT%\nivel_%%r.bin -output %OUT%\nivel_%%r.json
  timeout /t 5 >nul
)
echo.
echo ===== TERMINADO. Resultados en rendimiento\resultados\ =====
pause
