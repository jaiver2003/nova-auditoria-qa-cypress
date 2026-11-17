describe('Módulo 02: Gestión de Tickets - Rol Estudiante', () => {
  beforeEach(() => {
    cy.loginDirect();
  });

  it('CP-05 (Positivo): Consulta de "Mis Tickets" y visualización del detalle de TI-20261113-7BEB1D57', () => {
    // Navegar al módulo Mis Tickets
    cy.contains('button', /^Mis Tickets$/i).should('be.visible').click({ force: true });
    cy.wait(2000);

    // Verificar presencia del encabezado y listado de solicitudes
    cy.contains('h1, h2, h3', /Mis Tickets/i).should('be.visible');
    cy.contains('Solicitudes enviadas directamente a áreas de la institución').should('be.visible');

    // Verificar presencia del ticket asignado en estado Abierto
    cy.contains('TI-20261113-7BEB1D57').should('be.visible');
    cy.contains('Abierto').should('be.visible');
    cy.contains('Auditoría de calidad de una aplicación').should('be.visible');

    // Abrir el detalle del ticket
    cy.contains(/TI-20261113-7BEB1D57/).click({ force: true });
    cy.wait(2000);

    // Validar contenido del modal de detalle
    cy.contains('TI-20261113-7BEB1D57').should('be.visible');
    cy.contains('Descripción').should('be.visible');
    cy.contains('Detalles').should('be.visible');
    cy.contains('División de Tecnología de la Información y Transformación Digital').should('be.visible');
    cy.contains('Prioridad').should('be.visible');
    cy.get('textarea[placeholder*="Escribe una respuesta"]').should('be.visible');
  });

  it('CP-06 (Positivo): Apertura y validación de campos del formulario "Enviar ticket a un área"', () => {
    // Navegar a Mis Tickets
    cy.contains('button', /^Mis Tickets$/i).click({ force: true });
    cy.wait(1500);

    // Abrir formulario con el botón "+ Nuevo Ticket"
    cy.contains('button', /Nuevo Ticket/i).should('be.visible').click({ force: true });
    cy.wait(2000);

    // Verificar título y estructura del formulario
    cy.contains('Enviar ticket a un área').should('be.visible');
    cy.contains('Dirije tu solicitud directamente a un área de la institución.').should('be.visible');

    // Verificar campos disponibles para el estudiante
    cy.contains('label, span, div', /Área destino/i).should('be.visible');
    cy.get('select, [role="combobox"]').should('exist');

    cy.contains('Prioridad').should('be.visible');

    cy.get('input[placeholder*="asunto"]').should('be.visible');
    cy.get('textarea[placeholder*="solicitud"]').should('be.visible');

    // Verificar zona de adjuntos y botones de acción
    cy.contains(/Adjuntar archivo/i).should('be.visible');
    cy.contains('button', /^Cancelar$/i).should('be.visible');
    cy.contains('button', /Enviar ticket/i).should('be.visible');

    // Cancelar para no enviar ni ensuciar datos
    cy.contains('button', /^Cancelar$/i).click({ force: true });
  });

  it('CP-07 (Negativo): Intento de envío del formulario de nuevo ticket con campos vacíos', () => {
    // Navegar a Mis Tickets y abrir formulario
    cy.contains('button', /^Mis Tickets$/i).click({ force: true });
    cy.wait(1500);
    cy.contains('button', /Nuevo Ticket/i).click({ force: true });
    cy.wait(1500);

    // Intentar enviar el formulario sin diligenciar los campos obligatorios
    cy.contains('button', /Enviar ticket/i).click({ force: true });
    cy.wait(1000);

    // Validar aparición de los mensajes de validación requeridos
    cy.contains('Selecciona un área destino').should('be.visible');
    cy.contains('El asunto es obligatorio').should('be.visible');
    cy.contains('La descripción es obligatoria').should('be.visible');
  });
});
