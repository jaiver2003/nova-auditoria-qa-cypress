# INFORME DE EVALUACIÓN DE SEGURIDAD WEB (OPENVAS/GVM + INSPECCIÓN PASIVA)
## Plataforma NOVA — Módulo UniDoc · Rol **Rectoría**
### Calidad de Software II — Trabajo Final · Entregable 3 de 3

> **Nota de alcance e integridad.** Los resultados de OpenVAS/GVM provienen del reporte exportado `reporte_openvas_nova.xml/.pdf` (escaneo real del 17/11/2026, 22:23 a 23:27 UTC). Los puntajes CVSS de los hallazgos de OpenVAS son los del propio escáner; los de la inspección pasiva (VULN-01 a VULN-07) son **estimaciones manuales** y así se señalan. Se documentan los escaneos previos que no fueron válidos y su causa (Anexo C). No se reportan datos que no provengan de una ejecución real.

---

## 1. Portada y control de versiones

| Campo | Detalle |
|---|---|
| **Institución** | Corporación Universitaria Autónoma del Cauca (Uniautónoma) |
| **Asignatura** | Calidad de Software II · **Docente:** Jefferson Andrés Muñoz |
| **Firma QA (rol asumido)** | Grupo 1 — Aseguramiento de Calidad |
| **Sistema bajo prueba** | NOVA — `https://nova.uniautonoma.edu.co/` |
| **Módulo / rol** | UniDoc — Convocatorias y Gestión de Avales · Rol **Rectoría** |
| **Fecha de evaluación** | 16 de noviembre de 2026 |
| **Fecha de entrega** | 17 de noviembre de 2026 |

**Integrantes:** Jaiver Muñoz Muñoz · Martha Isabel España Gonzales

**Historial de versiones**

| Versión | Fecha | Autor | Cambio |
|---|---|---|---|
| 1.0 | 16/11/2026 | Equipo G1 | Inspección pasiva de cabeceras HTTP y mecanismo de sesión. |
| 2.0 | 16/11/2026 | Equipo G1 | **Reescritura honesta:** se retira toda referencia a un escaneo OpenVAS no ejecutado; se conservan solo hallazgos verificables y se añade guía para el escaneo OpenVAS real. |
| 2.1 | 17/11/2026 | Equipo G1 | Se documenta (Anexo C) la instalación y 6 ejecuciones de OpenVAS/GVM no concluyentes y su causa (plugins corruptos). |
| 3.0 | 17/11/2026 | Equipo G1 | **Escaneo OpenVAS válido** tras reinstalar el *feed*: 34 resultados, 2 puertos, TLS y servicios; se integran con la inspección pasiva (VULN-01 a VULN-11), matriz de riesgo y plan de remediación. |

---

## 2. Resumen ejecutivo

Se evaluó la seguridad de la plataforma NOVA (módulo UniDoc, rol **Rectoría**) con dos métodos complementarios y **sin explotar vulnerabilidades ni provocar denegación de servicio**: un escaneo automatizado con **OpenVAS/GVM** (perfil *Full and Fast*, puertos 80 y 443, sin credenciales) y una **inspección pasiva** de cabeceras y del almacenamiento de sesión.

**Nivel de riesgo general: MEDIO.** OpenVAS **no detectó vulnerabilidades críticas ni altas ni CVE asociados** en los servicios expuestos (nginx, TLS 1.2/1.3 con certificado válido). El riesgo proviene sobre todo de **configuraciones de seguridad web ausentes** y del manejo de la sesión en el navegador.

**Hallazgos por severidad (11 en total):** Crítica 0 · Alta 1 · Media 6 · Baja 2 · Informativa 2. De las 6 medias, **2 son detecciones genéricas de baja confianza** (VULN-08 y VULN-09) que consideramos *falsos positivos probables*, pendientes de verificación.

