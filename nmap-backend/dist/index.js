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
const app = (0, express_1.default)();
const PORT = 3000;
const exec = (0, node_util_1.promisify)(node_child_process_1.exec);
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.get("/scan", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const command = "nmap -sP 192.168.1.0/24";
    yield exec("nmap 192.168.29.1").then((output) => {
        console.log(output);
    });
}));
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
