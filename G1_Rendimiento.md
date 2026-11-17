# INFORME DE PRUEBAS DE RENDIMIENTO (CARGA Y ESTRÉS)
## PLATAFORMA INSTITUCIONAL NOVA — UNIVERSIDAD AUTÓNOMA DEL CAUCA
### ASIGNATURA: CALIDAD DE SOFTWARE II — TRABAJO FINAL (ENTREGABLE 2)

---

## 1. Portada y Control de Versiones

### 1.1 Información General
- **Institución:** Corporación Universitaria Autónoma del Cauca (Uniautónoma)
- **Facultad:** Ingeniería — Programa de Ingeniería de Software
- **Asignatura:** Calidad de Software II
- **Docente:** Jefferson Andrés Muñoz
- **Firma Auditora QA:** Nova Quality Assurance Solutions (Grupo 1)
- **Plataforma Evaluada:** Núcleo de Operaciones Virtuales Académicas (NOVA) — `https://nova.uniautonoma.edu.co/`
- **Aplicación / Módulo:** Tickets (Módulo de PQRS y Soporte Institucional)
- **Rol Evaluado:** Usuario Básico (Estudiante: JAIVER / Ticket: `TI-20261113-7BEB1D57`)
- **Fecha de Evaluación:** 16 y 17 de noviembre de 2026 (Entrega: 17 de noviembre de 2026)
- **Grupo Académico:** Grupo 1
- **Integrantes del Equipo:**
  - Jaiver Muñoz Muñoz (`jaiver.munoz@uniautonoma.edu.co`)
  - Martha Isabel España Gonzales (`martha.espana@uniautonoma.edu.co`)
- **Repositorio Git Oficial:** `c:\Users\USUARIO\Desktop\nova-qa-final` (Rama: `main`)
- **Enlace a Repositorio Remoto:** https://github.com/jaiver2003/nova-auditoria-qa-cypress

### 1.2 Historial de Versiones del Documento

| Versión | Fecha | Autor(es) | Descripción del Cambio |
| :---: | :---: | :--- | :--- |
| **1.0.0** | 16/11/2026 | Jaiver Muñoz / Martha España | Levantamiento de métricas empíricas de carga y redacción preliminar. |
| **1.1.0** | 17/11/2026 | Jaiver Muñoz / Martha España | Estructuración formal según las 13 secciones de la guía del curso, integración de criterios de aceptación, análisis de cuellos de botella y unificación con roles Rectoría y Estudiante. |

---

## 2. Resumen Ejecutivo
Se ejecutó una auditoría de rendimiento (pruebas de carga controlada y estrés progresivo) sobre la API REST de la plataforma **NOVA** para el rol **Usuario Básico (Estudiante)**, evaluando la capacidad de respuesta y estabilidad del servidor bajo cuatro niveles crecientes de demanda (5, 12, 25 y 40 peticiones por segundo - RPS).

**Conclusiones Principales:**
- **Capacidad Óptima Soportada:** La plataforma opera con excelente estabilidad y tiempos de respuesta sub-segundo hasta **12 RPS** continuos (p50: 163 ms, p95: 219 ms, 0% errores).
- **Punto de Inicio de Degradación:** Comienza a manifestarse a partir de los **17-20 RPS reales** (Nivel 3). Aunque la tasa de errores fue del 0%, la latencia media se disparó a 5,869 ms y el percentil 95 alcanzó los 9,243 ms debido a la saturación de los workers WSGI de Django y el encolamiento en Nginx.
- **Punto de Ruptura y Saturación:** A **40 RPS** (Nivel 4), el sistema colapsa operativamente: el rendimiento real se estanca en 23.97 RPS y el **81.33% de las peticiones fallan con HTTP 504 Gateway Timeout**.
- **Recomendación General:** La aplicación está lista para operar en condiciones cotidianas de bajo tráfico, pero **NO está preparada para eventos de alta concurrencia** (como matrículas simultáneas o cierres de notas). Se requiere con urgencia implementar pooling de conexiones a base de datos (pgBouncer), caché de catálogos en Redis y escalamiento horizontal de workers.

---

## 3. Objetivos y Alcance

### 3.1 Objetivo General
Determinar la capacidad máxima de procesamiento, los tiempos de respuesta bajo distintos volúmenes de concurrencia y el punto de quiebre de la plataforma NOVA para el rol Usuario Básico en el módulo de Tickets, contrastando los resultados frente a umbrales de servicio predefinidos.

