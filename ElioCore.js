import ERROR from "./ERRORS.js";
import { jwtVerify } from "./middleware/jwtVerify.js";
import requestManager from "./middleware/requestManager.js";
import { validateRequest } from "./middleware/validateRequest.js";
import { jwtSign } from "./utils/jwt.js";
import { requestTryCatch } from "./utils/requestTryCatch.js";

const defaultConfig = {
    JWT_TIMEOUT: "288h", //12 dias
    JWT_SECRET: "secretJWT",
}
export default class ElioCore{
    constructor(config = {}){
        this.config = {...defaultConfig,...config}
    }

    static ERROR = ERROR
    ERROR = ERROR

    static requestManager = (...props) => requestManager(...props)
    static requestTryCatch = (...props) => requestTryCatch(...props)
    static validateRequest = (...props) => validateRequest(...props)

    requestManager = (...props) => requestManager(...props)
    requestTryCatch = (...props) => requestTryCatch(...props)
    validateRequest = (...props) => validateRequest(...props)
    
    // TODO - config timeout, secret, etc...
    jwtVerify = (...props) => jwtVerify(...props, this.config)

    static utils = {

    }

    #nonStaticUtils = {
        jwtSign: (...props) => jwtSign (...props,this.config)
    }

    utils = {
        ...ElioCore.utils,
        ...this.#nonStaticUtils
    }

    
}