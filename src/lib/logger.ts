enum Labels {
    info = "INFO",
    debug = "DEBUG",
    warning = "WARNING",
    error = "ERROR"
}

export class Logger {
    static info(message: string) {
        console.log(`${Logger.utcDate()} [${Labels.info}]`, message)
    }

    static debug(message: string, value: any = null, stack: boolean = false) {
        if (stack) {
            console.debug(`${Logger.utcDate()} [${Labels.debug}]`, message,
                value, new DebuggerStack())
        }
        else {
            console.debug(`${Logger.utcDate()} [${Labels.debug}]`, message, value)
        }
    }

    static warning(message: string) {
        console.warn(`${Logger.utcDate()} [${Labels.warning}]`, message)
    }

    static error(message: string, error: any = null) {
        if (error) {
            console.error(`${Logger.utcDate()} [${Labels.error}]`, message,
                error)
        }
        else {
            console.error(`${Logger.utcDate()} [${Labels.error}]`, message,
                new Error().stack)
        }
    }

    private static utcDate(): string {
        const time = new Date()
        return time.toLocaleString()
    }
}

class DebuggerStack extends Error {
    constructor() {
        super('')
        this.name = 'Debugging stack:'
    }
}