### 3.2 Objetivos Específicos
1. Medir la latencia basal del sistema (p50, p95, p99) con tráfico representativo de uso regular (5 RPS).
2. Identificar el umbral donde la experiencia del usuario se degrada por encolamiento de solicitudes (12 a 25 RPS).
3. Determinar el punto de saturación extrema y tasa de fallos bajo estrés severo (40 RPS).
4. Proporcionar recomendaciones de optimización de infraestructura y software respaldadas por evidencia técnica.

### 3.3 Alcance
- **Incluido:** Pruebas sobre 3 endpoints REST de lectura frecuente para el rol Estudiante, autenticados mediante token Bearer JWT.
- **Excluido:** Pruebas de mutación masiva (`POST`/`PUT` de creación de tickets) para evitar inundar la base de datos de producción con registros basura (regla ética de no alteración de datos).

---

## 4. Sistema Bajo Prueba y Escenarios

El sistema bajo prueba es el backend de NOVA desplegado en `https://nova.uniautonoma.edu.co/api/`. Se seleccionaron 3 endpoints críticos que componen la carga típica generada por un estudiante al ingresar a gestionar solicitudes:

| Identificador Endpoint | Ruta REST | Método | Justificación de Representatividad |
| :--- | :--- | :---: | :--- |
| **EP-01 (Perfil)** | `/api/users/perfil/` | `GET` | Se invoca inmediatamente tras el login para renderizar el encabezado, nombre y permisos del estudiante. Valida sesión en base de datos. |
| **EP-02 (Listado Tickets)** | `/api/pqrs/tickets/` | `GET` | Consulta principal del módulo de tickets. Realiza consultas relacionales con filtros por usuario, área y estado de tickets. |
| **EP-03 (Catálogo Áreas)** | `/api/pqrs/dependencies/` | `GET` | Invocado al abrir el dashboard y al desplegar el formulario de radicación de tickets para listar las dependencias de la universidad. |

---

## 5. Entorno de Pruebas

### 5.1 Máquina Cliente (Generador de Carga)
- **Sistema Operativo:** Windows 11 Pro 64-bit (Build 10.0.26200)
- **CPU:** AMD Ryzen 5 9600X (6 núcleos físicos, 12 hilos lógicos, 3.9 - 5.4 GHz)
- **Memoria RAM:** 15.11 GB DDR5 (RAM utilizada por el generador: < 200 MB)
- **Herramienta de Carga:** Motor asíncrono en Node.js de microsegundos con HTTP Keep-Alive persistente y soporte para exportación a planes de JMeter (`Plan_Rendimiento_Nova.jmx`) y Vegeta (`targets.txt`).
- **Conectividad:** Conexión de fibra óptica dedicada, latencia RTT de red base: ~18-25 ms.

### 5.2 Servidor Bajo Prueba
- **Servidor Web / Reverse Proxy:** Nginx (identificado en cabecera `Server: nginx`)
- **Servidor de Aplicación:** WSGI Gunicorn / Django REST Framework
- **Autenticación:** JSON Web Token (`Authorization: Bearer <token>`)

---

## 6. Criterios de Aceptación

Antes de iniciar la ejecución, se definieron los siguientes umbrales de aceptación basados en estándares de la industria para aplicaciones web educativas:

| Métrica | Umbral en Carga Normal (<= 12 RPS) | Umbral en Estrés (25 - 40 RPS) | Justificación |
| :--- | :---: | :---: | :--- |
| **Percentil 95 (p95)** | **< 800 ms** | **< 3,000 ms** | Tiempos superiores a 1 segundo generan percepción de lentitud; superiores a 3 segundos generan abandono de navegación. |
| **Percentil 50 (Mediana)** | **< 400 ms** | **< 1,500 ms** | Representa la experiencia típica del 50% de las solicitudes. |
| **Tasa de Errores** | **0.00 %** | **< 5.00 %** | En condiciones normales no deben existir errores; en estrés se tolera hasta un 5% de saturación momentánea. |
| **RPS Real vs Objetivo** | **>= 95 %** | **>= 80 %** | El servidor debe ser capaz de procesar el volumen de transacciones inyectado sin congelar el socket. |

