import password from '../support/pages/password'

describe('Side Cart', () => {
  beforeEach(() => {
    cy.session('store_auth_session', () => {
      cy.visit(Cypress.env('STORE'))
      password.break()
    })
    cy.visit(`${Cypress.env('STORE')}?preview_theme_id=${Cypress.env('PREVIEW')}`)
  })

  it('open cart', () => {

  })
})
