describe('Add Money Page', () => {
  let authToken: string;
  let userWalletId: string;

  before(() => {
    // Login to get real token and wallet info
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/auth/login',
      body: {
        username: 'testuser',
        password: 'password123'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.token;
      
      // Get wallet information
      return cy.request({
        method: 'GET',
        url: 'http://localhost:8080/wallets/user',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    }).then((walletResponse) => {
      expect(walletResponse.status).to.eq(200);
      userWalletId = walletResponse.body.id;
    });
  });

  beforeEach(() => {
    cy.visit('/dashboard/add-money', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wallet_user', JSON.stringify({ 
          id: userWalletId, 
          username: 'testuser', 
          email: 'test@example.com' 
        }));
        win.localStorage.setItem('wallet_token', authToken);
      }
    });
  });

  it('displays add money form', () => {
    cy.get('input#amount').should('be.visible');
    cy.contains('External CBU');
    cy.get('button[type="submit"]').contains('Send DEBIN Request');
  });

  it('shows error on invalid amount', () => {
    cy.get('input#amount').type('0');
    cy.get('input#walletId').type('11111111-1111-1111-1111-111111111111');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid amount').should('be.visible');
  });

  it('shows error on negative amount', () => {
    cy.get('input#amount').type('-10');
    cy.get('input#walletId').type('11111111-1111-1111-1111-111111111111');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid amount').should('be.visible');
  });

  it('shows error on failed debin request', () => {
    cy.get('input#amount').type('50');
    cy.get('input#walletId').type('22222222-2222-2222-2222-222222222222'); // Wallet ID that causes failure
    cy.get('button[type="submit"]').click();
    
    // Wait for the error message to appear - the API returns a 500 error which should show as "API error: 500"
    cy.contains('API error: 500').should('be.visible');
    cy.url().should('include', '/dashboard/add-money');
  });

  it('redirects to dashboard on successful debin request', () => {
    cy.get('input#amount').type('50');
    cy.get('input#walletId').type('11111111-1111-1111-1111-111111111111'); // Wallet ID that succeeds
    cy.get('button[type="submit"]').click();
    
    // Should redirect to dashboard on success (this might take a moment for the API call)
    cy.url().should('include', '/dashboard', { timeout: 10000 });
    cy.url().should('not.include', '/add-money');
  });
}); 