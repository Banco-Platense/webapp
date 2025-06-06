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
    cy.get('button[type="submit"]').contains('Add Money');
  });

  it('shows error on invalid amount', () => {
    cy.get('input#amount').type('0');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid amount').should('be.visible');
  });

  it('redirects to dashboard on successful top-up', () => {
    cy.intercept('POST', '**/wallets/transactions/topup', {
      statusCode: 200,
      body: {}
    }).as('topupRequest');
    cy.get('input#amount').type('50');
    cy.get('button[type="submit"]').click();
    cy.wait('@topupRequest');
    cy.url().should('include', '/dashboard');
  });
}); 