import password from '../support/pages/password'
import search from '../support/pages/search'

describe('Search Functionality', () => {
  const word = 'snowboard'

  beforeEach(() => {
    cy.session('store_auth_session', () => {
      cy.visit(Cypress.env('STORE'))
      password.break()
    })
    cy.visit(`${Cypress.env('STORE')}/products/${Cypress.env('PRODUCT')}?preview_theme_id=${Cypress.env('PREVIEW')}`)
  })

  it('should open and close the search bar', () => {
    search.assertInputVisibility(false)
    search.open()
    search.assertInputVisibility(true)
    search.close()
    search.assertInputVisibility(false)
  })

  it('should type a word and verify results contain it', () => {
    search.open()
    search.type(word)
    search.checkResultsForSearchWord()
  })

  it('should perform a search using the search button', () => {
    search.open()
    search.type(word)
    search.search('button')
    search.assertInputValue()
  })

  it('should perform a search using the enter key shortcut', () => {
    search.open()
    search.type(word)
    search.search('enter')
    search.assertInputValue()
  })

  it('should ensure the search bar stays closed on the search results page', () => {
    search.open()
    search.type(word)
    search.search('enter')
    search.openLocked()
  })
})
