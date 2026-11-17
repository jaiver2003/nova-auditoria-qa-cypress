// Soporte global E2E
import './commands';

// Evitar que errores JS secundarios de librerías externas o third-party cancelen las pruebas
Cypress.on('uncaught:exception', (err) => {
  // Ignorar errores no críticos de ResizeObserver o scripts de Google GSI
  if (err.message.includes('ResizeObserver') || err.message.includes('Script error')) {
    return false;
  }
  return false;
});
