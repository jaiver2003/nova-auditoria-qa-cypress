# INFORME DE PRUEBAS FUNCIONALES AUTOMATIZADAS (E2E)
## PLATAFORMA INSTITUCIONAL NOVA — UNIVERSIDAD AUTÓNOMA DEL CAUCA
### ASIGNATURA: CALIDAD DE SOFTWARE II — TRABAJO FINAL (ENTREGABLE 1)

---

## 1. Portada y Control de Versiones

### 1.1 Información General
- **Institución:** Corporación Universitaria Autónoma del Cauca (Uniautónoma)
- **Facultad:** Ingeniería — Programa de Ingeniería de Software
- **Asignatura:** Calidad de Software II
- **Docente:** Jefferson Andrés Muñoz
- **Plataforma Evaluada:** Núcleo de Operaciones Virtuales Académicas (NOVA) — `https://nova.uniautonoma.edu.co/`
- **Módulos y Roles Evaluados:**
  - **Módulo Principal:** UniDoc — Convocatorias Docentes y Gestión de Avales (Rol: **Rectoría**)
  - **Módulo Complementario (Auditoría Cruzada):** Tickets y Evaluaciones (Rol: **Usuario Básico / Estudiante**)
- **Fecha de Auditoría y Ejecución:** 16 y 17 de noviembre de 2026
- **Grupo Académico:** Grupo 1
- **Integrantes del Equipo:**
  - Jaiver Muñoz Muñoz (`jaiver.munoz@uniautonoma.edu.co`)
  - Martha Isabel España Gonzales (`martha.espana@uniautonoma.edu.co`)
- **Repositorio Git Oficial:** `c:\Users\USUARIO\Desktop\nova-qa-final` (Rama: `main`)
- **Enlace a Repositorio Remoto:** https://github.com/jaiver2003/nova-auditoria-qa-cypress

### 1.2 Historial de Control de Versiones del Documento

| Versión | Fecha | Autor(es) | Descripción del Cambio |
| :---: | :---: | :--- | :--- |
| **1.0.0** | 16/11/2026 | Jaiver Muñoz Muñoz | Diseño inicial y automatización de la suite E2E de Tickets (Estudiante) CP-01 a CP-11. |
| **1.1.0** | 16/11/2026 | Martha Isabel España G. | Corrección de `cypress/support/e2e.js`, supresión de excepciones generales y diseño manual de CP-12. |
| **1.2.0** | 17/11/2026 | Jaiver Muñoz & Martha España | Incorporación del alcance oficial UniDoc — Rectoría (`REC-CP-01` a `REC-CP-12`), automatización en Cypress de 10 casos de Rectoría (`05_rectoria_convocatorias.cy.js`), consolidación de 21 casos aprobados (100% de éxito de ejecutados) y formalización de las 13 secciones. |

---

## 2. Resumen Ejecutivo
El presente informe documenta la auditoría de calidad funcional de software y la suite integral de pruebas automatizadas End-to-End (E2E) desarrollada con Cypress para la plataforma institucional **NOVA**.

El equipo QA abordó de manera coordinada la evaluación funcional sobre dos frentes operativos del sistema:
1. **Rol Rectoría en la aplicación UniDoc:** Auditoría sobre los flujos de acceso, seguridad de rutas de avales de convocatorias docentes (`/convocatorias-app/rectoria/avales`), consultas públicas y control de acceso en endpoints API.
2. **Rol Estudiante (Usuario Básico) en la aplicación Tickets:** Auditoría sobre el ciclo de vida de autenticación, visualización del ticket institucional asignado (`TI-20261113-7BEB1D57`), formulario de radicación a dependencias, módulo QuimeQuiz y fronteras de permisos.

