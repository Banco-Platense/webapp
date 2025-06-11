describe('Authentication Guards and Logout', () => {
  const user = { id: '1', username: 'testuser', email: 'test@example.com' };
  const token = 'fake-token';

  context('Authentication Guards', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
    });

    ['/dashboard', '/dashboard/send', '/dashboard/add-money'].forEach((path) => {
      it(`redirects ${path} to login if not authenticated`, () => {
        cy.visit(path);
        cy.url().should('include', '/login');
      });
    });
  });

  context('Logout', () => {
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

    it('clears localStorage and redirects to login on logout', () => {
      // Open user menu
      cy.get('button.relative.h-8.w-8.rounded-full').click();
      // Click the Logout menu item
      cy.contains('Logout').click();
      cy.url().should('include', '/login');
      cy.window().its('localStorage').invoke('getItem', 'wallet_user').should('be.null');
      cy.window().its('localStorage').invoke('getItem', 'wallet_token').should('be.null');
    });
  });
}); 