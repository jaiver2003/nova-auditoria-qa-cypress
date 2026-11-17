# INFORME DE PRUEBAS FUNCIONALES AUTOMATIZADAS (CYPRESS)
## Plataforma NOVA — Módulo UniDoc · Rol **Rectoría** (Gestión de Avales)
### Calidad de Software II — Trabajo Final · Entregable 1 de 3

---

## 1. Portada y control de versiones

| Campo | Detalle |
|---|---|
| **Institución** | Corporación Universitaria Autónoma del Cauca (Uniautónoma) |
| **Programa** | Ingeniería de Software |
| **Asignatura** | Calidad de Software II |
| **Docente** | Jefferson Andrés Muñoz |
| **Firma QA (rol asumido)** | Grupo 1 — Aseguramiento de Calidad |
| **Sistema bajo prueba** | Plataforma NOVA — `https://nova.uniautonoma.edu.co/` |
| **Aplicación / módulo** | UniDoc — Convocatorias Docentes y Gestión de Avales |
| **Rol evaluado** | **Rectoría** |
| **Fecha de entrega** | 17 de noviembre de 2026 |

**Integrantes del equipo**

- Jaiver Muñoz Muñoz
- Martha Isabel España Gonzales

> Verifique y complete los correos institucionales de cada integrante antes de la entrega.

**Historial de versiones del documento**

| Versión | Fecha | Autor | Cambio |
|---|---|---|---|
| 0.1 | 16/11/2026 | Equipo G1 | Diseño inicial de casos de Rectoría. |
| 1.0 | 16/11/2026 | Equipo G1 | Ejecución de la suite automatizada de acceso/seguridad. |
| 2.0 | 16/11/2026 | Equipo G1 | Corrección de alcance a UniDoc–Rectoría; retiro del material de Estudiante/Tickets. |
| 3.0 | 16/11/2026 | Equipo G1 | **Ejecución manual del panel autenticado de Avales** (REC-AV-01…07) con evidencia en captura; se incorporan resultados y dos hallazgos nuevos. |

---

## 2. Resumen ejecutivo

Se auditó el rol **Rectoría** del módulo **UniDoc** de la plataforma NOVA, tanto en su **frontera de acceso y seguridad** (automatizado con Cypress) como en su **panel autenticado de Gestión de Avales** (ejecución manual con sesión real de Rectoría vía Google institucional).

Se diseñaron **17 casos** y se **ejecutaron los 17**: 10 automatizados con Cypress (acceso, credenciales, protección de ruta y APIs sin token) y 7 manuales sobre el panel de Avales (contadores, filtros, orden por puntaje, ver postulantes y cierre de sesión). Resultado global: **15 aprobados, 1 fallido y 1 no concluyente**.

- Los **10 casos automatizados** resultaron **APROBADOS (100 %)** en 7 s de corrida, con vídeo y consola.
- En los **7 casos manuales**, se confirmó el funcionamiento de contadores, filtro por convocatoria, búsqueda, ver postulantes y cierre de sesión. Se detectó **un defecto** (REC-DEF-01: el filtro de fechas no valida un rango invertido, solo muestra lista vacía) y **un caso no concluyente** (REC-AV-05: el orden "Por Puntaje" no produjo cambio visible y la interfaz no expone el puntaje).

**Recomendación general:** el rol Rectoría es **apto con reservas**. El acceso, la seguridad perimetral y las funciones principales de consulta de avales operan correctamente; las reservas son el defecto de validación de fechas y la imposibilidad de verificar el orden por puntaje con los datos actuales.

---

## 3. Objetivo y alcance

**Objetivo.** Verificar que el rol Rectoría de UniDoc permite únicamente lo que su perfil autoriza, que su acceso está correctamente protegido y que sus flujos de gestión de avales se comportan según lo esperado.

**Dentro de alcance**

- Pantalla de acceso de UniDoc y sus validaciones.
- Protección de la ruta privada de Rectoría (`/convocatorias-app/rectoria/avales`) y de sus APIs.
- Navegación pública asociada (recuperación de contraseña, registro, portal).
- Panel autenticado de Gestión de Avales: contadores, filtros, búsqueda, orden y ver postulantes.

**Fuera de alcance (justificado)**

- Módulos **Tickets** y **Planes de Aula** y el rol **Estudiante** (material retirado a `_descartado/`).
- Operaciones de **otorgar/revocar avales reales**: no se ejecutan para no alterar decisiones sobre postulantes reales (regla ética del enunciado).
- Enumeración de identificadores de otros usuarios en las APIs.

---

## 4. Descripción de la aplicación y del rol

**UniDoc** es el módulo de NOVA para convocatorias docentes. El rol **Rectoría** accede al panel **Gestión de Avales**, donde visualiza los postulantes de las convocatorias, sus contadores (total, con aval y sin aval), aplica filtros (convocatoria, nombre, rango de fechas), ordena por puntaje y consulta el detalle de postulantes de cada convocatoria.

