# Diseño de pruebas funcionales de UniDoc Rectoría

## Alcance y estado

Versión 0.1, 16 de noviembre de 2026. Diseño preparado con asistencia de Codex para revisión del equipo. Alcance confirmado por el usuario: UniDoc, Rectoría, Gestión de Avales. Los casos de Estudiante no acreditan este alcance.

La captura aportada muestra 8 postulantes, 7 con aval y 1 sin aval; dos agrupaciones con 4 postulantes cada una: Sin convocatoria y Docente de Algebra moderna. Son valores observados en una imagen, no datos permanentes ni resultados de una ejecución automatizada. La imagen no incluye la URL. Las rutas del proyecto proceden de confirmaciones anteriores registradas en rectoria.alcance.json.

Se observan filtros de convocatoria, nombre, desde y hasta, el botón Por Puntaje, Ver postulantes y Cerrar sesión. No se han observado todavía el detalle de postulantes, los controles de aval ni el mecanismo de sesión. No se atribuyen permisos ni resultados a controles no inspeccionados.

## Precondiciones y datos

- P1: cuenta de prueba legítima con rol Rectoría y sesión activa en UniDoc.
- P2: convocatoria y postulante de prueba identificados por el equipo; datos estables durante la ejecución.
- P3: fechas y puntajes conocidos para contrastar filtros y orden. Confirmar a qué fecha corresponde el filtro.
- P4: navegador aislado sin sesión para comprobar permisos; no cerrar la sesión de trabajo antes de disponer de un acceso reproducible.
- P5: cuenta de otro rol expresamente asignada para comprobar denegación. No usar cuentas ajenas ni enumerar identificadores.

Los resultados esperados son criterios propuestos para validar con el comportamiento requerido. Un comportamiento ambiguo requiere aclaración antes de declararlo defecto.

## Casos diseñados

Todos los casos están NO EJECUTADOS y todavía NO automatizados. La columna Cypress expresa el objetivo de implementación, no cobertura conseguida.

| ID | Funcionalidad y descripción | Tipo | Prioridad | Precondición | Pasos | Datos | Resultado esperado | Cypress previsto |
|---|---|---|---|---|---|---|---|---|
| REC-CP-01 | Acceso al panel autorizado | Permisos positivo | Alta | P1 | Abrir la ruta de avales; comprobar encabezado y controles | Ruta registrada de Rectoría | Se muestra Gestión de Avales para Rectoría, sin redirección a Aspirante ni error de autorización | Sí |
| REC-CP-02 | Consistencia de contadores | Positivo | Alta | P1 y datos estables | Leer total, con aval y sin aval; contrastar con el listado completo | Conteos de la misma consulta, sin filtros | Total = con aval + sin aval; los registros únicos del listado concuerdan con los contadores | Sí |
| REC-CP-03 | Filtro por convocatoria | Positivo | Alta | P1, P2 | Seleccionar una convocatoria; abrir sus postulantes; restablecer Todas las convocatorias | Convocatoria de prueba | Se muestran solo los postulantes asociados; al restablecer se recupera el conjunto inicial | Sí |
| REC-CP-04 | Búsqueda por nombre existente | Positivo | Media | P1, P2 | Introducir un nombre conocido; revisar resultados; limpiar búsqueda | Nombre del postulante de prueba | Los resultados corresponden al nombre buscado y se restaura el listado al limpiar | Sí |
| REC-CP-05 | Rango válido de fechas | Positivo | Media | P1, P2, P3 | Fijar Desde y Hasta con datos dentro y fuera del intervalo; revisar resultados | Intervalo y registros conocidos | Se incluyen los registros del intervalo según la semántica de fecha confirmada; se excluyen los externos | Sí |
| REC-CP-06 | Orden por puntaje | Positivo | Media | P1, P3 y al menos dos puntajes distintos | Abrir listado; accionar Por Puntaje; comparar la secuencia y el conjunto de registros | Puntajes conocidos | Se conserva el conjunto y se ordena de forma monótona en la dirección indicada; confirmar si ordena grupos o postulantes | Sí |
| REC-CP-07 | Consulta de postulantes | Positivo | Alta | P1, P2 | Pulsar Ver postulantes en una convocatoria; contrastar pertenencia y conteo | Convocatoria de prueba | El listado corresponde a la convocatoria seleccionada y su total es consistente; considerar paginación | Sí |
| REC-CP-08 | Nombre sin coincidencias | Negativo | Media | P1 | Buscar una cadena comprobada como inexistente; limpiar | QA_SIN_COINCIDENCIA_20261116 | Estado vacío comprensible, sin datos residuales ni error; recuperación al limpiar | Sí |
| REC-CP-09 | Rango de fechas invertido | Negativo | Media | P1 | Introducir Desde posterior a Hasta; observar validación | Desde 2026-11-16, Hasta 2026-11-01 | Se informa o impide el rango inválido; no se presentan resultados engañosos como válidos | Sí |
| REC-CP-10 | Fecha imposible | Negativo | Media | P1 | Intentar introducir una fecha imposible en el control; observar el valor y la validación | 31/02/2026 | El control impide o rechaza la fecha sin error de aplicación; registrar si valida el navegador o la aplicación | Manual inicialmente |
| REC-CP-11 | Acceso sin sesión | Permisos negativo | Alta | P4 | Abrir la ruta de Rectoría en un contexto limpio; comprobar la consulta protegida observada | Ruta y API de Rectoría ya identificadas | No se exponen datos protegidos; la interfaz solicita autenticación y la API rechaza el acceso según su contrato | Sí |
| REC-CP-12 | Cierre de sesión | Positivo | Alta | P1 y acceso reproducible | Cerrar sesión; volver directamente a la ruta protegida; recargar | Sesión de prueba | Se solicita autenticación y no reaparecen datos protegidos accesibles tras recargar | Sí |

