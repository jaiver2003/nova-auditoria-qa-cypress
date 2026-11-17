# INFORME TÉCNICO DE AUDITORÍA DE VULNERABILIDADES (OPENVAS / GVM)
## PLATAFORMA INSTITUCIONAL NOVA — UNIVERSIDAD AUTÓNOMA DEL CAUCA
### ASIGNATURA: CALIDAD DE SOFTWARE II — TRABAJO FINAL (ENTREGABLE 3)

---

## 1. Portada y Control de Versiones

### 1.1 Información General
- **Institución:** Corporación Universitaria Autónoma del Cauca (Uniautónoma)
- **Facultad:** Ingeniería — Programa de Ingeniería de Software
- **Asignatura:** Calidad de Software II
- **Docente:** Jefferson Andrés Muñoz
- **Plataforma Evaluada:** Núcleo de Operaciones Virtuales Académicas (NOVA) — `https://nova.uniautonoma.edu.co/`
- **Módulos Evaluados:** Módulo UniDoc (Convocatorias / Gestión de Avales — Rol Rectoría) y Módulo Tickets (Rol Usuario Básico / Estudiante)
- **Fecha de Auditoría:** 16 y 17 de noviembre de 2026
- **Grupo Académico:** Grupo 1
- **Integrantes del Equipo:**
  - Jaiver Muñoz Muñoz (`jaiver.munoz@uniautonoma.edu.co`)
  - Martha Isabel España Gonzales (`martha.espana@uniautonoma.edu.co`)
- **Repositorio Git Oficial:** `c:\Users\USUARIO\Desktop\nova-qa-final` (Rama: `main`)
- **Enlace a Repositorio Remoto:** https://github.com/jaiver2003/nova-auditoria-qa-cypress

### 1.2 Historial de Control de Versiones del Documento

| Versión | Fecha | Autor(es) | Descripción del Cambio |
| :---: | :---: | :--- | :--- |
| **1.0.0** | 16/11/2026 | Martha Isabel España G. | Levantamiento de hallazgos pasivos de seguridad web, cabeceras HTTP y políticas de sesión. |
| **1.1.0** | 17/11/2026 | Jaiver Muñoz Muñoz | Estructuración formal de 12 secciones conforme a la sección 6.3 del enunciado, matriz de riesgo 5x5, análisis de impacto en roles Rectoría y Estudiante, y plan de remediación ISO/IEC 25010. |

---

## 2. Resumen Ejecutivo
El presente informe consolida los resultados de la auditoría de seguridad y análisis de vulnerabilidades ejecutada sobre la plataforma institucional **NOVA**, orientada específicamente a evaluar los vectores de exposición que amenazan la confidencialidad, integridad y disponibilidad de las operaciones del rol **Rectoría** (Gestión de Avales y Convocatorias Docentes en UniDoc) y del rol **Estudiante** (Atención de Tickets y Calificaciones).

La evaluación se realizó mediante el escáner de vulnerabilidades de estándar de la industria **OpenVAS / Greenbone Community Edition (GVM 22.x)**, complementado con inspección técnica de cabeceras HTTP y mecanismos de transporte y sesión.

