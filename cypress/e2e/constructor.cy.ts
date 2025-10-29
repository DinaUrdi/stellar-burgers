describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    cy.setCookie('accessToken', 'test-access-token');
    cy.setCookie('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Отображает ингредиенты после загрузки', () => {
    cy.get('[data-testid="ingredient-card"]').should(
      'have.length.greaterThan',
      0
    );
    cy.contains('Булка R2-D3').should('exist');
    cy.contains('Мясо бессмертного кракена').should('exist');
  });

  it('Открывает и закрывает модалку ингредиента', () => {
    cy.contains('Булка R2-D3')
      .parents('[data-testid="ingredient-card"]')
      .find('[data-testid="ingredient-link"]')
      .click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal"]').should('contain', 'Булка R2-D3');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    cy.contains('Булка R2-D3')
      .parents('[data-testid="ingredient-card"]')
      .find('[data-testid="ingredient-link"]')
      .click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Добавляет булку и начинку в конструктор', () => {
    cy.contains('Булка R2-D3')
      .parents('[data-testid="ingredient-card"]')
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    cy.get('.constructor-element_pos_top')
      .should('exist')
      .and('contain', 'Булка R2-D3 (верх)');

    cy.get('.constructor-element_pos_bottom')
      .should('exist')
      .and('contain', 'Булка R2-D3 (низ)');

    cy.contains('Мясо бессмертного кракена')
      .parents('[data-testid="ingredient-card"]')
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    cy.contains('Мясо бессмертного кракена').should('exist');

    cy.get('[data-testid="total-price"]').should('not.have.text', '0');
  });

  it('Создаёт заказ и очищает конструктор', () => {
    cy.contains('Булка R2-D3')
      .parents('[data-testid="ingredient-card"]')
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });
    cy.contains('Мясо бессмертного кракена')
      .parents('[data-testid="ingredient-card"]')
      .within(() => {
        cy.get('button').contains('Добавить').click();
      });

    cy.get('[data-testid="order-button"]').click();

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.wait('@postOrder');

    cy.fixture('order.json').then((order) => {
      cy.get('[data-testid="order-number"]').should(
        'contain',
        order.order.number
      );
    });

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
