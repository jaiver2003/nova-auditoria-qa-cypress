describe('Módulo 03: Quiz y Perfil de Estudiante', () => {
  beforeEach(() => {
    cy.loginDirect();
  });

  it('CP-08 (Negativo): Ingreso de PIN de Quiz inválido y verificación de alerta de error', () => {
    // Navegar al módulo Quiz
    cy.contains('button', /^Quiz$/i).should('be.visible').click({ force: true });
    cy.wait(3000);

    // Acceder al iframe embebido de QuimeQuiz
    cy.get('iframe', { timeout: 10000 }).should('be.visible').then(($iframe) => {
      const $body = $iframe.contents().find('body');
      
      // Verificar que el panel de estudiante de QuimeQuiz carga correctamente
      cy.wrap($body).should('contain', 'Unirse a un Quiz');
      cy.wrap($body).should('contain', 'JAIVER');

      // Digitar un código o PIN inexistente
      cy.wrap($body).find('input').first().clear().type('999999');
      cy.wrap($body).find('button').contains(/unirse/i).click();

      // Verificar el mensaje de error del sistema
      cy.wrap($body, { timeout: 8000 }).should('contain', 'PIN no válido o sesión no encontrada');
    });
  });

  it('CP-09 (Positivo): Visualización y validación de los datos del usuario en "Mi Perfil"', () => {
    // Navegar a Mi Perfil
    cy.contains('button', /^Mi Perfil$/i).should('be.visible').click({ force: true });
    cy.wait(2000);

    // Validar encabezado y tarjeta de perfil
    cy.contains('JAIVER MUÑOZ MUÑOZ').should('be.visible');
    cy.contains('Datos personales').should('be.visible');
    cy.contains('Cambiar contraseña').should('be.visible');

    // Validar valores en campos del formulario de datos personales (react inputs)
    cy.get('#nombre').should('have.value', 'JAIVER');
    cy.get('#apellido').should('have.value', 'MUÑOZ MUÑOZ');

    // Validar sección de solo lectura con rol Estudiante y correo institucional
    cy.scrollTo('bottom');
    cy.contains(/solo lectura/i).scrollIntoView().should('be.visible');
    cy.contains('Estudiante').should('be.visible');
    cy.contains(Cypress.env('NOVA_USER')).should('be.visible');
  });
});