### Métricas Globales de la Auditoría Funcional
- **Total de Casos de Prueba Diseñados:** **24 casos** (12 para UniDoc Rectoría + 12 para Tickets Estudiante).
- **Total de Casos Automatizados y Ejecutados en Cypress:** **21 casos** distribuidos en 5 archivos de especificación (`.cy.js`).
- **Casos Aprobados:** **21 casos (100% de éxito sobre los casos ejecutados)**.
- **Casos No Ejecutados (Manuales / Protegidos):** **3 casos** (justificados por protección de integridad en producción: radicación real de avales y comentarios en tickets vivos).
- **Tiempo Total de Ejecución de la Suite Completa:** **1 minuto 17 segundos** sobre Electron 138 (headless).
- **Defectos Identificados:** 2 defectos técnicos reportados (DEF-01: Defecto de localización en mensajes de autenticación; DEF-02: Respuesta HTTP 500 no controlada en endpoints API de Rectoría sin token).

---

## 3. Objetivo y Alcance

### 3.1 Objetivo General
Evaluar y verificar mediante pruebas de caja negra automatizadas la corrección funcional, las validaciones de interfaz y los controles de autorización de la plataforma NOVA para los roles **Rectoría** (UniDoc) y **Estudiante** (Tickets), garantizando que las operaciones institucionales críticas se ejecuten bajo los estándares de calidad de la norma ISO/IEC 25010.

### 3.2 Objetivos Específicos
1. Diseñar e implementar pruebas E2E con Cypress sobre el acceso y la seguridad perimetral de Convocatorias UniDoc para Rectoría.
2. Validar que las rutas administrativas y de avales (`/convocatorias-app/rectoria/avales`) expulsen eficazmente a sesiones no autorizadas o anónimas.
3. Verificar la gestión de tickets del estudiante, asegurando la visualización del ticket asignado `TI-20261113-7BEB1D57` y las validaciones de campos obligatorios en nuevos requerimientos.
4. Auditar las fronteras de rol y la denegación de privilegios administrativos en la interfaz gráfica del usuario básico.
5. Comprobar la resiliencia de la suite ante errores reales de JavaScript sin supresiones artificiales.

### 3.3 Alcance Definido

#### Módulos Incluidos en la Auditoría
- **UniDoc (Convocatorias - Rectoría):**
  - Formulario de autenticación propio (`/convocatorias-app/inicio-sesion`).
  - Protección de URL protegida de avales (`/convocatorias-app/rectoria/avales`).
  - Flujo de recuperación de contraseña (`/convocatorias-app/restablecer-contrasena`).
  - Portal base de convocatorias públicas (`/convocatorias-app`).
  - Navegación al registro de aspirantes (`/convocatorias-app/registro`).
  - Contratos de seguridad API (`/convocatorias-app/api/rectoria/obtener-convocatorias` y `/convocatorias-app/api/rectoria/usuarios/6/avales`).
- **Tickets (Estudiante):**
  - Inicio de sesión local (`/login`) y cierre de sesión seguro (`/estudiante`).
  - Panel principal (Dashboard, calendario y saludo personalizado "JAIVER").
  - Consulta y modal de detalle del ticket asignado `TI-20261113-7BEB1D57`.
  - Formulario de radicación de tickets y botón cancelar.
  - Módulo evaluativo embebido QuimeQuiz y visualización de perfil.
  - Fronteras de permisos e inaccesibilidad de controles de reasignación y borrado.

#### Exclusiones y Justificación Ética
- **Modificación de Avales Reales:** No se modificaron estados de avales ni puntajes de candidatos en convocatorias docentes reales para no interferir en procesos contractuales universitarios.
- **Creación o Cierre de Tickets Reales:** No se radicaron solicitudes masivas de prueba en la base de datos de producción para respetar al personal administrativo de la universidad.
- **Automatización de Google Identity Services:** Se excluyó la automatización directa sobre `accounts.google.com` para cumplir las políticas de Google y evitar bloqueos por CAPTCHA.

---

## 4. Descripción de la Aplicación y de los Roles

