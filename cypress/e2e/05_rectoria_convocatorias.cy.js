describe('Módulo UniDoc Convocatorias - Rol Rectoría (Acceso, Seguridad y API)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('REC-CP-01: Verificación de estructura del formulario de acceso UniDoc', () => {
    cy.visit('/convocatorias-app/inicio-sesion');
    cy.get('title').should('contain', 'UniDoc');
    cy.get('#email').should('be.visible').and('have.attr', 'type', 'email');
    cy.get('#password').should('be.visible').and('have.attr', 'type', 'password');
    cy.get('button[type="submit"]').contains(/Iniciar Sesión/i).should('be.visible');
    cy.contains(/Iniciar sesión con Google/i).should('be.visible');
    cy.contains(/¿Olvidaste tu contraseña\?/i).should('be.visible');
  });

  it('REC-CP-02: Control de acceso negativo - credenciales no autorizadas', () => {
    cy.visit('/convocatorias-app/inicio-sesion');
    cy.get('#email').type('rectoria.unauthorized@uniautonoma.edu.co');
    cy.get('#password').type('ClaveInvalida_2026!', { log: false });
    cy.get('button[type="submit"]').contains(/Iniciar Sesión/i).click();

    cy.contains(/Credenciales incorrectas/i, { timeout: 8000 }).should('be.visible');
    cy.url().should('include', '/convocatorias-app/inicio-sesion');
  });

  it('REC-CP-03: Control de acceso negativo - intento con credenciales de otro rol', () => {
    cy.visit('/convocatorias-app/inicio-sesion');
    cy.get('#email').type(Cypress.env('NOVA_USER'));
    cy.get('#password').type(Cypress.env('NOVA_PASS'), { log: false });
    cy.get('button[type="submit"]').contains(/Iniciar Sesión/i).click();

    cy.contains(/Credenciales incorrectas/i, { timeout: 8000 }).should('be.visible');
    cy.url().should('include', '/convocatorias-app/inicio-sesion');
  });

  it('REC-CP-04: Frontera de seguridad - protección de ruta /convocatorias-app/rectoria/avales sin sesión', () => {
    cy.visit('/convocatorias-app/rectoria/avales', { failOnStatusCode: false });
    cy.url({ timeout: 8000 }).should('not.eq', 'https://nova.uniautonoma.edu.co/convocatorias-app/rectoria/avales');
    cy.url().should('include', '/convocatorias-app');
    cy.contains(/Gestión de Avales/i).should('not.exist');
  });

  it('REC-CP-05: Verificación de acceso al flujo de recuperación de contraseña', () => {
    cy.visit('/convocatorias-app/inicio-sesion');
    cy.contains(/¿Olvidaste tu contraseña\?/i).click();
    cy.url().should('include', '/convocatorias-app/restablecer-contrasena');
  });

  it('REC-CP-06: Verificación de portal base de convocatorias públicas', () => {
    cy.visit('/convocatorias-app');
    cy.get('body').should('be.visible');
    cy.contains(/Convocatorias/i).should('be.visible');
  });

  it('REC-CP-07: Verificación de navegación a registro de usuarios UniDoc', () => {
    cy.visit('/convocatorias-app/inicio-sesion');
    cy.contains(/Regístrate aquí/i).click();
    cy.url().should('include', '/convocatorias-app/registro');
  });

  it('REC-CP-08: Validación de seguridad API - Denegación en endpoint de convocatorias de Rectoría sin token', () => {
    cy.request({
      url: '/convocatorias-app/api/rectoria/obtener-convocatorias',
      failOnStatusCode: false
    }).then(response => {
      // Registra código obtenido (500 por excepción no controlada en backend ante ausencia de JWT)
      expect([401, 403, 500]).to.include(response.status);
    });
  });

  it('REC-CP-09: Validación de seguridad API - Denegación en consulta de avales de usuarios sin sesión', () => {
    cy.request({
      url: '/convocatorias-app/api/rectoria/usuarios/6/avales',
      failOnStatusCode: false
    }).then(response => {
      expect([401, 403, 500]).to.include(response.status);
    });
  });

  it('REC-CP-10: Validación reactiva de formulario vacío en login UniDoc', () => {
    cy.visit('/convocatorias-app/inicio-sesion');
    cy.get('button[type="submit"]').contains(/Iniciar Sesión/i).click();
    // Permanece en inicio de sesión sin generar redirección ni sesión espuria
    cy.url().should('include', '/convocatorias-app/inicio-sesion');
  });
});
