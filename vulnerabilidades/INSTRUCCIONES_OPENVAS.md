# OpenVAS / Greenbone Community Edition — Instalación y uso (Windows 11)

> Objetivo autorizado ÚNICO: `nova.uniautonoma.edu.co`. No escanear ningún otro host (Ley 1273/2009).
> Usar el perfil "Full and Fast" (no perfiles destructivos). Ejecutar en horario de bajo uso.

## Requisitos
- Windows 10/11 64 bits, 8+ GB RAM (16 recomendado), ~20 GB libres, internet estable.
- Tiempo estimado: 1–3 horas (la mayor parte es esperar la descarga de feeds).

## Paso 1 — Instalar Docker Desktop (con WSL2)
1. Si no tienes WSL2: abre **PowerShell como administrador** y ejecuta:
   `wsl --install`  → reinicia el equipo.
2. Descarga Docker Desktop: https://www.docker.com/products/docker-desktop/ (Windows).
3. Instálalo (deja marcada la opción de usar WSL2). Ábrelo y espera a que diga **"Engine running"**.

## Paso 2 — Descargar la configuración de Greenbone
1. Abre la página oficial "Greenbone Community Containers":
   https://greenbone.github.io/docs/latest/22.4/container/index.html
2. En la carpeta del proyecto crea `vulnerabilidades\greenbone` y abre ahí una terminal (PowerShell).
3. Descarga el archivo `docker-compose.yml` que indica esa página (botón/enlace de descarga del compose 22.4).

## Paso 3 — Descargar e iniciar los contenedores
En esa terminal, dentro de `vulnerabilidades\greenbone`:
```
docker compose -f docker-compose.yml -p greenbone-community-edition pull
docker compose -f docker-compose.yml -p greenbone-community-edition up -d
```

## Paso 4 — Esperar la sincronización de feeds (lo más largo)
- Los feeds (NVT, SCAP, CERT) se descargan solos la primera vez: 15–60+ min.
- Ver progreso:
  `docker compose -p greenbone-community-edition logs -f`
- NO escanees hasta que los feeds terminen de cargar.

## Paso 5 — Entrar a la interfaz web
- Navega a: http://127.0.0.1:9392
- Usuario/clave inicial: `admin` / `admin`.
- Si no entra, fija la clave:
  `docker compose -p greenbone-community-edition exec -u gvmd gvmd gvmd --user=admin --new-password=admin`

## Paso 6 — Crear objetivo y tarea
1. **Configuration → Targets → New Target**
   - Name: `NOVA`
   - Hosts: `nova.uniautonoma.edu.co`
   - (deja el resto por defecto) → Save
2. **Scans → Tasks → New Task**
   - Name: `Escaneo NOVA UniDoc`
   - Scan Targets: `NOVA`
   - Scan Config: **Full and Fast**
   - Save

## Paso 7 — Ejecutar y exportar
1. En **Scans → Tasks**, pulsa el botón ▶ (play) de la tarea. Tarda 20–90 min.
2. Al terminar: **Scans → Reports → (abre el reporte)**.
3. Descárgalo en **PDF** y en **XML** (menú de exportación).
4. Guarda ambos archivos en la carpeta `vulnerabilidades\` del proyecto, por ejemplo:
   `vulnerabilidades\reporte_openvas.pdf` y `vulnerabilidades\reporte_openvas.xml`

## Al terminar
Deja el PDF/XML en `vulnerabilidades\` y avísame: integro los hallazgos reales al informe
`G1_Vulnerabilidades` (reemplazo las estimaciones manuales por los datos del escáner,
concilio con los hallazgos pasivos, actualizo la tabla, la matriz de riesgo y el anexo).

## Si se complica esta noche
El informe actual ya es válido como evaluación pasiva + procedimiento OpenVAS documentado.
Puedes entregar así y adjuntar el reporte OpenVAS cuando lo tengas, si el docente lo exige.