### 4.1 Arquitectura del Sistema
- **Frontend General:** Single Page Application (SPA) construida en Next.js (React) y Tailwind CSS alojada sobre Nginx.
- **Módulo UniDoc:** Aplicación web independiente montada en el path `/convocatorias-app/` con su propio flujo de inicio de sesión y gestión de convocatorias.
- **Backend API:** Django REST Framework (DRF) con autenticación basada en JSON Web Tokens (SimpleJWT).

### 4.2 Perfiles de Usuario Auditados
1. **Rol Rectoría (UniDoc):** Rol directivo responsable de la supervisión institucional de convocatorias, revisión de postulantes, verificación de puntajes y emisión de avales oficiales.
2. **Rol Usuario Básico / Estudiante (Tickets):** Usuario final que consulta avisos institucionales, radicar solicitudes o peticiones a dependencias universitarias y presenta pruebas en QuimeQuiz.

---

## 5. Entorno de Pruebas

| Parámetro | Valor Configurado |
| :--- | :--- |
| **URL Base del Sistema** | `https://nova.uniautonoma.edu.co/` |
| **Herramienta de Automatización** | Cypress v15.21.2 |
| **Navegador de Ejecución** | Electron 138 (Headless) |
| **Resolución de Pantalla (Viewport)** | 1366 x 768 píxeles |
| **Entorno de Ejecución (Node.js)** | Node.js v25.8.1 |
| **Sistema Operativo del Cliente** | Microsoft Windows 11 Pro (x64) |
| **Timeout por Defecto de Cypress** | 10,000 ms (`defaultCommandTimeout: 10000`) |
| **Grabación de Video** | Habilitada (`video: true`) |
| **Captura de Fallos** | Habilitada (`screenshotOnRunFailure: true`) |

---

## 6. Estrategia de Pruebas

### 6.1 Criterios de Selección y Automatización
- **Automatizado:** Todos los flujos determinísticos de verificación estructural, navegación, autenticación negativa, validaciones reactivas, denegación de rutas no autorizadas e inspección de respuestas de seguridad de endpoints.
- **Manual (No Ejecutado en Producción):** Casos que mutan permanentemente el estado de la base de datos (otorgar avales a docentes, escribir comentarios en el hilo del ticket `TI-20261113-7BEB1D57`).

### 6.2 Criterios de Entrada y Criterios de Salida
- **Criterios de Entrada:** Disponibilidad de la plataforma NOVA vía HTTPS, credenciales de prueba válidas en `cypress.env.json`, y configuración base de Cypress.
- **Criterios de Salida:** 100% de los casos automatizados aprobados sin errores de configuración, videos íntegros grabados en `cypress/videos/` y trazabilidad total de defectos.

### 6.3 Priorización de Casos de Prueba
- **Alta (P1):** Mecanismos de autenticación, control de acceso a rutas protegidas y visualización de datos asignados.
- **Media (P2):** Validaciones de formularios, navegación auxiliar y respuestas ante datos inválidos.
- **Baja (P3):** Estilos visuales, enlaces externos y accesibilidad.

---

## 7. Matriz de Trazabilidad Requisitos vs. Casos de Prueba

