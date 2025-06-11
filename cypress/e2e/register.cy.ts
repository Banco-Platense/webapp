describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('displays registration form', () => {
    cy.get('input#username').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.get('input#confirmPassword').should('be.visible');
    cy.get('button[type="submit"]').contains('Register');
  });

  it('shows error on password mismatch', () => {
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password456');
    cy.get('button[type="submit"]').click();
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('shows error on API failure', () => {
    cy.intercept('POST', '**/auth/register', {
      statusCode: 400,
      body: { message: 'Username already exists' }
    }).as('registerRequest');
    cy.get('#username').type('testuser');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@registerRequest');
    cy.get('.p-3').should('contain.text', 'Username already exists');
  });

  it('redirects to login on success and shows toast', () => {
    cy.intercept('POST', '**/auth/register', {
      statusCode: 200,
      body: 'Success!'
    }).as('registerRequest');
    cy.get('#username').type('testuser');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@registerRequest');
    cy.url().should('include', '/login');
    cy.contains('Registration Successful!').should('be.visible');
    cy.contains(
      'Your account has been created successfully. Please login with your credentials.'
    ).should('be.visible');
  });

  it('shows error on server 500 response', () => {
    cy.intercept('POST', '**/auth/register', {
      statusCode: 500,
      body: { message: 'Server error' }
    }).as('registerServerError');
    cy.get('#username').type('testuser');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@registerServerError');
    cy.get('.p-3').should('contain.text', 'Server error');
  });

  it('shows error on network failure', () => {
    cy.intercept('POST', '**/auth/register', { forceNetworkError: true }).as('registerNetworkError');
    cy.get('#username').type('testuser');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('.p-3').should('be.visible');
  });

  it('shows error on invalid email format', () => {
    cy.intercept('POST', '**/auth/register', {
      statusCode: 400,
      body: { message: 'Invalid email format' }
    }).as('registerEmailFormatError');
    cy.get('#username').type('testuser');
    cy.get('#email').type('invalid-email');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@registerEmailFormatError');
    cy.get('.p-3').should('contain.text', 'Invalid email format');
  });
}); 