**Acceso.** El ingreso al panel de Rectoría se realiza mediante **inicio de sesión con Google institucional (OAuth)**. La pantalla de UniDoc ofrece además un formulario de correo/contraseña y enlaces a recuperación y registro.

**Datos de prueba.** Se emplea una cuenta de prueba legítima con rol Rectoría. **No se incluyen credenciales reales en este documento**; se gestionan localmente en `cypress.env.json`, excluido de Git. Durante la ejecución del panel se observaron 8 postulantes (7 con aval, 1 sin aval) en dos agrupaciones ("Sin convocatoria" y "Docente de Algebra moderna", 4 cada una).

---

## 5. Entorno de pruebas

| Elemento | Valor |
|---|---|
| URL base | `https://nova.uniautonoma.edu.co` |
| Navegador (automatizado) | Electron 138 (headless, Cypress) |
| Navegador (manual) | Navegador integrado de la app de escritorio de Claude (motor Chromium) |
| Runner | Cypress 15.21.2 |
| Node.js | v25.8.1 |
| Sistema operativo | Windows 11 (64 bits) |
| Zona horaria de registro | America/Bogota (COT, UTC−5) |

---

## 6. Estrategia de pruebas

**Qué se automatizó y por qué.** Todo lo determinista y reproducible sin sesión interactiva: estructura del formulario, validaciones, control de credenciales, protección de ruta y rechazo de las APIs sin token. Estable y repetible con `npx cypress run`.

**Qué se ejecutó manualmente y por qué.** El panel autenticado de Avales requiere una sesión de Rectoría obtenida vía Google OAuth, cuyo login Google bloquea para automatización. Por eso REC-AV-01…07 se ejecutaron manualmente con una sesión real, capturando evidencia por caso.

**Criterios de entrada:** alcance y rol confirmados, rutas identificadas, proyecto Cypress configurado, credenciales en variables de entorno, sesión de Rectoría disponible para la parte manual.

**Criterios de salida:** ≥ 12 casos diseñados, ≥ 8 automatizados y ejecutados, evidencia por caso, defectos trazados y limitaciones declaradas. **Todos cumplidos.**

**Prioridad de casos:** Alta = acceso, protección y consulta de avales; Media = navegación y validaciones de entrada.

---

## 7. Matriz de trazabilidad

| Funcionalidad del rol | Casos que la cubren |
|---|---|
| Acceso y protección del panel | REC-CP-01, REC-CP-04, REC-CP-10, REC-AV-07 |
| Control de credenciales / aislamiento | REC-CP-02, REC-CP-03 |
| Navegación pública asociada | REC-CP-05, REC-CP-06, REC-CP-07 |
| Contrato de seguridad de las APIs de Rectoría | REC-CP-08, REC-CP-09 |
| Resumen de avales (contadores) | REC-AV-01 |
| Convocatorias y postulantes | REC-AV-02, REC-AV-06 |
| Búsqueda por nombre | REC-AV-03 |
| Filtros temporales | REC-AV-04 |
| Orden por puntaje | REC-AV-05 |

---

## 8. Casos de prueba

**Automatizados (ejecutados).** `cypress/e2e/05_rectoria_convocatorias.cy.js`

| ID | Funcionalidad / descripción | Tipo | Prioridad | Precondición | Datos de entrada | Resultado esperado | Autom. |
|---|---|---|---|---|---|---|---|
| REC-CP-01 | Estructura del formulario de acceso UniDoc | Positivo | Alta | Sin sesión | — | Se muestran todos los controles de acceso | Sí |
| REC-CP-02 | Login con credenciales no autorizadas | Negativo | Alta | Sin sesión | correo inexistente + clave inválida | Mensaje "Credenciales incorrectas"; permanece en login | Sí |
| REC-CP-03 | Login con credenciales de otra cuenta/rol | Negativo | Alta | Sin sesión | cuenta ajena a UniDoc | Rechazo; no se concede sesión de Rectoría | Sí |
| REC-CP-04 | Protección de la ruta de avales sin sesión | Permisos | Alta | Contexto limpio | ruta privada | Redirección fuera de la ruta; no se muestra "Gestión de Avales" | Sí |
| REC-CP-05 | Navegación a recuperación de contraseña | Positivo | Media | Sin sesión | — | Llega a `/restablecer-contrasena` | Sí |
| REC-CP-06 | Portal público de convocatorias | Positivo | Media | Sin sesión | — | Portal visible con "Convocatorias" | Sí |
| REC-CP-07 | Navegación a registro de usuarios | Positivo | Media | Sin sesión | — | Llega a `/registro` | Sí |
| REC-CP-08 | API de convocatorias de Rectoría sin token | Permisos | Alta | Sin sesión | API convocatorias (sin token) | La API rechaza el acceso (401/403/500) | Sí |
| REC-CP-09 | API de avales de usuario sin sesión | Permisos | Alta | Sin sesión | API avales (sin token) | La API rechaza el acceso (401/403/500) | Sí |
| REC-CP-10 | Validación reactiva de formulario vacío | Negativo | Media | Sin sesión | campos vacíos | No hay redirección ni sesión espuria | Sí |

