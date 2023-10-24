import multer from "multer"

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