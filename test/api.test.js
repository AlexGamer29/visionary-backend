const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../src/app')
// Replace with the path to your API app file
const { expect } = chai

chai.use(chaiHttp)

let authToken = '' // Variable to store the token
describe('User API', () => {
    describe('POST /api/auth/signup', () => {
        it('should signup a new user', (done) => {
            const newUser = {
                first_name: 'Duc',
                last_name: 'Nguyen',
                username: 'b',
                email: 'b@gmail.com',
                password: '12qwaszx',
            }

            chai.request(app)
                .post('/api/auth/signup')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(200) // Assuming you return 200 for a successful signup
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('status').to.equal(200)
                    // You can add more specific assertions based on your API response.

                    done()
                })
        })
    })

    describe('POST /api/auth/login', () => {
        it('should login a user', (done) => {
            const loginUser = {
                email: 'b@gmail.com',
                password: '12qwaszx',
            }

            chai.request(app)
                .post('/api/auth/signup')
                .send(loginUser)
                .end((err, res) => {
                    expect(res).to.have.status(200) // Assuming you return 200 for a successful signup
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('status').to.equal(200)
                    expect(res.body).to.have.property('token')
                    authToken = res.body.token // Save the token
                    // You can add more specific assertions based on your API response.

                    done()
                })
        })
    })

    describe('DELETE /api/user/delete-users', () => {
        it('should delete all users', (done) => {
            // Make a DELETE request to delete all users
            console.log(authToken)

            chai.request(app)
                .delete('/api/user/delete-users')
                .auth(authToken, { type: 'bearer' }) // Set the Authorization header with the saved token
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    expect(res).to.have.status(200) // Replace with the appropriate status code
                    expect(res.body.response)
                        .to.have.property('acknowledged')
                        .equal(true)
                    done()
                })
        })
    })

    describe('POST /api/user/add-user', () => {
        it('should add a new user', (done) => {
            const newUser = {
                first_name: 'A',
                last_name: 'Nguyen Van',
                username: 'sun123vet',
                email: 'hehe123@gmail.com',
                password: '12345678',
            }
            console.log(authToken)
            chai.request(app)
                .post('/api/user/add-user')
                .auth(authToken, { type: 'bearer' }) // Set the Authorization header with the saved token
                .send(newUser)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200) // Assuming you return a 201 status code for successful creation
                    expect(res).to.be.json
                    expect(res.body).to.have.property('status').equal(200)
                    // Add more assertions as needed to validate the response or the database state
                    done()
                })
        })
    })

    describe('GET /api/user/get-users', () => {
        it('should return a list of users', (done) => {
            console.log(authToken)

            chai.request(app)
                .get('/api/user/get-users')
                .auth(authToken, { type: 'bearer' }) // Set the Authorization header with the saved token
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res).to.be.json
                    expect(res.body.response).to.be.an('array')
                    // Add more assertions as needed to validate the response
                    done()
                })
        })
    })
})
