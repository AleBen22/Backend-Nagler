import { getByEmail, createUser, updateUserPassword } from "../dao/UserDAO.js";

export const getByEmailService = async (email) => {
    let userFound = await getByEmail(email);
    return userFound
}

export const createUserService = async (newUser) => {
    await createUser(newUser)
}

export const updateUserPasswordService = async (user, newPassword) => {
    let result = await updateUserPassword(user, newPassword)
    return result
}