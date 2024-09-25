import usersData from '../fixtures/user.json'

describe('POST /auth/oauth/v2/token', ()=> {

  it('Token gerado', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.session.client_id,
        clientSecret: usersData.session.client_secret
    }

    const payload = {
        scope: usersData.session.scope,
        grant_type: usersData.session.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)

    cy.postToken(client, payload)
        .then(response => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('access_token')
            expect(response.body).to.have.property('expires_in')
            expect(response.body).to.have.property('token_type')
        })
  })

  it('Token nao gerado - Não Autorizado', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.unauthorized.client_id,
        clientSecret: usersData.unauthorized.client_secret
    }

    const payload = {
        scope: usersData.unauthorized.scope,
        grant_type: usersData.unauthorized.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)

    cy.postToken(client, payload)
        .then(response => {
            expect(response.status).to.eq(401)
            expect(response.body.name).to.eq('Unauthorized')
            expect(response.body.message).to.eq('Unauthorized')
            expect(response.body.details[0].status).to.eq('DENIED')
            expect(response.body.details[0].error_code).to.eq('GENERIC-401')
        })
  })

  it('Token nao gerado - Data Invalida', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.invalidData.client_id,
        clientSecret: usersData.invalidData.client_secret
    }

    const payload = {
        scope: usersData.invalidData.scope,
        grant_type: usersData.invalidData.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)

    cy.postToken(client, payload)
        .then(response => {
            // Este cenário está a apresentar o statuscode como 401 para o grant_type diferente de 'client_credentials'
            // Não sei se é o statuscode esperado ou se seria 400
            expect(response.status).to.eq(401)
            expect(response.body.error).to.eq('unsupported_grant_type')
            expect(response.body.error_description).to.eq('Unsupported grant_type')
        })
  })

  it('Token gerado - Scope diferente', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.scopeDifferent.client_id,
        clientSecret: usersData.scopeDifferent.client_secret
    }

    const payload = {
        scope: usersData.scopeDifferent.scope,
        grant_type: usersData.scopeDifferent.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)

    cy.postToken(client, payload)
        .then(response => {
            // Não sei se o statuscode esperado passando um scope diferente de 'oob', é o 200 mesmo
            // Ou teria que ser 400
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('access_token')
            expect(response.body).to.have.property('expires_in')
            expect(response.body).to.have.property('token_type')
        })
  })

})