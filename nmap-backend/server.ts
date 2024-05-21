import app from './src/index'

const PORT = 3000
export const server = app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
});

