# INFORME DE PRUEBAS FUNCIONALES AUTOMATIZADAS (E2E)

> ANTECEDENTE DEL ROL ESTUDIANTE. El usuario confirmó posteriormente que el alcance final es UniDoc — Rectoría. Estos resultados se conservan, pero no acreditan el entregable funcional del nuevo rol.
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
- **Rol Asignado:** Estudiante. Equivalencia con el rol de la aplicación del enunciado pendiente de confirmar.
- **Usuario de prueba:** Cuenta institucional del estudiante, configurada localmente sin incluir credenciales en este documento.
- **Ticket Asignado para Auditoría:** `TI-20261113-7BEB1D57`
- **Fecha de Auditoría y Ejecución:** 16 de noviembre de 2026
- **Grupo Académico:** Sin número de grupo asignado, según confirmación del equipo.
- **Integrantes del Equipo:**
  - Jaiver Muñoz Muñoz (`jaiver.munoz@uniautonoma.edu.co`)
  - Martha Isabel España Gonzales.
- **Repositorio Git Local:** `c:\Users\USUARIO\Desktop\nova-qa-final` (Rama: `main`)
- **Enlace a Repositorio Remoto:** https://github.com/jaiver2003/nova-auditoria-qa-cypress (pendiente de verificar publicación de la versión final y acceso del docente).

### 1.2 Historial de Versiones del Documento

| Versión | Fecha | Autor(es) | Descripción del Cambio |
| :---: | :---: | :--- | :--- |
| **1.0.0** | 16/11/2026 | Equipo QA | Creación inicial del informe con resultados de suites E2E preliminares. |
| **1.1.0** | 16/11/2026 | Equipo QA | Reestructuración a 13 secciones formales, eliminación de supresión de errores en soporte, ajuste de trazabilidad de rutas 404 y categorización de CP-12 como manual no ejecutado. |

---

## 2. Resumen Ejecutivo
El presente informe documenta la auditoría de calidad funcional y la suite de pruebas automatizadas End-to-End (E2E) construida para la plataforma institucional **NOVA**, evaluando las vistas, operaciones y restricciones del rol **Estudiante**.

Se diseñaron un total de **12 casos de prueba**, de los cuales:
- **11 casos fueron automatizados** mediante Cypress 15.21.2 sobre el navegador Electron 138 (headless).
- **11 casos resultaron APROBADOS** en la ejecución limpia verificada (100% de éxito sobre los casos ejecutados).
- **1 caso (CP-12)** permanece en estado **No ejecutado** por razones éticas y de integridad de datos en el entorno de producción.
- **Tasa de ejecución global del diseño:** 91.67% (11/12 casos).
- **Tiempo total de ejecución automatizada:** 1 minuto 10 segundos.

Se identificó 1 defecto menor de internacionalización en el módulo de autenticación (DEF-01) y 1 observación técnica en el módulo QuimeQuiz (OBS-01).

---

## 3. Objetivo y Alcance

### 3.1 Objetivo General
Evaluar la conformidad funcional, el control de acceso y el comportamiento de la interfaz de usuario de la plataforma NOVA para el rol Estudiante, implementando una suite de pruebas automatizadas desatendidas, confiables y reproducibles con Cypress.

### 3.2 Objetivos Específicos
1. Automatizar los flujos de autenticación positiva, negativa (credenciales inválidas, campos vacíos) y cierre de sesión.
2. Validar la consulta de solicitudes en "Mis Tickets", confirmando la presencia y detalle del ticket institucional asignado `TI-20261113-7BEB1D57`.
3. Comprobar la estructura y validaciones de obligatoriedad del formulario de radicación "Enviar ticket a un área".
4. Verificar la interacción con el módulo evaluativo embebido "QuimeQuiz".
5. Auditar las fronteras de rol y restricciones visuales en tickets y navegación por URL.

