import request from "supertest"
import { server } from '../server'
import { ValidationError, sanitizeCommand } from "../src/lib/validateNmapCommand";
import { exec } from 'child_process'

jest.mock('../src/lib/validateNmapCommand', () => ({
    ...jest.requireActual('../src/lib/validateNmapCommand'),
    sanitizeCommand: jest.fn()
}));
jest.mock('child_process')


afterAll(() => {
    server.close()
})

describe('GET /', () => {
    it('should respond with text', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Express + TypeScript Server');
    });
});

describe('POST /scan', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    const mockSanitizeCommand = sanitizeCommand as jest.Mock

    it('should respond with job status "running" and "complete"', async () => {
        (sanitizeCommand as jest.Mock).mockReturnValue(["nmap -sT 192.168.1.1"]);

        const response = await request(server)
            .post('/scan')
            .send({ command: '-sT 192.168.1.1', jobId: '123' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            [{ jobId: '123', status: 'running' }]
        );

    });

    it('should handle validation errors', async () => {
        mockSanitizeCommand.mockImplementationOnce(() => {
            throw new ValidationError('Invalid option')
        })

        const response = await request(server)
            .post('/scan')
            .send({ command: '-sT 192.168.1.1', jobId: '123' });

        expect(response.status).toBe(400)
        expect(response.text).toContain('ValidationError: Invalid option')
    })

    it('should handle internal errors', async () => {
        (sanitizeCommand as jest.Mock).mockImplementation(() => {
            throw new Error('Some internal error')
        })
        const response = await request(server)
            .post('/scan')
            .send({ command: 'test command', jobId: "1234" })
        expect(response.status).toBe(500);
        expect(response.text).toContain('InternalError: Error: Some internal error');
    })
})