import express, { Express, Request, Response } from "express"
import { exec as execCb } from "node:child_process"
import { promisify } from "node:util"
import { validateCommand, ValidationError } from "./lib/validateNmapCommand"
const app: Express = express()
const PORT = 3000

const exec = promisify(execCb)


app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server")
});

app.post("/scan", async (req: Request, res: Response) => {
    try {
        const command = req.body && req.body.command
        validateCommand(command)
        await exec(command).then((output: any) => {
            return res.send(output)
        })
    }
    catch (e) {
        if (e instanceof ValidationError) {
            return res.send(`${e.name}: ${e.message}`)
        }
        else {
            return res.send(`InternalError`)
        }
    }
})

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
});