---

## 7. Diseño de las Pruebas

Se diseñó una prueba de carga escalonada dividida en **4 niveles de intensidad creciente**, con una duración constante de **15 segundos por escalón** y un intervalo de estabilización de 3 segundos entre niveles:

```
RPS
 40 |                                                 +---------------+ (Nivel 4: 15s)
 35 |                                                 |
 30 |                                                 |
 25 |                                 +---------------+ (Nivel 3: 15s)
 20 |                                 |
 15 |                                 |
 12 |                 +---------------+ (Nivel 2: 15s)
 10 |                 |
  5 | +---------------+ (Nivel 1: 15s)
  0 +-----------------+---------------+---------------+---------------+-----> Tiempo
      0s             15s             30s             45s             60s
```

- **Nivel 1 (Línea Base):** 5 RPS (75 peticiones totales). Simula el uso normal de un grupo pequeño de estudiantes navegando simultáneamente.
- **Nivel 2 (Carga Normal Esperada):** 12 RPS (180 peticiones totales). Simula la concurrencia estándar en un horario pico habitual de clase.
- **Nivel 3 (Estrés Moderado):** 25 RPS (375 peticiones totales). Simula concurrencia elevada (inicio de jornadas de registro).
- **Nivel 4 (Pico / Estrés Alto):** 40 RPS (600 peticiones totales). Simula sobredemanda masiva institucional para determinar el punto de colapso.

---

## 8. Ejecución

Las pruebas se ejecutaron mediante el motor de benchmarking parametrizado. Durante la ejecución se registraron los siguientes eventos:
- En los Niveles 1 y 2, las respuestas llegaron de manera inmediata y fluida, sin fluctuaciones en la conexión TCP.
- A partir del segundo 5 del Nivel 3, se evidenció un incremento notable en el tiempo de retención de conexiones abiertas en el servidor, elevando los tiempos de respuesta pero sin generar caídas de socket.
- En el Nivel 4, el buffer de workers de Gunicorn se llenó rápidamente; transcurridos 10 segundos, Nginx comenzó a cerrar conexiones devolviendo códigos `504 Gateway Timeout` al no recibir respuesta del backend en el tiempo límite configurado.

---

## 9. Resultados Reales

### 9.1 Tabla Consolidada por Nivel de Carga

| Métrica de Rendimiento | Nivel 1 (5 RPS) | Nivel 2 (12 RPS) | Nivel 3 (25 RPS) | Nivel 4 (40 RPS) |
| :--- | :---: | :---: | :---: | :---: |
| **RPS Objetivo** | 5 RPS | 12 RPS | 25 RPS | 40 RPS |
| **Duración del Escalón** | 15.0 s | 15.0 s | 15.0 s | 15.0 s |
| **Peticiones Totales Inyectadas** | 75 | 180 | 375 | 600 |
| **Peticiones Exitosas (200 OK)** | 75 (100%) | 180 (100%) | 375 (100%) | 112 (18.67%) |
| **Peticiones Fallidas (504 Timeout)**| 0 (0%) | 0 (0%) | 0 (0%) | **488 (81.33%)** |
| **Latencia Mínima** | 112 ms | 113 ms | 135 ms | 231 ms |
| **Latencia Promedio** | 148 ms | 172 ms | 5,869 ms | 9,065 ms |
| **Mediana (p50)** | **147 ms** | **163 ms** | **6,491 ms** | **10,045 ms** |
| **Percentil 95 (p95)** | **181 ms** | **219 ms** | **9,243 ms** | **10,058 ms** |
| **Percentil 99 (p99)** | **193 ms** | **235 ms** | **9,406 ms** | **10,063 ms** |
| **Latencia Máxima** | 193 ms | 242 ms | 9,498 ms | 11,069 ms |
| **Rendimiento Real (Throughput)** | **5.01 RPS** | **11.92 RPS** | **17.64 RPS** | **23.97 RPS** |
| **Tasa de Errores (%)** | **0.00 %** | **0.00 %** | **0.00 %** | **81.33 %** |

---

## 10. Análisis de Resultados

### 10.1 Evaluación Frente a Criterios de Aceptación

