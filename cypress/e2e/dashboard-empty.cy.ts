describe('Dashboard Empty State', () => {
  const user = { id: '1', username: 'testuser', email: 'test@example.com' };
  const token = 'fake-token';

  beforeEach(() => {
    cy.intercept('GET', '**/wallets/user', {
      statusCode: 200,
      body: { id: '1', userId: '1', balance: 50 }
    }).as('getWallet');

    cy.intercept('GET', '**/wallets/transactions', {
      statusCode: 200,
      body: []
    }).as('getTransactionsEmpty');

    cy.visit('/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wallet_user', JSON.stringify(user));
        win.localStorage.setItem('wallet_token', token);
      }
    });

    cy.wait('@getWallet');
    cy.wait('@getTransactionsEmpty');
  });

  it('displays empty state message when there are no transactions', () => {
    cy.contains('No transactions yet').should('be.visible');
  });
}); 