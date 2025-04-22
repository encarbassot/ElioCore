import ERROR from "./ERRORS.js";
import jwtVerify from "./middleware/jwtVerify.js";
import requestManager from "./middleware/requestManager.js";
import { validateRequest } from "./middleware/validateRequest.js";
import { hashPassword, verifyPassword } from "./utils/crypto.js";
import { jwtSign } from "./utils/jwt.js";
import { requestTryCatch } from "./utils/requestTryCatch.js";
import ElioDB from "./ElioDB.js";
import UserModel from "./models/UserModel.js";

const defaultConfig = {
  JWT_TIMEOUT: "288h", //12 dias
  JWT_SECRET: "secretJWT",
}



const pureFunctions = {
  requestManager,
  requestTryCatch,
  validateRequest,
  hashPassword,
  verifyPassword,
  db:ElioDB,
  ERROR,
  Models:{
    UserModel
  }
}


// ----------------- Exports directos -----------------

export const Models = {
  UserModel
}

// funciones puras (no necesitan config)
export {
  requestManager,
  requestTryCatch,
  validateRequest,
  hashPassword,
  verifyPassword,
  ElioDB as db,
  ERROR
}









// ----------------- Export Factory -----------------

// factory que devuelve funciones configuradas
export default function ElioCore(userConfig = {}) {
  const config = { ...defaultConfig, ...userConfig }

  return {
    config,
    jwtVerify: (...args) => jwtVerify(...args, config),
    jwtSign: (...args) => jwtSign(...args, config),
    
    // exponer las funciones puras pata un paquete todo en uno
    ...pureFunctions
  }
}




// asignar estáticas al factory para acceso tipo ElioCore.requestManager
Object.assign(ElioCore, pureFunctions)