@echo off
REM Prueba de rendimiento PRUDENTE sobre endpoints publicos de UniDoc (Rectoria) - Windows CMD.
REM Requiere vegeta.exe en el PATH o en esta carpeta. Ejecutar desde la raiz del proyecto: rendimiento\run_vegeta.bat
set T=rendimiento\targets_unidoc.txt
set OUT=rendimiento\resultados
if not exist "%OUT%" mkdir "%OUT%"
for %%r in (5 10 15 20) do (
  echo ^>^>^> Nivel %%r RPS durante 20s
  vegeta attack -targets=%T% -rate=%%r/s -duration=20s -output %OUT%\nivel_%%r.bin
  vegeta report %OUT%\nivel_%%r.bin
  vegeta report -type=json %OUT%\nivel_%%r.bin -output %OUT%\nivel_%%r.json
  timeout /t 5 >nul
)
echo Listo. Entrega los nivel_*.json de %OUT%.
