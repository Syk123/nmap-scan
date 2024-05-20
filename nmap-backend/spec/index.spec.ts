import app from '../src/index'
import request from 'supertest'

describe('GET root path', () => {
    it('should respond with text', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .expect('Express + TypeScript Server')
            .end(done)
    })
})