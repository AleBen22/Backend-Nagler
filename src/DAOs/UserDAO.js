import mongoose from "mongoose";
import { userModel } from "./models/user.model.js";

export const getAll = async () => {
    let result;
    try {
        result = await userModel.find()
    } catch (error) {
        throw error
        console.log(error)
    }
    return result
}

export const getByEmail = async email => {
    let result;
    try {
        result = await userModel.findOne( {email} )
    } catch (error) {
        throw error
        console.log(error)
    }
    return result
}

export const getByCartId = async cid => {
    let result;
    try {
        result = await userModel.findOne( {"cart": cid} )
    } catch (error) {
        throw error
        console.log(error)
    }
    return result
}

export const getById = async id => {
    let result;
    try {
        result = await userModel.findOne( {_id: id} )
    } catch (error) {
        throw error
        console.log(error)
    }
    return result
}

export const createUser = async user => {
    let result;
    try {
        result = await userModel.create(user)
    } catch (error) {
        throw error
        console.log(error)
    }
    return result
}

export const updateUserPassword = async (email, newPassword) => {
    let result;
    try {
        result = await userModel.updateOne({email: email}, {$set: {password: newPassword}})
    } catch (error) {
        throw error
        console.log(error)
    }
    return result
}