Diseño: 12 casos, 3 negativos de entrada y 2 casos de permisos (uno de acceso permitido y otro de acceso denegado). Objetivo: 11 automatizables, mínimo de entrega 8 realmente implementados y ejecutados. La cobertura entre roles requiere adicionalmente P5; REC-CP-11 solo verifica la frontera sin autenticación.

## Trazabilidad

| Función | Casos |
|---|---|
| Acceso y protección del panel | REC-CP-01, REC-CP-11, REC-CP-12 |
| Resumen de avales | REC-CP-02 |
| Convocatorias y postulantes | REC-CP-03, REC-CP-07 |
| Búsqueda por nombre | REC-CP-04, REC-CP-08 |
| Filtros temporales | REC-CP-05, REC-CP-09, REC-CP-10 |
| Orden por puntaje | REC-CP-06 |

## Estrategia y limitaciones

Primero se inspecciona la interfaz real y el contrato de sus consultas. Después se implementan selectores estables y aserciones sobre contenido y permisos, conservando evidencia por caso. No usar números fijos de la captura como expectativas permanentes. No considerar una página 404 como prueba suficiente de autorización.

Las operaciones de otorgar y revocar avales quedan pendientes de observar y diseñar sobre datos de prueba acordados. Son una función central del rol, por lo que su exclusión debe figurar expresamente en el informe; cumplir el mínimo numérico no acredita cobertura completa del proceso. No modificar decisiones reales sobre postulantes para obtener evidencia.

Entrada: sesión reproducible, alcance y datos identificados, requisitos de filtros aclarados. Salida: mínimo 12 casos documentados, 8 automatizados, resultados y evidencia individual, defectos trazados y limitaciones explícitas. Aprobación = aprobados / ejecutados × 100; si no hay ejecutados, no aplica. Cobertura de ejecución = ejecutados / diseñados × 100. No registrar casos bloqueados como aprobados.

## Registro de ejecución por completar

Para cada REC-CP registrar: resultado (aprobado, fallido o bloqueado), obtenido, fecha y hora America/Bogota, navegador y versión, versión del código, referencia de captura o video y defecto asociado. Conservar el estado no ejecutado hasta realizar el caso. Los defectos usarán REC-DEF-001 en adelante, con pasos, esperado, obtenido, severidad, prioridad y evidencia.

## Siguiente evidencia necesaria

Captura de Ver postulantes con sus controles visibles, ocultando datos personales innecesarios, y URL de la página sin parámetros de sesión. Esto permite cerrar el diseño del detalle y determinar cómo se consulta y gestiona el aval. La captura por sí sola no permite validar la sesión ni ejecutar Cypress.