**Tres acciones más urgentes:**
1. **Mover los tokens de sesión (JWT) a cookies `HttpOnly`/`Secure`** en lugar de `localStorage`/`sessionStorage` (VULN-01), para que un XSS no pueda robar la sesión de un usuario de Rectoría.
2. **Añadir cabeceras de seguridad en Nginx**: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options` y `X-Content-Type-Options` (VULN-02, 03, 04). OpenVAS confirmó su ausencia en 443.
3. **Revisar la política CORS** (`Access-Control-Allow-Private-Network: true`) y **estandarizar los errores de API** para que respondan 401/403 y no 500 sin token (VULN-05, 07).

**Aspectos positivos verificados:** solo TLS 1.2 y 1.3, suites con *Perfect Forward Secrecy*, certificado de DigiCert vigente hasta 25/03/2027, redirección y HTTP/2 disponibles, y la versión de nginx no se divulga.

---

## 3. Autorización y reglas de enfrentamiento

- **Objetivo autorizado:** `https://nova.uniautonoma.edu.co/`, dentro del marco académico del Trabajo Final de Calidad de Software II.
- **Autoridad:** el docente Jefferson Andrés Muñoz, como responsable del ejercicio sobre el sistema.
- **Restricciones respetadas:** **sin explotación** de vulnerabilidades, **sin denegación de servicio**, sin acceso ni modificación de datos fuera del rol, sin enumeración de usuarios. La inspección se limitó a observar cabeceras HTTP de respuestas normales y el almacenamiento de sesión en el propio navegador.
- **Marco legal:** Ley 1273 de 2009 (Colombia). Hallazgos confidenciales, solo para el docente.

---

## 4. Alcance y metodología

- **Objetivo escaneado:** `nova.uniautonoma.edu.co` (IP 179.1.113.103), puertos **80/TCP y 443/TCP**. Se limitó a estos dos puertos por prudencia al ser un servidor real compartido.
- **Herramienta y versión:** Greenbone Community Edition en Docker Desktop 4.99.0 (Windows 11, WSL2): gvmd 26.43.0, ospd-openvas 22.10.6, openvasd 23.52.12, interfaz GSA 28.7.0. Feeds: NVT 20261117T0550, SCAP 20261117T0218, CERT 20261117T0420, GVMD_DATA 20261117T0502. Base de 132 555 NVTs.
- **Perfil de escaneo:** *Full and Fast*, scanner *OpenVAS Default*, *Alive Test: Consider Hosts as Alive*. **Sin credenciales** (escaneo de caja negra, sin autenticación). El perfil trae desactivado el escaneo genérico de aplicaciones web, por lo que **no se probaron inyecciones SQL ni XSS**.
- **Fecha y hora del escaneo válido:** 17/11/2026, 22:23 a 23:27 UTC (17:23 a 18:27 COT), duración 1 h 03 min, estado *Done*, 1 host, 0 errores del escáner.
- **Inspección pasiva (complemento):** 16/11/2026, noche (COT). Cabeceras HTTP de `/`, `OPTIONS /api/login/` y `GET /api/login/` (`security_inspection.json`) y mecanismo de sesión en el navegador tras un acceso legítimo (`session_mecanismo.json`).
- **Modalidad:** caja negra, sin explotación, sin módulos de denegación de servicio, sin enumeración de usuarios.

---

## 5. Resultados generales

**Resultados de OpenVAS (reporte `f4daf271…`, 34 resultados):**

| Severidad (OpenVAS) | Cantidad |
|---|---|
| Crítica | 0 |
| Alta | 0 |
| Media | 2 |
| Baja | 1 |
| Log (informativos) | 31 |
| **Total** | **34** |

**Puertos y servicios detectados:**

| Puerto | Servicio | Detalle |
|---|---|---|
| 80/TCP | HTTP | Servidor `nginx` (versión no identificada). Responde con redirección 30x a rutas inexistentes. |
| 443/TCP | HTTPS | `nginx`, TLS 1.2 y TLS 1.3, ALPN con HTTP/1.1 y HTTP/2, HTTP comprimido con gzip. |

**Otros datos del host:** hostname `nova.uniautonoma.edu.co` (DNS directo); sistema operativo **no identificado**; distancia de red al escáner: 2 saltos; CPE detectados: `cpe:/a:nginx:nginx`, `cpe:/a:f5:nginx` y TLS 1.2/1.3.

**Certificado TLS (443):** sujeto `CN=uniautonoma.edu.co` (SAN `uniautonoma.edu.co` y `*.uniautonoma.edu.co`), emitido por *DigiCert Global G2 TLS RSA SHA256 2020 CA1*, RSA 2048 bits, firma `sha256WithRSAEncryption`, vigente del 08/09/2026 al 25/03/2027.

