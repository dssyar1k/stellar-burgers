const apiUrl = Cypress.env('apiUrl');

const SELECTORS = {
  constructorBunUp: '[data-cy=bun_up_constructor]',
  constructorBunDown: '[data-cy=bun_down_constructor]',
  ingredientsBun: '[data-cy=bun_ingredients]',
  constructorIngredient: '[data-cy=ingredient_constructor]',
  ingredientsMain: '[data-cy=main_ingredients]',
  ingredientsSouce: '[data-cy=souce_ingredients]',
  modal: '[data-cy=modal]',
  closeButton: '[data-cy=close_button]',
  orderButton: '[data-cy=order_button]',
  orderNumber: '[data-cy=order_number]',
  constructor: '[data-cy=constructor]',
  overlay: '[data-cy=overlay]'
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/ingredients`, {
      fixture: 'ingredients.json'
    });
    cy.intercept('GET', `${apiUrl}/auth/user`, {
      fixture: 'user.json'
    });
    cy.intercept('POST', `${apiUrl}/orders`, {
      fixture: 'order.json'
    });

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'Bearer access-token');

    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Тест добавления булки в конструктор', () => {
    cy.get(SELECTORS.constructorBunUp).should(
      'not.contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(SELECTORS.constructorBunDown).should(
      'not.contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(SELECTORS.ingredientsBun).contains('Добавить').click();
    cy.get(SELECTORS.constructorBunUp).should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(SELECTORS.constructorBunDown).should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
  });

  it('Тест добавления начинки в конструктор', () => {
    cy.get(SELECTORS.constructorIngredient).should(
      'not.contain',
      'Филе Люминесцентного тетраодонтимформа'
    );
    cy.get(SELECTORS.constructorIngredient).should(
      'not.contain',
      'Соус Spicy-X'
    );
    cy.get(SELECTORS.ingredientsMain).contains('Добавить').click();
    cy.get(SELECTORS.constructorIngredient).should(
      'contain',
      'Филе Люминесцентного тетраодонтимформа'
    );
    cy.get(SELECTORS.ingredientsSouce).contains('Добавить').click();
    cy.get(SELECTORS.constructorIngredient).should('contain', 'Соус Spicy-X');
  });

  it('Тест открытия модального окна ингредиента', () => {
    cy.get(SELECTORS.modal).should('not.exist');
    cy.get(SELECTORS.ingredientsBun)
      .contains('Флюоресцентная булка R2-D3')
      .click();
    cy.get(SELECTORS.modal).should('contain', 'Флюоресцентная булка R2-D3');
  });

  it('Тест закрытия модального окна с помощью крестика', () => {
    cy.get(SELECTORS.ingredientsBun)
      .contains('Флюоресцентная булка R2-D3')
      .click();
    cy.get(SELECTORS.closeButton).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('Тест закрытия модального окна при клике на overlay', () => {
    cy.get(SELECTORS.ingredientsBun)
      .contains('Флюоресцентная булка R2-D3')
      .click();
    cy.get(SELECTORS.modal).should('exist');
    cy.get(SELECTORS.overlay)
      .should('exist')
      .click('topRight', { force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('Тест создания заказа', () => {
    cy.get(SELECTORS.ingredientsBun).contains('Добавить').click();
    cy.get(SELECTORS.ingredientsMain).contains('Добавить').click();
    cy.get(SELECTORS.ingredientsSouce).contains('Добавить').click();
    cy.get(SELECTORS.orderButton)
      .contains('Оформить заказ')
      .should('exist')
      .click();
    cy.get(SELECTORS.orderNumber).should('contain', '99805');
    cy.get(SELECTORS.closeButton).click();
    cy.get(SELECTORS.modal).should('not.exist');
    cy.get(SELECTORS.constructor).should(
      'not.contain',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(SELECTORS.constructorIngredient).should(
      'not.contain',
      'Соус Spicy-X'
    );
    cy.get(SELECTORS.constructorIngredient).should(
      'not.contain',
      'Филе Люминесцентного тетраодонтимформа'
    );
  });
});