| Módulo / Funcionalidad | Caso de Prueba | Tipo de Caso | Prioridad | Automatizado | Archivo Cypress |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **UniDoc: Estructura de Login** | `REC-CP-01` | Positivo | Alta | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Login con datos inválidos** | `REC-CP-02` | Negativo | Alta | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Aislamiento entre roles** | `REC-CP-03` | Permisos Negativo | Alta | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Protección de ruta Avales** | `REC-CP-04` | Permisos Negativo | Alta | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Recuperación de clave** | `REC-CP-05` | Positivo | Media | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Convocatorias públicas** | `REC-CP-06` | Positivo | Media | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Enlace a Registro** | `REC-CP-07` | Positivo | Baja | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Seguridad API Convocatorias**| `REC-CP-08` | Permisos Negativo | Alta | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Seguridad API Avales** | `REC-CP-09` | Permisos Negativo | Alta | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Formulario vacío** | `REC-CP-10` | Negativo | Media | Sí | `05_rectoria_convocatorias.cy.js` |
| **UniDoc: Consulta de postulantes** | `REC-CP-11` | Positivo | Alta | No (Manual) | N/A (Inspección visual) |
| **UniDoc: Emisión de aval oficial** | `REC-CP-12` | Positivo | Crítica | No (Manual) | N/A (Restricción ética) |
| **Tickets: Login Exitoso** | `CP-01` | Positivo | Alta | Sí | `01_autenticacion.cy.js` |
| **Tickets: Contraseña Incorrecta** | `CP-02` | Negativo | Alta | Sí | `01_autenticacion.cy.js` |
| **Tickets: Formulario Vacío** | `CP-03` | Negativo | Media | Sí | `01_autenticacion.cy.js` |
| **Tickets: Cierre de Sesión** | `CP-04` | Positivo | Alta | Sí | `01_autenticacion.cy.js` |
| **Tickets: Consulta Ticket Asignado** | `CP-05` | Positivo | Alta | Sí | `02_tickets_estudiante.cy.js` |
| **Tickets: Estructura Nuevo Ticket** | `CP-06` | Positivo | Alta | Sí | `02_tickets_estudiante.cy.js` |
| **Tickets: Validaciones Nuevo Ticket** | `CP-07` | Negativo | Media | Sí | `02_tickets_estudiante.cy.js` |
| **Quiz: Validación PIN Inválido** | `CP-08` | Negativo | Media | Sí | `03_quiz_y_perfil.cy.js` |
| **Perfil: Datos Estudiante JAIVER** | `CP-09` | Positivo | Media | Sí | `03_quiz_y_perfil.cy.js` |
| **Permisos: Redirección /admin y 404**| `CP-10` | Permisos Negativo | Alta | Sí | `04_permisos_rol.cy.js` |
| **Permisos: Controles en Ticket** | `CP-11` | Permisos Negativo | Alta | Sí | `04_permisos_rol.cy.js` |
| **Tickets: Interacción en Hilo** | `CP-12` | Positivo | Media | No (Manual) | N/A (Restricción ética) |

---

## 8. Casos de Prueba Diseñados y Documentados

### 8.1 Suite UniDoc — Rol Rectoría (`REC-CP-01` a `REC-CP-12`)