### 3.3 Alcance
- **Módulos Incluidos:** Autenticación local (`/login`), Dashboard Estudiante (`/estudiante`), QuimeQuiz (`/estudiante?s=quiz`), Mis Tickets (`/estudiante?s=tickets`), Formulario Nuevo Ticket y Mi Perfil (`/estudiante?s=perfil`).
- **Límites y Exclusiones:**
  - No se realizan modificaciones permanentes en la base de datos de producción (no se radican tickets reales sin justificación ni se agregan comentarios al ticket oficial `TI-20261113-7BEB1D57`).
  - No se automatiza el proveedor externo de Google OAuth 2.0 (`accounts.google.com`) para no violar mecanismos anti-automatización.

---

## 4. Descripción de la Aplicación y del Rol

### 4.1 Arquitectura de NOVA
- **Frontend:** Aplicación de página única (SPA) desarrollada en Next.js / React, con enrutamiento dinámico en el cliente y diseño responsivo con Tailwind CSS.
- **Backend:** API REST sobre Django REST Framework (DRF) con persistencia relacional y autenticación SimpleJWT (`/api/login/`).
- **Módulo QuimeQuiz:** Aplicación web independiente montada en un `iframe` que comparte contexto de sesión mediante Single Sign-On institucional (`/quiz-app/`).

### 4.2 Perfil del Rol Estudiante (Usuario Básico)
El rol Estudiante cuenta con permisos para:
- Visualizar su panel informativo personalizado (saludo "JAIVER", rol "ESTUDIANTE", calendario académico).
- Consultar el historial de tickets radicados por su usuario.
- Diligenciar y enviar nuevas solicitudes de soporte institucional.
- Ingresar a quizzes en vivo mediante código PIN.
- Consultar y actualizar datos de contacto en su perfil personal.

---

## 5. Entorno de Pruebas

| Parámetro | Detalle Técnico |
| :--- | :--- |
| **Sistema Operativo** | Microsoft Windows 11 Pro 64-bit (Compilación 10.0.26200) |
| **Procesador (CPU)** | AMD Ryzen 5 9600X 6-Core Processor (12 procesadores lógicos) |
| **Memoria RAM** | 15.11 GB DDR5 |
| **Runtime Node.js** | v25.8.1 (x64) |
| **Gestor de Paquetes** | NPM 11.11.0 |
| **Framework E2E** | Cypress 15.21.2 |
| **Navegador Runner** | Electron 138 (Headless, resolución de viewport: 1366 x 768 px) |
| **URL Base de la Aplicación** | `https://nova.uniautonoma.edu.co` |
| **Archivo de Configuración** | `cypress.config.js` (`baseUrl`, `video: true`, `screenshotOnRunFailure: true`) |

---

## 6. Estrategia de Pruebas

### 6.1 Enfoque de Pruebas
Se implementó una estrategia de **Caja Negra a nivel de Sistema**, combinando análisis de partición de equivalencia y valores límite en formularios.

### 6.2 Soporte de Excepciones y Rigor Técnico
En `cypress/support/e2e.js`, se configuró un manejador estricto para `uncaught:exception`:
- **Únicamente se ignora:** La notificación benigna de bucle del motor del navegador (`ResizeObserver loop limit exceeded`).
- **Comportamiento general:** No se suprime ninguna otra excepción no capturada ni errores de script de la aplicación. Cualquier fallo JavaScript no controlado provocará el fallo legítimo del caso de prueba.

### 6.3 Manejo de Credenciales
Las credenciales reales se leen exclusivamente desde `Cypress.env('NOVA_USER')` y `Cypress.env('NOVA_PASS')` (almacenadas localmente en `cypress.env.json`, ignorado en `.gitignore`), protegiendo los datos con `{ log: false }`.

### 6.4 Criterios de entrada y salida
Entrada: cuenta local activa del rol Estudiante, disponibilidad de NOVA, datos de prueba existentes y alcance definido. El ticket utilizado debe existir y conservar las precondiciones del caso. La inclusión de Quiz en la aplicación asignada requiere confirmación.