**Inspección pasiva (resumen):**
- Raíz `/` → 200, con `cache-control: no-store`, pero **sin** HSTS, CSP ni `X-Frame-Options`.
- `GET /api/login/` → 405 con `Allow: POST, OPTIONS`; la API **sí** envía `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: same-origin`, `Cross-Origin-Opener-Policy: same-origin`.
- `OPTIONS /api/login/` → 200 con `Access-Control-Allow-Private-Network: true`.
- Sesión: `access_token` en `sessionStorage`; `refresh_token` y `_at_shared` en `localStorage` (aspecto de JWT); cookie `g_state` de Google con `httpOnly=false`, `secure=false`.

**Conteo unificado de hallazgos del informe (escala común):**

| Severidad | Cantidad | IDs |
|---|---|---|
| Crítica | 0 | — |
| Alta | 1 | VULN-01 |
| Media | 6 | VULN-02, 03, 04, 05, 08, 09 |
| Baja | 2 | VULN-07, 10 |
| Informativa | 2 | VULN-06, 11 |

---

## 6. Tabla de hallazgos

| ID | Hallazgo | Fuente | CVE | CVSS | Severidad | Host/puerto | Estado |
|---|---|---|---|---|---|---|---|
| VULN-01 | Tokens de sesión JWT en Web Storage | Pasiva | — | 7,5 (est.) | **Alta** | nova…:443 | Confirmado |
| VULN-02 | Ausencia de `Content-Security-Policy` en el frontend | Pasiva + OpenVAS | — | 6,1 (est.) | Media | nova…:443 | Confirmado por ambas |
| VULN-03 | Ausencia de `Strict-Transport-Security` (HSTS) | Pasiva + OpenVAS | — | 5,3 (est.) | Media | nova…:443 | Confirmado por ambas |
| VULN-04 | Ausencia de `X-Frame-Options`/`frame-ancestors` y de `X-Content-Type-Options` en el frontend | Pasiva + OpenVAS | — | 4,7 (est.) | Media | nova…:443 | Confirmado por ambas |
| VULN-05 | CORS `Access-Control-Allow-Private-Network: true` | Pasiva | — | 5,3 (est.) | Media | nova…:443 | Confirmado |
| VULN-06 | Se divulga el producto `nginx` (sin versión) | Pasiva + OpenVAS | — | 2,6 (est.) | Informativa | nova…:80/443 | Confirmado (versión no expuesta) |
| VULN-07 | API de Rectoría podría responder 500 sin token | Pasiva | — | 3,1 (est.) | Baja | nova…:443 | Por confirmar |
| VULN-08 | SSL/TLS: BREACH, compresión HTTP activa | OpenVAS | — (refs CERT-Bund/DFN-CERT) | **5,9** | Media | nova…:443 | Falso positivo probable (QoD 30 %) |
| VULN-09 | TCP Sequence Number Approximation Reset DoS (abr. 2004) | OpenVAS | — (refs CERT-Bund) | **5,0** | Media | nova…:443 | Falso positivo probable (QoD 50 %) |
| VULN-10 | TCP Timestamps: divulgación de información (uptime) | OpenVAS | — | **2,6** | Baja | general/tcp | Confirmado (QoD 80 %) |
| VULN-11 | Enumeración de métodos HTTP en puerto 80 (GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE) | OpenVAS | — | 0,0 | Informativa | nova…:80 | Por verificar (probable redirección 30x) |

> Los CVSS de VULN-08, 09 y 10 son los reportados por OpenVAS. Los marcados *(est.)* son estimaciones manuales del equipo. OpenVAS no asoció **ningún CVE** a los servicios de NOVA.

---

## 7. Análisis detallado de hallazgos (11)

