import { getByEmail, getById, createUser, updateUserPassword, getByCartId, updateUserRole } from "../DAOs/UserDAO.js";

export const getByEmailService = async (email) => {
    let userFound = await getByEmail(email);
    return userFound
}

export const getByIdService = async (uid) => {
    let userFound = await getById(uid);
    return userFound
}

export const createUserService = async (newUser) => {
    let user = await createUser(newUser)
    return user
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

export const updateUserRoleService = async (uid, newRole) => {
    let result = await updateUserRole(uid, newRole)
    return result
}