import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: true,
    auth: {
        user: config.GMAIL_USER_AUTH,
        pass: config.GMAIL_PASS_AUTH
    },
    tls: {
        rejectUnauthorized: false
    }
})

export const sendMail = async options => {
    let result = await transport.sendMail(options)
    return result
}

export const createOptionsRecover = data => {
    return {
        from: `Coder BackEnd <${config.GMAIL_USER_AUTH}>`,
        to: data.to,
        subject: 'Recuperación password',
        html:`<h4><a href="${data.link}">Ingrese aqui</a></h4>`,
    }
}

export const createOptionsUserDeleted = data => {
    return {
        from: `Coder BackEnd <${config.GMAIL_USER_AUTH}>`,
        to: data.to,
        subject: 'Usuario eliminado',
        html:`<h4>Su usuario fue eliminado en virtud de no ser utilizado en tanto tiempo</h4>`,
    }
}

export const createOptionsProductDeleted = data => {
    return {
        from: `Coder BackEnd <${config.GMAIL_USER_AUTH}>`,
        to: data.to,
        subject: 'Producto eliminado',
        html:`<h4>El producto ${data.product} fue eliminado por el administrador ${data.user}</h4>`,
    }
}