### VULN-01 — Tokens JWT en Web Storage · Alta
- **Descripción:** el `access_token` (sessionStorage) y el `refresh_token`/`_at_shared` (localStorage) son legibles por JavaScript del DOM.
- **Impacto en Rectoría:** ante un XSS en cualquier parte de la plataforma, un atacante podría leer el token de un usuario de Rectoría y suplantar su sesión para consultar la Gestión de Avales. Confidencialidad comprometida.
- **Evidencia:** `session_mecanismo.json` (claves `access_token`, `refresh_token`, `_at_shared`, `"pareceJWT": true`). Observado sobre una sesión de NOVA; el patrón es de plataforma y aplica a UniDoc.
- **Recomendación:** emitir los tokens en cookies `HttpOnly; Secure; SameSite=Lax`, inaccesibles a scripts.

### VULN-02 — Ausencia de CSP · Media
- **Descripción:** la raíz no devuelve `Content-Security-Policy`; no hay lista blanca de orígenes para scripts/estilos/frames.
- **Impacto en Rectoría:** mayor superficie para inyección de scripts de terceros en la interfaz del panel.
- **Evidencia:** `security_inspection.json` (cabeceras de `/` sin CSP) y `reporte_openvas_nova.xml` (OID `1.3.6.1.4.1.25623.1.0.112081`, *HTTP Security Headers Detection* en 80 y 443: faltan `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Embedder/Opener/Resource-Policy`, entre otras).
- **Recomendación:** definir una CSP restrictiva en Nginx que contemple los orígenes legítimos de Google (login) y el propio dominio.

### VULN-03 — Ausencia de HSTS · Media
- **Descripción:** sin `Strict-Transport-Security` en 443; aunque haya redirección a HTTPS, la primera conexión es degradable (SSL-strip).
- **Impacto en Rectoría:** en redes Wi-Fi compartidas, riesgo de intercepción de la credencial de acceso.
- **Evidencia:** `security_inspection.json` (sin la cabecera en `/`) y `reporte_openvas_nova.xml` (OID `1.3.6.1.4.1.25623.1.0.105879`, *HTTP Strict Transport Security (HSTS) Missing* en 443).
- **Recomendación:** `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`.

### VULN-04 — Clickjacking y falta de `nosniff` en el frontend · Media
- **Descripción:** la API incluye `X-Frame-Options: DENY`, pero la página frontend `/` no trae `X-Frame-Options` ni `frame-ancestors`.
- **Impacto en Rectoría:** la interfaz podría embeberse en un iframe malicioso para engañar a un usuario de Rectoría (clics superpuestos).
- **Evidencia:** `security_inspection.json` (API con `x-frame-options: DENY`; raíz sin ella) y `reporte_openvas_nova.xml` (OID `1.3.6.1.4.1.25623.1.0.112081`: faltan `X-Frame-Options` y `X-Content-Type-Options` en 80 y 443).
- **Recomendación:** `add_header X-Frame-Options "SAMEORIGIN" always;` o `frame-ancestors 'self'` vía CSP en el frontend.

### VULN-05 — CORS Private Network · Media
- **Descripción:** `OPTIONS /api/login/` responde `Access-Control-Allow-Private-Network: true`, que habilita solicitudes desde redes privadas hacia el recurso.
- **Impacto en Rectoría:** amplía la superficie de peticiones cross-origin; debe verificarse que no exponga APIs internas.
- **Evidencia:** `security_inspection.json` (cabecera en el preflight de `/api/login/`).
- **Recomendación:** restringir esta política a lo estrictamente necesario y revisar `Access-Control-Allow-Origin`.

### VULN-06 — Divulgación del producto `nginx` · Informativa
- **Descripción:** la cabecera `Server: nginx` revela el producto. OpenVAS (OID `1.3.6.1.4.1.25623.1.0.108708` y `1.3.6.1.4.1.25623.1.0.113787`) confirmó que **la versión no se expone** (`Version: unknown`), por lo que el riesgo es mínimo.
- **Recomendación:** mantener `server_tokens off;` y, si se desea, ocultar también el nombre del producto.

### VULN-07 — Manejo de error en API sin token · Baja (por confirmar)
- **Descripción:** se correlaciona con REC-OBS-01 del informe funcional: la API de Rectoría podría responder 500 ante la ausencia de token en vez de 401/403, lo que puede filtrar detalles de la pila.
- **Recomendación:** estandarizar respuestas 401/403 y ocultar trazas. **Confirmar capturando el código y cuerpo exactos.**

