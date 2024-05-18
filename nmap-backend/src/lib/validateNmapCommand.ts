const OPTIONS = [
    "-sP", "-sL", "-sn", "-sS", "-sT", "-sU", "-sA", "-sW", "-sM", "-sN", "-sF", 
    "-sX", "-sI", "-sY", "-sZ", "-sO", "-b", "-sV", "-sC", "-O", "-T0", "-T1", 
    "-T2", "-T3", "-T4", "-T5", "-p", "-F", "-oN", "-oX", "-oS", "-oG", "-oA", 
    "-A", "-v", "-d", "-6","--script", "--min-hostgroup", "--max-hostgroup", "--min-parallelism",
    "--max-parallelism", "--min-rtt-timeout", "--max-rtt-timeout",
    "--initial-rtt-timeout", "--max-retries", "--host-timeout", "--scan-delay",
    "--max-scan-delay", "--min-rate", "--max-rate", "--disable-arp-ping",
    "--reason", "--open", "--packet-trace", "--iflist", "--append-output",
    "--resume", "--stylesheet", "--script-trace", "--version-intensity",
    "--version-light", "--version-all", "--version-trace", "--webxml",
    "--privileged", "--unprivileged", "--release-memory", "--send-eth",
    "--send-ip", "--badsum", "--adler32", "--crc32"]

export class ValidationError extends Error {
    constructor(msg: string) {
        super(msg)
        this.name = "ValidationError"
    }
}

export let validateCommand = (command: string): ValidationError | boolean => {
    let split_command = command.split(" ")
    if (split_command[0] !== "nmap" ) {
        throw new ValidationError("Command should start with nmap")
    }

    for (let i in split_command) {
        i = i.split("=")[0]
        if (i.startsWith("-") && !OPTIONS.includes(i)) {
            throw new ValidationError(`Unexpected option: ${i}`)
        }
    }
    return true
}   