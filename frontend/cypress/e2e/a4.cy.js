const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3000/api';

const e2eUser = {
  email: 'cypress_a4_user@test.com',
  password: 'secret12',
};

function ensureUser() {
  cy.request({
    method: 'POST',
    url: `${apiUrl}/signup`,
    body: { email: e2eUser.email, password: e2eUser.password },
    failOnStatusCode: false,
  }).then((res) => {
    expect([200, 201, 409], 'signup seed').to.include(res.status);
  });
}

function expectToken(win) {
  const t = win.localStorage.getItem('token');
  expect(t, 'JWT in localStorage').to.be.a('string');
  expect(t.length, 'JWT non-empty').to.be.greaterThan(10);
}

describe('A4 assignment', () => {
  it('signup creates account and lands on dashboard', () => {
    const email = `signup_${Date.now()}@test.com`;
    cy.visit('/signup');
    cy.get('[data-cy="signup-email"]').type(email);
    cy.get('[data-cy="signup-password"]').type('secret12');
    cy.get('[data-cy="signup-submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.window().then((win) => {
      expectToken(win);
    });
    cy.get('[data-cy="dashboard"]').should('be.visible');
  });

  it('login returns token and shows dashboard', () => {
    ensureUser();
    cy.clearLocalStorage();
    cy.visit('/signin');
    cy.get('[data-cy="signin-email"]').type(e2eUser.email);
    cy.get('[data-cy="signin-password"]').type(e2eUser.password);
    cy.get('[data-cy="signin-submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.window().then((win) => {
      expectToken(win);
    });
  });

  it('add project when authenticated', () => {
    ensureUser();
    cy.clearLocalStorage();
    cy.visit('/signin');
    cy.get('[data-cy="signin-email"]').type(e2eUser.email);
    cy.get('[data-cy="signin-password"]').type(e2eUser.password);
    cy.get('[data-cy="signin-submit"]').click();
    cy.url().should('include', '/dashboard');

    const title = `Cypress Project ${Date.now()}`;
    cy.get('[data-cy="project-title"]').clear().type(title);
    cy.get('[data-cy="project-completion"]').type('2026-04-11');
    cy.get('[data-cy="project-description"]').clear().type('Created by Cypress');
    cy.get('[data-cy="crud-submit"]').click();
    cy.contains('li', title).should('exist');
  });

  it('edit project when authenticated', () => {
    ensureUser();
    cy.clearLocalStorage();
    cy.visit('/signin');
    cy.get('[data-cy="signin-email"]').type(e2eUser.email);
    cy.get('[data-cy="signin-password"]').type(e2eUser.password);
    cy.get('[data-cy="signin-submit"]').click();
    cy.url().should('include', '/dashboard');

    const title = `Edit Me ${Date.now()}`;
    cy.get('[data-cy="project-title"]').clear().type(title);
    cy.get('[data-cy="project-completion"]').type('2026-05-01');
    cy.get('[data-cy="crud-submit"]').click();
    cy.contains('li', title).should('exist');

    cy.contains('li', title).within(() => {
      cy.contains('button', 'Edit').click();
    });
    const updated = `${title} UPDATED`;
    cy.get('[data-cy="project-title"]').clear().type(updated);
    cy.get('[data-cy="crud-submit"]').click();
    cy.contains('li', updated).should('exist');
  });

  it('logout clears session', () => {
    ensureUser();
    cy.clearLocalStorage();
    cy.visit('/signin');
    cy.get('[data-cy="signin-email"]').type(e2eUser.email);
    cy.get('[data-cy="signin-password"]').type(e2eUser.password);
    cy.get('[data-cy="signin-submit"]').click();
    cy.url().should('include', '/dashboard');

    cy.get('[data-cy="logout"]').click();
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
    cy.visit('/dashboard');
    cy.url().should('include', '/signin');
  });
});
