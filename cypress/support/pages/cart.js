class Cart {
  /**
   * Verifies if the cart is open or closed
   * @param {boolean} expectedState - true if expected to be open, false if expected to be closed
   */
  isOpen (expectedState) {
    cy.get(Cypress.env('cart').section)
      .invoke('attr', 'data-active')
      .then(isOpen => {
        expect(isOpen).to.equal(expectedState.toString(), `🔴 Expected cart state to be '${expectedState}', but got '${isOpen}'`)
      })
  }

  /**
   * Performs an action on the cart (open, close, close via overlay)
   * @param {'open' | 'close' | 'closeOutside'} action - Action to perform
   */
  cartAction (action) {
    const selectors = {
      open: Cypress.env('cart').open,
      close: Cypress.env('cart').close,
      closeOutside: Cypress.env('cart').overlay
    }

    if (!selectors[action]) {
      throw new Error(`🔴 Invalid cart action: "${action}". Expected one of: ${Object.keys(selectors).join(', ')}`)
    }

    cy.get(selectors[action]).click({ force: true })
  }

  /**
   * Validates whether the "empty cart" message is visible or hidden
   * @param {'visible' | 'hidden'} state - Expected state
   */
  emptyMessage (state) {
    const states = {
      visible: 'exist',
      hidden: 'not.exist'
    }

    if (!states[state]) {
      throw new Error(`🔴 Invalid state: "${state}". Expected one of: ${Object.keys(states).join(', ')}`)
    }

    cy.get(Cypress.env('cart').emptyMessage).should(states[state])
  }

  /**
   * Validates whether a cart item is visible or hidden
   * @param {'visible' | 'hidden'} state - Expected state
   */
  cartItem (state) {
    const states = {
      visible: 'exist',
      hidden: 'not.exist'
    }

    if (!states[state]) {
      throw new Error(`🔴 Invalid state: "${state}". Expected one of: ${Object.keys(states).join(', ')}`)
    }

    cy.get(Cypress.env('cart').item).should(states[state])
  }

  /**
   * Inputs a number into the quantity field and verifies that only digits are accepted
   */
  inputNums (inputText) {
    cy.intercept('POST', '/cart/change.js').as('updateQuantity')
    const expectedValue = inputText.replace(/\D/g, '')

    cy.get(Cypress.env('cart').section)
      .find(Cypress.env('cart').inputQuantity)
      .clear().type(inputText).type('{ctrl}{enter}')

    cy.wait('@updateQuantity')

    cy.get(Cypress.env('cart').inputQuantity)
      .invoke('val')
      .then(value => {
        if (value !== expectedValue) {
          throw new Error(
            `🔴 Expected input value to be '${expectedValue}', but got '${value}'\n\n+ expected - actual\n-${value}\n+${expectedValue}`
          )
        }
      })
  }

  /**
   * Validates the quantity of a product in the cart
   * @param {number} expectedQuantity - Expected quantity
   */
  inputQuantityValidator (expectedQuantity) {
    cy.get(Cypress.env('cart').inputQuantity)
      .invoke('attr', 'data-quantity')
      .then(quantity => {
        expect(Number(quantity)).to.eq(expectedQuantity,
          `🔴 Quantity validation failed! \n\nExpected: ${expectedQuantity} \nActual: ${quantity}`
        )
      })
  }

  /**
   * Increases or decreases the quantity of a cart item
   * @param {'increase' | 'decrease'} action - Action to perform
   */
  quantityAction (action) {
    cy.intercept('POST', '/cart/change.js').as('updateQuantity')

    const selectors = {
      increase: Cypress.env('cart').plusQunatity,
      decrease: Cypress.env('cart').minusQuantity
    }

    if (!selectors[action]) {
      throw new Error(`🔴 Invalid quantity action: "${action}". Expected one of: ${Object.keys(selectors).join(', ')}`)
    }

    cy.get(Cypress.env('cart').section)
      .find(selectors[action]).click()

    cy.wait('@updateQuantity')
  }

  /**
   * Deletes a product from the cart
   */
  delete () {
    cy.intercept('POST', '/cart/change.js').as('deleteProduct')
    cy.get(Cypress.env('cart').trash).click()
    cy.wait('@deleteProduct')
  }

  /**
   * Verifies the cart counter (internal or external)
   * @param {number} expectedNum - Expected counter value
   * @param {'internal' | 'external'} type - Counter type
   */
  verifyCartCounter (expectedNum, type) {
    const selectors = {
      internal: Cypress.env('cart').counterInternal,
      external: Cypress.env('cart').counterExternal
    }

    if (!selectors[type]) {
      throw new Error(`🔴 Invalid counter type: "${type}". Expected one of: ${Object.keys(selectors).join(', ')}`)
    }

    cy.get(selectors[type])
      .find('span')
      .invoke('text')
      .then(numCounter => {
        expect(numCounter.trim()).to.eq(
          expectedNum.toString(),
          `Expected cart ${type} counter to be '${expectedNum}', but got '${numCounter.trim()}'`
        )
      })
  }
}

export default new Cart()
