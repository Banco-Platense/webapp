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
}); 