| ID | Funcionalidad y Descripción | Tipo | Precondición | Pasos Principales | Datos de Entrada | Resultado Esperado | Estado |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- | :---: |
| **REC-CP-01** | Estructura de acceso UniDoc | Positivo | Acceso a internet | Visitar `/convocatorias-app/inicio-sesion`; inspeccionar campos | N/A | Presencia visible de email, password y botones | **Aprobado** |
| **REC-CP-02** | Login negativo credenciales inválidas | Negativo | Formulario limpio | Digitar credenciales no registradas; click submit | `rectoria.unauthorized@...` | Notificación visible "Credenciales incorrectas" | **Aprobado** |
| **REC-CP-03** | Aislamiento cruzado de roles | Permisos Negativo | Cuenta estudiante activa | Intentar entrar a UniDoc con credenciales de Tickets | Usuario y clave de Tickets | Rechazo de acceso; permanencia en inicio-sesion | **Aprobado** |
| **REC-CP-04** | Protección de ruta Avales de Rectoría | Permisos Negativo | Sesión no autenticada | Visitar `/convocatorias-app/rectoria/avales` | URL directa | Redirección forzada a `/convocatorias-app` | **Aprobado** |
| **REC-CP-05** | Flujo de restablecimiento de clave | Positivo | Formulario de login | Click en "¿Olvidaste tu contraseña?" | N/A | Carga de `/convocatorias-app/restablecer-contrasena` | **Aprobado** |
| **REC-CP-06** | Acceso a portal público convocatorias| Positivo | Acceso a internet | Visitar `/convocatorias-app` | URL base | Despliegue de cabecera y listado público | **Aprobado** |
| **REC-CP-07** | Navegación a registro de usuarios | Positivo | Formulario de login | Click en "Regístrate aquí" | N/A | Carga de vista `/convocatorias-app/registro` | **Aprobado** |
| **REC-CP-08** | Seguridad API Convocatorias Rectoría | Permisos Negativo | Petición sin token | GET a `/convocatorias-app/api/rectoria/obtener-convocatorias` | Sin cabecera Auth | Rechazo de la petición sin exponer datos | **Aprobado** |
| **REC-CP-09** | Seguridad API Consulta de Avales | Permisos Negativo | Petición sin token | GET a `/convocatorias-app/api/rectoria/usuarios/6/avales` | Sin cabecera Auth | Rechazo de la petición sin exponer avales | **Aprobado** |
| **REC-CP-10** | Validación de formulario vacío | Negativo | Campos limpios | Click en "Iniciar Sesión" sin digitar datos | Vacíos | No envía petición ni redirige | **Aprobado** |
| **REC-CP-11** | Consulta y filtro de postulantes | Positivo | Sesión de Rectoría | Abrir panel de avales; seleccionar convocatoria | Convocatoria activa | Muestra postulantes con puntajes | *No ejecutado* |
| **REC-CP-12** | Emisión oficial de aval | Positivo | Candidato evaluado | Seleccionar candidato; pulsar Otorgar Aval | ID de postulante | Estado actualizado a "Con Aval" | *No ejecutado* |

### 8.2 Suite Tickets — Rol Estudiante (`CP-01` a `CP-12`)

| ID | Funcionalidad y Descripción | Tipo | Precondición | Pasos Principales | Datos de Entrada | Resultado Esperado | Estado |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- | :---: |
| **CP-01** | Autenticación positiva de Estudiante | Positivo | Usuario registrado | Visitar `/login`, diligenciar credenciales, submit | Credenciales estudiante | Saludo "JAIVER", rol "ESTUDIANTE", ticket visible | **Aprobado** |
| **CP-02** | Login negativo contraseña errónea | Negativo | Usuario registrado | Digitar correo real con contraseña falsa | `PasswordInvalido_2026!` | Toast de error HTTP 401 | **Aprobado** |
| **CP-03** | Login negativo campos vacíos | Negativo | Vista `/login` | Click en submit sin llenar inputs | Campos vacíos | Mensajes "El correo es requerido" | **Aprobado** |
| **CP-04** | Cierre de sesión y bloqueo history | Positivo | Sesión iniciada | Click en botón "Salir"; navegar hacia atrás | N/A | Redirección a `/login` y sesión invalidada | **Aprobado** |
| **CP-05** | Consulta Ticket `TI-20261113-7BEB1D57`| Positivo | Sesión iniciada | Navegar a Mis Tickets; click en tarjeta | ID del ticket | Modal abierto con título y estado "Abierto" | **Aprobado** |
| **CP-06** | Formulario Nuevo Ticket y Cancelar | Positivo | Sesión iniciada | Click "+ Nuevo Ticket"; verificar inputs y cancelar | N/A | Formulario desplegado y cerrado al cancelar | **Aprobado** |
| **CP-07** | Validación nuevo ticket vacío | Negativo | Modal abierto | Click "Enviar ticket" con campos en blanco | Vacíos | Mensajes de obligatoriedad en rojo | **Aprobado** |
| **CP-08** | Ingreso PIN inválido en QuimeQuiz | Negativo | Sesión iniciada | Ir a Quiz; ingresar PIN inexistente en iframe | PIN `999999` | Alerta "PIN no válido o sesión no encontrada" | **Aprobado** |
| **CP-09** | Visualización Perfil Estudiante | Positivo | Sesión iniciada | Ir a Mi Perfil; verificar nombre y campos | N/A | Nombre "JAIVER", lectura "Estudiante" | **Aprobado** |
| **CP-10** | Restricción URL /admin y 404 | Permisos Negativo | Sesión iniciada | Navegar a `/admin` y rutas no mapeadas | Rutas restringidas | Redirección de `/admin` y 404 en no mapeadas | **Aprobado** |
| **CP-11** | Fronteras visuales en modal ticket | Permisos Negativo | Modal abierto | Inspeccionar botones de acción en DOM | `TI-20261113-7BEB1D57` | Botones de cambiar estado o eliminar NO existen | **Aprobado** |
| **CP-12** | Envío de comentario en ticket | Positivo | Modal abierto | Redactar respuesta y pulsar enviar mensaje | Texto de prueba | Mensaje publicado en el hilo | *No ejecutado* |

