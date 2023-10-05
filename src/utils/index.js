import bcrypt from 'bcrypt';
import { fileURLToPath} from 'url'
import { dirname } from 'path';

export const validateProduct = product => {
    let result = true;
    if(!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        result = false;
    }
    return result
}

export const validateNumber = number => {
    let result = true
    if(!number || isNaN(number) || number < 0) {
        result = false
    }
    return result
}

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)