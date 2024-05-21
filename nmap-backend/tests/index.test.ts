import request from "supertest"
import app from '../src/index'

describe('GET /ping', () => {
    it('should respond with pong', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Express + TypeScript Server');
    });
});