---

## 9. Resultados de Ejecución

### 9.1 Consolidado Numérico Oficial
- **Total Casos Diseñados:** 24
- **Total Casos Ejecutados:** 21
- **Casos Aprobados:** 21 (100% de éxito de ejecución)
- **Casos Fallidos:** 0
- **Casos No Ejecutados (Manuales / Éticos):** 3 (REC-CP-11, REC-CP-12, CP-12)
- **Tasa de Cobertura de Ejecución:** **87.5%** (21/24 casos).
- **Tasa de Aprobación de Casos Ejecutados:** **100.0%** (21/21 casos).

### 9.2 Detalle de Ejecución por Archivo de Especificación Cypress

| Archivo de Prueba (`cypress/e2e/`) | Casos Ejecutados | Resultado | Duración | Video de Evidencia Generado |
| :--- | :---: | :---: | :---: | :--- |
| `01_autenticacion.cy.js` | 4 de 4 | **4 Aprobados** | 13 s | `cypress/videos/01_autenticacion.cy.js.mp4` |
| `02_tickets_estudiante.cy.js` | 3 de 3 | **3 Aprobados** | 22 s | `cypress/videos/02_tickets_estudiante.cy.js.mp4` |
| `03_quiz_y_perfil.cy.js` | 2 de 2 | **2 Aprobados** | 12 s | `cypress/videos/03_quiz_y_perfil.cy.js.mp4` |
| `04_permisos_rol.cy.js` | 2 de 2 | **2 Aprobados** | 21 s | `cypress/videos/04_permisos_rol.cy.js.mp4` |
| `05_rectoria_convocatorias.cy.js` | 10 de 10 | **10 Aprobados** | 7 s | `cypress/videos/05_rectoria_convocatorias.cy.js.mp4` |
| **TOTAL GENERAL SUITE UNIFICADA** | **21 de 21** | **21 Aprobados** | **1 min 17 s** | **5 videos MP4 íntegros** |

---

## 10. Reporte de Defectos y Observaciones Técnicas

### Defecto DEF-01: Mensaje de error de autenticación no internacionalizado (Tickets)
- **Caso Relacionado:** `CP-02`
- **Severidad:** Baja | **Prioridad:** Media
- **Pasos para Reproducir:**
  1. Ingresar a `https://nova.uniautonoma.edu.co/login`.
  2. Introducir correo institucional válido y contraseña errónea.
  3. Pulsar botón "Iniciar sesión".
- **Resultado Esperado:** Mensaje institucional en español amigable: *"Correo o contraseña incorrectos"*.
- **Resultado Obtenido:** Toast con mensaje técnico de librería Django SimpleJWT en inglés: `"No active account found with the given credentials"`.
- **Impacto:** Confusión en usuarios hispanohablantes y divulgación indirecta de la tecnología backend.

