import { getByEmail, createUser, updateUserPassword, getByCartId } from "../DAOs/UserDAO.js";

export const getByEmailService = async (email) => {
    let userFound = await getByEmail(email);
    return userFound
}

export const createUserService = async (newUser) => {
    await createUser(newUser)
}

export const getCartIdByUserService = async (cid) => {
    let cart = await getByCartId(cid)
    if(!cart){
        return null
    }
    return cart
}

export const updateUserPasswordService = async (user, newPassword) => {
    let result = await updateUserPassword(user, newPassword)
    return result
}