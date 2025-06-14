describe('Send Money Page', () => {
  const user = { id: '1', username: 'testuser', email: 'test@example.com' };
  const token = 'fake-token';

  beforeEach(() => {
    cy.visit('/dashboard/send', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wallet_user', JSON.stringify(user));
        win.localStorage.setItem('wallet_token', token);
      }
    });
  });

  it('displays send money form', () => {
    cy.get('input#recipient').should('be.visible');
    cy.get('input#amount').should('be.visible');
    cy.get('button[type="submit"]').contains('Send Money');
  });

  it('shows error on invalid amount', () => {
    cy.get('#recipient').type('recipient-id');
    cy.get('#amount').type('0');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid amount').should('be.visible');
  });

  it('redirects to dashboard on successful transfer', () => {
    cy.intercept('POST', '**/wallets/transactions/p2p', {
      statusCode: 200,
      body: {}
    }).as('sendRequest');
    cy.get('#recipient').type('recipient-id');
    cy.get('#amount').type('25');
    cy.get('#note').type('Test payment');
    cy.get('button[type="submit"]').click();
    cy.wait('@sendRequest');
    cy.url().should('include', '/dashboard');
  });

  it('shows error on negative amount', () => {
    cy.get('#recipient').type('recipient-id');
    cy.get('#amount').type('-25');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid amount').should('be.visible');
  });

  it('allows sending without a note', () => {
    cy.intercept('POST', '**/wallets/transactions/p2p', {
      statusCode: 200,
      body: {}
    }).as('sendRequestNoNote');
    cy.get('#recipient').type('recipient-id');
    cy.get('#amount').type('25');
    cy.get('button[type="submit"]').click();
    cy.wait('@sendRequestNoNote');
    cy.url().should('include', '/dashboard');
  });

  it('shows error on server 500 response', () => {
    cy.intercept('POST', '**/wallets/transactions/p2p', {
      statusCode: 500,
      body: {}
    }).as('sendError500');
    cy.get('#recipient').type('recipient-id');
    cy.get('#amount').type('25');
    cy.get('button[type="submit"]').click();
    cy.wait('@sendError500');
    cy.contains('Transfer failed. Please try again.').should('be.visible');
  });
}); 