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
    search.assertVisible(false)
    search.open()
    search.assertVisible(true)
    search.close()
    search.assertVisible(false)
  })

  describe('Searching', () => {
    beforeEach(() => {
      search.open()
      search.type(query)
    })

    it('shows matching results', () => {
      search.checkResults()
    })

    it('searches with button', () => {
      search.submit('button')
      search.assertInput()
    })

    it('searches with enter key', () => {
      search.submit('enter')
      search.assertInput()
    })
  })

  it('keeps search bar closed on results page', () => {
    search.open()
    search.type(query)
    search.submit('enter')
    search.assertLocked()
  })
})
