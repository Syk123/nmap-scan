"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const validateNmapCommand_1 = require("./lib/validateNmapCommand");
const app = (0, express_1.default)();
const PORT = 3000;
const OUTPUT_DIR = "../raw_outputs";
const exec = (0, node_util_1.promisify)(node_child_process_1.exec);
const jobs = {};
app.use(express_1.default.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.post("/scan", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const command = body.command;
        const jobId = body.jobId;
        const sanitizedCommand = (0, validateNmapCommand_1.sanitizeCommand)(command) + ` -oX dist/raw_outputs/${jobId}_scan_result.xml`;
        exec(sanitizedCommand).then((_) => __awaiter(void 0, void 0, void 0, function* () {
        })).then(() => {
            jobs[jobId] = { status: "complete" };
        });
        jobs[jobId] = { status: "running" };
        res.send(serializedJobs(jobs));
    }
    catch (e) {
        if (e instanceof validateNmapCommand_1.ValidationError) {
            return res.status(400).send(`${e.name}: ${e.message}. Request: ${JSON.stringify(req.body)}`);
        }
        else {
            return res.status(500).send(`InternalError: ${e}. Request: ${JSON.stringify(req.body)}`);
        }
    }
}));
app.get("/jobs", (req, res) => {
    return res.send(serializedJobs(jobs));
});
app.get("/download", (req, res) => {
    const jobId = req.query.jobId;
    const file = `${__dirname}/raw_outputs/${jobId}_scan_result.xml`;
    console.log(file);
    res.download(file);
});
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
let serializedJobs = (jobs) => {
    return Object.keys(jobs).map((key) => ({ jobId: key, status: jobs[key]["status"] }));
};
