class Account {
  page () {
    cy.visit(`${Cypress.env('STORE')}/account?preview_theme_id=${Cypress.env('PREVIEW_THEME_ID')}`)
  }

  /**
   * Logs in using fixture data or random credentials.
   * @param {boolean} [random=false] - Use random credentials if true.
  */
  inputLogin (random = false) {
    const getCredentials = random
      ? cy.wrap({ email: `user${Date.now()}@example.com`, password: `Pass${Math.floor(Math.random() * 10000)}!` })
      : cy.fixture('account.json').its('login')

    getCredentials.then(({ email, password }) => {
      cy.get(Cypress.env('account').login.email).type(email)
      cy.get(Cypress.env('account').login.password).type(password)
      cy.contains('button', 'Sign in')
    })
  }

  /**
   * Checks if login behaved as expected.
   * @param {boolean} shouldFail - `true` if login should fail, `false` if it should succeed.
   * @throws {Error} If the result doesn't match the expectation.
  */
  loginFailed (shouldFail) {
    cy.url().then(url => {
      if (shouldFail !== url.includes('login')) {
        throw new Error(`Expected login ${shouldFail ? 'failure' : 'success'}, but got the opposite`)
      }
    })
  }

  /**
   * Handles the "Forgot your password" flow.
   *
   * @param {string|null} email - Email for reset or null to skip.
   * @param {boolean} cancel - Flag to cancel the process.
   *
   * @example forgotPassword('test@example.com');
   * @example forgotPassword();
   * @example forgotPassword(null, true);
  */
  forgotPassword (email, cancel = false) {
    cy.get(Cypress.env('account').forgot.go).click()

    if (cancel) {
      cy.get(Cypress.env('account').forgot.btn_cancel).click()
      cy.contains('Reset your password').should('not.be.visible')
      return
    }

    if (email) {
      cy.get(Cypress.env('account').forgot.input).type(email)
    }

    cy.contains('button', 'Submit').click()

    if (email) {
      cy.get(Cypress.env('account').forgot.messages).should('be.visible')
      cy.contains('Reset your password').should('not.be.visible')
    } else {
      cy.contains('Reset your password').should('be.visible')
    }
  }

  /**
 * Creates a new account with either predefined or random data.
 * Optionally, verifies if an error message appears when the email already exists.
 *
 * @param {boolean} [useRandomData=false] - Whether to use random data for the account creation.
 * @param {boolean} [isEmailExisting=false] - Whether to check if the error message is visible due to an existing email.
 */
  createAccount (useRandomData = false, isEmailExisting = false) {
    this.navigateToCreateAccountPage()
    cy.fixture('account.json').then(data => {
      const accountData = useRandomData ? this.generateRandomAccountData() : data.createAccount
      this.fillAccountDetails(accountData)
      this.submitAccountCreationForm()
      this.verifyErrorMessage(isEmailExisting)
    })
  }

  /**
 * Navigates to the account creation page.
 */
  navigateToCreateAccountPage () {
    cy.get(Cypress.env('account').create_account.go).click()
    cy.url().should('include', 'account/register')
  }

  /**
 * Fills in the account details form.
 *
 * @param {Object} accountData - The account data to fill in.
 * @param {string} accountData.name - The name of the account holder.
 * @param {string} accountData.lastName - The last name of the account holder.
 * @param {string} accountData.email - The email address of the account holder.
 * @param {string} accountData.password - The password for the new account.
 */
  fillAccountDetails (accountData) {
    const { name, lastName, email, password } = accountData
    cy.get(Cypress.env('account').create_account.name).type(name)
    cy.get(Cypress.env('account').create_account.last_name).type(lastName)
    cy.get(Cypress.env('account').create_account.email).type(email)
    cy.get(Cypress.env('account').create_account.password).type(password, { log: false })
  }

  /**
 * Submits the account creation form.
 */
  submitAccountCreationForm () {
    cy.get(Cypress.env('account').create_account.button_create).click()
  }

  /**
 * Verifies if the error message is visible based on the email existence status.
 *
 * @param {boolean} isEmailExisting - Whether the email already exists or not.
 */
  verifyErrorMessage (isEmailExisting) {
    if (isEmailExisting) {
      this.checkErrorMessageVisible()
    } else {
      this.checkErrorMessageNotVisible()
    }
  }

  /**
 * Checks if the error message is visible when the email already exists.
 */
  checkErrorMessageVisible () {
    cy.get(Cypress.env('account').create_account.message_error).should('be.visible')
  }

  /**
 * Checks if the error message is not visible when the email does not exist.
 * Throws an error if the message is visible when it shouldn't be.
 */
  checkErrorMessageNotVisible () {
    cy.get(Cypress.env('account').create_account.message_error).should('not.be.visible').then((messageError) => {
      if (messageError.is(':visible')) {
        throw new Error('Error message should not be visible when email does not exist')
      }
    })
  }

  /**
 * Generates random account data for account creation.
 *
 * @returns {Object} Randomly generated account data.
 * @returns {string} accountData.name - Random name.
 * @returns {string} accountData.lastName - Random last name.
 * @returns {string} accountData.email - Random email address.
 * @returns {string} accountData.password - Random password.
 */
  generateRandomAccountData () {
    const randomName = `Name${Math.floor(Math.random() * 1000)}`
    const randomLastName = `LastName${Math.floor(Math.random() * 1000)}`
    const randomEmail = `email${Math.floor(Math.random() * 1000)}@test.com`
    const randomPassword = `Password${Math.floor(Math.random() * 10000)}!`

    return {
      name: randomName,
      lastName: randomLastName,
      email: randomEmail,
      password: randomPassword
    }
  }
}

export default new Account()