| Nivel | p95 Real vs Criterio | Tasa de Error vs Criterio | Estado de Cumplimiento |
| :---: | :---: | :---: | :---: |
| **Nivel 1 (5 RPS)** | 181 ms (Criterio: < 800 ms) | 0.00 % (Criterio: 0.00 %) | **CUMPLE SATISFACTORIAMENTE** |
| **Nivel 2 (12 RPS)**| 219 ms (Criterio: < 800 ms) | 0.00 % (Criterio: 0.00 %) | **CUMPLE SATISFACTORIAMENTE** |
| **Nivel 3 (25 RPS)**| 9,243 ms (Criterio: < 3,000 ms) | 0.00 % (Criterio: < 5.00 %) | **NO CUMPLE EN LATENCIA** |
| **Nivel 4 (40 RPS)**| 10,058 ms (Criterio: < 3,000 ms)| 81.33 % (Criterio: < 5.00 %) | **COLAPSO CRÍTICO** |

### 10.2 Análisis de Cuello de Botella
1. **Comportamiento Concurrente:** El backend de Django en NOVA procesa de manera lineal y óptima hasta aproximadamente 15 RPS. A partir de allí, el Throughput real se desacopla del objetivo (a 25 RPS objetivo solo entrega 17.64 RPS; a 40 RPS objetivo se estanca en 23.97 RPS).
2. **Causa Raíz del Bloqueo:** La alta latencia acumulada (mediana de 6.4 segundos en Nivel 3 y 10 segundos en Nivel 4) es síntoma característico de **agotamiento de workers síncronos de Gunicorn**. Al no contar con suficientes procesos de atención, las nuevas peticiones esperan en la cola de Nginx. Cuando la cola sobrepasa el timeout por defecto (60s o 10s según configuración proxy), Nginx descarta la petición devolviendo `504 Gateway Timeout`.
3. **Comportamiento de Recuperación:** Una vez cesó la inyección de carga de 40 RPS, el servidor tardó aproximadamente **8 a 12 segundos** en drenar la cola de solicitudes pendientes y retornar a tiempos basales de 150 ms, demostrando que no hubo corrupción de memoria en el proceso, sino saturación transitoria de sockets.

---

## 11. Conclusiones y Recomendaciones

### 11.1 Conclusiones
1. La plataforma NOVA soporta de forma holgada el tráfico habitual de consulta de tickets (hasta 12 transacciones por segundo sostenidas con latencias menores a 250 ms).
2. El sistema presenta una **barrera crítica de capacidad en 24 RPS**, a partir de la cual deja de atender a más del 80% de los usuarios.
3. El módulo de Tickets no resistiría un evento institucional masivo sin medidas previas de escalamiento.

### 11.2 Plan de Remediación Priorizado
1. **Prioridad Alta — Optimización de Workers:** Ajustar la configuración de Gunicorn para utilizar workers asíncronos (`gevent` o `uvicorn` si se migra a ASGI) o incrementar los workers síncronos a `(2 * CPU cores) + 1`.
2. **Prioridad Alta — Pooling de Base de Datos:** Instalar `pgBouncer` para evitar que la sobrecarga de conexiones destruya el pool de PostgreSQL en ráfagas de tráfico.
3. **Prioridad Media — Caché de Catálogos:** Implementar caché en Redis con TTL de 30 minutos para el endpoint `/api/pqrs/dependencies/`, reduciendo el 33% del impacto en base de datos.

---

## 12. Riesgos y Limitaciones
1. **Concurrencia de Servidor Compartido:** El servidor aloja conjuntamente los módulos de Planes de Aula, UniDoc y Tickets. Un pico de carga en Planes de Aula impactaría negativamente el rendimiento de Tickets.
2. **Entorno de Red Externa:** Las pruebas se realizaron a través de Internet público hacia el dominio institucional, por lo que la latencia incluye el salto WAN (~20 ms).

---

## 13. Anexos
- **Plan de Pruebas de Apache JMeter:** [Plan_Rendimiento_Nova.jmx](file:///c:/Users/USUARIO/Desktop/nova-qa-final/Plan_Rendimiento_Nova.jmx) (parametrizado con `${TOKEN}`).
- **Archivo de Objetivos para Vegeta:** [targets.txt](file:///c:/Users/USUARIO/Desktop/nova-qa-final/targets.txt) (formateado con cabeceras `Authorization: Bearer ${TOKEN}`).
- **Resultados JSON Brutos:** `benchmark_results.json`.
