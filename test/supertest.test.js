import chai from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker"

const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')


describe('Desafio Testing', () => {
    let cookie

    describe('Test de Session, Registro, login de User', () => {
        
        it('Endpoint POST /api/session, no debe registrar un usuario con datos vacios', async() => {
            const mockUser = {}
            const  { status, ok, _body } = await requester.post('/api/session/register').send(mockUser)
            expect(ok).to.be.eq(false)
        })

        const mockUser = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: '1234',
            age: 35,
            role: 'admin'
        }

        it('Endpoint POST /api/session, debe registrar un usuario', async() => {
            const { _body } = await requester.post('/api/session/register').send(mockUser)
            expect(_body.payload).to.have.property('_id')
        })

        it('Endpoint POST /api/session, no debe registrar un usuario existente', async() => {
            const { status, ok, _body } = await requester.post('/api/session/register').send(mockUser)
            expect(ok).to.be.eq(false)
        })

        it('Endpoint POST /api/session, debe hace login y devolver una COOKIE', async() => {
            const result = await requester.post('/api/session/login').send({
                email: mockUser.email,
                password: mockUser.password
            })
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1].split(';')[0]
            }
            expect(cookie.name).to.be.ok.and.eql('authToken')
            expect(cookie.value).to.be.ok
        })

    })

    describe('Test de Products', () => {
        let productId 

        it('Endpoint GET /api/products, devuelve todos los productos', async() => {
            const { status, ok, _body } = await requester.get('/api/products')
            productId = _body.data.payload[0]._id
            expect(ok).to.be.ok
        })

        it('Endpoint GET /api/products/:pid, devuelve el producto segun su id', async() => {
            const { status, ok, _body } = await requester.get(`/api/products/${productId}`)
            expect(_body.product).to.have.property('_id')
        })

        it('Endpoint POST /api/products, no debe registrar un producto con datos vacios', async() => {
            const productMock = {}
            const { status, ok, _body } = await requester.post('/api/products').send(productMock)
            expect(ok).to.be.eq(false)
        })

        it('Endpoint POST /api/products, no debe registrar productos por no encontrarse logueado', async() => {
            const productMock = {
                title: 'Producto Prueba',
                description: 'Este es un producto de prueba',
                code: 'CDE124',
                price: 123.50,
                status: true,
                stock: 605,
                category: 'Test',
                owner: 'admin'
            }
            const { status, ok, _body } = await requester.post('/api/products').send(productMock)
            expect(ok).to.be.eq(false)
        })

        // it('Endpoint POST /api/products, debe registrar un producto', async() => {
        //     const productMock = {
        //         title: 'Producto Prueba',
        //         description: 'Este es un producto de prueba',
        //         code: 'CDE124',
        //         price: 123.50,
        //         status: true,
        //         stock: 605,
        //         category: 'Test',
        //         owner: 'admin'
        //     }
        //     const { status, ok, _body } = await requester.post('/api/products').set('Cookie', [`${cookie.name}=${cookie.value}`]).send(productMock)
        //     console.log(_body)
        //     expect(_body.payload).to.have.property('_id')
        // })

    })

    describe('Test de Carts', () => {
        let cartId

        it('Endpoint POST /api/carts, debe registrar un cart con datos vacios', async() => {
            const cartMock = {}
            const { status, ok, _body } = await requester.post('/api/carts').send(cartMock)
            cartId = _body.payload._id
            expect(_body.payload).to.have.property('_id')
        })

        it('Endpoint GET /api/carts/:cid, debe traer el cart segun su cid', async() => {
            const { status, ok, _body } = await requester.get(`/api/carts/${cartId}`)
            expect(_body.payload).to.have.property('_id')
        })

        it('Endpoint DELETE /api/carts/:cid, debe eliminar el cart segun su cid', async() => {
            const { status, ok, _body } = await requester.delete(`/api/carts/${cartId}`)
            expect(ok).to.be.ok
        })

        it('Endpoint GET /api/carts/:cid, no debe traer el cart por ser inexistente', async() => {
            const { status, ok, _body } = await requester.get(`/api/carts/${cartId}`)
            expect(ok).to.be.eq(false)
        })

    })

})
