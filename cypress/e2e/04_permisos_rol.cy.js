describe('Módulo 04: Control de Permisos y Fronteras de Rol (Estudiante)', () => {
  beforeEach(() => {
    cy.loginDirect();
  });

  it('CP-10 (Permisos): Redirección de rol en /admin, respuesta 404 en rutas no encontradas y control de sesión', () => {
    // 1. Redirección por rol en ruta administrativa /admin
    // Al intentar navegar directamente a /admin, el enrutador valida el rol y redirige al dashboard de estudiante
    cy.visit('/admin', { failOnStatusCode: false });
    cy.wait(2000);
    cy.location('pathname').should('eq', '/estudiante');
    cy.contains('JAIVER').should('be.visible');

    // 2. Rutas no encontradas (/usuarios, /planes-de-aula, /unidoc)
    // Se registra que la aplicación despliega la vista de página no encontrada (404)
    const rutasNoEncontradas = ['/usuarios', '/planes-de-aula', '/unidoc'];
    rutasNoEncontradas.forEach((ruta) => {
      cy.visit(ruta, { failOnStatusCode: false });
      cy.wait(1500);
      cy.contains(/404|Página no encontrada|no existe/i).should('be.visible');
    });

    // 3. Verificación de frontera de sesión: acceso no autenticado a /estudiante
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => win.sessionStorage.clear());
    cy.visit('/estudiante', { failOnStatusCode: false });
    cy.wait(1500);
    cy.location('pathname').should('include', '/login');
  });

  it('CP-11 (Permisos): Verificación de controles visibles en el detalle de ticket (TI-20261113-7BEB1D57)', () => {
    // Navegar a Mis Tickets y abrir el ticket TI-20261113-7BEB1D57
    cy.contains('button', /^Mis Tickets$/i).click({ force: true });
    cy.wait(2000);
    cy.contains(/TI-20261113-7BEB1D57/).click({ force: true });
    cy.wait(2000);

    // Validar que se encuentra en la vista de detalle del ticket
    cy.contains('TI-20261113-7BEB1D57').should('be.visible');
    cy.contains('Detalles').should('be.visible');

    // 1. Controles de estado: No debe haber elementos para cerrar o resolver el ticket
    cy.get('select[name*="estado"], [aria-label*="estado"]').should('not.exist');
    cy.contains('button', /Cerrar ticket|Resolver ticket|Marcar resuelto/i).should('not.exist');

    // 2. Controles de reasignación: No debe haber selectores ni botones para asignar a funcionarios
    cy.get('select[name*="asignar"], [aria-label*="asignar"]').should('not.exist');
    cy.contains('button', /Reasignar|Asignar funcionario/i).should('not.exist');

    // 3. Controles de borrado: No debe haber botón de eliminación
    cy.contains('button', /Eliminar ticket|Borrar ticket/i).should('not.exist');

    // 4. Acción autorizada para el Estudiante: Únicamente enviar comentarios o respuestas
    cy.get('textarea[placeholder*="Escribe una respuesta"]').should('be.visible');
    cy.contains('button', /Enviar/i).should('be.visible');
  });
});
