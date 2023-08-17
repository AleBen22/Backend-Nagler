export const authMiddleware = (req, res, next) => {
    if(req.session.user){
        if(req.session.user.email) {
            if(req.session.user.role === "admin") {
                req.session.role = req.session.user.role
                req.session.admin = true
            } else {
                req.session.admin = false
            }
            req.session.user = req.session.user.email
        } else {
        if(req.session.role === "admin") {
            req.session.admin = true
        } else {
            req.session.admin = false
        }
        }
            next()
        }else{
            res.render('login', { status: 'failed'})
    }
}

export const adminMiddleware = (req, res, next) => {
    if(req.session.user){
        if(req.session.role === "admin") {
            next()
        } else {
            res.status(400).send({status: "No posee autorizacion"})
        }
        }else{
            res.status(400).send({status: "No se encuentra logueado"})
    }
}

export const userMiddleware = (req, res, next) => {
    if(req.session.user){
        if(req.session.role === "user") {
            next()
        } else {
            res.status(400).send({status: "No posee autorizacion"})
        }
        }else{
            res.status(400).send({status: "No se encuentra logueado"})
    }
}