### VULN-08 — SSL/TLS: BREACH (compresión HTTP) · Media (CVSS 5,9 · OpenVAS) · Falso positivo probable
- **Descripción:** OpenVAS detectó `Content-Encoding: gzip` en `https://nova.uniautonoma.edu.co/` y lo reporta como posible exposición al ataque BREACH (vector `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N`).
- **Impacto en Rectoría:** BREACH requiere que una respuesta comprimida **refleje datos controlados por el atacante junto con un secreto** (p. ej., un token CSRF). La raíz es la página estática de la aplicación y los tokens de NOVA viajan en el almacenamiento del navegador, no en el cuerpo de estas respuestas; el riesgo práctico es bajo. Debe revisarse en páginas dinámicas con secretos.
- **Evidencia:** `reporte_openvas_nova.xml`, OID `1.3.6.1.4.1.25623.1.0.117414`, QoD 30 % (confianza baja).
- **Recomendación:** no comprimir respuestas que contengan secretos, separar secretos de la entrada del usuario o enmascarar/aleatorizar los tokens por petición.

### VULN-09 — TCP Sequence Number Approximation Reset DoS (abr. 2004) · Media (CVSS 5,0 · OpenVAS) · Falso positivo probable
- **Descripción:** detección genérica de una debilidad antigua de pilas TCP (paquetes RST falsificados). Los productos afectados que cita la propia prueba (Microsoft Windows, Cisco, Juniper, IBM AIX) no coinciden con lo identificado en el objetivo (`nginx`; el sistema operativo no pudo determinarse).
- **Impacto en Rectoría:** una pérdida de disponibilidad de conexiones TCP afectaría el acceso al panel; no se intentó explotarla.
- **Evidencia:** `reporte_openvas_nova.xml`, OID `1.3.6.1.4.1.25623.1.0.902815`, QoD 50 %.
- **Recomendación:** confirmar con el equipo de infraestructura que el sistema operativo y el balanceador aplican las mitigaciones modernas del TCP (RFC 5961); si es así, descartar.

### VULN-10 — TCP Timestamps · Baja (CVSS 2,6 · OpenVAS)
- **Descripción:** el host implementa marcas de tiempo TCP (RFC 1323/7323), lo que permite estimar el *uptime* del servidor.
- **Impacto en Rectoría:** información de reconocimiento de bajo valor; ayuda a un atacante a inferir ventanas de reinicio o parches.
- **Evidencia:** `reporte_openvas_nova.xml`, OID `1.3.6.1.4.1.25623.1.0.80091`, QoD 80 %; marcas de tiempo 845074110 y 845075238 con 1 s de diferencia.
- **Recomendación:** en Linux, `net.ipv4.tcp_timestamps = 0` en `/etc/sysctl.conf` y `sysctl -p`.

### VULN-11 — Métodos HTTP en el puerto 80 · Informativa (por verificar)
- **Descripción:** la enumeración de OpenVAS en `http://nova.uniautonoma.edu.co/` lista GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS y TRACE. En 443 solo reporta GET y HEAD. En el mismo escaneo, el puerto 80 responde con redirección 30x a rutas inexistentes, por lo que es probable que la lista refleje la redirección y no métodos realmente habilitados.
- **Impacto en Rectoría:** si de verdad se aceptaran PUT, DELETE o TRACE en HTTP, habría riesgo de manipulación. No se probó ninguno (sin explotación).
- **Evidencia:** `reporte_openvas_nova.xml`, OID `1.3.6.1.4.1.25623.1.0.153974`, QoD 70 %.
- **Recomendación:** limitar métodos en Nginx (`limit_except GET HEAD POST { deny all; }`) y mantener la redirección de 80 a 443.

### Resultados positivos de OpenVAS (no son hallazgos)
- **TLS:** solo TLS 1.2 y TLS 1.3; no se aceptan versiones antiguas.
- **Cifrados:** se aceptan suites con *Perfect Forward Secrecy* (ECDHE). OpenVAS lista además como "Medium" algunas suites en modo CBC (`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`, `…AES_256_CBC_SHA384`, Camellia); es recomendable preferir GCM/ChaCha20.
- **Certificado:** válido, de DigiCert, con SAN comodín del dominio.
- **Servidor:** `nginx` sin versión visible; ninguna vulnerabilidad con CVE detectada.

---

