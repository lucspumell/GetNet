import usersData from '../fixtures/user.json'
import cardsData from '../fixtures/cards.json'

describe('POST /tokens/card', ()=> {

  it('token do cartão gerado com sucesso', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.session.client_id,
        clientSecret: usersData.session.client_secret
    }

    const payloadToken = {
        scope: usersData.session.scope,
        grant_type: usersData.session.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)


    const payloadCard = {
        card_number: cardsData.cardSucsess.card_number,
        customer_id: cardsData.cardSucsess.customer_id
    }

    cy.postToken(client, payloadToken)
        .then(response => {
            expect(response.status).to.eq(200)
            cy.postTokenizacaoPCI(response.body.access_token, payloadCard)
                .then(resp => {
                    expect(resp.status).to.eq(201)
                    expect(resp.body).to.have.property('number_token')
                })
        })
  })

  it('CardToken não gerado - Não Autorizado', ()=> {

        // Datas Test
        const payloadCard = {
            card_number: cardsData.cardSucsess.card_number,
            customer_id: cardsData.cardSucsess.customer_id
        }

        cy.postTokenizacaoPCI("teste", payloadCard)
            .then(resp => {
                expect(resp.status).to.eq(401)
                expect(resp.body.message).to.eq('Unauthorized')
                expect(resp.body.name).to.eq('GatewayRequestError')
                expect(resp.body.details[0].status).to.eq('DENIED')
                expect(resp.body.details[0].error_code).to.eq('GENERIC-401')
                expect(resp.body.details[0].description).to.eq('Unauthorized Access')
                expect(resp.body.details[0].description_detail).to.eq('Unauthorized Access. Please review your request and try again.')
            })
  })

  it('CardToken não gerado - Número do Cartão Maior que o Permitido', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.session.client_id,
        clientSecret: usersData.session.client_secret
    }

    const payloadToken = {
        scope: usersData.session.scope,
        grant_type: usersData.session.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)


    const payloadCard = {
        card_number: cardsData.cardNumberHigherThanAllowed.card_number,
        customer_id: cardsData.cardNumberHigherThanAllowed.customer_id
    }

    cy.postToken(client, payloadToken)
        .then(response => {
            expect(response.status).to.eq(200)
            cy.postTokenizacaoPCI(response.body.access_token, payloadCard)
                .then(resp => {
                    expect(resp.status).to.eq(400)
                    expect(resp.body.message).to.eq('Bad Request')
                    expect(resp.body.name).to.eq('GatewayTokenizationServiceError')
                    expect(resp.body.details[0].status).to.eq('DENIED')
                    expect(resp.body.details[0].error_code).to.eq('TOKENIZATION-400')
                    expect(resp.body.details[0].description).to.eq('Bad Request')
                    expect(resp.body.details[0].description_detail).to.eq('card_number length should be between 13 and 19. Current length: 20')
                })
        })
  })

  it('CardToken não gerado - Número do Cartão Menor que o Permitido', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.session.client_id,
        clientSecret: usersData.session.client_secret
    }

    const payloadToken = {
        scope: usersData.session.scope,
        grant_type: usersData.session.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)


    const payloadCard = {
        card_number: cardsData.cardNumberLowerThanAllowed.card_number,
        customer_id: cardsData.cardNumberLowerThanAllowed.customer_id
    }

    cy.postToken(client, payloadToken)
        .then(response => {
            expect(response.status).to.eq(200)
            cy.postTokenizacaoPCI(response.body.access_token, payloadCard)
                .then(resp => {
                    expect(resp.status).to.eq(400)
                    expect(resp.body.message).to.eq('Bad Request')
                    expect(resp.body.name).to.eq('GatewayTokenizationServiceError')
                    expect(resp.body.details[0].status).to.eq('DENIED')
                    expect(resp.body.details[0].error_code).to.eq('TOKENIZATION-400')
                    expect(resp.body.details[0].description).to.eq('Bad Request')
                    expect(resp.body.details[0].description_detail).to.eq('card_number length should be between 13 and 19. Current length: 12')
                })
        })
  })

  it('card token generated with success - Sem ID', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.session.client_id,
        clientSecret: usersData.session.client_secret
    }

    const payloadToken = {
        scope: usersData.session.scope,
        grant_type: usersData.session.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)


    const payloadCard = {
        card_number: cardsData.cardWithoutCustomerId.card_number
    }

    cy.postToken(client, payloadToken)
        .then(response => {
            expect(response.status).to.eq(200)
            cy.postTokenizacaoPCI(response.body.access_token, payloadCard)
                .then(resp => {
                    expect(resp.status).to.eq(201)
                    expect(resp.body).to.have.property('number_token')
                })
        })
  })

  it('CardToken não gerado - Cartão não encontrado', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.session.client_id,
        clientSecret: usersData.session.client_secret
    }

    const payloadToken = {
        scope: usersData.session.scope,
        grant_type: usersData.session.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)


    const payloadCard = {
        card_number: cardsData.cardNotFound.card_number,
        customer_id: cardsData.cardNotFound.customer_id
    }

    cy.postToken(client, payloadToken)
        .then(response => {
            expect(response.status).to.eq(200)
            cy.postTokenizacaoPCI(response.body.access_token, payloadCard)
                .then(resp => {
                    expect(resp.status).to.eq(402)
                    expect(resp.body.message).to.eq('Invalid Bin')
                    expect(resp.body.name).to.eq('GatewayTokenizationServiceError')
                    expect(resp.body.details[0].status).to.eq('DENIED')
                    expect(resp.body.details[0].error_code).to.eq('TOKENIZATION-402')
                    expect(resp.body.details[0].description).to.eq('Invalid Bin')
                    expect(resp.body.details[0].description_detail).to.eq('The BIN - 575590 (first six digits of card number) that you submitted is not found in our payment provider')
                })
        })
  })

  it('CardToken não gerado - Sem numero do Cartão', ()=> {

    // Datas Test
    const sessionData = {
        clientId: usersData.session.client_id,
        clientSecret: usersData.session.client_secret
    }

    const payloadToken = {
        scope: usersData.session.scope,
        grant_type: usersData.session.grant_type
    }

    let concatenacaoClientIdClientSecret = sessionData.clientId + ':' + sessionData.clientSecret
    let client = btoa(concatenacaoClientIdClientSecret)


    const payloadCard = {
        customer_id: cardsData.cardWithoutCardNumber.customer_id
    }

    cy.postToken(client, payloadToken)
        .then(response => {
            expect(response.status).to.eq(200)
            cy.postTokenizacaoPCI(response.body.access_token, payloadCard)
                .then(resp => {
                    expect(resp.status).to.eq(400)
                    expect(resp.body.message).to.eq('Bad Request')
                    expect(resp.body.name).to.eq('GatewayTokenizationServiceError')
                    expect(resp.body.details[0].status).to.eq('DENIED')
                    expect(resp.body.details[0].error_code).to.eq('GENERIC-400')
                    expect(resp.body.details[0].description).to.eq('Invalid card_number')
                    expect(resp.body.details[0].description_detail).to.eq('card_number is required')
                })
        })
  })
})