**Panel autenticado de Avales (ejecución manual).** Sesión real de Rectoría.

| ID | Funcionalidad / descripción | Tipo | Prioridad | Precondición | Resultado esperado | Autom. |
|---|---|---|---|---|---|---|
| REC-AV-01 | Consistencia de contadores (Total = con aval + sin aval) | Positivo | Alta | Sesión Rectoría | Los contadores concuerdan | Manual |
| REC-AV-02 | Filtro por convocatoria y restablecimiento | Positivo | Alta | Sesión Rectoría | Solo postulantes de la convocatoria; al restablecer vuelve el conjunto | Manual |
| REC-AV-03 | Búsqueda por nombre (estado vacío) | Negativo | Media | Sesión Rectoría | Mensaje de estado vacío sin error | Manual |
| REC-AV-04 | Rango de fechas invertido (Desde > Hasta) | Negativo | Media | Sesión Rectoría | Se informa/impide el rango inválido | Manual |
| REC-AV-05 | Orden "Por Puntaje" | Positivo | Media | Sesión Rectoría | Conserva el conjunto y ordena de forma monótona | Manual |
| REC-AV-06 | "Ver postulantes" de una convocatoria | Positivo | Alta | Sesión Rectoría | Listado pertenece a la convocatoria; conteo consistente | Manual |
| REC-AV-07 | Cierre de sesión invalida el acceso | Permisos | Alta | Sesión Rectoría | Tras salir, la ruta de avales exige autenticación otra vez | Manual |

Resumen de diseño: **17 casos** (10 automatizados + 7 manuales); 4 negativos (REC-CP-02, 03, 10 y REC-AV-04) y 5 de permisos (REC-CP-04, 08, 09 y REC-AV-07, más el aislamiento REC-CP-03). Se superan los mínimos del enunciado (12 casos, 8 automatizados, 3 negativos, 2 de permisos).

---

## 9. Resultados de ejecución

### 9.1 Automatizados — 16/11/2026, 22:55 COT · `npx cypress run`
Evidencia: `cypress/videos/05_rectoria_convocatorias.cy.js.mp4`, `evidencias/funcionales/2026-11-17T03-55-09Z/consola.txt`, `cypress_run_raw_report.txt`.

| ID | Resultado | Duración |
|---|---|---|
| REC-CP-01 | Aprobado | 879 ms |
| REC-CP-02 | Aprobado | 1 433 ms |
| REC-CP-03 | Aprobado | 1 677 ms |
| REC-CP-04 | Aprobado | 133 ms |
| REC-CP-05 | Aprobado | 204 ms |
| REC-CP-06 | Aprobado | 172 ms |
| REC-CP-07 | Aprobado | 257 ms |
| REC-CP-08 | Aprobado | 921 ms |
| REC-CP-09 | Aprobado | 790 ms |
| REC-CP-10 | Aprobado | 516 ms |

Subtotal: 10 ejecutados · 10 aprobados · 0 fallidos.

### 9.2 Manuales (panel de Avales) — 16/11/2026, ~23:42–23:45 COT
Evidencia: `evidencias/avales/REC-AV-0X_*.jpg`.

| ID | Resultado | Observación | Evidencia |
|---|---|---|---|
| REC-AV-01 | Aprobado | Total 8 = Con aval 7 + Sin aval 1 (consistente) | REC-AV-01_contadores.jpg |
| REC-AV-02 | Aprobado | Al filtrar "Docente de Algebra moderna" solo aparece ese grupo (4); al restablecer vuelve el conjunto | REC-AV-02_filtro_convocatoria.jpg |
| REC-AV-03 | Aprobado | Búsqueda sin coincidencias → "No hay usuarios con los filtros actuales" | REC-AV-03_busqueda_sin_coincidencias.jpg |
| REC-AV-04 | **Fallido** | Rango invertido (Desde 16/11 > Hasta 01/11) **no se valida ni se informa**; solo muestra lista vacía → defecto REC-DEF-01 | REC-AV-04_rango_fechas_invertido.jpg |
| REC-AV-05 | **No concluyente** | "Por Puntaje" no cambió el orden visible y la vista no expone el puntaje; no verificable con los datos actuales | REC-AV-05_orden_por_puntaje.jpg |
| REC-AV-06 | Aprobado | "Sin convocatoria" → 4 postulantes, coincide con el conteo del grupo | REC-AV-06_ver_postulantes.jpg |
| REC-AV-07 | Aprobado | Cierre de sesión redirige a login; acceso directo a la ruta de avales redirige al portal público | REC-AV-07_cierre_sesion_ruta_protegida.jpg |

