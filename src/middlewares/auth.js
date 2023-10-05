import multer from "multer"

export const authMiddleware = (req, res, next) => {
    if(req.session.user){
        if(req.session.user.email) {
            if(req.session.user.role === "admin" || req.session.role === "premium") {
                req.session.role = req.session.user.role
                req.session.admin = true
            } else {
                req.session.admin = false
            }
            req.session.user = req.session.user.email
        } else {
        if(req.session.role === "admin" || req.session.role === "premium") {
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
        if(req.session.role === "admin" || req.session.role === "premium") {
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
        if(req.session.role === "user" || req.session.role === "premium") {
            next()
        } else {
            res.status(400).send({status: "No posee autorizacion"})
        }
        }else{
            res.status(400).send({status: "No se encuentra logueado"})
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'id' || file.fieldname === 'address' || file.fieldname === 'statement') {
            cb(null, './public/uploads/documents/')
        } else if (file.fieldname === 'profiles') {
            cb(null, './public/uploads/profiles/')
        } else if (file.fieldname === 'products') {
            cb(null, './public/uploads/products/')
        }
    },
    filename: function(req, file, cb) {
        let extension = file.originalname.split('.').length - 1
        cb(null, file.fieldname+"-"+Date.now()+"."+file.originalname.split('.')[extension])
    },
})

export const uploadMiddleware = multer({ storage }).fields([
    {name: 'id', maxCount: 1},
    {name: 'address', maxCount: 1},
    {name: 'statement', maxCount: 1},
    {name: 'profiles', maxCount: 1},
    {name: 'products', maxCount: 1}
])