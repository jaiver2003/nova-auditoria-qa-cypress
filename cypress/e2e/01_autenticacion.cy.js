describe('Módulo 01: Autenticación y Control de Sesión (Estudiante)', () => {
  beforeEach(() => {
    // Limpiar cookies y localStorage antes de cada prueba de autenticación
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('CP-01 (Positivo): Login exitoso con credenciales válidas y verificación de dashboard', () => {
    cy.visit('/login');
    cy.intercept('POST', '**/api/login/').as('loginReq');

    // Verificar presencia de inputs y botones de acceso
    cy.get('#email').should('be.visible').clear().type(Cypress.env('NOVA_USER'), { log: false });
    cy.get('#password').should('be.visible').clear().type(Cypress.env('NOVA_PASS'), { log: false });
    cy.get('form button[type=submit]').should('be.visible').click();

    cy.wait('@loginReq').then(({ response }) => {
      expect(response.statusCode).to.be.oneOf([200, 201]);
    });

    // Validar redirección a la ruta del rol Estudiante
    cy.location('pathname', { timeout: 15000 }).should('include', '/estudiante');

    // Validar elementos visibles del estudiante en el dashboard
    cy.contains('JAIVER').should('be.visible');
    cy.get('body').should('contain', 'JAIVER');
    cy.contains(/estudiante/i).should('be.visible');
    cy.contains('Noviembre 2026').should('be.visible');
    cy.contains('Mis tickets').should('be.visible');
    cy.contains('TI-20261113-7BEB1D57').should('be.visible');
  });

  it('CP-02 (Negativo): Intento de login con contraseña incorrecta', () => {
    cy.visit('/login');
    cy.intercept('POST', '**/api/login/').as('loginFailReq');

    cy.get('#email').type(Cypress.env('NOVA_USER'), { log: false });
    cy.get('#password').type('ClaveInvalida123!', { log: false });
    cy.get('form button[type=submit]').click();

    cy.wait('@loginFailReq').then(({ response }) => {
      expect(response.statusCode).to.eq(401);
    });

    // Validar mensaje de error en toast y permanencia en /login
    cy.contains(/Error de autenticación|No active account found/i, { timeout: 8000 }).should('be.visible');
    cy.location('pathname').should('include', '/login');
  });

  it('CP-03 (Negativo): Intento de login con campos obligatorios vacíos', () => {
    cy.visit('/login');
    let loginRequests = 0;
    cy.intercept('POST', '**/api/login/', () => { loginRequests += 1; });

    // Enviar formulario sin digitar credenciales
    cy.get('form button[type=submit]').click();

    // Validar los mensajes de error reactivos de la aplicación
    cy.contains('El correo es requerido').should('be.visible');
    cy.contains('La contraseña es requerida').should('be.visible');
    cy.then(() => expect(loginRequests, 'Peticiones de login hasta mostrar las validaciones').to.eq(0));

    // Verificar permanencia en la página de login
    cy.location('pathname').should('include', '/login');
  });

  it('CP-04 (Positivo): Cierre de sesión exitoso con botón Salir y bloqueo de navegación', () => {
    cy.loginDirect();

    // Hacer clic en el botón Salir del navbar/sidebar
    cy.contains('button', /^Salir$/i).should('be.visible').click();

    // Verificar redirección inmediata a /login o landing
    cy.location('pathname', { timeout: 10000 }).should('match', /^(\/login\/?|\/)$/);

    // Intentar acceder directamente a /estudiante luego de salir
    cy.visit('/estudiante', { failOnStatusCode: false });
    cy.wait(2000);
    // Debe redirigir al login al no contar con sesión activa
    cy.location('pathname').should('include', '/login');
  });
});
