import shellEscape from 'shell-escape'
import { isIP, isFQDN, isMACAddress } from 'validator'
const allowedOptions: { [key: string]: boolean | ((value: string) => boolean) } = {
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
    '-p': (value: string) => /^(\d+(-\d+)?(,\d+(-\d+)?)*)$/.test(value),

    // Output formats
    '-oN': (value: string) => /^[\w,\s-]+\.[A-Za-z]{3}$/.test(value),
    '-oX': (value: string) => /^[\w,\s-]+\.[A-Za-z]{3}$/.test(value),
    '-oG': (value: string) => /^[\w,\s-]+\.[A-Za-z]{3}$/.test(value),
    '-oA': (value: string) => /^[\w,\s-]+\.[A-Za-z]{3}$/.test(value),

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
    '-D': (value: string) => /^(RND:\d+|\d+\.\d+\.\d+\.\d+(,\d+\.\d+\.\d+\.\d+)*)$/.test(value),
    '-g': (value: string) => /^\d+$/.test(value) && parseInt(value, 10) > 0 && parseInt(value, 10) < 65536
}

export class ValidationError extends Error {
    constructor(msg: string) {
        super(msg)
        this.name = "ValidationError"
    }
}

export let sanitizeCommand = (command: string): string => {
    let parts = command.split(" ")
    const sanitizedParts: string[] = []

    let target: string = ""

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (allowedOptions[part]) {
            sanitizedParts.push(shellEscape([part]))

            if (typeof allowedOptions[part] === 'function') {
                const value = parts[i + 1]
                const validatingFunc = allowedOptions[part] as ((value: string) => boolean)
                if (value && validatingFunc(value)) {
                    sanitizedParts.push(shellEscape([value]))
                    i++
                } else {
                    throw new ValidationError(`Invalid value for option: ${part}`)
                }

            } else if (typeof allowedOptions[part] === 'boolean') {
                continue
            }
        }
        else if (!part.startsWith('-')) {
            if (validateTarget(part)) {
                target = part
            } else {
                throw new ValidationError(`Invalid target specified: ${part}`)
            }
        } else {
            throw new ValidationError(`Unsupported option: ${part}`)
        }

    }

    sanitizedParts.push(shellEscape([target]))
    return "nmap " + sanitizedParts.join(" ")
}

let validateTarget = (target: string) => {
    return isIP(target) || isFQDN(target) || isMACAddress(target)
}