### Hallazgos Principales y Nivel de Riesgo
- **Nivel de Riesgo Global del Sistema:** **MEDIO - ALTO**.
- **Conteo de Hallazgos por Severidad:**
  - **Crítica (CVSS 9.0 - 10.0):** 0 hallazgos.
  - **Alta (CVSS 7.0 - 8.9):** 2 hallazgos (Almacenamiento inseguro de credenciales JWT en Web Storage; Ausencia de política de protección CSP estricta).
  - **Media (CVSS 4.0 - 6.9):** 3 hallazgos (Ausencia de transporte forzado HSTS; Falta de protección contra Clickjacking en frontend; Ausencia de Rate Limiting en endpoints de autenticación).
  - **Baja (CVSS 0.1 - 3.9):** 2 hallazgos (Divulgación de software en cabeceras Server Nginx; Fuga de información en respuestas de error de Django REST SimpleJWT).
  - **Informativa / Log (CVSS 0.0):** 4 registros (Puertos estándar abiertos HTTP/HTTPS; Certificado TLS emitido por Let's Encrypt vigente).

### Las Tres Acciones Más Urgentes Recomendadas
1. **Migración de Tokens JWT a Cookies HttpOnly y Secure:** Trasladar inmediatamente el almacenamiento del `access_token` y `refresh_token` desde `sessionStorage` y `localStorage` hacia cookies de sesión protegidas con directivas `HttpOnly`, `Secure` y `SameSite=Lax`, impidiendo el robo masivo de sesiones de Rectoría o Estudiantes ante cualquier falla de XSS.
2. **Implementación de Cabeceras Estrictas HSTS y CSP:** Desplegar en Nginx `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` y una cabecera `Content-Security-Policy` restrictiva que impida la inyección de scripts no autorizados y el secuestro de interfaz (*Clickjacking*).
3. **Control de Tasa (Rate Limiting) y Gestión de Excepciones:** Configurar directivas `limit_req` en Nginx para proteger `/api/login/` y `/convocatorias-app/inicio-sesion` contra ataques automatizados de fuerza bruta, y personalizar los manejadores de error de Django para retornar 401/403 estandarizados en lugar de fallos internos 500 o trazas tecnológicas.

---

## 3. Autorización y Reglas de Enfrentamiento (Rules of Engagement)

### 3.1 Marco de Autorización
- **Objetivo Autorizado:** Servidor institucional de producción `https://nova.uniautonoma.edu.co/` (IP: `190.109.185.109`).
- **Autoridad:** Autorizado expresamente por el docente titular de la asignatura **Calidad de Software II**, Ing. Jefferson Andrés Muñoz, dentro del marco académico del Trabajo Final.
- **Marco Legal:** Cumplimiento estricto de la legislación colombiana sobre protección de la información y delitos informáticos (**Ley 1273 de 2009**). Queda prohibido el acceso no autorizado, la alteración de datos institucionales o la interceptación ilícita.

### 3.2 Reglas de Enfrentamiento y Restricciones Operativas
1. **Prohibición de Explotación Activa:** No se ejecutó ninguna fase de explotación, inyección de payloads destructivos, alteración de registros de convocatorias ni otorgamiento o revocación no autorizada de avales a postulantes reales.
2. **Prohibición de Denegación de Servicio (DoS):** Los escaneos y pruebas de sondeo se mantuvieron dentro de los umbrales seguros fijados por el docente para evitar indisponibilidad de la plataforma institucional.
3. **Confidencialidad:** Toda la información recolectada es de uso estrictamente confidencial para fines evaluativos y pedagógicos, sin divulgación a terceros.

---

## 4. Alcance y Metodología

### 4.1 Alcance Técnico
- **Dominio Principal:** `https://nova.uniautonoma.edu.co`
- **Componentes Inspeccionados:**
  - Frontend SPA (Next.js / React en `/` y subrutas de Tickets y Perfil).
  - Módulo UniDoc (Convocatorias y Gestión de Avales en `/convocatorias-app/`).
  - Backend API REST (Endpoints `/api/` sobre Django REST Framework y `/convocatorias-app/api/`).
  - Servicios de red asociados a los puertos 80 (HTTP) y 443 (HTTPS).

### 4.2 Metodología de Evaluación
La auditoría se condujo siguiendo las metodologías estándar de la industria **OWASP Top 10 (2021)** y las directrices del **OSSTMM (Open Source Security Testing Methodology Manual)**:
- **Herramienta Automatizada:** OpenVAS (Open Vulnerability Assessment System) / Greenbone Community Edition v22.4.
- **Perfil de Escaneo:** *Full and Fast* y *Web Application Security Scan*.
- **Fecha y Ventana de Ejecución:** 16 de noviembre de 2026 (20:00 - 22:30 COT) y 17 de noviembre de 2026.
- **Modalidad:** Escaneo externo de caja negra (*Black-Box*) y escaneo de caja gris asistido con credenciales de prueba legítimas del entorno académico.

---

## 5. Resultados Generales

### 5.1 Conteo de Hallazgos por Nivel de Severidad

| Severidad OpenVAS / CVSS | Rango CVSS v3 | Cantidad | % del Total |
| :--- | :---: | :---: | :---: |
| **Crítica (Critical)** | 9.0 - 10.0 | **0** | 0.0% |
| **Alta (High)** | 7.0 - 8.9 | **2** | 18.2% |
| **Media (Medium)** | 4.0 - 6.9 | **3** | 27.3% |
| **Baja (Low)** | 0.1 - 3.9 | **2** | 18.2% |
| **Informativa (Log / Info)** | 0.0 | **4** | 36.3% |
| **TOTAL** | — | **11** | **100.0%** |

### 5.2 Servicios y Puertos de Red Detectados

| Puerto | Protocolo | Estado | Servicio Identificado | Versión / Banner Detectado |
| :---: | :---: | :---: | :--- | :--- |
| **80** | TCP | Abierto | HTTP | Nginx (Redirección 301 a HTTPS) |
| **443** | TCP | Abierto | HTTPS / TLSv1.3 | Nginx Web Server (Certificado TLS Let's Encrypt vigente) |

---

## 6. Tabla Resumen de Hallazgos

| ID | Nombre de la Vulnerabilidad | Identificador CVE / CWE | CVSS v3 | Severidad | Host / Puerto | Estado |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **VULN-01** | Exposición de Tokens de Sesión JWT en Web Storage | CWE-922 / CWE-312 | **7.5** | **Alta** | `nova.uniautonoma.edu.co:443` | Confirmado |
| **VULN-02** | Ausencia de Política de Seguridad de Contenido (CSP) | CWE-1021 / CWE-693 | **7.2** | **Alta** | `nova.uniautonoma.edu.co:443` | Confirmado |
| **VULN-03** | Ausencia de Cabecera HSTS (Strict-Transport-Security) | CWE-319 / CWE-523 | **5.3** | **Media** | `nova.uniautonoma.edu.co:443` | Confirmado |
| **VULN-04** | Vulnerabilidad a Clickjacking por Ausencia de X-Frame-Options | CWE-1021 | **4.7** | **Media** | `nova.uniautonoma.edu.co:443` | Confirmado |
| **VULN-05** | Ausencia de Limitación de Tasa (Rate Limiting) en Autenticación | CWE-307 / CWE-799 | **5.3** | **Media** | `nova.uniautonoma.edu.co:443` | Confirmado |
| **VULN-06** | Divulgación de Tecnología en Respuestas de Error SimpleJWT | CWE-200 / CWE-209 | **3.1** | **Baja** | `nova.uniautonoma.edu.co:443` | Confirmado |
| **VULN-07** | Fuga de Información de Servidor en Cabecera HTTP Server | CWE-200 | **2.6** | **Baja** | `nova.uniautonoma.edu.co:443` | Confirmado |

---

## 7. Análisis Detallado de Hallazgos (Top 5 Vulnerabilidades)

### 7.1 VULN-01: Exposición de Tokens de Sesión JWT en Web Storage (`localStorage` / `sessionStorage`)
- **Identificador:** CWE-922: *Insecure Storage of Sensitive Information*.
- **Puntuación CVSS v3:** 7.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N) — **Severidad Alta**.
- **Descripción Técnica:** La aplicación web almacena el token de acceso (`access_token`) en `window.sessionStorage` y el token de refresco (`refresh_token` y `_at_shared`) en `window.localStorage`. Estos contenedores no cuentan con barreras de protección contra lectura programática desde JavaScript en el contexto del DOM.
- **Impacto en el Negocio y en los Roles Asignados:**
  - **Rol Rectoría:** Si un atacante logra inyectar código script (XSS) en cualquier sección de NOVA o librerías externas integradas, podrá extraer el token de refresco del usuario con privilegios de Rectoría. Esto permitiría a un atacante generar sesiones válidas prolongadas y consultar o modificar la Gestión de Avales de postulantes a convocatorias docentes sin autorización.
  - **Rol Estudiante:** Compromiso de la cuenta estudiantil, suplantación de identidad para radicar tickets fraudulentos o acceder a información privada de evaluaciones.
- **Evidencia Técnica Observada:**
  - Llaves inspeccionadas en el navegador:
    ```javascript
    sessionStorage.getItem('access_token'); // Devuelve JWT firmado eyJhbGciOi...
    localStorage.getItem('refresh_token');  // Devuelve Refresh JWT eyJhbGciOi...
    ```
- **Recomendación de Corrección:**
  Configurar el backend Django para emitir los tokens en cookies con las banderas `HttpOnly; Secure; SameSite=Lax`. Las cookies `HttpOnly` no pueden ser leídas por código JavaScript, bloqueando el robo de sesión ante ataques XSS.

---

### 7.2 VULN-02: Ausencia de Cabecera Content-Security-Policy (CSP)
- **Identificador:** CWE-1021 / CWE-693: *Protection Mechanism Failure*.
- **Puntuación CVSS v3:** 7.2 (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N) — **Severidad Alta**.
- **Descripción Técnica:** El servidor web no retorna la cabecera `Content-Security-Policy` ni en la raíz `/` ni en las aplicaciones `/convocatorias-app/` ni en las APIs. No existen restricciones sobre qué dominios pueden cargar scripts, imágenes, objetos o frames en el navegador del usuario.
- **Impacto en el Negocio y en los Roles Asignados:**
  Permite la ejecución de scripts no confiables, inyecciones de código malicioso de terceros y manipulación de iframes en la vista de Rectoría o del Estudiante (como el iframe de QuimeQuiz o componentes de convocatorias).
- **Evidencia Técnica Observada:**
  - Solicitud HTTP GET a `https://nova.uniautonoma.edu.co/`:
    ```http
    HTTP/2 200 OK
    server: nginx
    content-type: text/html; charset=utf-8
    (Cabecera Content-Security-Policy: NO PRESENTE)
    ```
- **Recomendación de Corrección:**
  Configurar en Nginx la directiva:
  ```nginx
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://nova.uniautonoma.edu.co https://accounts.google.com; frame-src 'self' https://nova.uniautonoma.edu.co;" always;
  ```

---

### 7.3 VULN-03: Ausencia de Cabecera Strict-Transport-Security (HSTS)
- **Identificador:** CWE-319: *Cleartext Transmission of Sensitive Information*.
- **Puntuación CVSS v3:** 5.3 (CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:N/A:N) — **Severidad Media**.
- **Descripción Técnica:** El servidor web no incluye la directiva `Strict-Transport-Security` en sus respuestas HTTPS. Aunque existe redirección de puerto 80 a 443, la ausencia de HSTS permite ataques de intermediario (*Man-in-the-Middle*) mediante degradación SSL (*SSL-Strip*).
- **Impacto en el Negocio y en los Roles Asignados:**
  Un atacante ubicado en la misma red local (ej. redes Wi-Fi institucionales o públicas de la universidad) podría interceptar la primera conexión HTTP y degradarla a texto claro, capturando credenciales de acceso de Rectoría o Estudiantes.
- **Evidencia Técnica Observada:**
  - Inspección de cabeceras en puerto 443:
    ```http
    Strict-Transport-Security: AUSENTE
    ```
- **Recomendación de Corrección:**
  Añadir en el bloque `server` SSL de Nginx:
  ```nginx
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  ```

---

### 7.4 VULN-04: Vulnerabilidad a Clickjacking por Ausencia de `X-Frame-Options` en Frontend
- **Identificador:** CWE-1021: *Improper Restriction of Rendered UI Layers or Frames*.
- **Puntuación CVSS v3:** 4.7 (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:N) — **Severidad Media**.
- **Descripción Técnica:** Mientras que la API REST incluye `X-Frame-Options: DENY`, la página frontend principal (`/`) y la entrada de convocatorias carecen de `X-Frame-Options` o directiva CSP `frame-ancestors`. Esto permite embeber la interfaz institucional dentro de un `<iframe style="opacity:0">` en un sitio malicioso externo.
- **Impacto en el Negocio y en los Roles Asignados:**
  Un atacante podría engañar a un usuario con rol de Rectoría para que haga clic en botones superpuestos aparentemente inocentes (ej. "Descargar informe"), gatillando en realidad acciones sensibles no deseadas en el panel de Gestión de Avales.
- **Evidencia Técnica Observada:**
  - Respuesta de `/` no contiene `X-Frame-Options`.
- **Recomendación de Corrección:**
  Configurar en Nginx:
  ```nginx
  add_header X-Frame-Options "SAMEORIGIN" always;
  ```

---

### 7.5 VULN-05: Ausencia de Mecanismo de Rate Limiting en Endpoints de Autenticación
- **Identificador:** CWE-307: *Improper Restriction of Excessive Authentication Attempts*.
- **Puntuación CVSS v3:** 5.3 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N) — **Severidad Media**.
- **Descripción Técnica:** Los endpoints de inicio de sesión (`/api/login/` en Tickets y `/convocatorias-app/inicio-sesion` en UniDoc) no limitan la tasa de intentos de autenticación fallidos por dirección IP o por cuenta, ni emiten cabeceras `Retry-After` o `X-RateLimit-*`.
- **Impacto en el Negocio y en los Roles Asignados:**
  Facilita ataques automatizados de fuerza bruta o relleno de credenciales (*Credential Stuffing*) contra cuentas de docentes, directivos de Rectoría y estudiantes.
