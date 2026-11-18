# Auditoría QA — NOVA · UniDoc · Rol Rectoría
## Trabajo Final — Calidad de Software II (Uniautónoma)

Proyecto de aseguramiento de calidad sobre la plataforma **NOVA**
(`https://nova.uniautonoma.edu.co/`), módulo **UniDoc — Convocatorias y Gestión de Avales**,
para el rol **Rectoría**. Incluye pruebas **funcionales** (Cypress), un plan de
**rendimiento** (JMeter/Vegeta) y una **evaluación de seguridad** web.

> Alcance acotado al rol Rectoría. El material de otros módulos/roles (Estudiante/Tickets)
> se retiró del proyecto activo a la carpeta `_descartado/`.

## Integrantes (Grupo 1)
- Jaiver Muñoz Muñoz
- Martha Isabel España Gonzales

Docente: Jefferson Andrés Muñoz · Entrega: 17 de noviembre de 2026

## Pruebas funcionales (Cypress)
- **10 casos automatizados y ejecutados** (100 % aprobados) en `cypress/e2e/05_rectoria_convocatorias.cy.js`:
  acceso, control de credenciales, protección de ruta privada y contrato de las APIs de Rectoría sin token.
- **7 casos diseñados de ejecución manual** (panel autenticado de avales) en
  `cypress/e2e/06_rectoria_avales_autenticado.cy.js` (`it.skip`), porque el acceso a UniDoc
  es por **Google institucional (OAuth)**, no automatizable de forma fiable.

## Requisitos e instalación
1. Node.js (compatible con Cypress 15: `^20.1.0 || ^22 || >=24`).
2. Instalar dependencias:
   ```bash
   npm install
   ```

## Credenciales (fuera de Git)
Las credenciales **nunca** se versionan (`.gitignore` excluye `cypress.env.json`).
```bash
cp cypress.env.example.json cypress.env.json
# editar cypress.env.json con el correo/clave de prueba
```
`NOVA_USER`/`NOVA_PASS` solo se usan en el caso negativo REC-CP-03. El acceso real de
Rectoría es por Google y se prueba de forma manual.

## Ejecución
```bash
# funcionales (toda la suite activa = Rectoría)
npx cypress run

# solo la suite de Rectoría
npx cypress run --spec cypress/e2e/05_rectoria_convocatorias.cy.js

# modo interactivo
npx cypress open

# ejecución con respaldo de evidencia
npm run test:evidence
```

## Rendimiento
Plan y scripts en `rendimiento/` y `Plan_Rendimiento_Nova.jmx`. Ejecutar **solo** dentro
de la ventana y el límite autorizados por el docente:
```bash
bash rendimiento/run_vegeta.sh      # Linux/macOS
# o rendimiento\run_vegeta.ps1      # Windows
```

## Estructura
```
cypress/e2e/            Specs (05 automatizado, 06 manual documentado)
cypress/support/        Comandos y configuración
rendimiento/            targets + scripts Vegeta
Plan_Rendimiento_Nova.jmx   Plan JMeter (endpoints públicos UniDoc)
evidencias/             Evidencia de corridas (consola, vídeo)
security_inspection.json, session_mecanismo.json   Evidencia pasiva de seguridad
G1_Funcionales.*  G1_Rendimiento.*  G1_Vulnerabilidades.*   Informes (MD + PDF)
_descartado/            Material fuera de alcance (Estudiante/Tickets) e informes previos
```

## Informes
1. **G1_Funcionales.pdf** — funcionales Cypress (10 automatizados + 7 manuales, trazabilidad, defectos).
2. **G1_Rendimiento.pdf** — plan de carga/estrés prudente para UniDoc; resultados pendientes de la ventana autorizada; referencia del servidor compartido en anexo.
3. **G1_Vulnerabilidades.pdf** — evaluación pasiva de seguridad (hallazgos reales) + guía para el escaneo OpenVAS pendiente.


## Ejecución de Martha (17/11/2026)
Ejecuté `npx cypress run` en mi copia del repositorio con Cypress 15.21.2 (Electron 138). Resultado: 10 pruebas automatizadas pasaron en 05_rectoria_convocatorias.cy.js (8 s) y 0 fallaron. Los 7 casos de 06_rectoria_avales_autenticado.cy.js quedaron pendientes porque son de ejecución manual con sesión autenticada.