Salida: ejecutar los casos automatizados del alcance, conservar resultados y evidencia, registrar defectos y explicar los casos no ejecutados. No se considera aprobado un caso solo por estar implementado. Los cambios posteriores a una corrida requieren nueva ejecución de las pruebas afectadas.

### 6.5 Prioridad y selección
Prioridad alta: acceso, cierre de sesión, consulta de tickets y restricciones del rol, por su efecto sobre disponibilidad de funciones y acceso a información. Prioridad media: presentación de formularios y consulta de perfil. Se automatizan acciones repetibles; CP-12 queda diseñado y no ejecutado porque modifica el historial de un ticket institucional sin contar con datos desechables acordados para esa operación.

---

## 7. Matriz de Trazabilidad de Requisitos

| Requisito Funcional | Casos de Prueba Asociados | Estado de Cobertura |
| :--- | :---: | :---: |
| RF-01: Autenticación exitosa de estudiante y acceso a dashboard | **CP-01** | Cubierto (Automatizado) |
| RF-02: Control de errores ante credenciales inválidas | **CP-02** | Cubierto (Automatizado) |
| RF-03: Validación de campos obligatorios en formulario de login | **CP-03** | Cubierto (Automatizado) |
| RF-04: Cierre de sesión seguro y control de acceso posterior | **CP-04** | Cubierto (Automatizado) |
| RF-05: Consulta de listado de tickets y visualización de detalle | **CP-05** | Cubierto (Automatizado) |
| RF-06: Formulario de radicación de tickets institucionales | **CP-06** | Cubierto (Automatizado) |
| RF-07: Validación de campos obligatorios en creación de tickets | **CP-07** | Cubierto (Automatizado) |
| RF-08: Validación de código PIN en módulo QuimeQuiz | **CP-08** | Cubierto (Automatizado) |
| RF-09: Consulta de información personal y rol en Mi Perfil | **CP-09** | Cubierto (Automatizado) |
| RF-10: Restricción de navegación hacia rutas administrativas | **CP-10** | Cubierto (Automatizado) |
| RF-11: Restricción de acciones privilegiadas en tickets | **CP-11** | Cubierto (Automatizado) |
| RF-12: Interacción y seguimiento en hilo de conversación de tickets | **CP-12** | Diseñado (Manual) |

---

## 8. Casos de Prueba (12 Casos Diseñados)

