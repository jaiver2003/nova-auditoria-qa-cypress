# Evidencia de Inspección Pasiva de Seguridad Web y Cabeceras HTTP
## Plataforma NOVA — Universidad Autónoma del Cauca
### Apoyo Técnico para Entregable 3 (Seguridad) — Trabajo Final de Calidad de Software II
**Objetivo Evaluado:** `https://nova.uniautonoma.edu.co` y su API REST  
**Fecha de Inspección:** 16 de noviembre de 2026  
**Metodología:** Inspección pasiva y no intrusiva mediante análisis de cabeceras HTTP, políticas de sesión y respuestas de error (sin escaneos agresivos ni explotación).

---

## 1. Análisis de Cabeceras de Seguridad HTTP

Se realizaron solicitudes de sondeo `GET` y `OPTIONS` tanto al Frontend web como al backend de la API REST.

### Matriz de Cabeceras Identificadas

| Cabecera de Seguridad | Frontend (`/`) | Backend API (`/api/login/`) | Estado de Seguridad | Recomendación Técnica |
| :--- | :---: | :---: | :---: | :--- |
| **Strict-Transport-Security (HSTS)** | ❌ Ausente | ❌ Ausente | **Vulnerable** | Habilitar `max-age=31536000; includeSubDomains; preload` para forzar conexiones HTTPS y mitigar ataques SSL-Strip. |
| **Content-Security-Policy (CSP)** | ❌ Ausente | ❌ Ausente | **Vulnerable** | Implementar política CSP estricta para mitigar inyecciones XSS y restricción de orígenes de scripts y frames. |
| **X-Frame-Options** | ❌ Ausente | ✅ `DENY` | **Parcial** | Añadir `X-Frame-Options: SAMEORIGIN` o directiva `frame-ancestors` en CSP en el frontend para evitar ataques de Clickjacking. |
| **X-Content-Type-Options** | ❌ Ausente | ✅ `nosniff` | **Parcial** | Añadir `nosniff` globalmente en Nginx para prevenir ataques de MIME-Sniffing en recursos estáticos. |
| **Referrer-Policy** | ❌ Ausente | ✅ `same-origin` | **Aceptable** | Configurar en frontend `strict-origin-when-cross-origin`. |
| **Cross-Origin-Opener-Policy** | ❌ Ausente | ✅ `same-origin` | **Aceptable** | Correctamente implementado en la API para aislar el contexto de navegación. |
| **Permissions-Policy** | ❌ Ausente | ❌ Ausente | **Mejora** | Deshabilitar APIs innecesarias del navegador (`camera=(), microphone=(), geolocation=()`). |
| **Server** | ⚠️ `nginx` | ⚠️ `nginx` | **Riesgo Informativo** | Deshabilitar `server_tokens off;` en la configuración de Nginx para no divulgar el software de servidor. |

---

## 2. Almacenamiento de Tokens JWT y Gestión de Sesión

### Hallazgo Crítico de Almacenamiento: Exposición de Tokens en Almacenamiento Web (Web Storage)
- **Evidencia Encontrada:**
  - `sessionStorage`: Almacena la llave `access_token` con el JWT firmado en texto plano.
  - `localStorage`: Almacena las llaves `_at_shared` y `refresh_token` con el token de refresco en texto plano.
- **Riesgo Asociado:** 
  Cualquier vulnerabilidad de Cross-Site Scripting (XSS) en la aplicación o librerías de terceros (ej. Google GSI, scripts externos) permite la extracción inmediata de los tokens mediante `window.localStorage` o `window.sessionStorage`, comprometiendo la cuenta del estudiante sin control de caducidad inmediata.
- **Recomendación:**
  Migrar el almacenamiento del `access_token` y `refresh_token` a cookies con las banderas **`HttpOnly`**, **`Secure`** y **`SameSite=Lax`**. Las cookies `HttpOnly` son inaccesibles por código JavaScript en el navegador, neutralizando el robo de tokens vía XSS.

---

## 3. Divulgación de Información y Mensajes de Error Técnicos

### Hallazgo: Exposición de Mensajes de Error Internos de Django SimpleJWT
- **Petición:** `POST /api/login/` con credenciales no registradas o contraseña errónea.
- **Respuesta del Servidor:** Código HTTP `401 Unauthorized`.
- **Cuerpo de Respuesta:**
  ```json
  {
    "detail": "No active account found with the given credentials"
  }
  ```
- **Riesgo:** 
  El mensaje literal permite deducir la tecnología backend empleada (Django REST Framework + `djangorestframework-simplejwt`) y facilita ataques de fuerza bruta al confirmar la diferencia entre errores de esquema y errores de autenticación.
- **Recomendación:**
  Personalizar los serializadores y handlers de excepción de DRF para responder con mensajes genéricos internacionalizados en español.

---

## 4. Control de Tasa (Rate Limiting) y Protección contra Fuerza Bruta

- **Observación:** El endpoint `/api/login/` no emite cabeceras de limitación de tasa (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`).
- **Riesgo:** Posibilidad de realizar ataques automatizados de diccionario o credential stuffing contra las cuentas de estudiantes y docentes de la universidad.
- **Recomendación:** Implementar `django-ratelimit` o directivas `limit_req` en Nginx (ej. máximo 5 intentos por minuto por dirección IP en `/api/login/`).
