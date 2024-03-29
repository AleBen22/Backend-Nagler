import { userModel } from "./models/user.model.js";

export const getAll = async () => {
    let result;
    try {
        result = await userModel.find()
    } catch (error) {
        throw error
    }
    return result
}

export const getByEmail = async email => {
    let result;
    try {
        result = await userModel.findOne( {email} )
    } catch (error) {
        throw error
    }
    return result
}

export const getByCartId = async cid => {
    let result;
    try {
        result = await userModel.findOne( {"cart": cid} )
    } catch (error) {
        throw error
    }
    return result
}

export const getById = async id => {
    let result;
    try {
        result = await userModel.findOne( {_id: id} )
    } catch (error) {
        throw error
    }
    return result
}

export const createUser = async user => {
    let result;
    try {
        result = await userModel.create(user)
    } catch (error) {
        throw error
    }
    return result
}

export const deleteUser = async uid => {
    let result;
    try {
        result = await userModel.deleteOne({ _id: uid})
    } catch (error) {
        throw error
    }
    return result
} 

export const updateUserPassword = async (email, newPassword) => {
    let result;
    try {
        result = await userModel.updateOne({email: email}, {$set: {password: newPassword}})
    } catch (error) {
        throw error
    }
    return result
}

export const updateUserRole = async (uid, newRole) => {
    let result;
    try {
        result = await userModel.updateOne({_id: uid}, {$set: {role: newRole}})
    } catch (error) {
        throw error
    }
    return result
}

export const updateUserConnection = async (uid) => {
    let result;
    try {
        result = await userModel.updateOne({_id: uid}, {$set: {last_connection: Date.now()}})
    } catch (error) {
        throw error
    }
    return result
}

export const updateUserDocs = async (uid, newDoc) => {
    let result;
    try {
        result = await userModel.updateOne({_id: uid}, {$set: {documents: newDoc}})
    } catch (error) {
        throw error
    }
    return result
}
