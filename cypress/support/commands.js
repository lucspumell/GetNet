// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('postToken', (client, payload)=> {
    cy.api({
        url: '/auth/oauth/v2/token',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${client}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: true,
        body: payload,
        failOnStatusCode: false
      }).then((response)=> {
        return response
    })
})

Cypress.Commands.add('postTokenizacaoPCI', (token, payload)=> {
    cy.api({
        url: '/v1/tokens/card',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: payload,
        failOnStatusCode: false
      }).then((response)=> {
        return response
    })
})

Cypress.Commands.add('postTokenizacaoBandeira', (token, payload)=> {
    cy.api({
        url: '/v1/tokenization/token',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: payload,
        failOnStatusCode: false
      }).then((response)=> {
        return response
    })
})