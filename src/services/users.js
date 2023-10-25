import ContactDTO from "../DAOs/DTOs/contact.dto.js";
import {
    getAll,
    getByEmail,
    getById,
    createUser,
    deleteUser,
    updateUserPassword,
    getByCartId,
    updateUserRole,
    updateUserConnection,
    updateUserDocs
} from "../DAOs/mongo/user.dao.mongo.js";

export const getUsersService = async () => {
    let usersFound = await getAll();
    let contacts = []
    let user 
    for(var i = 0; i < usersFound.length;i++){
        user = new ContactDTO(usersFound[i])
        contacts.push(user)
    } 
    return contacts
}

export const getAllUsersService = async () => {
    let usersFound = await getAll();
    return usersFound
}

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

export const deleteUserService = async (uid) => {
    let result = await deleteUser(uid)
    return result
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

export const updateUserConnectionService = async (email) => {
    let user = await getByEmail(email)
    if(!user){
        return null
    }
    let result = await updateUserConnection(user._id)
    return result
}

export const updateUserDocsService = async (uid, newDoc) => {
    let result = await updateUserDocs(uid, newDoc)
    return result
}