| ID | Prioridad | Automatizado | Módulo | Tipo | Precondiciones | Pasos de Ejecución | Datos de Entrada | Resultado Esperado |
| :---: | :---: | :---: | :--- | :---: | :--- | :--- | :--- | :--- |
| **CP-01** | Alta | Sí (Cypress) | Autenticación | Positivo | Estudiante registrado y activo en NOVA. | 1. Visitar `/login`.<br>2. Digitar usuario y contraseña válidos.<br>3. Clic en "Iniciar Sesión". | `NOVA_USER`, `NOVA_PASS`. | Redirige a `/estudiante`. Saludo `JAIVER`, rol `ESTUDIANTE`, calendario `Noviembre 2026` y ticket `TI-20261113-7BEB1D57` visibles. |
| **CP-02** | Alta | Sí (Cypress) | Autenticación | Negativo | Estudiante registrado en la plataforma. | 1. Visitar `/login`.<br>2. Digitar usuario válido y clave incorrecta.<br>3. Enviar formulario. | Usuario real, clave: `ClaveInvalida123!`. | Código HTTP 401. Toast de error visible. Usuario permanece en `/login`. |
| **CP-03** | Media | Sí (Cypress) | Autenticación | Negativo | Navegador ubicado en `/login`. | 1. Clic en "Iniciar Sesión" con campos vacíos. | Campos vacíos. | Mensajes reactivos visibles: *"El correo es requerido"* y *"La contraseña es requerida"*. No se observa petición de login hasta mostrar los mensajes de validación. |
| **CP-04** | Alta | Sí (Cypress) | Autenticación | Positivo | Sesión activa del estudiante en NOVA. | 1. Clic en botón "Salir".<br>2. Intentar visitar `/estudiante` directamente. | Acción Clic en botón `Salir`. | Redirección inmediata a `/login`. Al navegar a `/estudiante` sin sesión, redirige forzosamente a `/login`. |
| **CP-05** | Alta | Sí (Cypress) | Mis Tickets | Positivo | Estudiante autenticado; ticket `TI-20261113-7BEB1D57` asignado. | 1. Clic en "Mis Tickets".<br>2. Localizar tarjeta de ticket.<br>3. Clic en la tarjeta. | `TI-20261113-7BEB1D57` | Despliega modal con estado "Abierto", etiqueta de prioridad, área y sección de descripción. |
| **CP-06** | Media | Sí (Cypress) | Mis Tickets | Positivo | Estudiante en módulo Mis Tickets. | 1. Clic en "+ Nuevo Ticket".<br>2. Comprobar campos del formulario.<br>3. Clic en "Cancelar". | Clic en botón `+ Nuevo Ticket`. | Se muestra formulario con Área, Prioridad, Asunto, Descripción, Adjuntos y Cancelar/Enviar. "Cancelar" cierra el modal. |
| **CP-07** | Alta | Sí (Cypress) | Mis Tickets | Negativo | Formulario de nuevo ticket desplegado. | 1. Clic en "Enviar ticket" sin llenar campos obligatorios. | Campos obligatorios vacíos. | Mensajes de alerta visibles: *"Selecciona un área destino"*, *"El asunto es obligatorio"*, *"La descripción es obligatoria"*. No se observa petición POST de creación de ticket hasta mostrar los mensajes de validación. |
| **CP-08** | Media | Sí (Cypress) | Quiz | Negativo | Estudiante en módulo Quiz; iframe cargado. | 1. Clic en "Quiz".<br>2. En iframe, ingresar PIN inválido.<br>3. Clic en "Unirse al Quiz". | PIN: `999999`. | Mensaje de alerta en pantalla: *"PIN no válido o sesión no encontrada"*. |
| **CP-09** | Media | Sí (Cypress) | Mi Perfil | Positivo | Sesión activa de JAIVER en NOVA. | 1. Clic en "Mi Perfil".<br>2. Comprobar campos y sección de lectura. | Navegación a `/estudiante?s=perfil`. | Inputs Nombre (`JAIVER`) y Apellido (`MUÑOZ MUÑOZ`) cargados. Sección SOLO LECTURA muestra rol `Estudiante` y correo. |
| **CP-10** | Alta | Sí (Cypress) | Permisos | Seguridad | Estudiante autenticado en NOVA. | 1. Navegar por URL a `/admin`.<br>2. Navegar a `/usuarios`, `/planes-de-aula`, `/unidoc`.<br>3. Purgar sesión e ir a `/estudiante`. | URLs administrativas. | `/admin` redirige a `/estudiante`. Rutas no encontradas muestran vista 404 institucional. Acceso sin sesión redirige a `/login`. |
| **CP-11** | Alta | Sí (Cypress) | Permisos | Seguridad | Estudiante en detalle de `TI-20261113-7BEB1D57`. | 1. Inspeccionar controles de estado, reasignación y borrado. | Modal de ticket. | No existen botones para cerrar, resolver o borrar el ticket. No existe selector de asignación a funcionarios. Solo se permite comentar. |
| **CP-12** | Media | No (Manual) | Mis Tickets | Positivo | Estudiante autenticado; ticket `TI-20261113-7BEB1D57` abierto. | 1. Abrir detalle del ticket.<br>2. Ingresar comentario en área de texto.<br>3. Clic en "Enviar". | Comentario de seguimiento. | La petición POST procesa el comentario, este aparece en el historial con autor JAIVER y el campo de texto se reinicia. |

---

## 9. Resultados de Ejecución