## 8. Falsos positivos y limitaciones

- **Falsos positivos probables:** VULN-08 (BREACH, QoD 30 %) y VULN-09 (TCP RST, QoD 50 %) son detecciones genéricas de baja confianza, y los productos que cita VULN-09 no coinciden con el objetivo. VULN-11 puede deberse a que el puerto 80 redirige todo con 30x. Se dejan documentados para verificación por el equipo de infraestructura.
- **Qué no detecta este escaneo:** al ser un escaneo **sin credenciales** y con el escaneo genérico de aplicaciones web desactivado en el perfil, no evalúa inyecciones SQL, XSS reales, fallos de lógica de negocio, autenticación/autorización del rol Rectoría ni vulnerabilidades internas del sistema operativo.
- **Alcance de puertos:** solo 80 y 443 (decisión de prudencia). Otros servicios del host no se evaluaron.
- **Sistema operativo no identificado:** por eso algunas pruebas dependientes del SO no se pudieron correlacionar.
- **Escaneo desde Docker en Windows:** el escáner se ejecutó desde una red NAT; el tráfico llegó al servidor sin filtrado evidente (ver Anexo C).
- **Alcance de la evidencia de sesión:** VULN-01 se observó sobre una sesión de NOVA; conviene reconfirmarlo sobre una sesión de Rectoría en UniDoc.
- **Una sola corrida válida:** no se repitió el escaneo para no sobrecargar un servidor real.

---

## 9. Matriz de riesgo (probabilidad × impacto)

| Impacto \ Probabilidad | Baja | Media | Alta |
|---|---|---|---|
| **Mayor** | | VULN-01 | |
| **Moderado** | VULN-03, VULN-08, VULN-09 | VULN-02, VULN-05 | |
| **Menor** | VULN-04, VULN-06, VULN-11 | VULN-07 | VULN-10 |

---

## 10. Plan de remediación

| Prioridad | ID | Acción | Responsable sugerido | Plazo |
|---|---|---|---|---|
| P1 | VULN-01 | JWT a cookies `HttpOnly/Secure/SameSite` | Backend + Frontend | 5 días |
| P2 | VULN-02 | Desplegar CSP restrictiva | Infraestructura/DevOps | 7 días |
| P3 | VULN-03 | Activar HSTS | SysAdmin Nginx | 3 días |
| P4 | VULN-04 | `X-Frame-Options`/`frame-ancestors` y `X-Content-Type-Options: nosniff` en el frontend | Infraestructura | 3 días |
| P5 | VULN-05 | Restringir CORS Private Network | Backend/DevOps | 7 días |
| P6 | VULN-07 | Estandarizar errores 401/403 | Backend | 10 días |
| P7 | VULN-08 | Verificar BREACH en páginas dinámicas; enmascarar secretos | Backend | 14 días |
| P8 | VULN-09 | Confirmar mitigaciones TCP (RFC 5961) y descartar | SysAdmin | 14 días |
| P9 | VULN-10 | `net.ipv4.tcp_timestamps = 0` | SysAdmin | 14 días |
| P10 | VULN-11 | Limitar métodos HTTP y verificar el puerto 80 | SysAdmin Nginx | 7 días |
| P11 | VULN-06 | Mantener `server_tokens off` | SysAdmin Nginx | 2 días |

---

## 11. Conclusiones y relación con ISO/IEC 25010

Respecto a la característica de **Seguridad** de ISO/IEC 25010:

- **Confidencialidad:** el transporte está bien configurado (TLS 1.2/1.3, PFS, certificado vigente), pero la confidencialidad de la sesión depende de VULN-01 (tokens legibles por script). Es la prioridad.
- **Integridad:** la ausencia de CSP y de `X-Content-Type-Options` (VULN-02, VULN-04) amplía la superficie de manipulación en el navegador; las firmas JWT aportan integridad de sesión.
- **No repudio / autenticidad:** autenticación mediante Google y tokens firmados; conviene reforzar con errores estandarizados.
- **Responsabilidad / trazabilidad:** no evaluada por estos métodos; depende de los registros del servidor.

