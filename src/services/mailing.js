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

export const createOptions = data => {
    return {
        from: `Coder BackEnd <${config.GMAIL_USER_AUTH}>`,
        to: data.to,
        subject: 'Recuperación password',
        html:`<h4><a href="${data.link}">Ingrese aqui</a></h4>`,
    }
}