### 9.1 Resumen Métrico Oficial
- **Total Casos Diseñados:** 12
- **Total Casos Ejecutados:** 11 (CP-01 a CP-11)
- **Casos Aprobados:** 11 (100% de éxito en ejecutados)
- **Casos Fallidos:** 0 (0%)
- **Casos No Ejecutados:** 1 (CP-12 — 8.33% del diseño total)
- **Cobertura de Ejecución:** 91.67% (11/12)
- **Duración Total de la Corrida:** 1 minuto 10 segundos
- **Archivo de Salida Bruta de Cypress:** `evidencias/funcionales/2026-11-17T02-40-26-342Z/consola.txt`

La corrida comenzó el 16/11/26, 9:40:26 p. m. (America/Bogota). Las fechas UTC, versiones y huellas SHA-256 del código están en evidencias/funcionales/2026-11-17T02-40-26-342Z/ejecucion.json. Se preservaron las evidencias anteriores.

### 9.2 Tabla de Tiempos Reales por Caso de Prueba

| ID | Archivo de Prueba | Resultado | Tiempo Real (ms) | Video de Evidencia |
| :---: | :--- | :---: | :---: | :--- |
| **CP-01** | `01_autenticacion.cy.js` | **APROBADO** | 4152 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/01_autenticacion.cy.js.mp4` |
| **CP-02** | `01_autenticacion.cy.js` | **APROBADO** | 2598 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/01_autenticacion.cy.js.mp4` |
| **CP-03** | `01_autenticacion.cy.js` | **APROBADO** | 761 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/01_autenticacion.cy.js.mp4` |
| **CP-04** | `01_autenticacion.cy.js` | **APROBADO** | 5718 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/01_autenticacion.cy.js.mp4` |
| **CP-05** | `02_tickets_estudiante.cy.js` | **APROBADO** | 7716 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/02_tickets_estudiante.cy.js.mp4` |
| **CP-06** | `02_tickets_estudiante.cy.js` | **APROBADO** | 7167 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/02_tickets_estudiante.cy.js.mp4` |
| **CP-07** | `02_tickets_estudiante.cy.js` | **APROBADO** | 7500 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/02_tickets_estudiante.cy.js.mp4` |
| **CP-08** | `03_quiz_y_perfil.cy.js` | **APROBADO** | 6948 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/03_quiz_y_perfil.cy.js.mp4` |
| **CP-09** | `03_quiz_y_perfil.cy.js` | **APROBADO** | 5481 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/03_quiz_y_perfil.cy.js.mp4` |
| **CP-10** | `04_permisos_rol.cy.js` | **APROBADO** | 14120 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/04_permisos_rol.cy.js.mp4` |
| **CP-11** | `04_permisos_rol.cy.js` | **APROBADO** | 7751 ms | `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/04_permisos_rol.cy.js.mp4` |
| **CP-12** | *Caso Manual Diseñado* | **NO EJECUTADO** | N/A | *No ejecutado en suite desatendida para no alterar el historial del ticket institucional `TI-20261113-7BEB1D57` en la BD de producción.* |

---

## 10. Reporte de Defectos y Observaciones

### 10.1 Defecto DEF-01: Mensaje de error no internacionalizado en Login
- **ID:** DEF-01
- **Prioridad:** Baja, pendiente de planificación de corrección por el responsable de la aplicación.
- **Caso relacionado:** CP-02.
- **Evidencia de la corrida verificada:** evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/01_autenticacion.cy.js.mp4 y CP-02 en evidencias/funcionales/2026-11-17T02-40-26-342Z/consola.txt.
- **Módulo / Endpoint:** Autenticación (`POST /api/login/`).
- **Severidad:** Baja (Cosmética / Calidad de Interfaz).
- **Pasos para Reproducir:**
  1. Ingresar a `https://nova.uniautonoma.edu.co/login`.
  2. Digitar un correo institucional registrado y una contraseña inválida.
  3. Hacer clic en "Iniciar Sesión".
- **Resultado Obtenido:** El backend responde con HTTP 401 y la interfaz muestra un toast con el mensaje en inglés:  
  `"No active account found with the given credentials"`
- **Resultado Esperado:** Mensaje en español, claro y orientado al usuario final:  
  *"Credenciales incorrectas o cuenta inactiva. Por favor intente de nuevo."*

