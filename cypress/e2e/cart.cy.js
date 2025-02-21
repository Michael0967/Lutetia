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

    it('restricts non-numeric input', () => {
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
      cart.cartAction('open')
      cart.isOpen(false)

      cart.verifyCartCounter(10, 'external')
    })
  })

  describe('Cart Upsell Tests', () => {
    const upsellSection = Cypress.env('cart').upsell.section
    let hasUpsell = false

    beforeEach(() => {
      cy.document().then(doc => {
        hasUpsell = doc.querySelectorAll(upsellSection).length > 0
      })
    })

    it('navigates upsell if available', function () {
      if (!hasUpsell) this.skip()
      cart.cartAction('open')
      cart.isOpen(true)
      cart.navigateUpsell('next')
      cart.navigateUpsell('back')
    })

    it('adds a single upsell product', function () {
      if (!hasUpsell) this.skip()
      cart.cartAction('open')
      cart.isOpen(true)
      cart.addProductUpsell()
      cart.emptyMessage('hidden')
      cart.cartItem('visible')
    })

    it('adds up to 8 upsell products and hides section when done', function () {
      if (!hasUpsell) this.skip()
      cart.cartAction('open')
      cart.isOpen(true)
      cart.addUpsellAllProductsToCart()
    })
  })
})
