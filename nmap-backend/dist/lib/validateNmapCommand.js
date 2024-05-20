"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeCommand = exports.ValidationError = void 0;
const shell_escape_1 = __importDefault(require("shell-escape"));
const validator_1 = require("validator");
const allowedOptions = {
    // Scan types
    '-sS': true,
    '-sT': true,
    '-sU': true,
    '-sP': true,
    '-sV': true,
    '-O': true,
    '-A': true,
    '-sC': true,
    //Port specifications
    '-p': (value) => /^(\d+(-\d+)?(,\d+(-\d+)?)*)$/.test(value),
    // Output formats
    '-oN': (value) => /^[\w,\s-]+\.[A-Za-z]{3}$/.test(value),
    '-oX': (value) => /^[\w,\s-]+\.[A-Za-z]{3}$/.test(value),
    '-oG': (value) => /^[\w,\s-]+\.[A-Za-z]{3}$/.test(value),
    '-oA': (value) => /^[\w,\s-]+\.[A-Za-z]{3}$/.test(value),
    // Host discovery
    '-T0': true,
    '-T1': true,
    '-T2': true,
    '-T3': true,
    '-T4': true,
    '-T5': true,
    //Others
    '--open': true,
    '-6': true,
    '--packet-trace': true,
    '--append-output': true,
    '-D': (value) => /^(RND:\d+|\d+\.\d+\.\d+\.\d+(,\d+\.\d+\.\d+\.\d+)*)$/.test(value),
    '-g': (value) => /^\d+$/.test(value) && parseInt(value, 10) > 0 && parseInt(value, 10) < 65536
};
class ValidationError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
let sanitizeCommand = (command) => {
    let parts = command.split(" ");
    const sanitizedParts = [];
    let target = "";
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (allowedOptions[part]) {
            sanitizedParts.push((0, shell_escape_1.default)([part]));
            if (typeof allowedOptions[part] === 'function') {
                const value = parts[i + 1];
                const validatingFunc = allowedOptions[part];
                if (value && validatingFunc(value)) {
                    sanitizedParts.push((0, shell_escape_1.default)([value]));
                    i++;
                }
                else {
                    throw new ValidationError(`Invalid value for option: ${part}`);
                }
            }
            else if (typeof allowedOptions[part] === 'boolean') {
                continue;
            }
        }
        else if (!part.startsWith('-')) {
            if (validateTarget(part)) {
                target = part;
            }
            else {
                throw new ValidationError(`Invalid target specified: ${part}`);
            }
        }
        else {
            throw new ValidationError(`Unsupported option: ${part}`);
        }
    }
    sanitizedParts.push((0, shell_escape_1.default)([target]));
    return "nmap " + sanitizedParts.join(" ");
};
exports.sanitizeCommand = sanitizeCommand;
let validateTarget = (target) => {
    return (0, validator_1.isIP)(target) || (0, validator_1.isFQDN)(target) || (0, validator_1.isMACAddress)(target);
};
