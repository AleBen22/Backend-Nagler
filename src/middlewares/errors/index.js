import EErrors from "../../services/errors/enums.js"

export default (error, req, res, next) => {
    req.logger.info(error.cause)
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.name})
            break

        case EErrors.INVALID_PARAM_ERROR:
            res.status(400).send({ status: 'error', error: error.name})
            break

        case EErrors.DATABASE_ERROR:
            res.status(400).send({ status: 'error', error: error.name})
            break

        default: res.status(400).send({ status: 'error', error: 'Unhandled error'})
    }
}