### 10.2 Observación Técnica OBS-01: Validación de formato en entrada de PIN de Quiz
- **ID:** OBS-01 *(Pendiente de confirmación con pruebas exploratorias adicionales)*
- **Módulo:** QuimeQuiz (`/estudiante?s=quiz`).
- **Clasificación:** Observación de Usabilidad / Robustez.
- **Descripción:** La prueba CP-08 demostró que al ingresar un PIN numérico no existente (`999999`), el sistema responde correctamente informando *"PIN no válido o sesión no encontrada"*. No obstante, el elemento `<input>` en el marcado HTML no declara atributos restrictivos visibles como `pattern="[0-9]*"` o `type="number"`. Queda pendiente confirmar si la interfaz restringe o no caracteres alfanuméricos y símbolos antes de disparar la consulta al servidor.

---

## 11. Análisis de Resultados

### 11.1 Rendimiento y Estabilidad de la Suite Funcional
- Las duraciones de los casos en la corrida registrada oscilan entre 761 ms y 14.120 segundos. Incluyen navegación, esperas y aserciones; no equivalen a latencias del servidor.
- La corrida registrada terminó sin fallos. Una sola corrida no permite concluir ausencia de intermitencias.

### 11.2 Análisis Crítico de Permisos y Fronteras de Acceso
1. **Redirección observada en `/admin`:** Al visitar esta ruta con sesión de estudiante, el navegador termina en `/estudiante`. La prueba no determina qué componente interno decide la redirección.
2. **Comportamiento en Rutas No Encontradas:** Al navegar a rutas como `/usuarios`, `/planes-de-aula` o `/unidoc`, la aplicación presenta la vista institucional 404 ("Página no encontrada"). Esta observación indica únicamente que la ruta solicitada no fue localizada por el enrutador; no constituye evidencia de una política de autorización 403 del servidor ni de aislamiento a nivel de bundle.
3. **Controles Visibles en Tickets:** El detalle del ticket `TI-20261113-7BEB1D57` no presenta controles de mutación administrativa en el DOM, confirmando que la interfaz de usuario respeta el perfil de consulta del estudiante.

---

## 12. Conclusiones y Recomendaciones

### 12.1 Conclusiones
1. La suite automatizada de 11 casos E2E cumplió con el 100% de aprobación técnica en la ejecución desatendida, validando los flujos clave de autenticación, tickets, quizzes y perfil.
2. El diseño contempla 12 casos bien estructurados, reservando el caso CP-12 para ejecución manual controlada con el fin de proteger la base de datos institucional.
3. Valoración: uso con reservas para las funciones observadas en la corrida registrada. No se ha validado el envío de comentarios de CP-12, la autorización del servidor para operaciones administrativas ni la estabilidad a largo plazo.

### 12.2 Recomendaciones
1. **Internacionalización:** Traducir los mensajes de excepción de SimpleJWT para asegurar una experiencia de usuario completamente en español.
2. **Control de acceso:** Confirmar con el responsable las rutas existentes y sus permisos antes de ampliar las pruebas de autorización del servidor.
3. **Formulario de Quiz:** Confirmar el requisito de formato del PIN y realizar pruebas exploratorias antes de proponer cambios.

---

## 13. Anexos
1. **Grabaciones en Video de la Corrida:**
   - `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/01_autenticacion.cy.js.mp4`
   - `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/02_tickets_estudiante.cy.js.mp4`
   - `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/03_quiz_y_perfil.cy.js.mp4`
   - `evidencias/funcionales/2026-11-17T02-40-26-342Z/videos/04_permisos_rol.cy.js.mp4`
2. **Respaldo de Grabaciones Previas:** Directorio local `cypress/videos_previos/`.
3. **Registro de Consola Oficial de Cypress:** Archivo `evidencias/funcionales/2026-11-17T02-40-26-342Z/consola.txt`.
4. **Catálogo de Endpoints REST Identificados:** Archivo `endpoints_reales.json`.
5. **Configuración Base del Framework:** Archivo `cypress.config.js`.
