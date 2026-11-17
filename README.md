# Suite QA Automation — Plataforma Institucional NOVA
## Trabajo Final de Calidad de Software II — Universidad Autónoma del Cauca

Repositorio de automatización de pruebas End-to-End (E2E), evaluación de rendimiento y auditoría pasiva de seguridad sobre la plataforma institucional **NOVA** (https://nova.uniautonoma.edu.co/), enfocado en el rol **Estudiante** (Usuario: JAIVER / Ticket: `TI-20261113-7BEB1D57`).

---

## 👥 Integrantes del Proyecto
- **Jaiver Muñoz Muñoz** (`jaiver.munoz@uniautonoma.edu.co`)
- **Marta** (`marta@uniautonoma.edu.co`)

---

## 📋 Estructura de Casos de Prueba Automatizados (11 Casos E2E)

El proyecto cuenta con 4 suites de pruebas que cubren 11 casos de prueba reales:

### 1. `cypress/e2e/01_autenticacion.cy.js`
- **CP-01 (Positivo):** Inicio de sesión exitoso con credenciales válidas y verificación de los elementos del dashboard (`JAIVER`, `ESTUDIANTE`, calendario `Noviembre 2026`, ticket asignado).
- **CP-02 (Negativo):** Intento de inicio de sesión con contraseña incorrecta (valida código HTTP 401 y despliegue del toast de error).
- **CP-03 (Negativo):** Intento de inicio de sesión con campos obligatorios vacíos (valida mensajes de validación reactiva de la interfaz).
- **CP-04 (Positivo):** Cierre de sesión exitoso mediante el botón "Salir" y verificación de bloqueo de acceso hacia atrás.

### 2. `cypress/e2e/02_tickets_estudiante.cy.js`
- **CP-05 (Positivo):** Consulta del módulo "Mis Tickets" y visualización del detalle del ticket asignado `TI-20261113-7BEB1D57` en estado "Abierto".
- **CP-06 (Positivo):** Apertura del formulario de creación "Enviar ticket a un área" y validación de campos disponibles para el estudiante (Área destino, Prioridad, Asunto, Descripción, Adjuntos, Cancelar).
- **CP-07 (Negativo):** Intento de envío del formulario de nuevo ticket con campos obligatorios vacíos (valida mensajes "Selecciona un área destino", "El asunto es obligatorio", "La descripción es obligatoria").

### 3. `cypress/e2e/03_quiz_y_perfil.cy.js`
- **CP-08 (Negativo):** Ingreso de PIN de Quiz en vivo inválido/inexistente en el módulo QuimeQuiz y validación del mensaje de error "PIN no válido o sesión no encontrada".
- **CP-09 (Positivo):** Navegación a "Mi Perfil" y verificación de los datos personales del estudiante JAIVER (Nombre, Apellido, rol Estudiante en solo lectura).

### 4. `cypress/e2e/04_permisos_rol.cy.js`
- **CP-10 (Permisos):** Intento de acceso directo por URL a rutas administrativas de otros roles (`/admin`, `/usuarios`, `/planes-de-aula`, `/unidoc`), verificando redirección o bloqueo 404 institucional.
- **CP-11 (Permisos):** Verificación en el detalle del ticket `TI-20261113-7BEB1D57` de que el rol Estudiante no dispone de controles para cambiar estado a cerrado/resuelto ni reasignar el ticket.

---

## 🛠️ Requisitos Previos e Instalación

1. **Node.js:** Versión 18+ o superior (probado con v25.8.1).
2. **NPM:** Gestor de paquetes incluido en Node.js.
3. **Clonar e instalar dependencias:**
   ```bash
   git clone <url-del-repositorio>
   cd nova-qa-final
   npm install
   ```

---

## 🔐 Configuración de Credenciales (`cypress.env.json`)

Por razones estrictas de seguridad y ética, las credenciales reales **NUNCA** se almacenan en el repositorio Git (están excluidas en `.gitignore`).

Para configurar el entorno de pruebas local:
1. Copia el archivo de ejemplo:
   ```bash
   cp cypress.env.example.json cypress.env.json
   ```
2. Edita `cypress.env.json` con tus credenciales asignadas de NOVA:
   ```json
   {
     "NOVA_USER": "tu_correo@uniautonoma.edu.co",
     "NOVA_PASS": "tu_contraseña_real"
   }
   ```

---

## 🚀 Comandos de Ejecución

### ⚠️ Nota Técnica Importante para Windows / VSCode / Entornos IDE
En algunos entornos de desarrollo basados en Electron, la variable de entorno `ELECTRON_RUN_AS_NODE` puede venir activa, lo cual impide que el binario de Cypress inicie su ventana gráfica o runner. Para garantizar una ejecución limpia, ejecute los comandos removiendo dicha variable:

- **En PowerShell (Windows):**
  ```powershell
  Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue; npx cypress run
  ```

- **En CMD o Bash:**
  ```bash
  npx cypress run
  ```

- **Abrir Cypress en modo interactivo:**
  ```bash
  npm run cy:open
  ```

---

## 📊 Documentos de Evidencia Anexos para Informes Finales

En la raíz del proyecto se generaron los siguientes informes técnicos completos:
- **`evidencia_funcional.md`:** Resumen técnico de la ejecución de los 11 casos E2E, tabla de tiempos, rutas reales del DOM y reporte de defectos.
- **`evidencia_rendimiento.md`:** Resultados de las pruebas de carga y estrés en 4 niveles (5, 12, 25 y 40 RPS) con percentiles (p50, p95, p99), análisis de saturación y cuello de botella.
- **`evidencia_seguridad.md`:** Auditoría pasiva de cabeceras de seguridad HTTP, análisis de almacenamiento de JWT en Web Storage y mensajes de SimpleJWT.
- **`targets.txt`:** Plan de endpoints para pruebas con Vegeta.
- **`Plan_Rendimiento_Nova.jmx`:** Plan de pruebas de rendimiento listo para ejecutar en Apache JMeter.
