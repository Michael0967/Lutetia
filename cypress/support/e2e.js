Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('NS_BINDING_ABORTED')) {
    return false
  }
  return true
})