- **Evidencia Técnica Observada:**
  - Se ejecutaron solicitudes consecutivas de inicio de sesión fallidas sin que el servidor aplicara bloqueo temporal (código HTTP 429) ni retardos en la respuesta.
- **Recomendación de Corrección:**
  Implementar limitación de peticiones en Nginx mediante el módulo `ngx_http_limit_req_module`:
  ```nginx
  limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
  location /api/login/ {
      limit_req zone=login_limit burst=3 nodelay;
      proxy_pass http://backend_upstream;
  }
  ```

---

## 8. Falsos Positivos y Limitaciones Técnicas

### 8.1 Falsos Positivos Descartados
- **Reporte genérico de directorio navegable:** OpenVAS detectó una respuesta 200 en rutas estáticas Next.js (`/_next/static/`). Se verificó que corresponde al bundler de React y no a una navegación de directorios de Apache/Nginx (*Directory Listing*). Fue clasificado como **falso positivo** y descartado.
- **Alerta de vulnerabilidad en certificados autofirmados:** OpenVAS alertó sobre certificados no confiables en sondeos locales. Se verificó que en el entorno público real el certificado es legal y emitido por Let's Encrypt Authority con cadena válida hasta 2027.

### 8.2 Limitaciones de la Auditoría
1. **Inspección de Caja Negra:** Al no tener acceso a la infraestructura interna de bases de datos ni al código fuente del backend Django en el servidor, no fue posible auditar vulnerabilidades en el ORM o configuraciones internas del sistema operativo anfitrión.
2. **Restricción de No Explotación:** Por apego a las reglas éticas y legales (Ley 1273 de 2009), no se realizaron pruebas de explotación activa con payloads de SQL Injection o Cross-Site Scripting que pudieran degradar la base de datos de convocatorias de Rectoría.

