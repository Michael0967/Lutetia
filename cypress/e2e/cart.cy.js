import password from '../support/pages/password'
import product from '../support/pages/product'
import cart from '../support/pages/cart'

describe('Side Cart', () => {
  beforeEach(() => {
    cy.session('store_auth_session', () => {
      cy.visit(Cypress.env('STORE'))
      password.break()
    })
    cy.visit(`${Cypress.env('STORE')}/products/${Cypress.env('PRODUCT')}?preview_theme_id=${Cypress.env('PREVIEW')}`)
  })

  describe('Cart Behavior - Open and Close', () => {
    it('opens the cart', () => {
      cart.isOpen(false)

      cart.cartAction('open')
      cart.isOpen(true)
    })

    it('closes the cart', () => {
      cart.cartAction('open')
      cart.isOpen(true)

      cart.cartAction('close')
      cart.isOpen(false)
    })

    it('closes the cart by clicking outside', () => {
      cart.cartAction('open')
      cart.isOpen(true)

      cart.cartAction('closeOutside')
      cart.isOpen(false)
    })
  })

  describe('Shopping Cart Functionality', () => {
    beforeEach(() => {
      product.addToCart()
      cart.isOpen(true)
      cart.emptyMessage('hidden')
      cy.reload()
      cart.cartAction('open')
      cart.isOpen(true)
    })

    it('updates product quantity', () => {
      cart.quantityAction('increase')
      cart.inputQuantityValidator(2)

      cart.quantityAction('decrease')
      cart.inputQuantityValidator(1)
    })

    it.only('restricts non-numeric input', () => {
      cart.inputNums('10Abcde')
    })

    it('removes a product from the cart', () => {
      cart.delete()
      cart.cartItem('hidden')
      cart.emptyMessage('visible')
    })

    it('updates the internal cart counter', () => {
      cart.inputNums('10Abcde')
      cart.verifyCartCounter(10, 'internal')
    })

    it('updates the external cart counter', () => {
      cart.inputNums('10Abcde')
      cart.verifyCartCounter(10, 'external')
    })
  })
})
