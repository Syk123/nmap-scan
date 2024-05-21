import express, { Express, Request, Response } from "express"
import { exec as execCb } from "node:child_process"
import { promisify } from "node:util"
import { sanitizeCommand, ValidationError } from "./lib/validateNmapCommand"

const app: Express = express()

const exec = promisify(execCb)

const jobs: Jobs = {}

interface Jobs {
    [key: string]: { status: string }
}

interface ScanRequest {
    jobId: string
    command: string
}

interface ScanResponse {
    jobId: string
    status: string
}

app.use(express.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server")
});

app.post("/scan", async (req: Request, res: Response) => {
    try {
        const body = req.body as ScanRequest
        const command = body.command
        const jobId = body.jobId
        const sanitizedCommand = sanitizeCommand(command) + ` -oX dist/${jobId}_scan_result.xml`
        exec(sanitizedCommand).then(async (_: any) => {
        }).then(() => {
            jobs[jobId] = { status: "complete" }
        })
        jobs[jobId] = { status: "running" }
        res.send(serializedJobs(jobs))
    }
    catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).send(`${e.name}: ${e.message}. Request: ${JSON.stringify(req.body)}`)
        }
        else {
            return res.status(500).send(`InternalError: ${e}. Request: ${JSON.stringify(req.body)}`)
        }
    }
})

app.get("/jobs", (req: Request, res: Response) => {
    return res.send(serializedJobs(jobs))
})

app.get("/download", (req: Request, res: Response) => {
    const jobId = req.query.jobId
    const file = `${__dirname}/${jobId}_scan_result.xml`
    console.log(file)
    res.download(file)
})

let serializedJobs = (jobs: Jobs): ScanResponse[] => {
    return Object.keys(jobs).map((key) => ({ jobId: key, status: jobs[key]["status"] }))
}

export default app