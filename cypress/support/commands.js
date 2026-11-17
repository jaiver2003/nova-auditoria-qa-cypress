// Comandos personalizados — Alcance: UniDoc / Rol Rectoría (Gestión de Avales)
//
// NOTA DE ALCANCE Y AUTENTICACIÓN
// El acceso autenticado a UniDoc (panel de Rectoría / Gestión de Avales) se realiza
// mediante inicio de sesión federado con Google institucional (OAuth). Google bloquea
// de forma deliberada la automatización de su flujo de login dentro de navegadores
// controlados, por lo que los casos que requieren sesión autenticada de Rectoría se
// ejecutan de forma MANUAL con evidencia en captura/vídeo (ver informe funcional,
// sección 6 y 9) y no mediante estos comandos.
//
// Los casos automatizados de este proyecto verifican la frontera NO autenticada,
// el control de acceso y el contrato de las APIs protegidas de Rectoría, que sí son
// deterministas y reproducibles sin exponer credenciales.

// Verifica que una ruta protegida de Rectoría NO exponga datos sin sesión.
Cypress.Commands.add('expectRutaProtegida', (ruta) => {
  cy.visit(ruta, { failOnStatusCode: false });
  cy.url({ timeout: 8000 }).should('not.eq', `https://nova.uniautonoma.edu.co${ruta}`);
  cy.contains(/Gestión de Avales/i).should('not.exist');
});

// Verifica que un endpoint protegido de Rectoría rechace el acceso sin token.
Cypress.Commands.add('expectApiProtegida', (ruta) => {
  cy.request({ url: ruta, failOnStatusCode: false }).then((r) => {
    expect([401, 403, 500]).to.include(r.status);
  });
});
