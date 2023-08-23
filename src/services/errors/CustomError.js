export default class CustomError {
    static createError({ name= "Error", cause, message, code = 1}){
        console.log("HOLA desde customError");
        return;
        const error = new Error(message);
        error.cause = cause;
        error.name = name;
        error.code = code;
        throw error;
    }
}