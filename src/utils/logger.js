import winston from 'winston';
import dotenv from 'dotenv';
dotenv.config()

let logger

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'blue',
        info: 'cyan',
        http: 'green',
        debug: 'white'
    }
}

const buildProdLogger = () => {
    const logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelOptions.colors}),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({ filename: './errors.log', level: 'error', format: winston.format.simple()})
        ]
    })
    return logger
}

const buildDevLogger = () => {
    const logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelOptions.colors}),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({ filename: './errors.log', level: 'error', format: winston.format.simple()})
        ]
    })
    return logger
}

if(process.env.ENV === 'production'){
    logger = buildProdLogger()
}else{
    logger = buildDevLogger()
}

export const addLogger = (req, res, next) => {
    req.logger = logger
    next()
}