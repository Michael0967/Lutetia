import account from '../support/pages/account'
import password from '../support/pages/password'

describe('Account Management', () => {
  const storeUrl = `${Cypress.env('STORE')}/account?preview_theme_id=${Cypress.env('PREVIEW')}`

  beforeEach(() => {
    cy.session('store_auth_session', () => {
      cy.visit(storeUrl)
      password.break()
    })
    cy.visit(storeUrl)
  })

  describe('User Login', () => {
    it('fails with invalid credentials', () => {
      account.page()
      account.inputLogin(true)
      account.loginFailed(true)
    })

    it('logs in successfully', () => {
      account.page()
      account.inputLogin()
      account.loginFailed(false)
    })

    it('logs out successfully', () => {
      account.page()
      account.inputLogin()
      account.loginFailed(false)
      cy.contains('Log out').click()
      cy.url().should('include', Cypress.env('STORE'), { timeout: 0 })
    })
  })

  describe('Password Recovery', () => {
    it('requests a reset with a valid email', () => {
      account.forgotPassword('michael.rojas@gradiweb.com')
    })

    it('fails to request reset without email', () => {
      account.forgotPassword()
    })

    it('cancels the reset request', () => {
      account.forgotPassword(null, true)
    })
  })

  describe('Account Creation', () => {
    it('creates an account with random data', () => {
      account.createAccount(true, false)
    })

    it('shows error for existing email', () => {
      account.createAccount(false, true)
    })
  })
})