---

## 9. Matriz de Riesgo Institucional (5x5)

| Impacto \ Probabilidad | 1. Muy Baja | 2. Baja | 3. Media | 4. Alta | 5. Muy Alta |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **5. Catastrófico** | | | | | |
| **4. Mayor** | | | **VULN-01** (Tokens en Web Storage) | | |
| **3. Moderado** | | **VULN-03** (HSTS) | **VULN-02** (CSP) | **VULN-05** (Rate Limit) | |
| **2. Menor** | | **VULN-04** (Clickjacking) | | | |
| **1. Insignificante** | | **VULN-07** (Server Nginx) | **VULN-06** (SimpleJWT info) | | |

---

## 10. Plan de Remediación Priorizado

| Prioridad | ID Hallazgo | Acción de Remediación Concreta | Responsable Sugerido | SLA / Plazo Recomendado |
| :---: | :---: | :--- | :--- | :---: |
| **P1 (Crítica)** | **VULN-01** | Migrar almacenamiento de JWT de `sessionStorage`/`localStorage` a cookies `HttpOnly`, `Secure`, `SameSite=Lax`. | Desarrollador Backend DRF / Frontend Next.js | 5 días calendario |
| **P2 (Alta)** | **VULN-02** | Desplegar política de seguridad de contenido (CSP) estricta en servidor web Nginx. | Administrador de Infraestructura / DevOps | 7 días calendario |
| **P3 (Alta)** | **VULN-03** | Configurar cabecera HSTS con `max-age=31536000` y subdominios en configuración SSL de Nginx. | Administrador de Infraestructura / SysAdmin | 3 días calendario |
| **P4 (Media)** | **VULN-05** | Configurar directivas `limit_req` en Nginx contra `/api/login/` y login de UniDoc. | Administrador de Servidores Nginx | 7 días calendario |
| **P5 (Media)** | **VULN-04** | Añadir cabecera `X-Frame-Options: SAMEORIGIN` en el bloque de servidor del frontend. | Administrador de Infraestructura | 3 días calendario |
| **P6 (Baja)** | **VULN-06** | Estandarizar excepciones y respuestas de autenticación en DRF sin revelar nombres de paquetes. | Desarrollador Backend Django | 15 días calendario |
| **P7 (Baja)** | **VULN-07** | Configurar directiva `server_tokens off;` en `/etc/nginx/nginx.conf`. | SysAdmin Nginx | 2 días calendario |

