import password from '../support/pages/password'
import search from '../support/pages/search'

describe('Search', () => {
  const query = 'snowboard'

  beforeEach(() => {
    cy.session('auth', () => {
      cy.visit(Cypress.env('STORE'))
      password.break()
    })
    cy.visit(`${Cypress.env('STORE')}/products/${Cypress.env('PRODUCT')}?preview_theme_id=${Cypress.env('PREVIEW')}`)
  })

  it('opens and closes search bar', () => {
    search.assertInputVisibility(false)
    search.open()
    search.assertInputVisibility(true)
    search.close()
    search.assertInputVisibility(false)
  })

  describe('Searching', () => {
    beforeEach(() => {
      search.open()
      search.type(query)
    })

    it('shows matching results', () => {
      search.checkResultsForSearchWord()
    })

    it('searches with button', () => {
      search.search('button')
      search.assertInputValue()
    })

    it('searches with enter key', () => {
      search.search('enter')
      search.assertInputValue()
    })
  })

  it('keeps search bar closed on results page', () => {
    search.open()
    search.type(query)
    search.search('enter')
    search.openLocked()
  })
})
