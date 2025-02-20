class Search {
  open () {
    cy.get(Cypress.env('search').open).click()
  }

  close () {
    cy.get(Cypress.env('search').close).click()
    this.assertInputVisibility(false)
  }

  /** Validates if the search input visibility matches the expected state */
  assertInputVisibility (shouldBeVisible) {
    const assertion = shouldBeVisible ? 'be.visible' : 'not.be.visible'
    cy.get(Cypress.env('search').input).should(assertion, { timeout: 0 })
  }

  /** Types a search term into the search input */
  type (wordToSearch) {
    cy.intercept('GET', '/search/suggest*').as('searching')
    cy.get(Cypress.env('search').input).type(wordToSearch)
    cy.wait('@searching').then(() => {
      cy.wrap(wordToSearch).as('searchWord')
      cy.log(`Stored search word: ${wordToSearch}`)
    })
  }

  /**
   * Verifies that all search results contain the previously typed search word.
   * @throws {Error} If no search word is found, no results exist, or a result does not contain the word.
  */
  checkResultsForSearchWord () {
    cy.get('@searchWord').then(wordToSearch => {
      if (!wordToSearch) throw new Error('No search word found, make sure to call type() first')

      const searchWordLower = wordToSearch.trim().toLowerCase()

      cy.get(Cypress.env('search').list)
        .should('exist')
        .and('not.be.empty')
        .each(($el, index) => {
          cy.wrap($el)
            .invoke('text')
            .then(text => {
              const resultText = text.trim().toLowerCase()
              cy.log(`Checking result ${index + 1}: "${resultText}"`)

              if (!resultText.includes(searchWordLower)) {
                throw new Error(`Expected "${resultText}" to contain "${searchWordLower}"`)
              }
            })
        })
    })
  }

  /**
   * Performs a search on the page using either the search button or the Ctrl + Enter keyboard shortcut.
   * @param {'button' | 'enter'} method - The search method to execute.
   *        - `"button"`: Clicks the search button.
   *        - `"enter"`: Simulates the `{ctrl}{enter}` keyboard shortcut in the search input field.
   * @throws {Error} If an invalid method is provided.
  */
  search (method) {
    const selectors = {
      button: () => cy.get(Cypress.env('search').results).find('[type="submit"]').click(),
      enter: () => cy.get(Cypress.env('search').input).type('{ctrl}{enter}')
    }

    if (!selectors[method]) {
      throw new Error(`Invalid method: "${method}". Use "button" or "enter".`)
    }

    selectors[method]()

    cy.url().should('include', 'search', { timeout: 500 })
  }

  /**
   * Asserts that the search input contains the expected value.
   * The expected value is retrieved from the Cypress alias '@searchWord'.
   * @throws {Error} If no search word is found.
  */
  assertInputValue () {
    cy.get('@searchWord').then(expectedValue => {
      if (!expectedValue) throw new Error('No search word found, make sure to call type() first')

      cy.get(Cypress.env('search').input)
        .eq(1)
        .invoke('attr', 'value')
        .should('eq', expectedValue)
    })
  }

  /** Ensures the search bar stays closed when on the search page. */
  openLocked () {
    cy.url().should('include', 'search').then(() => {
      this.open()
      cy.get(Cypress.env('search').input).first().should('not.be.visible')
    })
  }
}

export default new Search()
