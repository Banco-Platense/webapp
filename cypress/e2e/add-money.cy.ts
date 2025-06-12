describe('Add Money Page', () => {
  const user = { id: '1', username: 'testuser', email: 'test@example.com' };
  const token = 'fake-token';

  beforeEach(() => {
    cy.visit('/dashboard/add-money', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wallet_user', JSON.stringify(user));
        win.localStorage.setItem('wallet_token', token);
      }
    });
  });

  it('displays add money form', () => {
    cy.get('input#amount').should('be.visible');
    cy.contains('Source');
    cy.get('button[type="submit"]').contains('Send DEBIN Request');
  });

  it('shows error on invalid amount', () => {
    cy.get('input#amount').type('0');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid amount').should('be.visible');
  });

  it('shows error on negative amount', () => {
    cy.get('input#amount').type('-10');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid amount').should('be.visible');
  });

  it('shows error on server 400 response', () => {
    cy.intercept('POST', '**/wallets/transactions/debin', {
      statusCode: 400,
      body: { message: 'Invalid topup amount' }
    }).as('debinError');
    cy.get('input#amount').type('50');
    cy.get('button[type="submit"]').click();
    cy.wait('@debinError');
    cy.contains('Failed to add money. Please try again.').should('be.visible');
    cy.url().should('include', '/dashboard/add-money');
  });

  it('shows error on server 500 response', () => {
    cy.intercept('POST', '**/wallets/transactions/debin', {
      statusCode: 500,
      body: {}
    }).as('debinError500');
    cy.get('input#amount').type('50');
    cy.get('button[type="submit"]').click();
    cy.wait('@debinError500');
    cy.contains('Failed to add money. Please try again.').should('be.visible');
  });

  it('redirects to dashboard on successful top-up', () => {
    cy.intercept('POST', '**/wallets/transactions/debin', {
      statusCode: 200,
      body: {}
    }).as('debinRequest');
    cy.get('input#amount').type('50');
    cy.get('button[type="submit"]').click();
    cy.wait('@debinRequest');
    cy.url().should('include', '/dashboard');
  });
}); 