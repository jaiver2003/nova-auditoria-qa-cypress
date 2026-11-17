/**
 * Casos FUNCIONALES del panel autenticado de Rectoría (Gestión de Avales).
 *
 * ESTADO: diseñados y documentados; ejecución MANUAL (no automatizada).
 *
 * MOTIVO: el ingreso al panel de Rectoría en UniDoc se realiza mediante inicio de
 * sesión federado con Google institucional (OAuth). Google bloquea deliberadamente
 * la automatización de su pantalla de login dentro de navegadores controlados
 * (detección de automatización / "este navegador puede no ser seguro"), por lo que
 * no es posible obtener una sesión estable de Rectoría desde Cypress sin técnicas
 * frágiles o fuera de alcance. Estos casos se ejecutan manualmente con evidencia en
 * captura/vídeo y se reportan en el informe funcional (secciones 8, 9 y 10).
 *
 * Se dejan aquí como `it.skip` para que el diseño quede trazado en el repositorio.
 * Si el equipo obtiene un mecanismo de sesión reproducible (p. ej. inyección de
 * token emitido tras un login manual autorizado), se retirará el `.skip` y se
 * completarán los selectores reales del panel.
 */
describe('UniDoc Rectoría — Panel de Gestión de Avales (autenticado, ejecución manual)', () => {
  it.skip('REC-AV-01 (Positivo): consistencia de contadores Total = con aval + sin aval', () => {});
  it.skip('REC-AV-02 (Positivo): filtro por convocatoria muestra solo sus postulantes y se restablece', () => {});
  it.skip('REC-AV-03 (Positivo): búsqueda por nombre existente devuelve coincidencias y limpia bien', () => {});
  it.skip('REC-AV-04 (Negativo): rango de fechas invertido (Desde > Hasta) se informa/impide', () => {});
  it.skip('REC-AV-05 (Positivo): orden "Por Puntaje" conserva el conjunto y ordena de forma monótona', () => {});
  it.skip('REC-AV-06 (Positivo): "Ver postulantes" lista los de la convocatoria con conteo consistente', () => {});
  it.skip('REC-AV-07 (Permisos): tras "Cerrar sesión", la ruta de avales exige autenticación de nuevo', () => {});
});
