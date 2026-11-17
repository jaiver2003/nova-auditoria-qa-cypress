// Comandos personalizados para Nova QA

Cypress.Commands.add('loginDirect', () => {
  cy.visit('/login');
  cy.get('#email').clear().type(Cypress.env('NOVA_USER'), { log: false });
  cy.get('#password').clear().type(Cypress.env('NOVA_PASS'), { log: false });
  cy.get('form button[type=submit]').click();
  cy.location('pathname', { timeout: 15000 }).should('include', '/estudiante');
});

Cypress.Commands.add('loginAsStudent', () => {
  cy.session('student-session', () => {
    cy.visit('/login');
    cy.get('#email').clear().type(Cypress.env('NOVA_USER'), { log: false });
    cy.get('#password').clear().type(Cypress.env('NOVA_PASS'), { log: false });
    cy.get('form button[type=submit]').click();
    cy.location('pathname', { timeout: 15000 }).should('include', '/estudiante');
    cy.contains('ESTUDIANTE').should('be.visible');
  }, {
    validate() {
      cy.window().then((win) => {
        const token = win.sessionStorage.getItem('access_token') || win.localStorage.getItem('_at_shared');
        expect(token).to.be.a('string');
      });
    }
  });
});
