class Password {
  inputFill () {
    cy.get(Cypress.env('password').input)
      .type(Cypress.env('PASSWORD'))
      .type('{ctrl}{enter}')
  }

  isPasswordPage () {
    return cy.url().then(url => url.includes('password'))
  }

  verifyPasswordChange () {
    return cy.url().then(newUrl => {
      if (newUrl.includes('password')) {
        throw new Error('Incorrect password')
      }
    })
  }

  break () {
    this.isPasswordPage().then(isPassword => {
      if (!isPassword) return

      this.inputFill()
      this.verifyPasswordChange()
    })
  }
}

export default new Password()
