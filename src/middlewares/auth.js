export const authMiddleware = (req, res, next) => {
    if(req.user){
        if(req.user.role === "admin") {
            req.user.admin = true
            req.user.premium = false
        } else if (req.user.role === "premium") {
            req.user.admin = false
            req.user.premium = true
        } else {
            req.user.admin = false
            req.user.premium = false
        }
        next()
    }else{
        res.render('login', { msg: 'No se encuentra logueado', style: 'index.css' })
    }
}

export const adminMiddleware = (req, res, next) => {
    if(req.user){
        if(req.user.role === "admin" || req.user.role === "premium") {
            next()
        } else {
            res.status(400).send({status: "No posee autorizacion"})
        }
    }else{
        res.render('login', { msg: 'No se encuentra logueado', style: 'index.css' })
    }
}

export const userMiddleware = (req, res, next) => {
    if ( req.user ) {
        if ( req.user.role === "user" || req.user.role === "premium" ) {
            next()
        } else {
            res.status(400).send({status: "No posee autorizacion"})
        }
    } else {
        res.render('login', { msg: 'No se encuentra logueado', style: 'index.css' })
    }
}