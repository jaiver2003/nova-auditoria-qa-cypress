describe('Módulo 04: Control de Permisos y Fronteras de Rol (Estudiante)', () => {
  beforeEach(() => {
    cy.loginDirect();
  });

  it('CP-10 (Permisos): Bloqueo y redirección al intentar acceder por URL a rutas no autorizadas', () => {
    // 1. Intentar acceder a /admin (debe redirigir de vuelta a /estudiante)
    cy.visit('/admin', { failOnStatusCode: false });
    cy.wait(2000);
    cy.location('pathname').should('eq', '/estudiante');

    // 2. Intentar acceder a rutas administrativas de otros roles (/usuarios, /planes-de-aula, /unidoc)
    const rutasRestringidas = ['/usuarios', '/planes-de-aula', '/unidoc'];
    rutasRestringidas.forEach((ruta) => {
      cy.visit(ruta, { failOnStatusCode: false });
      cy.wait(1500);
      // Validar que el estudiante no puede ver módulos administrativos
      cy.contains(/404|Página no encontrada|no existe/i).should('be.visible');
    });
  });

  it('CP-11 (Permisos): Verificación de ausencia de controles administrativos en el detalle de ticket', () => {
    // Navegar a Mis Tickets y abrir el ticket TI-20261113-7BEB1D57
    cy.contains('button', /^Mis Tickets$/i).click({ force: true });
    cy.wait(2000);
    cy.contains(/TI-20261113-7BEB1D57/).click({ force: true });
    cy.wait(2000);

    // Validar que se encuentra en la vista de detalle
    cy.contains('TI-20261113-7BEB1D57').should('be.visible');
    cy.contains('Detalles').should('be.visible');

    // Validar que el estudiante NO tiene controles administrativos:
    // No debe existir selector para cambiar estado a Cerrado o Resuelto
    cy.get('select[name*="estado"], [aria-label*="estado"]').should('not.exist');
    cy.contains('button', /Cerrar ticket|Resolver ticket|Marcar resuelto/i).should('not.exist');

    // No debe existir control para reasignar a otro funcionario o área
    cy.get('select[name*="asignar"], [aria-label*="asignar"]').should('not.exist');
    cy.contains('button', /Reasignar|Asignar funcionario/i).should('not.exist');

    // No debe existir opción para eliminar el ticket
    cy.contains('button', /Eliminar ticket|Borrar ticket/i).should('not.exist');

    // El estudiante solo debe contar con el campo de responder/comentar
    cy.get('textarea[placeholder*="Escribe una respuesta"]').should('be.visible');
    cy.contains('button', /Enviar/i).should('be.visible');
  });
});
