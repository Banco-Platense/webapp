describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays login form', () => {
    cy.get('input#username').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('button[type="submit"]').contains('Login');
  });

  it('shows error on invalid credentials', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid username or password' }
    }).as('loginRequest');
    cy.get('#username').type('wronguser');
    cy.get('#password').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.get('.p-3').should('contain.text', 'Invalid username or password');
  });

  it('redirects to dashboard on valid credentials', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
        token: 'fake-token'
      }
    }).as('loginRequest');
    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
  });

  it('shows error on server 500 response', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('loginServerError');
    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginServerError');
    cy.get('.p-3').should('contain.text', 'Server error');
  });

  it('shows error on network failure', () => {
    cy.intercept('POST', '**/auth/login', { forceNetworkError: true }).as('loginNetworkError');
    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('.p-3').should('be.visible');
  });

  it('sets localStorage on successful login', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
        token: 'fake-token'
      }
    }).as('loginRequest');
    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.window().its('localStorage').invoke('getItem', 'wallet_user').should('exist');
    cy.window().its('localStorage').invoke('getItem', 'wallet_token').should('equal', 'fake-token');
  });
}); 