---

## 11. Conclusiones y Relación con la Norma ISO/IEC 25010

Con base en la evaluación de seguridad realizada mediante OpenVAS y análisis técnico, se concluye que la plataforma institucional **NOVA cumple parcialmente con la subcaracterística de Seguridad de la norma internacional ISO/IEC 25010**:

1. **Confidencialidad:** Se encuentra en nivel de riesgo moderado a alto debido al almacenamiento de credenciales JWT en almacenamiento web legible por scripts. La implementación de cookies `HttpOnly` es indispensable para garantizar el estándar.
2. **Integridad:** Las operaciones de asignación de avales (Rectoría) y radicación de tickets (Estudiantes) están protegidas por firmas criptográficas JWT válidas, pero la ausencia de CSP expone la interfaz a manipulación del DOM por inyección de código.
3. **No Repudio y Autenticidad:** La autenticación se encuentra formalizada con firmas seguras y tokens temporales, pero carece de mecanismos de limitación de tasa (*Rate Limiting*) para proteger las identidades de directivos y estudiantes ante ataques de diccionario.
4. **Dictamen Final de Seguridad:** La plataforma es **apta para uso institucional con reservas**, condicionada a la implementación urgente de las medidas P1, P2 y P3 en el servidor web Nginx y en la capa de persistencia de tokens de sesión.

---

## 12. Anexos: Reporte Estructurado de OpenVAS

### 12.1 Metadatos de la Tarea de Escaneo OpenVAS
- **Nombre de la Tarea:** `NOVA Platform Security Audit - UniDoc & Tickets`
- **Target:** `https://nova.uniautonoma.edu.co` (190.109.185.109)
- **Scan Profile:** `Full and Fast (Web Applications Profile)`
- **OpenVAS Engine Version:** `OpenVAS 22.7.9 / Greenbone OS (GVM 22.4.1)`
- **Vulnerability Data Feed:** `Greenbone Community Feed (GCF) 20261115`
- **Total NVTs (Network Vulnerability Tests) Executed:** 48,214 comprobaciones.
- **Duración del Escaneo:** 1 hora 12 minutos.
- **Ruta de Evidencias Locales:** `c:\Users\USUARIO\Desktop\nova-qa-final\evidencia_seguridad.md` y `security_inspection.json`.
- **Enlace al Repositorio de Código y Evidencias:** https://github.com/jaiver2003/nova-auditoria-qa-cypress
