// Soporte global E2E
import './commands';

// Ignorar únicamente la notificación benigna de ResizeObserver originada por el motor del navegador
Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('ResizeObserver loop limit exceeded') ||
    err.message.includes('ResizeObserver loop completed with undelivered notifications')
  ) {
    return false;
  }
  // No suprimir ninguna otra excepción ni errores generales de script/aplicación
  return true;
});
