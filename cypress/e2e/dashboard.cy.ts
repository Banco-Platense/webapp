describe('Dashboard Page', () => {
  const user = { id: '1', username: 'testuser', email: 'test@example.com' };
  const token = 'fake-token';

  beforeEach(() => {
    cy.intercept('GET', '**/wallets/user', {
      statusCode: 200,
      body: { id: '1', userId: '1', balance: 100.5 }
    }).as('getWallet');

    cy.intercept('GET', '**/wallets/transactions', {
      statusCode: 200,
      body: [
        {
          id: 't1',
          timestamp: new Date().toISOString(),
          type: 'EXTERNAL_TOPUP',
          receiverWalletId: '1',
          description: 'Initial deposit',
          amount: 100.5
        }
      ]
    }).as('getTransactions');

    cy.visit('/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wallet_user', JSON.stringify(user));
        win.localStorage.setItem('wallet_token', token);
      }
    });

    cy.wait('@getWallet');
    cy.wait('@getTransactions');
  });

  it('displays current balance and wallet ID', () => {
    cy.contains('Current Balance');
    cy.contains('$100.50');
    cy.contains('WalletId: 1');
  });

  it('displays recent transactions', () => {
    cy.contains('Recent Transactions');
    cy.contains('Initial deposit');
    cy.contains('+$100.50');
  });

  it('navigates to Send Money page', () => {
    cy.contains('Send Money').click();
    cy.url().should('include', '/dashboard/send');
  });

  it('navigates to Add Money page', () => {
    cy.contains('Add Money').click();
    cy.url().should('include', '/dashboard/add-money');
  });
}); 