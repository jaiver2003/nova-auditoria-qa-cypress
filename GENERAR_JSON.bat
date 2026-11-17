@echo off
cd /d "%~dp0"
set OUT=rendimiento\resultados
where vegeta >nul 2>nul
if %errorlevel%==0 (set VG=vegeta) else (set VG=.\vegeta.exe)
for %%r in (5 10 15 20) do (
  echo Generando nivel %%r ...
  %VG% report -type=json %OUT%\nivel_%%r.bin > %OUT%\nivel_%%r.json
  %VG% report %OUT%\nivel_%%r.bin > %OUT%\nivel_%%r.txt
)
echo ===== TERMINADO. Revisa rendimiento\resultados\ =====
pause