**Dictamen:** el servidor web expuesto presenta un endurecimiento **bueno en transporte y servicios** y **parcial en cabeceras y sesión**. OpenVAS no encontró vulnerabilidades críticas ni altas ni CVE; las 2 medias de OpenVAS son probables falsos positivos. La plataforma es **apta con reservas** para el uso del rol Rectoría, condicionada a implementar P1 a P4. Este resultado vale solo para los puertos 80 y 443, sin autenticación y sin pruebas de aplicación; **no demuestra la ausencia de vulnerabilidades en la lógica de la aplicación**.

---

## 12. Anexos

### Anexo A — Procedimiento ejecutado (OpenVAS/GVM)

1. Instalación de Greenbone Community Edition con Docker Compose y sincronización de feeds (NVT, SCAP, CERT, GVMD_DATA), registrando las versiones del apartado 4.
2. Creación de la lista de puertos `Web_80_443` (`T:80,443`) y del target `NOVA_web` (`nova.uniautonoma.edu.co`, *Consider Hosts as Alive*).
3. Tarea `NOVA_web_FullFast` con perfil *Full and Fast* y scanner *OpenVAS Default*, sin credenciales ni módulos de explotación o denegación de servicio.
4. Ejecución el 17/11/2026 (22:23 a 23:27 UTC) y exportación del reporte completo (sin filtros: `min_qod=0`, todos los niveles) en PDF y XML.
5. Conciliación con la inspección pasiva: confirmados por ambos métodos (VULN-02, 03, 04, 06), nuevos de OpenVAS (VULN-08 a 11) y probables falsos positivos (VULN-08, 09, 11).

### Anexo B — Evidencia

- `reporte_openvas_nova.pdf` y `reporte_openvas_nova.xml`: reporte completo exportado de OpenVAS (escaneo válido).
- `reporte_openvas_intento.pdf` / `.xml`: reporte de un escaneo previo **no válido** (0 puertos; ver Anexo C), conservado como evidencia del proceso.
- `security_inspection.json` y `session_mecanismo.json`: evidencia de la inspección pasiva.

### Anexo C — Escaneos previos no válidos y su causa

Antes del escaneo válido se hicieron **6 ejecuciones contra NOVA (17/11/2026, 06:40 a 12:56 UTC)** que terminaron en menos de 1 minuto con **0 puertos y 0 resultados**. No se interpretan como ausencia de vulnerabilidades.

| # | Hora (UTC) | Tarea | Duración | Puertos | Resultados |
|---|---|---|---|---|---|
| 1 | 06:40 | NOVA_Rectoria_FullFast | 1 min | 0 | 0 |
| 2 | 06:47 | NOVA_Rectoria_FullFast | 1 min | 0 | 0 |
| 3 | 06:50 | NOVA_Rectoria_FullFast | 1 min | 0 | 0 |
| 4 | 06:51 | NOVA_web_FullFast | 1 min | 0 | 0 |
| 5 | 07:10 | NOVA_web_FullFast | 51 s | 0 | 0 |
| 6 | 12:56 | NOVA_web_FullFast | < 1 min | 0 | 0 |
| **7** | **22:23 a 23:27** | **NOVA_web_FullFast** | **1 h 03 min** | **2** | **34** |

**Diagnóstico.** Un contenedor `nginx` propio (IP 172.18.0.18) escaneado en la misma red mostró el problema: solo se ejecutaban 4 pruebas de descubrimiento (ICMP, *Ping Host*, *Traceroute*, *Hostname Determination*) y 0 puertos, aunque `nmap -sT -p 80,443` desde el contenedor del escáner devolvía `80/tcp open`. El log de `openvas` mostraba `Stopped loading plugins: High number of errors` y `plugin_feed_info.inc: Checksum check failed`: **el directorio de plugins estaba corrupto**, probablemente por una copia interrumpida del *feed* cuando el motor de Docker se bloqueó. Con los plugins dañados, el escáner no llegaba a la fase de puertos ni a las pruebas de servicios.

**Corrección.** Se eliminaron todos los volúmenes (`docker compose down -v`), se descargaron de nuevo las imágenes y se resincronizó el *feed* completo. Tras ello, el escaneo del contenedor de prueba pasó a durar unos 5 minutos con 14 resultados, 2 aplicaciones y detección del sistema operativo, y el escaneo de NOVA (ejecución 7) fue completo.