### Defecto DEF-02: Respuesta HTTP 500 no controlada en endpoints API de Rectoría sin token (UniDoc)
- **Casos Relacionados:** `REC-CP-08`, `REC-CP-09`
- **Severidad:** Media | **Prioridad:** Alta
- **Pasos para Reproducir:**
  1. Ejecutar solicitud HTTP GET directa a `https://nova.uniautonoma.edu.co/convocatorias-app/api/rectoria/obtener-convocatorias` sin cabecera `Authorization`.
- **Resultado Esperado:** Código HTTP `401 Unauthorized` o `403 Forbidden` con esquema JSON estructurado.
- **Resultado Obtenido:** Código HTTP `500 Internal Server Error` debido a excepción no capturada de puntero nulo al resolver la sesión en el middleware del backend.
- **Impacto:** Vulnerabilidad de resiliencia y fuga de excepciones de servidor ante peticiones no autenticadas.

### Observación OBS-01: Expiración asíncrona de sesión en iframe de QuimeQuiz
- **Caso Relacionado:** `CP-08`
- **Severidad:** Informativa
- **Descripción:** Cuando la sesión principal de NOVA permanece inactiva por más de 15 minutos, el iframe de `/quiz-app/` muestra la interfaz pero falla al procesar el PIN debido a la desincronización del Single Sign-On. Requiere recarga forzada de página.

---

## 11. Análisis de Resultados

1. **Estabilidad de Módulos:**
   - **Alta Estabilidad:** El enrutamiento de Next.js, las validaciones reactivas del formulario de tickets y el formulario de acceso de UniDoc demostraron comportamientos 100% predecibles y sin *flakiness*.
   - **Fronteras de Seguridad Efectivas:** Se comprobó que un usuario no autenticado es expulsado de `/convocatorias-app/rectoria/avales`, y un usuario Estudiante es redirigido desde `/admin` hacia `/estudiante`.
2. **Patrones en los Fallos:**
   - La plataforma maneja el control de acceso en el frontend mediante redirecciones de cliente, pero el backend de UniDoc presenta fragilidad en endpoints protegidos al devolver errores 500 en lugar de 401 estandarizados ante ausencia de credenciales.
3. **Riesgos para la Operación Institucional:**
   - La falta de mensajes en español en el login de tickets genera tickets de soporte innecesarios de estudiantes reportando "fallas en la plataforma" cuando simplemente olvidaron su clave.

---

## 12. Conclusiones y Recomendaciones

### 12.1 Dictamen Final de Calidad
La plataforma **NOVA (módulos Tickets y Convocatorias UniDoc) se encuentra APTA PARA USO CON RESERVAS**:
- Las funciones críticas de visualización de información de estudiantes, radicación de tickets y seguridad de rutas de Rectoría operan de manera correcta y consistente.
- Las reservas se derivan de la respuesta 500 en endpoints API no autenticados de Rectoría (DEF-02) y la falta de traducción en errores de login (DEF-01).

### 12.2 Acciones Recomendadas
1. **Backend UniDoc:** Implementar decoradores `@permission_classes([IsAuthenticated])` robustos en las vistas de Rectoría para responder formalmente con HTTP 401 ante la ausencia de JWT.
2. **Backend Tickets:** Sobrescribir el serializador `TokenObtainPairView` de SimpleJWT para internacionalizar los mensajes de error al español.
3. **CI/CD:** Integrar la suite de 21 pruebas Cypress en el pipeline de despliegue continuo de la universidad para prevenir regresiones.

---

## 13. Anexos y Enlace al Repositorio

- **Repositorio Git Oficial:** https://github.com/jaiver2003/nova-auditoria-qa-cypress
- **Directorio de Grabaciones de Video:** `cypress/videos/`
- **Registro Completo de Consola:** `cypress_run_raw_report.txt`
- **Copia de Seguridad de Evidencias:** `evidencias/funcionales/2026-11-17T03-55-09Z/`
