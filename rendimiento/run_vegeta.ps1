# Prueba de rendimiento PRUDENTE sobre endpoints PÚBLICOS de UniDoc (Rectoría) — Windows PowerShell.
# Requiere vegeta.exe accesible (en el PATH o en esta carpeta). Ejecutar desde la raíz del proyecto:
#   powershell -ExecutionPolicy Bypass -File rendimiento\run_vegeta.ps1
$T   = "rendimiento\targets_unidoc.txt"
$OUT = "rendimiento\resultados"
New-Item -ItemType Directory -Force -Path $OUT | Out-Null
$niveles = @(5,10,15,20)   # RPS por nivel (prudentes). Si un nivel supera 5% error o p95>3s, detenga.
foreach ($rps in $niveles) {
  Write-Host ">>> Nivel $rps RPS durante 20s"
  vegeta attack -targets=$T -rate="$rps/s" -duration=20s -output "$OUT\nivel_$rps.bin"
  vegeta report "$OUT\nivel_$rps.bin"
  vegeta report -type=json "$OUT\nivel_$rps.bin" -output "$OUT\nivel_$rps.json"
  Start-Sleep -Seconds 5
}
Write-Host "Listo. Entrega los archivos de $OUT (nivel_5.json, nivel_10.json, nivel_15.json, nivel_20.json)."