Subtotal manual: 7 ejecutados · 5 aprobados · 1 fallido · 1 no concluyente.

### 9.3 Resumen numérico global
Ejecutados: **17** · Aprobados: **15** · Fallidos: **1** · No concluyentes: **1**.
**% de aprobación = aprobados / ejecutados = 15 / 17 = 88,2 %.**
**Cobertura de ejecución = 17 / 17 = 100 %.**

> La captura REC-AV-06 contiene datos personales de postulantes (uso confidencial para el docente); recórtela si se difunde por otro medio.

---

## 10. Reporte de defectos

| ID | Título | Caso | Pasos | Esperado | Obtenido | Severidad | Prioridad | Estado |
|---|---|---|---|---|---|---|---|---|
| REC-DEF-01 | Filtro de fechas no valida rango invertido | REC-AV-04 | Fijar Desde=16/11/2026 y Hasta=01/11/2026 | Mensaje o bloqueo del rango inválido | Sin aviso; muestra "No hay usuarios con los filtros actuales" | Baja | Media | Abierto |
| REC-OBS-01 | Posible error 500 en API de Rectoría sin token | REC-CP-08/09 | Invocar la API sin `Authorization` | 401/403 estandarizado | Aserción acepta 401/403/500; código exacto sin registrar | Baja | Media | Abierto — por confirmar |
| REC-OBS-02 | Contadores no se recalculan al filtrar | REC-AV-02 | Aplicar filtro de convocatoria/búsqueda | ¿Contadores del subconjunto? | Los contadores superiores permanecen como totales globales | Informativa | Baja | Observación de diseño |
| REC-OBS-03 | Puntaje no visible en el listado | REC-AV-05 | Abrir "Ver postulantes" | Ver puntaje para validar el orden | El listado no muestra el puntaje | Baja | Media | Abierto |

---

## 11. Análisis de resultados

- **Más estable:** la frontera de acceso y las funciones de consulta del panel (contadores, filtro por convocatoria, búsqueda, ver postulantes, cierre de sesión) respondieron correctamente y con evidencia.
- **Defecto confirmado:** el filtro temporal no valida un rango invertido (REC-DEF-01). Riesgo de negocio bajo pero genera confusión: el usuario de Rectoría podría creer que no hay postulantes cuando en realidad el rango es inválido.
- **Zona no verificable:** el orden por puntaje (REC-AV-05) no pudo confirmarse porque la interfaz no expone el puntaje y el orden no cambió de forma observable; se requiere un conjunto de datos con puntajes distintos y visibles, o acceso a la lógica de orden.
- **Observaciones de diseño:** los contadores son globales y no reflejan el filtro activo (REC-OBS-02); conviene aclararlo en la interfaz.
- **Limitaciones:** los datos observados (8 postulantes) son los existentes al momento de la prueba; los resultados de orden y filtros dependen de ese estado. La parte manual no es reejecutable automáticamente por el login OAuth.

---

## 12. Conclusiones y recomendaciones

**Valoración:** **APTO CON RESERVAS.** El acceso, la seguridad perimetral y las funciones principales de consulta de avales del rol Rectoría funcionan correctamente y con evidencia real. Las reservas son concretas: un defecto de validación de fechas (REC-DEF-01) y la imposibilidad de verificar el orden por puntaje (REC-AV-05 / REC-OBS-03).

**Acciones recomendadas**
1. Corregir la validación del filtro de fechas para informar o impedir rangos invertidos (REC-DEF-01).
2. Exponer el puntaje en el listado de postulantes para permitir verificar el orden (REC-OBS-03) y reejecutar REC-AV-05.
3. Aclarar en la interfaz que los contadores son totales globales o recalcularlos según el filtro (REC-OBS-02).
4. Confirmar el código HTTP real de las APIs sin token y exigir 401/403 (REC-OBS-01).

---

## 13. Anexos

- **Anexo A — Proyecto Cypress.** Estructura, instalación y comandos en `README.md`. Specs en `cypress/e2e/`. Credenciales fuera de Git.
- **Anexo B — Evidencia automatizada.** `cypress/videos/05_rectoria_convocatorias.cy.js.mp4`, `evidencias/funcionales/2026-11-17T03-55-09Z/`, `cypress_run_raw_report.txt`.
- **Anexo C — Evidencia manual del panel de Avales.** `evidencias/avales/REC-AV-01…07_*.jpg` (capturas de la sesión real de Rectoría, 16/11/2026).
- **Anexo D — Repositorio.** Repositorio Git del proyecto: https://github.com/jaiver2003/nova-auditoria-qa-cypress
