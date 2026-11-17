# Plan de cierre del trabajo final

## Cambio de alcance confirmado por el usuario

El alcance vigente es UniDoc — Rectoría, mediante Convocatorias e inicio de sesión con Google institucional. La captura muestra Gestión de Avales, contadores de postulantes, filtros por convocatoria, nombre y fechas, orden por puntaje y acceso a Ver postulantes.

Las 11 pruebas aprobadas de Estudiante/Tickets/Quiz y las mediciones anteriores se conservan como antecedentes. NO acreditan cobertura funcional ni rendimiento de Rectoría. Las marcas de avance de Estudiante que siguen abajo son históricas.

Pendientes del nuevo alcance:
- [x] Confirmar URL real de Rectoría: https://nova.uniautonoma.edu.co/convocatorias-app/rectoria/avales
- [x] Confirmar URL de acceso: https://nova.uniautonoma.edu.co/convocatorias-app/inicio-sesion
- [ ] Identificar consultas API reales de UniDoc y su autenticación. Las rutas de páginas confirmadas no son endpoints API.
- [ ] Identificar y validar la sesión propia de UniDoc después del acceso legítimo por Google. El mismo correo no garantiza el mismo token ni permisos.
- [ ] Diseñar 12 casos de Rectoría, con 3 negativos y 2 de permisos; automatizar al menos 8.
- [ ] Crear plan JMeter/Vegeta para 2 o 3 consultas de Rectoría, sin otorgar o revocar avales reales bajo carga.
- [ ] Obtener del docente el objetivo de OpenVAS y límites/ventana de carga antes de ejecutar.
- [ ] Rehacer los informes finales alrededor de UniDoc — Rectoría.

## Paso 1 Confirmar alcance y cerrar pruebas funcionales

- [x] Confirmar equipo: sin número de grupo; Jaiver Muñoz Muñoz y Martha Isabel España Gonzales. Las autorías históricas aún requieren verificación.
- [ ] Confirmar aplicación asignada y equivalencia del rol Estudiante con el rol del enunciado.
- [ ] Confirmar si Quiz forma parte del alcance; reemplazar CP-08 si queda fuera.
- [x] Corregir aserción de ruta posterior al cierre de sesión.
- [x] Comprobar ausencia de solicitudes de login al mostrar validación de campos vacíos.
- [x] Comprobar cierre del formulario al cancelar.
- [x] Comprobar ausencia de solicitudes de creación de ticket al mostrar validación de campos vacíos.
- [x] Preparar ejecución con registro, fechas y huellas del código sin sobrescribir videos anteriores.
- [x] Ejecutar la versión corregida: 11/11 aprobadas; evidencia en evidencias/funcionales/2026-11-17T02-40-26-342Z.
- [x] Actualizar informe desde la consola de esa ejecución: 11 aprobadas, duración de suites 1:10.
- [ ] Completar criterios de entrada/salida, prioridad de defectos, referencia de evidencia y valoración final con reservas.

Ejecutar `npm run test:evidence` cuando se confirme el alcance. Genera una carpeta local por corrida en evidencias/funcionales con consola.txt, ejecucion.json, videos y capturas si las hay. Revisar datos personales antes de entregar. El comando realiza las pruebas contra NOVA, no es una validación offline.

## Paso 2 Preparar y ejecutar rendimiento

- [ ] Confirmar objetivo, ventana y límite máximo de carga del docente.
- [ ] Elegir JMeter o Vegeta y comprobar instalación y versión.
- [ ] Definir umbrales antes de ejecutar y justificar el nivel esperado de uso.
- [ ] Crear plan real de cuatro niveles, duración, rampas, pausas, recuperación y parada.
- [ ] Comprobar autenticación sin publicar el token.
- [ ] Ejecutar en la ventana autorizada, conservar muestras originales y comandos.
- [ ] Calcular percentiles y errores desde muestras, distinguiendo timeout cliente de HTTP 504.
- [ ] Completar las 13 secciones del informe y gráficas.

Los resultados Node existentes son preliminares. El JMX actual no reproduce cuatro escalones de RPS. No ejecutar ese plan como si ya estuviera validado. No repetir automáticamente los niveles de carga anteriores.

## Paso 3 OpenVAS

- [ ] Confirmar objetivo de escaneo y restricciones del docente.
- [ ] Preparar OpenVAS/GVM, feeds y registrar versión/perfil.
- [ ] Ejecutar el escaneo autorizado y exportar reporte completo.
- [ ] Analizar cinco hallazgos o todos si hay menos; no inventar vulnerabilidades.
- [ ] Completar CVE cuando exista, CVSS, severidad, evidencia, impacto y vínculo con el rol.
- [ ] Elaborar falsos positivos, matriz de riesgo, remediación y relación con Seguridad de ISO/IEC 25010.
- [ ] Completar las 12 secciones del informe.

La inspección pasiva existente es apoyo, no sustituye OpenVAS.

## Paso 4 Entrega

- [ ] Unificar portada, identificadores y escala de severidad de los tres informes.
- [ ] Generar y revisar visualmente G{n}_Funcionales.pdf, G{n}_Rendimiento.pdf y G{n}_Vulnerabilidades.pdf.
- [ ] Organizar anexos privados accesibles al docente y referencias desde los PDF.
- [ ] Verificar secretos y datos personales antes de compartir.
- [ ] Registrar los cambios con autorías reales y verificar contenido publicado del repositorio.
- [ ] Probar instalación en un directorio limpio con npm ci y comprobar instrucciones.
- [ ] Verificar acceso del docente al repositorio y anexos.
