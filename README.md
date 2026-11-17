# Suite QA Automation — Plataforma Institucional NOVA
## Trabajo Final de Calidad de Software II — Universidad Autónoma del Cauca

Repositorio de automatización de pruebas End-to-End (E2E) con Cypress, evaluación de rendimiento (JMeter / Vegeta) y auditoría pasiva de seguridad web (OpenVAS / GVM) sobre la plataforma institucional **NOVA** (https://nova.uniautonoma.edu.co/), cubriendo tanto el módulo **UniDoc — Convocatorias Docentes y Gestión de Avales (Rol Rectoría)** como el módulo **Tickets y Evaluaciones (Rol Estudiante / Usuario Básico)**.

---

## 👥 Integrantes del Proyecto (Grupo 1)
- **Jaiver Muñoz Muñoz** (`jaiver.munoz@uniautonoma.edu.co`)
- **Martha Isabel España Gonzales** (`martha.espana@uniautonoma.edu.co`)

**Docente:** Jefferson Andrés Muñoz  
**Institución:** Corporación Universitaria Autónoma del Cauca (Uniautónoma)  
**Fecha de Entrega:** 17 de noviembre de 2026  

---

## 📋 Estructura de Casos de Prueba Automatizados (21 Casos E2E Aprobados)

El proyecto cuenta con 5 suites de pruebas en `cypress/e2e/` que cubren 21 casos de prueba reales automatizados con 100% de aprobación:

### Módulo UniDoc — Convocatorias Docentes (Rol Rectoría)
#### `cypress/e2e/05_rectoria_convocatorias.cy.js` (10 Casos Aprobados)
- **REC-CP-01:** Verificación estructural del formulario de acceso UniDoc (Email, Contraseña, botón Iniciar Sesión, acceso Google y recuperación).
- **REC-CP-02:** Control de acceso negativo con credenciales no autorizadas (valida mensaje visible "Credenciales incorrectas").
- **REC-CP-03:** Control de acceso negativo con credenciales de otro rol (garantiza aislamiento entre roles).
- **REC-CP-04:** Frontera de seguridad: verificación de que la URL de avales de Rectoría (`/convocatorias-app/rectoria/avales`) expulsa a usuarios no autenticados hacia `/convocatorias-app`.
- **REC-CP-05:** Verificación de navegación al flujo de recuperación de contraseña (`/convocatorias-app/restablecer-contrasena`).
- **REC-CP-06:** Verificación de visualización del portal público base de convocatorias docentes (`/convocatorias-app`).
- **REC-CP-07:** Verificación de navegación hacia el registro de nuevos usuarios (`/convocatorias-app/registro`).
- **REC-CP-08:** Seguridad de API: denegación de acceso en endpoint de convocatorias de Rectoría (`/convocatorias-app/api/rectoria/obtener-convocatorias`) sin token JWT.
- **REC-CP-09:** Seguridad de API: denegación de acceso en endpoint de avales (`/convocatorias-app/api/rectoria/usuarios/6/avales`) sin sesión.
- **REC-CP-10:** Validación reactiva de formulario vacío en login de UniDoc.

### Módulo Tickets y Perfil (Rol Estudiante)
#### 1. `cypress/e2e/01_autenticacion.cy.js` (4 Casos Aprobados)
- **CP-01 (Positivo):** Inicio de sesión exitoso con credenciales válidas y verificación de los elementos del dashboard (`JAIVER`, `ESTUDIANTE`, calendario, ticket asignado `TI-20261113-7BEB1D57`).
- **CP-02 (Negativo):** Intento de inicio de sesión con contraseña incorrecta (valida código HTTP 401 y despliegue del toast de error).
- **CP-03 (Negativo):** Intento de inicio de sesión con campos obligatorios vacíos (valida mensajes de validación reactiva de la interfaz).
- **CP-04 (Positivo):** Cierre de sesión exitoso mediante el botón "Salir" y verificación de bloqueo de acceso hacia atrás.

#### 2. `cypress/e2e/02_tickets_estudiante.cy.js` (3 Casos Aprobados)
- **CP-05 (Positivo):** Consulta del módulo "Mis Tickets" y visualización del detalle del ticket asignado `TI-20261113-7BEB1D57` en estado "Abierto".
- **CP-06 (Positivo):** Apertura del formulario de creación "Enviar ticket a un área" y validación de campos disponibles para el estudiante (Área destino, Prioridad, Asunto, Descripción, Adjuntos, Cancelar).
- **CP-07 (Negativo):** Intento de envío del formulario de nuevo ticket con campos obligatorios vacíos (valida mensajes "Selecciona un área destino", "El asunto es obligatorio", "La descripción es obligatoria").

#### 3. `cypress/e2e/03_quiz_y_perfil.cy.js` (2 Casos Aprobados)
- **CP-08 (Negativo):** Ingreso de PIN de Quiz en vivo inválido/inexistente en el módulo QuimeQuiz y validación del mensaje de error "PIN no válido o sesión no encontrada".
- **CP-09 (Positivo):** Navegación a "Mi Perfil" y verificación de los datos personales del estudiante JAIVER (Nombre, Apellido, rol Estudiante en solo lectura).

#### 4. `cypress/e2e/04_permisos_rol.cy.js` (2 Casos Aprobados)
- **CP-10 (Permisos):** Intento de acceso directo por URL a rutas administrativas de otros roles (`/admin`, `/usuarios`, `/planes-de-aula`, `/unidoc`), verificando redirección o bloqueo 404 institucional.
- **CP-11 (Permisos):** Verificación en el detalle del ticket `TI-20261113-7BEB1D57` de que el rol Estudiante no dispone de controles para cambiar estado a cerrado/resuelto ni reasignar el ticket.

---

## 🛠️ Requisitos Previos e Instalación

1. **Node.js:** Versión compatible con Cypress (`^20.1.0 || ^22.0.0 || >=24.0.0`).
2. **NPM:** Gestor de paquetes incluido en Node.js.
3. **Clonar e instalar dependencias:**
   ```bash
   git clone https://github.com/jaiver2003/nova-auditoria-qa-cypress.git
   cd nova-auditoria-qa-cypress
   npm install
   ```

---

## 🔐 Configuración de Credenciales (`cypress.env.json`)

Por razones estrictas de seguridad y ética (Ley 1273 de 2009), las credenciales reales **NUNCA** se almacenan en el repositorio Git (están excluidas en `.gitignore`).

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

### Ejecución de Toda la Suite Unificada (21 Pruebas E2E):
- **En PowerShell (Windows):**
  ```powershell
  Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue; npx cypress run
  ```

- **En Linux / macOS / Bash:**
  ```bash
  npx cypress run
  ```

- **Ejecutar únicamente la suite de Convocatorias UniDoc (Rectoría):**
  ```powershell
  Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue; npx cypress run --spec cypress/e2e/05_rectoria_convocatorias.cy.js
  ```

- **Abrir Cypress en modo interactivo (GUI):**
  ```bash
  npx cypress open
  ```

- **Ejecutar con generación automática de respaldo de evidencias:**
  ```bash
  npm run test:evidence
  ```

---

## 📑 Informes Técnicos Oficiales del Trabajo Final

En la raíz del proyecto se encuentran los 3 informes técnicos completos requeridos por la rúbrica oficial (con sus 13 secciones obligatorias):

1. **`G1_Funcionales.md` / `G1_Funcionales.pdf`:** Informe de pruebas funcionales automatizadas con Cypress (21 casos aprobados, trazabilidad de roles Rectoría y Estudiante, defectos DEF-01 y DEF-02).
2. **`G1_Rendimiento.md` / `G1_Rendimiento.pdf`:** Informe de pruebas de carga y estrés en 4 niveles (5, 12, 25 y 40 RPS) con percentiles p50/p95/p99, detección del punto de saturación y script JMeter (`Plan_Rendimiento_Nova.jmx`) y Vegeta (`targets.txt`).
3. **`G1_Vulnerabilidades.md` / `G1_Vulnerabilidades.pdf`:** Informe de auditoría de vulnerabilidades con OpenVAS / GVM 22.x, matriz de riesgo 5x5, análisis detallado de los 5 hallazgos críticos/medios y plan de remediación priorizado bajo ISO/IEC 25010.
