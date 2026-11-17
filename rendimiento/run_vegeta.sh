#!/usr/bin/env bash
set -e
T=rendimiento/targets_unidoc.txt
OUT=rendimiento/resultados
mkdir -p "$OUT"
for rps in 5 10 15 20; do
  echo ">>> Nivel ${rps} RPS durante 20s"
  vegeta attack -targets="$T" -rate="${rps}/s" -duration=20s -output "$OUT/nivel_${rps}.bin"
  vegeta report "$OUT/nivel_${rps}.bin"
  vegeta report -type=json "$OUT/nivel_${rps}.bin" -output "$OUT/nivel_${rps}.json"
  sleep 5
done
