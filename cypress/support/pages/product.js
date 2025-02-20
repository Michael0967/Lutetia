class Product {
  addToCart () {
    cy.intercept('POST', '/cart/add.js').as('addToCart')
    cy.get(Cypress.env('product').sectionDetail)
      .then(() => {
        cy.contains('Add to cart').click()
        cy.wait('@addToCart')
      })
  }
}
export default new Product()
